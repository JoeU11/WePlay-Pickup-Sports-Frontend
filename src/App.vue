<script>
export default {
  data: function () {
    return {
      loggedIn: !!localStorage.jwt
    }
  },
  watch: {
    $route: function () {
      this.loggedIn = !!localStorage.jwt
    }
  }
}
</script>


<template>
  <nav>
    <router-link class="white" to="/pickup-events">Home</router-link> |
    <router-link class="white" to="/events/new">Create an event</router-link> |
    <router-link class="white" to="/about">About</router-link> |
    <router-link class="white" to="/signup" v-if="!loggedIn">Register </router-link>
    <small v-if="!loggedIn">| </small>
    <router-link class="white" to="/login" v-if="!loggedIn">Sign in </router-link>
    <small v-if="!loggedIn">| </small>
    <router-link class="white" to="/logout" v-if="loggedIn">Log out</router-link>
  </nav>
  <div class="container white increase-size" id="main">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#customH1 {
  margin-top: 15px;
  margin-bottom: 50px;
  font-weight: bold;
}

#app {
  font-family: Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace;
  background-image: url("./assets/soccer-field-final.jpeg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#main {
  padding-bottom: 1000px;
}

.white {
  color: azure;
}

.align-right {
  text-align: right;
}

.align-left {
  text-align: left;
}

.increase-size {
  font-size: 22px;
}

.recolor {
  background-color: #42b983 !important;
  border-color: black !important;
}

#error {
  background-color: #241137;
  color: azure;
}
</style>
