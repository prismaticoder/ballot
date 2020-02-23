<template>
  <div class="container mt-4">
    <h4 class="text-center mt-5"><span class="redColor text-uppercase">{{region.name}}</span> VOTERS</h4>

    <form action="" class="voterForm" >
    <div class="input-group mb-3 col-md-5 mx-auto">
            <input type="search" v-model="matric" id="voterText" class="form-control" placeholder="Enter a Matric Number" aria-label="Enter Matric Number" aria-describedby="basic-addon2">
            <div class="input-group-append">
            <button @click.prevent="getMatric(matric)" class="btn myBtn voterBtn" type="submit"><i class="fa fa-search" style="color: #BF1111;"></i></button>
            </div>
    </div>
    </form>

    <table class="table table-sm">
        <thead class="blueColor">
            <tr>
                <th>S/N</th>
                <th>Matric</th>
                <th>Firstname</th>
                <th>Surname</th>
                <th v-if="region.type == 'hall'">Faculty</th>
                <th v-if="region.type == 'hall'">Department</th>
                <th v-else-if="region.type == 'faculty'">Department</th>
                <th>Level</th>
            </tr>
        </thead>
        <tbody id="tableBody">
                <tr v-bind:key="voter.id" v-for="(voter, index) in voters">
                    <td>{{index+1}}</td>
                    <td>{{ voter.matric }}</td>
                    <td class="text-capitalize">{{ voter.firstName.toLowerCase() }}</td>
                    <td class="text-capitalize">{{ voter.lastName.toLowerCase() }}</td>
                    <td v-if="region.type == 'hall'">{{ voter.faculty }}</td>
                    <td v-if="region.type == 'hall'">{{ voter.department }}</td>
                    <td v-else-if="region.type == 'faculty'">{{ voter.department }}</td>
                    <td>{{ voter.level }}</td>
                </tr>
        </tbody>
        
    </table>
    <div class="col-md-8 mx-auto text-center" v-if="showVisible">
        <a @click.prevent="init" class="backBtn specColor" href="">Back to Main List</a>
    </div>
</div>
</template>

<script>

import axios from 'axios';


export default {
    name: "Voters",
    data() {
        return {
            voters: [],
            region: {},
            matric: '',
            showVisible: false
        }
    },
    methods: {
        init() {
            axios.get('http://localhost:4010/sultan-bello/admin/voters')
            .then(res => {
                if (res.data.ok) {
                    this.voters = res.data.voters;
                    this.region = res.data.region;
                    this.showVisible = false;
                }
            })
            .catch(err => console.log(err))
        },
        getMatric(matric) {
            axios.get(`http://localhost:4010/sultan-bello/admin/voters/search?q=${matric}`)
            .then(res => {
                if (res.data.ok) {
                    this.voters = [res.data.voter];
                    this.showVisible = true;
                }
                else {
                    alert (res.data.message)
                }
            })
            .catch(err => console.log(err))
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>