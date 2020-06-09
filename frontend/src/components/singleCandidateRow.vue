<template>
    <div class="border mx-auto" style="width: 20rem">

        <div class="col-12 text-left">
            <span class="tag mt-2">NAME</span>
            {{candidate.fullName}}
            <span class="tag mt-2">LEVEL</span>
            {{candidate.level}}
            <span class="tag mt-2">INTENDED POST</span>
            <span class="text-capitalize">{{candidate.category.name}}</span>
            <span class="tag mt-2">STATUS</span>
            {{candidate.status[0].toUpperCase() + candidate.status.toLowerCase().slice(1)}}
        </div>

        <div class="col-12 border-top justify-content-center">

            <v-btn fab small :color="btnColor" style="color: #162059" title="Deny Application" class="mr-3 btn-fix" @click.prevent="type = 'deny'; dialog = true">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn v-if="candidate.status == 'pending'" fab small :color="btnColor" style="color: #162059" title="Approve Application" dark class="ml-5 btn-fix" @click.prevent="type = 'approve'; dialog = true">
                <v-icon>mdi-check</v-icon>
            </v-btn>

        </div>

        <v-dialog v-model="dialog" persistent max-width="350">
            <v-card v-if="type == 'deny'">
                <v-card-title class="headline">Reject Application?</v-card-title>
                <v-card-text>
                Are you sure you want to reject <strong>{{candidate.fullName}}'s</strong> application as a candidate for the post of <strong>{{candidate.category.name}}</strong> in the upcoming election?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                    <v-btn color="green darken-1" text @click.prevent="rejectCandidate()">Yes</v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-else>
                <v-card-title class="headline">Approve Application?</v-card-title>
                <v-card-text>
                Approve <strong>{{candidate.fullName}}'s</strong> application as a candidate for the post of <strong>{{candidate.category.name}}</strong> in the upcoming election?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                    <v-btn color="green darken-1" text @click.prevent="approveCandidate()">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
export default {
    name: 'singleCandidateRow',
    props: ["candidate","btnColor"],
    data() {
        return {
            dialog: false,
            type: ''
        }
    },
    methods: {
        approveCandidate() {
            this.$http.get(`admin/candidates/${this.candidate.id}/confirm`)
            .then(() => {
                this.dialog = false;
                this.type = ''
                this.candidate.status = 'confirmed'
                this.$emit('approveCandidate', this.candidate.id)
            })
            .catch(err => {
                this.dialog = false;
                this.type = '';
                err.response ? alert(err.response.data.error) : alert("Error processing request, please try again");
                window.location.reload()
            })
        },
        rejectCandidate() {
            this.$http.get(`admin/candidates/${this.candidate.id}/deny`)
            .then(res => {
                console.log(res.data)
                this.dialog = false;
                this.type = ''
                this.$emit('rejectCandidate', this.candidate.id)   
            })
            .catch(err => {
                err.response ? alert(err.response.data.error) : alert("Error processing request, please try again");
                window.location.reload()
            })
        },
    }
}
</script>