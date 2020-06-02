<template>
    <div class="container">
        <h3 class="main-header" style="text-align: center;">Candidate Applications</h3>
        <hr>


        <div class="mt-2 form-group col-md-12">
            <v-btn v-show="candidates.length !== allCandidates.length" fab top left absolute :color="btnColor" style="color: #162059" title="Back" class="mt-4 btn-fix" @click.prevent="candidates = [...allCandidates]; statusFilter=''; postFilter=''">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="col-md-8 mx-auto mt-2 border">
                <h4>Filter Candidate List</h4>
                 <form class="candidateForm mx-auto" @submit.prevent="filterCandidates()">
                <div class="row text-left">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">
                        <label for="status">Status</label>
                        <b-form-select :disabled="!hasLoaded" id="status" v-model="statusFilter">
                            <b-form-select-option :value="''">All</b-form-select-option>
                            <b-form-select-option value="confirmed">Confirmed</b-form-select-option>
                            <b-form-select-option value="pending">Pending</b-form-select-option>
                        </b-form-select>
                    </div>
                    <div class="col-md-4">
                        <label for="post">Post</label>
                        <b-form-select :disabled="!hasLoaded" id="post" v-model="postFilter">
                            <b-form-select-option :value="''">All</b-form-select-option>
                            <b-form-select-option :value="category.name" v-for="category in categories" :key="category.id">{{category.name}}</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>

                 <div class="col-12 mt-2">
                    <v-btn :disabled="!hasLoaded" :color="otherColor" type="submit" style="color: floralwhite" class="btn btn-block myBtn col-4 text-capitalize">Apply Filter</v-btn>
                </div>

            </form>
            </div>
           
        </div>

        <div class="row justify-content-center" v-if="hasLoaded && candidates.length > 0">
            <div class="col-md-4" v-for="candidate in candidates" :key="candidate.id">
                <singleCandidateRow v-on:approveCandidate="approveCandidate" v-on:rejectCandidate="rejectCandidate" :candidate="candidate" :btnColor="btnColor"/>
            </div>
        </div>
        <div v-else-if="hasLoaded && candidates.length == 0">
            <p class="text-center">
                There are no candidates in this category
            </p>
        </div>
        <div v-else class="row justify-content-center">
            <div class="col-lg-4">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
        </div>
    </div>
</template>

<script>

import singleCandidateRow from '../../components/singleCandidateRow';


export default {
    name: 'Candidates',
    components: {
        singleCandidateRow
    },
    data() {
        return {
            candidates: [],
            hasLoaded: false,
            allCandidates: [],
            categories: [],
            statusFilter: '',
            postFilter: '',
            btnColor: "#fff",
            otherColor: '#162059'
        }
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/admin/candidates`)
            .then(res => {
                this.candidates = res.data.candidates
                this.allCandidates = res.data.candidates

                return this.$http.get(`${process.env.VUE_APP_URL}/admin/categories`)
                .then (res => {
                    this.categories = res.data.categories
                    this.hasLoaded = true
                })
                .catch (err => {
                    console.log(err)
                })
            })
            .catch(err => {
                console.log(err)
                })
        },
        rejectCandidate(id) {
            this.candidates = this.candidates.filter(candidate => candidate.id !== id)
            this.allCandidates = this.allCandidates.filter(candidate => candidate.id !== id)    
        },
        approveCandidate(id) {
            for (let i = 0; i < this.allCandidates.length; i++) {
                if (this.allCandidates[i] === id) {
                    this.allCandidates[i].status = 'confirmed'
                    break;
                }
            }
        },
        filterCandidates() {
            let { statusFilter, postFilter } = this;

            if (statusFilter && postFilter) {
                this.candidates = this.allCandidates.filter(candidate => candidate.status == statusFilter && candidate.category.name == postFilter);
            }
            else if (statusFilter || postFilter) {
                if (statusFilter) {
                    this.candidates = this.allCandidates.filter(candidate => candidate.status == statusFilter)
                }
                else {
                    this.candidates = this.allCandidates.filter(candidate => candidate.category.name == postFilter)
                }
            }
            else {
                this.candidates = [...this.allCandidates]
            }
        }
    },
    created() {
        this.init()
    },
}
</script>

<style scoped>

</style>