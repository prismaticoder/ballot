<template>
    <div>
        <h5>CANDIDATES</h5>
        <hr>
        <div class="row timer blueColor">
            <div class="col-6">{{confirmed}}</div>
            <div class="col-6">{{pending}}</div>
        </div>
        <div class="row">
            <div class="col-6">Confirmed</div>
            <div class="col-6">Pending</div>
        </div>

        <v-btn to="/command/candidates" rounded :color="btnColor" class="mt-4 text-white col-md-7">
            VIEW ALL CANDIDATES
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "CandidateCounter",
    props: ["pending","confirmed","btnColor"]
}
</script>

<style scoped>

</style>