<template>
    <div class="col-md-6">
      <div class="card">
          <div class="card-header">
              <span class="timerHeader blueColor">Candidates</span>
          </div>
          <div class="card-body text-center">
              <div class="row timerBody">
                  <p class="text-center bg-primary">{{totalCount}} Candidates</p>
              </div>
              <div class="row">
                  <div class="col-md-6">
                      <span class="d-block">{{pending}}</span>
                      <!-- Pending -->
                  </div>
                  <div class="col-md-6">
                      <span class="d-block">{{confirmed}}</span>
                      <!-- Confirmed -->
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "CandidateCounter",
    props: ["totalCount","pending","confirmed"]
}
</script>

<style scoped>

.timerHeader {
    font-size: 1.7rem;
}

.timerBody {
    font-size: 2.5rem
}

</style>