<template>
  <div>
    <h3 class="main-header" style="text-align: center;">Approved Election Results</h3>
    <hr>
    <div v-if="isLoaded && !pageText">
        <div class="mt-5 mx-auto" :id="category.id" v-for="category in categories" v-bind:key="category.id">
            <h4 class="text-center">CATEGORY: {{category.name.toUpperCase()}}</h4>
            <hr>
            <CategoryResult class="justify-content-center mt-4" :category="category" :totalVotes="totalVotes"/>
        </div>
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

import CategoryResult from '../components/result/CategoryResult';


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
            pageText: null
        }
    },
    methods: {
        init() {
            this.$http.get('results')
            .then(res => {
                this.categories = res.data.categories;
                this.totalVotes = res.data.totalVotes;
                this.isLoaded = true
            })
            .catch(err => {
                this.pageText = err.response ? err.response.data.error : "Error processing request, please try again"
                this.isLoaded = true;
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