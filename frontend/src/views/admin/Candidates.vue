<template>
    <div class="container mt-4">
        <h4 class="text-center mt-5"><span class="redColor text-uppercase">ALL</span> CANDIDATES</h4>

        <div class="col-md-2 mt-4 mb-5 mx-auto form-group">
            <form action="" class="candidateForm">


                <label for="status">Filter Candidates</label>

                <select @change="filterCandidates(value)" v-model="value" class="form-control">
                    <option selected value="">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                </select>
                
                
            </form>
        </div>

        <table class="table table-sm table-bordered mt-1">
            <thead class="blueColor">
            <tr>
                <th class="text-center">S/N</th>
                <th class="text-center">Matric</th>
                <th class="text-center">Name</th>
                <!-- <th class="text-center">Category</th> -->
                <th class="text-center">Level</th>
                <th class="text-center">Status</th>
                <th class="text-center" colspan="2">Confirm/Reject</th>
                <th class="text-center">-</th>
            </tr>
        </thead>
        <tbody>
            <tr v-bind:key="candidate.id" v-for="(candidate, index) in candidates">
                <td>{{index+1}}</td>
                <td>{{candidate.matric}}</td>
                <td class="text-capitalize fullName">{{candidate.fullName}}</td>
                <td>{{candidate.level}}</td>
                <td class="text-capitalize">{{candidate.status}}</td>
                <td v-if="candidate.status == 'confirmed'" class="text-center" title="This candidate is already confirmed">-</td>
                <td v-else class="text-center editor confirmBtn" @click="acceptCandidate(candidate.id)" title="Accept Candidate Application"><i class="fa fa-1x fa-check blueColor"></i></td>
                <td class="text-center editor denyBtn" @click="rejectCandidate(candidate.id)" title="Reject/Overturn Candidate Application"><i class="fa fa-1x fa-close redColor"></i></td>
                <td><a class="specColor" href="">See Full Details</a></td>
                <!-- <singleCandidateRow v-bind:candidate="candidate" v-on:rejectCandidate="rejectCandidate" v-on:acceptCandidate="acceptCandidate"/> -->
            </tr>
        </tbody>
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
            candidates: [],
            value: ''
        }
        // candidates: undefined
    },
    methods: {
        init() {
            axios.get("http://localhost:4010/law/admin/candidates")
            .then(res => {
                if (res.data.ok) {
                    this.candidates = res.data.candidates
                }
            })
            .catch(err => {
                console.log(err)
                alert("Sorry, there was an error connecting to the server. Please check your internet connection and try again")
                })
        },
        acceptCandidate(id) {
            axios.post(`http://localhost:4010/law/admin/candidates/${id}/confirm`)
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
            axios.post(`http://localhost:4010/law/admin/candidates/${id}/deny`)
            .then(res => {
                if (res.data.ok) {
                    this.candidates = this.candidates.filter(candidate => candidate.id !== id)
                }
                else {
                    alert (res.data.message)
                }
                })
            .catch(err => console.log(err))
        },
        filterCandidates(value) {
            axios.get(`http://localhost:4010/law/admin/candidates?status=${value}`)
            .then(res => {
                if (res.data.ok) {
                    this.candidates = res.data.candidates
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