<template>
  <div class="container">

      <h3 class="main-header" style="text-align: center;">Candidate Application | Ballot</h3>
      <hr>

        <div v-if="state == 'prevoting'">
            <b-alert class="mt-4 col-md-8 mx-auto" v-model="showAlert" variant="danger" dismissible>
                <strong>{{errorMsg}}</strong>
            </b-alert>

            <b-form class="col-md-6 mx-auto text-left" @submit.prevent="checkIfQualify()">

                <b-form-group label="Category" label-for="category">
                    <b-form-select :disabled="showFullForm" id="category" v-model="category" required>
                        <b-form-select-option :value="''">Please select a category</b-form-select-option>
                        <b-form-select-option :value="category.id" v-for="category in categories" :key="category.id">{{category.name}}</b-form-select-option>
                    </b-form-select>
                </b-form-group>

                <b-form-group label="Matric. Number" label-for="matric">
                    <b-form-input :disabled="showFullForm" id="matric" v-model="matric" minlength="6" maxlength="6" pattern="\d*" title="This field must contain numbers only" required placeholder="Enter your matric number here..."></b-form-input>
                </b-form-group>

                <div class="d-flex justify-content-center mt-5" v-if="!showFullForm">
                    <v-btn type="submit" :loading="loading" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Submit</v-btn>
                </div>

                <div v-if="showFullForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" readonly :value="voter.fullName">
                    </div>
                    <b-form-group label="Alias" label-for="alias" description="Fill in this field if you have an alias you would like to be recognized with for the election">
                        <b-form-input id="alias" v-model="alias" type="text" placeholder="Enter alias here..."></b-form-input>
                    </b-form-group>

                    <b-form-group label="Phone Number" label-for="phoneNumber">
                        <b-form-input required id="phoneNumber" v-model="phoneNumber" type="text" placeholder="Enter your phone number here..."></b-form-input>
                    </b-form-group>

                    <b-form-group label="Twitter Handle" label-for="twitter">
                        <b-form-input id="twitter" v-model="twitter" type="text" placeholder="E.g @myhandle"></b-form-input>
                    </b-form-group>

                     <b-form-group label="Instagram Handle" label-for="instagram">
                        <b-form-input id="instagram" v-model="instagram" type="text" placeholder="E.g @myhandle"></b-form-input>
                    </b-form-group>

                    <b-form-group label="Briefly state your plans as a candidate (<100 words)" label-for="manifesto">
                        <b-form-textarea v-model="manifesto" required placeholder="Enter not more than 100 words" rows="8"></b-form-textarea>
                    </b-form-group>

                    <b-form-group label="Official Image of yourself (Must be less than 1MB)" label-for="image">
                        <b-form-file v-model="image" required ref="file" accept="image/jpeg, image/png, image/gif" id="image" placeholder="Choose an image"></b-form-file>
                    </b-form-group>

                    <div class="mt-5">
                        <v-btn type="submit" :loading="loading" :block="true" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Submit</v-btn>
                    </div>
                </div>

            </b-form>
        </div>

        <div v-else>
            <p class="text-center">
                Sorry, applications for candidacy are now closed. Applications will be open in the next election iteration.
            </p>
        </div>

  </div>
</template>

<script>
export default {
    name: 'CandidateApply',
    data() {
        return {
            category: "",
            matric: "",
            categories: [],
            alias: null,
            voter: {},
            image: [],
            showAlert: false,
            showFullForm: false,
            errorMsg: "",
            loading: false,
            instagram: null,
            twitter: null,
            manifesto: "",
            phoneNumber: "",
            type: process.env.VUE_APP_TYPE.toLowerCase(),
            btnColor: "#162059",
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/categories`)
            .then(res => {
                this.categories = res.data.categories
            })
            .catch(err => {
                console.log(err)
            })
        },
        checkIfQualify() {
            let matric = this.matric;
            let categoryId = this.category;

            this.loading = true

            if (this.showFullForm) {
                let {instagram, twitter, phoneNumber, alias, manifesto} = this;
                let {firstName,lastName,level} = this.voter;

                let formData = new FormData();

                formData.append('file', this.image);
                formData.append('upload_preset', 'h7emmbnz')

                this.$http.post("https://api.cloudinary.com/v1_1/ballotdev/image/upload", formData)
                .then(res => {
                    let imageUrl = res.data.secure_url;

                    return this.$http.post(`${process.env.VUE_APP_URL}/candidates/apply`, {
                        instagram, twitter, phoneNumber, alias, manifesto,firstName,lastName,level,imageUrl,categoryId,matric
                    })
                    .then(res => {
                        alert ("Your application has been submitted as pending " + res.data.candidate.fullName)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                })
                .catch(err => console.log(err))
                
                    
                // console.log(formData)


            }
            else {
                this.$http.get(`${process.env.VUE_APP_URL}/candidates/checkIfQualify?matric=${matric}&categoryId=${categoryId}`)
                .then(res => {
                    this.showAlert = false
                    this.loading = false
                    this.showFullForm = true;
                    this.voter = res.data.voter;
                })
                .catch(err => {
                    this.showAlert = true;
                    this.loading = false;
                    this.errorMsg = err.response ? err.response.data.error : "Internal Server Error"
                })
            }
        }
    },
    computed: {
        state() { return this.$store.getters.state }
    }
}
</script>

<style>

</style>