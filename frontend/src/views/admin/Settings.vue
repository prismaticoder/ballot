<template>
  <div class="container">
      <h3 class="main-header" style="text-align: center;">Election Settings And Configuration</h3>
      <hr>
      <div class="row">
          <div class="col-md-4" v-for="(category,index) in categories" :key="category.id">
              <SingleCategory :category="category" :levels="levels" :index="index" :updateCategory="updateCategory"/>
          </div>
      </div>
  </div>
</template>

<script>

import SingleCategory from '../../components/admin/SingleCategory'

export default {
    name: "Settings",
    components: {
        SingleCategory
    },
    data() {
        return {
            date: "",
            categories: null,
            levels: []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/categories`)
            .then(res => {
                this.categories = res.data.categories;
                let highestLevel = process.env.VUE_APP_HIGHEST_LEVEL;

                for (let i = 100; i <= highestLevel; i+=100) {
                    this.levels.push(i)
                }
            })
            .catch(err => {
                console.log(err.response.data.error)
            })
        },
        updateCategory(index,category) {
            this.categories.splice(index,1,category)
        }
    }
}
</script>

<style scoped>

@import '../../../node_modules/vue-datetime/dist/vue-datetime.css';

</style>