<template>
  <div class="border" v-if="!editMode">
      <div class="col-12 border-bottom">
          <h5>POST</h5>
          <span class="text-capitalize">{{category.name}}</span>
      </div>
      <div class="row">
        <div class="col-6 border-right">
            <h5>MIN. LEVEL</h5>
            {{category.minLevel}} Level
        </div>
        <div class="col-6 border-left">
            <h5>MAX. LEVEL</h5>
            {{category.maxLevel}} Level
        </div>
      </div>
      <div class="col-12 border-top justify-content-center">
          <!-- Edit and Delete Buttons -->
            <v-btn fab small :color="btnColor" style="color: #162059" title="Edit Category Details" class="mr-3 btn-fix" @click.prevent="editMode = true">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab small :color="btnColor" style="color: #162059" title="Remove Category" dark class="ml-5 btn-fix" @click.prevent="dialog = true">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
      </div>
      <!-- Confirmation Dialog -->
        <v-dialog v-model="dialog" persistent max-width="350">
            <v-card>
                <v-card-title class="headline">Remove Category?</v-card-title>
                <v-card-text>
                Are you sure you want to delete this category: <strong>{{category.name}}</strong>?
                Deleting this would also mean you are automatically cancelling the application of every candidate associated with this position.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                    <v-btn color="green darken-1" text @click="$emit('deleteCategory', category.id)">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
  </div>
    <div class="border" v-else>
        <b-alert class="col-12 mx-auto" v-model="showAlert" variant="warning" dismissible>
            {{errorMsg}}
        </b-alert>
      <div class="col-12 border-bottom">
          <h5>POST</h5>
          <input type="text" class="form-control" v-model="name">
      </div>
      <div class="row">
        <div class="col-6 border-right">
            <h5>MIN. LEVEL</h5>
            <b-form-select required v-model="minLevel">
                <b-form-select-option :value="level" v-for="level in levels" :key="level">{{level}}</b-form-select-option>
            </b-form-select>
        </div>
        <div class="col-6 border-left">
            <h5>MAX. LEVEL</h5>
            <b-form-select required v-model="maxLevel">
                <b-form-select-option :value="level" v-for="level in levels" :key="level.id">{{level}}</b-form-select-option>
            </b-form-select>
        </div>
      </div>
      <div class="col-12 border-top justify-content-center">
        <v-btn fab small :color="btnColor" dark style="color: #162059" title="Cancel" class="mr-3 btn-fix" @click.prevent="editMode = false">
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn fab small :color="btnColor" style="color: #162059" title="Update" dark class="ml-5 btn-fix" @click.prevent="updateCategory()">
            <v-icon>mdi-check</v-icon>
        </v-btn>
      </div>
  </div>
</template>

<script>
export default {
    name: "SingleCategory",
    props: ["category","levels","index"],
    data() {
        return {
            btnColor: "#fff",
            editMode: false,
            showAlert: false,
            errorMsg: null,
            dialog: false,
            name: this.category.name,
            minLevel: this.category.minLevel,
            maxLevel: this.category.maxLevel,
            id: this.category.id
        }
    },
    methods: {
        updateCategory() {
            let { name, minLevel, maxLevel,id } = this;
            name = name.replace(/\s+/g,' ').trim()

            //check if there was any change before going to the API
            if (name == this.category.name && minLevel == this.category.minLevel && maxLevel == this.category.maxLevel) {
                this.editMode = false
            }

            else if (maxLevel < minLevel) {
                this.showAlert = true;
                this.errorMsg = "Error: The minimum level must be either less than or equal to the maximum level set";
            }

            else {
                this.$http.put(`${process.env.VUE_APP_URL}/admin/categories/${id}`, {
                name,minLevel,maxLevel
                })
                .then(res => {
                    this.editMode = false
                    this.$emit('updateCategory',this.index,res.data.category)
                })
                .catch(err => {
                    this.showAlert = true;
                    this.errorMsg = err.response ? err.response.data.error : "Error processing request, please try again"
                })
            }
            
        }
    }

}
</script>

<style>

</style>