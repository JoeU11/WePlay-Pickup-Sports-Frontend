<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newSessionParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/sessions", this.newSessionParams)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          this.$router.push("/");
        })
        .catch((error) => {
          // console.log(error.response);
          this.errors = ["Invalid email or password."];
          this.email = "";
          this.password = "";
        });
    },
  },
};
</script>

<template>
  <div class="login">
    <form v-on:submit.prevent="submit()">
      <h1 id="customH1">Sign in</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div class="container text-center">
        <div class="row">
          <div class="col align-right">
            <label>Email:</label>
          </div>
          <div class="col align-left">
            <input type="email" v-model="newSessionParams.email" />
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col align-right">
            <label>Password:</label>
          </div>
          <div class="col align-left">
            <input type="password" v-model="newSessionParams.password" />
          </div>
        </div>
      </div>
      <br />
      <input class="btn btn-info recolor bold" type="submit" value="Submit" />
    </form>
  </div>
</template>