<template>
    <v-card style="text-decoration:none" class="mx-auto" width="20rem" tile>

    <v-card-title class="text-center">{{candidate.fullName}}</v-card-title>

    <v-card-text>
        <div>
            <span class="tag mb-2">VOTES</span>
            <span class="timer blueColor">{{candidate.voteCount}} <span v-if="candidate.voteCount == highestVote">- Winner</span></span>

            <span class="tag mt-4 mb-2">PERCENTAGE OF TOTAL</span>
            <span class="timer">{{votePercent}}%</span>

        </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: "SingleResult",
    props: ["candidate","index","categoryTotal","totalVotes","highestVote"],
    computed: {
        votePercent() {
            let percent = (this.candidate.voteCount / this.totalVotes) * 100;
            return percent
        }
    }
}
</script>

<style>

</style>