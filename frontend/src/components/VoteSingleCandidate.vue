<template>
  <v-card style="text-decoration:none" class="mx-auto mb-5" width="25rem" hover :shaped="true">

    <v-img class="img-fluid" :src="candidate.imageUrl" :lazy-src="require('../assets/image.png')" @click="goToCandidate()"></v-img>

    <v-card-title class="text-center">{{candidate.fullName}}</v-card-title>

    <v-card-text>
        <div>
            <span class="tag">ALIAS</span> 
            {{candidate.alias}}
        </div>

        <div>
            <span class="tag">LEVEL</span>
            {{candidate.level}}
        </div>
        
        
    </v-card-text>


    <v-card-actions class="justify-content-center">

        <v-btn color="orange" rounded>
        Vote
      </v-btn>

    </v-card-actions>
  </v-card>

</template>

<script>
export default {
    name: 'VoteSingleCandidate',
    props: ["candidate"],
    data() {
      return {
        defaultImg: "../assets/logo.svg",
      }
    },
    methods: {

    }
}
</script>

<style>

</style>