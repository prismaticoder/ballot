<template>
    <div class="container">
        <table border="1" cellpadding="20" align="center" cellspacing="15">
            <tr v-bind:key="candidate.id" v-for="candidate in candidates">
                <singleCandidateRow v-bind:candidate="candidate" v-on:rejectCandidate="rejectCandidate" v-on:acceptCandidate="acceptCandidate"/>
            </tr>
            
        </table>
    </div>
</template>

<script>

import singleCandidateRow from './singleCandidateRow.vue';
import axios from 'axios'


export default {
    name: 'Candidates',
    components: {
        singleCandidateRow
    },
    data() {
        return {
            candidates: []
        }
        // candidates: undefined
    },
    methods: {
        init() {
            axios.get('http://localhost:4010/arts/admin/candidates')
            .then(res => {
                if (res.data.ok) {
                    this.candidates = res.data.candidates
                }
            })
            .catch(err => console.log(err))
        },
        acceptCandidate(id) {
            axios.post(`http://localhost:4010/arts/admin/candidates/${id}/confirm`)
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
            axios.post(`http://localhost:4010/arts/admin/candidates/${id}/deny`)
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