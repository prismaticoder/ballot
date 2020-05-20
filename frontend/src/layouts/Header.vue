<template>

    <nav class="myNav navbar navbar-expand-lg sticky-top navbar-light p-3 mb-2">
        <a class="navbar-brand" href="/">
            <span class="main-logo">
                <img src="../assets/ballot.svg" class="mt-n3" srcset="" width="35" height="35"> 
                <span> BALLOT</span>
            </span>
        </a>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse class="col-md-2 mx-auto justify-content-center" id="nav-collapse" is-nav>
            <ul v-if="!(path.includes('admin')) || path == '/admin/login'" class="navbar-nav">
                 <router-link to="/" exact tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">HOME</a>
                 </router-link>
                  <router-link to="/accreditation" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">ACCREDITATION</a>
                 </router-link>
                 <b-nav-item-dropdown text="CANDIDATES" v-bind:class="{'active':(routeName.includes('candidate'))}">
                    <b-dropdown-item href="/candidates" @click.prevent="goTo('all-candidates')">View all candidates</b-dropdown-item>
                    <b-dropdown-item href="/candidates/apply" @click.prevent="goTo('candidate-apply')">Apply for candidacy</b-dropdown-item>
                    <b-dropdown-item href="/candidates/application-status" @click.prevent="goTo('candidate-app-check')">Check application status</b-dropdown-item>
                 </b-nav-item-dropdown>
            </ul>
            <ul v-else class="navbar-nav">
                 <router-link to="/admin" exact tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">HOME</a>
                 </router-link>
                  <router-link to="/admin/voters" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">VOTERS</a>
                 </router-link>
                  <router-link to="/admin/candidates" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">CANDIDATES</a>
                 </router-link>
                  <router-link to="/admin/settings" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">SETTINGS</a>
                 </router-link>
            </ul>

            <!-- <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"> -->
            <!-- <button class="btn btn-outline-dark col-sm-2" type="submit">VOTE</button> -->
            <!-- </form> -->
        </b-collapse>


    </nav>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            path: location.pathname
        }
    },
    methods: {
        goTo(route) {
            this.$router.push({name: route})
        }
    },
    computed: {
        routeName() {
            return this.$route.name
        }
    }
}
</script>

<style>

</style>