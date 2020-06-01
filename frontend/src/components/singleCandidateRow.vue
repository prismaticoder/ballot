<template>
    <div class="border mx-auto" style="width: 20rem">

        <div class="col-12 text-left">
            <span class="tag mt-2">NAME</span>
            {{candidate.fullName}}
            <span class="tag mt-2">LEVEL</span>
            {{candidate.level}}
            <span class="tag mt-2">POST</span>
            <span class="text-capitalize">{{candidate.category.name}}</span>
            <span class="tag mt-2">STATUS</span>
            {{candidate.status[0].toUpperCase() + candidate.status.toLowerCase().slice(1)}}
        </div>

        <div class="col-12 border-top justify-content-center">

            <v-btn fab small :color="btnColor" style="color: #162059" title="Deny Application" class="mr-3 btn-fix" @click.prevent="$emit('rejectCandidate', candidate.id)">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn v-if="candidate.status == 'pending'" fab small :color="btnColor" style="color: #162059" title="Approve Application" dark class="ml-5 btn-fix" @click.prevent="$emit('acceptCandidate', candidate.id)">
                <v-icon>mdi-check</v-icon>
            </v-btn>

        </div>

    </div>
</template>

<script>
export default {
    name: 'singleCandidateRow',
    props: ["candidate","btnColor"]
}
</script>