<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newUserParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/users", this.newUserParams)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>

<template>
  <div class="signup">
    <form v-on:submit.prevent="submit()">
      <h1 id="customH1">Register</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>


      <div class="container text-center">
        <div class="row">
          <div class="col align-right">
            <label>Name:</label>
          </div>
          <div class="col align-left">
            <input type="text" v-model="newUserParams.name" />
          </div>
        </div>
        <div class="row">
          <div class="col align-right">
            <label>Email:</label>
          </div>
          <div class="col align-left">
            <input type="email" v-model="newUserParams.email" />
          </div>
        </div>
        <div class="row">
          <div class="col align-right">
            <label>Password:</label>
          </div>
          <div class="col align-left">
            <input type="password" v-model="newUserParams.password" />
          </div>
        </div>
        <div class="row">
          <div class="col align-right">
            <label>Password confirmation:</label>
          </div>
          <div class="col align-left">
            <input type="password" v-model="newUserParams.password_confirmation" />
          </div>
        </div>
      </div>
      <br />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>