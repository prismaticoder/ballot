<template>
    <div class="container mt-4">
        <table class="table table-sm table-bordered">
            <tr v-bind:key="candidate.id" v-for="candidate in candidates">
                <td>{{candidate.matric}}</td>
                <td class="text-capitalize fullName">{{candidate.fullName}}</td>
                <td>{{candidate.level}}</td>
                <td class="text-capitalize">{{candidate.status}}</td>
                <td v-if="candidate.status == 'confirmed'" class="text-center" title="This candidate is already confirmed">-</td>
                <td v-else class="text-center editor confirmBtn" @click="acceptCandidate(candidate.id)" title="Accept Candidate Application"><button>Accept</button></td>
                <td class="text-center editor denyBtn" @click="rejectCandidate(candidate.id)" title="Reject/Overturn Candidate Application"><button>Reject</button></td>
                <td><a class="specColor" href="">See Full Details</a></td>
                <!-- <singleCandidateRow v-bind:candidate="candidate" v-on:rejectCandidate="rejectCandidate" v-on:acceptCandidate="acceptCandidate"/> -->
            </tr>
            
        </table>
    </div>
</template>

<script>

// import singleCandidateRow from './singleCandidateRow.vue';
import axios from 'axios'


export default {
    name: 'Candidates',
    components: {
        // singleCandidateRow
    },
    data() {
        return {
            candidates: []
        }
        // candidates: undefined
    },
    methods: {
        init() {
            axios.get('http://localhost:4010/physics/admin/candidates')
            .then(res => {
                if (res.data.ok) {
                    this.candidates = res.data.candidates
                }
            })
            .catch(err => console.log(err))
        },
        acceptCandidate(id) {
            axios.post(`http://localhost:4010/physics/admin/candidates/${id}/confirm`)
            .then(res => {
                if (res.data.ok) {
                    console.log(res)
                    this.candidates.forEach(candidate => {
                        if (candidate.id == id) {
                            candidate.status = "confirmed"
                        }
                    })
                }
                else {
                    alert(res.data.message)
                }
                this.init()})
            .catch(err => console.log(err))
        },
        rejectCandidate(id) {
            axios.post(`http://localhost:4010/physics/admin/candidates/${id}/deny`)
            .then(res => {
                if (res.data.ok) {
                    this.candidates = this.candidates.filter(candidate => candidate.id !== id)
                }
                else {
                    alert (res.data.message)
                }
                })
            .catch(err => console.log(err))
        }
    },
    created() {
        this.init()
    },
}
</script>

<style scoped>

</style>