<template>

    <nav class="myNav navbar navbar-expand-lg sticky-top navbar-light p-3 mb-2">
        <a class="navbar-brand" href="/">
            <span class="main-logo">
                <img src="../assets/ballot.svg" class="mt-n3" srcset="" width="35" height="35"> 
                <span> BALLOT</span>
            </span>
        </a>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse class="col-md-7 mx-auto justify-content-center" id="nav-collapse" is-nav>
            <ul v-if="!isLoggedIn" class="navbar-nav">
                 <router-link to="/" exact tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">HOME</a>
                 </router-link>
                  <router-link v-if="state == 'prevoting'" to="/accreditation" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">ACCREDITATION</a>
                 </router-link>
                 <router-link v-else-if="state == 'voting'" to="/vote" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">VOTE</a>
                 </router-link>
                 <router-link v-else to="/results" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">RESULTS</a>
                 </router-link>
                 <router-link v-if="state == 'voting'" to="/stats" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">STATS</a>
                 </router-link>
                 <b-nav-item-dropdown text="CANDIDATES" v-bind:class="{'active':(routeName.includes('candidate'))}">
                    <b-dropdown-item href="/candidates" @click.prevent="goTo('all-candidates')">View all candidates</b-dropdown-item>
                    <b-dropdown-item href="/candidates/apply" @click.prevent="goTo('candidate-apply')">Apply for candidacy</b-dropdown-item>
                    <b-dropdown-item href="/candidates/application-status" @click.prevent="goTo('candidate-app-check')">Check application status</b-dropdown-item>
                 </b-nav-item-dropdown>
            </ul>
            <ul v-else class="navbar-nav">
                 <router-link to="/command" exact tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">HOME</a>
                 </router-link>
                 <router-link to="/command/settings" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">SETTINGS</a>
                 </router-link>
                  <router-link to="/command/voters" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">VOTER LIST</a>
                 </router-link>
                  <router-link to="/command/candidates" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">CANDIDATES</a>
                 </router-link>
                 <router-link v-if="state == 'postvoting'" to="/command/results" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">RESULTS</a>
                 </router-link>
                 <router-link v-else-if="state == 'prevoting'" to="/command/accreditation" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">ACCREDITATION</a>
                 </router-link>
                 <li class="nav-item" style="cursor: pointer">
                    <a class="nav-link" @click.prevent="logout()">LOGOUT (<strong>{{username}}</strong>)</a>
                 </li>
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
        },
        logout() {
            this.$store.dispatch('logout')
            .then(() => {
                window.location.href = "/command/login"
            })
            .catch(() => {
                console.log("Logout error")
            })
        }
    },
    computed: {
        routeName() {
            return this.$route.name
        },
        isLoggedIn() {
            return this.$store.getters.isLoggedIn
        },
        username() {
            return this.$store.state.user
        },
        state() {
            return this.$store.getters.state
        }
    }
}
</script>

<style>

</style>