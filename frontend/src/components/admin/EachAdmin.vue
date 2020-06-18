<template>
  <div class="border mt-5 p-2">
      <div class="col-12 p-3">
          <h5>USERNAME</h5>
          <span>{{admin.username}}</span>
      </div>
      <div class="col-12 mt-3 border-top p-3 justify-content-center">
            <v-btn fab small :color="btnColor" style="color: #162059" title="Remove Admin" dark class="btn-fix" @click.prevent="dialog = true">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
      </div>
      <!-- Confirmation Dialog -->
        <v-dialog v-model="dialog" persistent max-width="350">
            <v-card>
                <v-card-title class="headline">Delete Admin?</v-card-title>
                <v-card-text>
                Are you sure you want to delete this admin user: <strong>{{admin.username}}</strong>?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                    <v-btn color="green darken-1" text @click="$emit('deleteAdmin', admin.id)">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
  </div>
</template>

<script>
export default {
    name: "EachAdmin",
    props: ["admin","index"],
    data() {
        return {
            btnColor: "#fff",
            dialog: false,
        }
    },    
    
}
</script>

<style>

</style>