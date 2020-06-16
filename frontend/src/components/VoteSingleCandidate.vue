<template>
  <v-card style="text-decoration:none" class="mx-auto mt-5" width="20rem" hover :shaped="true" @click="$emit('selectCandidate', candidate.id)">

    <v-img class="img-fluid" :src="candidate.imageUrl" :lazy-src="require('../assets/image.png')"></v-img>


    <v-overlay :color="btnColor" absolute v-show="selectedCandidate == candidate.id">
        <v-icon x-large>mdi-check</v-icon>
    </v-overlay>

    <v-card-title class="text-center">{{candidate.fullName}}</v-card-title>

    <v-card-text>
        <div>
            <span class="tag">ALIAS</span> 
            <span v-if="candidate.alias">{{candidate.alias}}</span>
            <span v-else>None</span>
        </div>

        <div>
            <span class="tag">LEVEL</span>
            {{candidate.level}}
        </div>
        
        
    </v-card-text>
  </v-card>

</template>

<script>
export default {
    name: 'VoteSingleCandidate',
    props: ["candidate","selectedCandidate"],
    data() {
      return {
        defaultImg: "../assets/logo.svg",
        overlay: false,
        btnColor: "#fccc83",
      }
    },
    methods: {

    }
}
</script>

<style>

</style>