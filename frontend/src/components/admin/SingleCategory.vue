<template>
  <div class="border" v-if="!editMode">
      <div class="col-12 border-bottom">
          <h5>POST</h5>
          <span class="text-capitalize">{{category.name}}</span>
      </div>
      <div class="row border-bottom">
        <div class="col-6 border-right">
            <h5>MIN. LEVEL</h5>
            {{category.minLevel}} Level
        </div>
        <div class="col-6 border-left">
            <h5>MAX. LEVEL</h5>
            {{category.maxLevel}} Level
        </div>
      </div>
      <div class="col-12 justify-content-center">
          <!-- Edit and Delete Buttons -->
            <v-btn fab small :color="btnColor" style="color: #162059" title="Edit Category Details" class="mr-3 btn-fix" @click.prevent="editMode = true">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn fab small :color="btnColor" style="color: #162059" title="Remove Category" dark class="ml-5 btn-fix" @click.prevent="$emit(deleteCategory, category.id)">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
      </div>
  </div>
    <div class="border" v-else>
      <div class="col-12 border-bottom">
          <h5>POST</h5>
          <input type="text" class="form-control" v-model="category.name">
      </div>
      <div class="row border-bottom">
        <div class="col-6 border-right">
            <h5>MIN. LEVEL</h5>
            <b-form-select v-model="category.minLevel">
                <b-form-select-option :value="level" v-for="level in levels" :key="level">{{level}}</b-form-select-option>
            </b-form-select>
        </div>
        <div class="col-6 border-left">
            <h5>MAX. LEVEL</h5>
            <b-form-select v-model="category.maxLevel">
                <b-form-select-option :value="level" v-for="level in levels" :key="level.id">{{level}}</b-form-select-option>
            </b-form-select>
        </div>
      </div>
      <div class="col-12 justify-content-center">
        <v-btn fab small :color="btnColor" dark style="color: #162059" title="Edit Category Details" class="mr-3 btn-fix" @click.prevent="editMode = false">
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn fab small :color="btnColor" style="color: #162059" title="Remove Categoty" dark class="ml-5 btn-fix" @click.prevent="updateCategory()">
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
        }
    },
    methods: {
        updateCategory() {
            let { name, minLevel, maxLevel,id } = this.category;
            this.$http.put(`${process.env.VUE_APP_URL}/admin/categories/${id}`, {
                name,minLevel,maxLevel
            })
            .then(res => {
                this.editMode = false
                this.$emit('updateCategory',this.index,res.data.category)
            })
            .catch(err => {
                console.log(err.response.data.error)
            })
            
        }
    }

}
</script>

<style>

</style>