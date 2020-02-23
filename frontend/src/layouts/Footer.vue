<template>
  <footer class="footer text-center">
    <div class="container p-3">
      <span class="text-muted">&copy; {{date}} <a class="specColor" href="http://www.mis.ui.edu.ng">Information Technology and Media Services</a> (ITeMS), University of Ibadan </span>
    </div>
  </footer>
</template>

<script>
export default {
    name: "Footer",
    data () {
        return {
            date: new Date().getFullYear()
        }
    }
}
</script>

<style>

</style>