<template>
    <div class="container">
        <h3 v-if="name == 'confirm_accreditation'" class="main-header mt-4" style="text-align: center;">Confirm Accreditation</h3>
        <h3 v-else-if="name == 'reset_code'" class="main-header mt-4" style="text-align: center;">Restore Voter Code</h3>
        <h3 v-else class="main-header mt-4" style="text-align: center;">Page Not Found</h3>
        <hr>


        <p v-if="isLoaded" class="mt-5">
            <span class="mt-5" style="display:block">{{message}}</span>

            <v-btn class="text-white mt-5 col-6" @click="goHome()" rounded :color="btnColor">
                <v-icon>mdi-home</v-icon>
                &nbsp;
                Go Home
            </v-btn>
        </p>
        <p v-else class="mt-5">
            Please Wait...
        </p>
        

    </div>
</template>

<script>
export default {
    name: "ConfirmAccreditation",
    data() {
        return {
            message: "",
            isLoaded: false,
            name: this.$route.name,
            btnColor: "#162059",
        }
    },
    methods: {
        init() {
            if (['reset_code','confirm_accreditation'].includes(this.name)) {
                let code = this.$route.query.code

                if (code) {
                    if (this.name == 'confirm_accreditation') {
                        this.$http.get(`confirm_accreditation?code=${code}`)
                        .then(res => {
                            this.message = res.data.message;
                            this.isLoaded = true
                            setTimeout(function() {window.location.href = '/'}, 5000)
                        })
                        .catch(err => {
                            this.message = err.response ? err.response.data.error : "Error processing request, please try again."
                            this.isLoaded = true;
                        })
                    }

                    else {
                        this.$http.get(`/reset_voter_code?code=${code}`)
                        .then(res => {
                            this.message = res.data.message;
                            this.isLoaded = true
                            setTimeout(function() {window.location.href = '/'}, 5000)
                        })
                        .catch(err => {
                            this.message = err.response ? err.response.data.error : "Error processing request, please try again."
                            this.isLoaded = true;
                        })
                    }
                }

                else {
                    window.location.href = '/page-not-found'
                }
                
            }

            else {
                window.location.href = '/page-not-found'
            }

            
        },
        goHome() {
            this.$router.replace('/')
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>