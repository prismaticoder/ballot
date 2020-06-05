<template>
    <div>
        <h5>VOTERS</h5>
        <hr>
        <div class="row timer blueColor">
            <div class="col-6">{{voterCount}}</div>
            <div class="col-6">{{accreditedVoterCount}}</div>
        </div>
        <div class="row">
            <div class="col-6">Eligible</div>
            <div class="col-6">Accredited</div>
        </div>

        <v-btn to="/command/voters" rounded :color="btnColor" class="mt-4 text-white col-md-7">
            DOWNLOAD VOTER LIST
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "VoterCounter",
    props: ["voterCount","accreditedVoterCount","btnColor"]
}
</script>

<style scoped>

</style>