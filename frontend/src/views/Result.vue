<template>
  <div>
    <h3 class="main-header" style="text-align: center;">Approved Election Results</h3>
    <hr>

    
    <div class="mt-5 mx-auto" :id="category.id" v-for="category in categories" v-bind:key="category.id">
        <h4 class="text-center">CATEGORY: {{category.name.toUpperCase()}}</h4>
        <hr>
        <CategoryResult class="justify-content-center mt-4" :category="category" :totalVotes="totalVotes"/>
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
            totalVotes: null
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