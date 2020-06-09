<template>
  <div class="container" v-if="isLoaded">
      <v-breadcrumbs :items="items" class="">
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

      <hr>

      <div class="row mt-5">
          <div class="col-lg-4 p-4 d-flex align-items-center rounded">

              <v-img :src="candidate.imageUrl" class="img-fluid rounded-left"></v-img>
          </div>
          <div class="col-lg-8 border-left mt-3 pt-3 text-center">
              <span class="tag">NAME</span> <span>{{candidate.fullName}}</span>
              <span class="tag mt-3">CURRENT LEVEL</span> <span>{{candidate.level}}</span>
              <span class="tag mt-3">I'M RUNNING FOR:</span> <span>{{candidate.category.name.toUpperCase()}}</span>
              <span class="tag mt-3">MY PLANS FOR THIS {{appType}}</span> <p>{{candidate.manifesto}}</p>

                <v-avatar :color="twitterColor" v-if="candidate.twitter" class="m-3">
                    <v-btn outlined :href="candidate.twitter" class="border-0" target="_blank" style="text-decoration: none">
                        <v-icon style="color:floralwhite">mdi-twitter</v-icon>
                    </v-btn>
                </v-avatar>

                <v-avatar :color="instagramColor" v-if="candidate.instagram" class="m-3">
                    <v-btn outlined :href="candidate.instagram" class="border-0" target="_blank"  style="text-decoration: none">
                        <v-icon style="color:floralwhite">mdi-instagram</v-icon>
                    </v-btn>
                </v-avatar>
          </div>

      </div>
  </div>
  <div class="container" v-else>

      <v-breadcrumbs :items="items" class="">
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>
      <hr>

      <div class="row mt-5">
          <div class="col-md-4 p-3 d-flex align-items-center">
              <v-skeleton-loader type="image" width="20rem" class="m-3"></v-skeleton-loader>
          </div>
          <div class="col-md-8 border-left mt-3">
              <v-skeleton-loader class="mx-auto" type="list-item" width="10rem"></v-skeleton-loader>
              <v-skeleton-loader class="mx-auto" type="text" width="15rem"></v-skeleton-loader>

              <v-skeleton-loader class="mt-3 mx-auto" type="list-item" width="10rem"></v-skeleton-loader>
              <v-skeleton-loader class="mx-auto" type="text" width="15rem"></v-skeleton-loader>

              <v-skeleton-loader class="mt-3 mx-auto" type="list-item" width="10rem"></v-skeleton-loader>
              <v-skeleton-loader class="mx-auto" type="text" width="15rem"></v-skeleton-loader>

              <v-skeleton-loader class="mt-3 mx-auto" type="list-item" width="10rem"></v-skeleton-loader>
              <v-skeleton-loader class="mx-auto" type="sentences" width="35rem"></v-skeleton-loader>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'SingleCandidate',
    data() {
        return {
            appType: process.env.VUE_APP_TYPE.toUpperCase(),
            candidate : {},
            isLoaded: false,
            twitterColor: "#0072b1",
            instagramColor: "#7f1734",                
            items: [
            {
                disabled: false,
                text: "ALL CANDIDATES",
                exact: true,
                link: true,
                to: "/candidates"
            },
            {
                disabled: false,
                text: `${this.refine(this.$route.params.id)} (CANDIDATE PROFILE)`,
                to: "/candidates"
            },]
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`candidates/${this.$route.params.id.split('-')[2]}`)
            .then(res => {
                if (res.data.candidate.refinedLink == this.$route.params.id) {
                    this.isLoaded = true
                    this.candidate = res.data.candidate
                }
                else {
                    this.$router.replace({name: '404'})
                }
            })
            .catch(err => {
                console.log(err)

                if (err.response) {
                    if (err.response.data.status == 404) {
                        this.$router.replace({name: '404'})
                        console.log(err)
                    }
                }
            })

        },
        refine(params) {
            let array = params.split('-');
            array.pop();
            let newParam = array.join(' ').toUpperCase()

            return newParam
        }
    },
}
</script>

<style>

</style>