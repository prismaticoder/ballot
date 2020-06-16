<template>
  <div class="col-lg-4 mt-5">
      <h5>{{categoryName.toUpperCase()}}</h5>
      {{candidateName}}
  </div>
</template>

<script>
export default {
    name: "EachSubmission",
    props: ["category", "votes"],
    data() {
        return {
            categoryName: this.category.name
        }
    },
    computed: {
        candidateName() {
            let candidateId = this.votes.filter(vote => vote.categoryId == this.category.id)[0].candidateId;

            if (!candidateId) {
                return "Undecided"
            }

            let name = this.category.candidates.filter(candidate => candidate.id == candidateId)[0].fullName

            return name
        }
    }
}
</script>

<style>

</style>