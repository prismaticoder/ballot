<template>
  <div class="container mt-4">
    <h4 class="text-center mt-5"><span class="redColor text-uppercase">{{region.name}}</span> VOTERS</h4>

    <form action="" class="voterForm mt-4 mb-5" >
    <div class="input-group mb-3 col-md-5 mx-auto">
            <input type="search" v-model="matric" id="voterText" class="form-control" placeholder="Search Voters By Matric..." aria-label="Enter Matric Number" aria-describedby="basic-addon2">
            <div class="input-group-append">
            <button @click.prevent="getMatric(matric)" class="btn myBtn voterBtn" type="submit"><i class="fa fa-search" style="color: #BF1111;"></i></button>
            </div>
    </div>
    </form>

    <table class="table mt-1 table-sm table-bordered">
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


    <nav v-show="!showVisible" class="mt-4" v-if="pages > 1" aria-label="Page navigation">
        <ul class="pagination justify-content-center">
            <li v-if="currentPage == 1" class="page-item disabled">
                <span class="page-link" tabindex="-1">Previous</span>
            </li>
            <li class="page-item" v-else>
                <span class="page-link" @click="getPage(parseInt(currentPage) - 1)">Previous</span>
            </li>

            <li v-bind:key="page" v-bind:class="{'page-item':true, 'active':(page == currentPage)}" v-for="page in pages">
                <span v-if="page == currentPage" @click="getPage(page)" class="page-link active">{{page}}</span>
                <span v-else @click="getPage(page)" class="page-link">{{page}}</span>
            </li>

           <li v-if="currentPage == pages" class="page-item disabled">
                <span class="page-link" tabindex="-1">Next</span>
            </li>
            <li class="page-item" v-else>
                <span class="page-link" @click="getPage(parseInt(currentPage) + 1)">Next</span>
            </li>
        </ul>
    </nav>
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
            pages: '',
            currentPage: null,
            nextPage: '',
            showVisible: false
        }
    },
    methods: {
        init() {
            axios.get('http://localhost:4010/queen-idia/admin/voters')
            .then(res => {
                if (res.data.ok) {
                    this.voters = res.data.voters;
                    this.region = res.data.region;
                    this.pages = res.data.totalPages;
                    this.nextPage = res.data.nextPage;
                    this.currentPage = res.data.currentPage
                    this.showVisible = false;
                }
            })
            .catch(err => console.log(err))
        },
        getMatric(matric) {
            axios.get(`http://localhost:4010/queen-idia/admin/voters/search?q=${matric}`)
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
        },
        getPage(page) {
            axios.get(`http://localhost:4010/queen-idia/admin/voters?page=${page}`)
            .then(res => {
                if (res.data.ok) {
                    this.voters = res.data.voters;
                    this.region = res.data.region;
                    this.pages = res.data.totalPages;
                    this.currentPage = res.data.currentPage
                    this.nextPage = res.data.nextPage;
                    this.showVisible = false;
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