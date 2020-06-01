<template>
  <v-card style="text-decoration:none" class="mx-auto mb-5" width="25rem" hover :shaped="true">

    <v-img class="img-fluid" :src="candidate.imageUrl" :lazy-src="defaultImg" @click="goToCandidate()"></v-img>

    <v-card-title>{{candidate.fullName}}</v-card-title>

    <v-card-subtitle class="pb-0">{{candidate.level}} Level</v-card-subtitle>


    <v-card-actions class="justify-content-center">

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

    </v-card-actions>
  </v-card>

</template>

<script>
export default {
    name: 'SingleCandidate',
    props: ["candidate"],
    data() {
      return {
        defaultImg: "../assets/logo.svg",
        twitterColor: "#0072b1",
        instagramColor: "#7f1734"
      }
    },
    methods: {
      goToCandidate() {
        this.$router.push({name: 'single-candidate', params: {id: this.candidate.refinedLink}})
      }
    }
}
</script>

<style>

</style>