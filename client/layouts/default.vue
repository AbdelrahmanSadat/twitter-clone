<template>
  <div>
    <nav class="navbar navbar-expand navbar-light bg-light">
      <nuxt-link to="/" class="navbar-brand">Navbar</nuxt-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <nuxt-link to="/" class="nav-link">Home</nuxt-link>
          </li>
          <li v-show="!loggedIn" class="nav-item">
            <nuxt-link to="/register" class="nav-link">Register</nuxt-link>
          </li>
          <li v-show="!loggedIn" class="nav-item">
            <nuxt-link to="/verification" class="nav-link">verification</nuxt-link>
          </li>
          <li v-show="!loggedIn" class="nav-item">
            <nuxt-link to="/login" class="nav-link">Login</nuxt-link>
          </li>
          <li v-show="loggedIn" class="nav-item">
            <nuxt-link to="/logout" class="nav-link">Logout</nuxt-link>
          </li>
          <li v-show="loggedIn" class="nav-item">
            <nuxt-link to="/Profile" class="nav-link">Profile</nuxt-link>
          </li>
          <li v-show="loggedIn" class="nav-item">
            <nuxt-link to="/timeline" class="nav-link">Timeline</nuxt-link>
          </li>
          <li v-show="loggedIn" class="nav-item">
            <nuxt-link to="/tweet" class="nav-link">Tweet</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link to="/users" class="nav-link">Users</nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
    <nuxt/>
  </div>
</template>


<script>
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css"
export default {
  computed: {
    loggedIn: function () {
      if(this.$store.state.token && this.$store.state.token.length>0)
        return true
      else
        return false
    }
  }
}
</script>


<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>

