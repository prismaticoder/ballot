<template>
  <div class="container mt-4">
      <h4>ELECTION SETTINGS & CONFIGURATION</h4>
      <datetime v-model="date" type="datetime"></datetime>
  </div>
</template>

<script>

import { Datetime } from 'vue-datetime'

export default {
    name: "Settings",
    components: {
        datetime: Datetime,
        
    },
    data() {
        return {
            date: ""
        }
    }
}
</script>

<style scoped>

@import '../../../node_modules/vue-datetime/dist/vue-datetime.css';

</style>