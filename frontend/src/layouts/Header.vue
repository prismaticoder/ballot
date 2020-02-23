<template>

  <nav class="navbar navbar-expand-lg sticky-top navbar-light p-3">
        <a class="navbar-brand" href="/">
            <span class="main-logo">
                <!-- <img class="rounded-circle inline" src="/images/archive.svg" alt="UI Logo" srcset="" width="30" height="30" style="border: solid #162059 1px; padding: 5px;">  -->
                BALLOT</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse col-md-2 mx-auto" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                 <router-link to="/" exact tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">HOME</a>
                 </router-link>
                  <router-link to="/about" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">ABOUT</a>
                 </router-link>
                  <router-link to="/regions" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">REGIONS</a>
                 </router-link>
                  <router-link to="/register" tag="li" class="nav-item" active-class="active">
                    <a class="nav-link">REGISTER</a>
                 </router-link>
            </ul>
            <!-- <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"> -->
            <!-- <button class="btn btn-outline-dark col-sm-2" type="submit">VOTE</button> -->
            <!-- </form> -->
        </div>
    </nav>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style>

@import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
@import "https://fonts.googleapis.com/css?family=Abel|Roboto|Ubuntu&display=swap";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

@import "../assets/sticky-footer.css";

nav {
            /* font-family: 'Roboto', sans-serif; */
            /* /* font-family: 'Lato', sans-serif; */
            font-family: 'Abel', sans-serif;
            background-color: #BF1111;
            color: #162059;
        }
        .main-logo {
            color: #162059;
            /* font-family: 'Ubuntu', sans-serif; */
            /* font-size: x-large; */
            /* letter-spacing: 0.2rem; */
            font-weight: bolder;
            font-size: xx-large;
        }
        .main-logo:hover {
            text-decoration: underline;
        }
        body {
            font-family: 'Ubuntu', sans-serif;
        }
        h1 {
            font-family: 'Abel', sans-serif;
            color: #162059;
            font-size: 2.6rem;
        }
        .myBtn {
            background-color: #162059;
        }
        a.myBtn {
            color: rgb(196, 175, 175);
        }
        footer {
            background-color:rgba(0,0,0,.03)
        }
        .specColor {
            color : #162059;
            text-decoration: underline;
        }
        .specColor:hover {
            color: #BF1111;
            text-decoration: underline;
        }
        li.nav-item {
            font-size: larger;
            padding: 4px;
            /* margin-left: 5px; */
        }
        li.nav-item>a:hover, li.active>a{
            border-bottom:solid #162059 2px;
        }


</style>