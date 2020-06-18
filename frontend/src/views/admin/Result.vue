<template>
  <div>
    <h3 class="main-header mt-4" style="text-align: center;">Election Results</h3>
    <hr>
    <div v-if="isLoaded && !pageText">
        <div class="container" v-show="!isApproved">
            <p class="mt-2 text-left">
                <span class="header">IMPORTANT</span>
                In order to give voters access to the election results, click the "Approve Results" button.
            </p>
            <div class="col-7 col-md-3 mt-1">
                <v-btn class="text-white" block rounded :color="btnColor" :loading="loading" @click="dialog = true">
                    Approve Results 
                    <v-icon small>
                        mdi-check
                    </v-icon>
                </v-btn> 
            </div>
            <hr>

            <v-dialog v-model="dialog" persistent max-width="350">
                <v-card>
                    <v-card-title class="headline">Approve Results</v-card-title>
                    <v-card-text>
                    Please confirm that you wish to approve this election's results
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="btnLoading" color="green darken-1" text @click="dialog = false">No</v-btn>
                        <v-btn :loading="btnLoading" :disabled="btnLoading" color="green darken-1" text @click="approveResult()">Yes</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </div>
        <div class="mt-5 mx-auto" :id="category.id" v-for="category in categories" v-bind:key="category.id">
            <h4 class="text-center">CATEGORY: {{category.name.toUpperCase()}}</h4>
            <hr>
            <CategoryResult class="justify-content-center mt-4" :category="category" :totalVotes="totalVotes"/>
        </div>

        <v-snackbar v-model="snackbar">
            {{ text }}
            <v-btn color="pink" text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
    <div v-else-if="isLoaded && pageText">
        <div class="mt-5 mx-auto">
            <p>
                {{pageText}}
            </p>
        </div>
    </div>
    <div v-else>
        <v-skeleton-loader class="mx-auto mt-5" type="heading"></v-skeleton-loader>

        <div class="row justify-content-center">
            <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
            <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
            <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
            <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
            <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
            <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
        </div>
    </div>

  </div>
</template>

<script>

import CategoryResult from '@/components/admin/CategoryResult';


export default {
    name: "Result",
    components: {
        CategoryResult
    },
    data() {
        return {
            isLoaded: false,
            categories: null,
            totalVotes: null,
            pageText: null,
            isApproved: 0,
            btnColor: "#162059",
            loading: false,
            dialog: false,
            snackbar:false,
            text: null,
            btnLoading: false
        }
    },
    methods: {
        init() {
            this.$http.get('admin/results')
            .then(res => {
                this.categories = res.data.categories;
                this.totalVotes = res.data.totalVotes;
                this.isApproved = res.data.isApproved
                this.isLoaded = true
            })
            .catch(err => {
                this.pageText = err.response ? err.response.data.error : "Error processing request, please try again"
                this.isLoaded = true;
            })
        },
        approveResult() {
            this.btnLoading = true

            this.$http.get('admin/approveResults')
            .then(res => {
                this.btnLoading = false
                this.dialog = false,
                this.isApproved = 1,
                this.snackbar = true,
                this.text = res.data.message

                setTimeout(function() {this.snackbar = false}, 2500)
            })
            .catch(err => {
                this.btnLoading = false
                this.dialog = false
                alert(err.response ? err.response.data.error : "Error processing request, please try again")
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>