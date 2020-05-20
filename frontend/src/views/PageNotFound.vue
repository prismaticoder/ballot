<template>
  <div class="container mt-5">

      <div class="container justify-content-center mt-5">
          <h1 class="text-center mt-5">
              404 | Page Not Found
          </h1>

          <p class="text-center mt-3">
              We've searched and searched and we've unfortunately come up with no response to your request for this page :(
                  <br>
                Try visiting our <router-link to="/" tag="a">home page</router-link> to see some of the resources available for you. 

          </p>
      </div>
      
  </div>
</template>

<script>
export default {
    name: "PageNotFound"
}
</script>

<style>

</style>