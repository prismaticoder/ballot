<template>
  <v-card style="text-decoration:none" class="m-3" width="20rem" :hover="true" :shaped="true" :to="{name: 'single-candidate', params: {id: candidate.refinedLink}}">

    <v-img
      
      class="img-fluid"
      :src="candidate.imageUrl"
    >
    </v-img>

    <v-card-title>{{candidate.fullName}}</v-card-title>

    <v-card-subtitle class="pb-0">{{candidate.level}} Level</v-card-subtitle>

    <!-- <v-card-text class="text--primary">
      <div>{{candidate.level}} Level</div>
    </v-card-text> -->

    <v-card-actions class="justify-content-center">
      <v-btn
        color="orange"
        text
      >
        Share
      </v-btn>

      <!-- <v-avatar class="m-2" color="indigo" size="36"> -->
            <!-- <v-img src="../assets/twitter.svg" alt=""></v-img> -->
        <!-- </v-avatar> -->

      <v-btn
        color="orange"
        text
      >
        Explore
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script>
export default {
    name: 'SingleCandidate',
    props: ["candidate"]
}
</script>

<style>

</style>