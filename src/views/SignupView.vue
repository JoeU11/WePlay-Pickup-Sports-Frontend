<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newUserParams: { preferredTimes: [] },
      errors: [],
      test: "",
      preferredDay: null,
      morning: false,
      afternoon: false,
      evening: false,
      allTimes: ["morning", "afternoon", "evening"]
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
    addTime: function () {
      if (this.preferredDay) {
        if (this.morning || this.afternoon || this.evening) {
          for (let i = 0; i < [this.morning, this.afternoon, this.evening].length; i++) {
            if ([this.morning, this.afternoon, this.evening][i]) {
              if (!this.newUserParams.preferredTimes.some(entry => entry.day === this.preferredDay && entry.time_slot === this.allTimes[i])) {
                this.newUserParams.preferredTimes.push({ day: this.preferredDay, time_slot: this.allTimes[i] })
                console.log(this.newUserParams.preferredTimes)
              }
            }
          }
        }
      }
    }
  },
};
</script>

<template>
  <div class="signup">
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
      <br />
      <div class="row">
        <div class="col align-right">
          <label>Email:</label>
        </div>
        <div class="col align-left">
          <input type="email" v-model="newUserParams.email" />
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col align-right">
          <label>Password:</label>
        </div>
        <div class="col align-left">
          <input type="password" v-model="newUserParams.password" />
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col align-right">
          <label>Password confirmation:</label>
        </div>
        <div class="col align-left">
          <input type="password" v-model="newUserParams.password_confirmation" />
        </div>
      </div>
      <br />
      <hr />
      <p class="bold">The information below isn't required but we really appreciate it!</p>
      <small>We use address and preferred playing time info to provide an estimate of the number of players that will
        sign up for an event. Check it out on the datails page!</small> <br /><br />
      <div class="row">
        <div class="col align-right">
          <label>Address:</label>
        </div>
        <div class="col align-left">
          <input type="text" v-model="newUserParams.location" />
        </div>
        <br /> <br /><br />
        <div class="row">
          <p>Preferred playing times. Check as many as apply:</p>
          <!-- Availability testing -->
          <br /><br />
          <div class="col align-left">
            <label for="days">Choose a day:</label><br />
            <select name="days" id="days" v-model="preferredDay">
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <br><br>
            <label>Select times:</label><br />
            <input type="checkbox" id="time" name="morning" value="morning" v-model="morning">
            <label for="time"> | Morning (7am to noon) </label> <br />
            <input type="checkbox" id="time" name="afternoon" value="afternoon" v-model="afternoon">
            <label for="time"> | Afternoon (noon to 5pm) </label><br />
            <input type="checkbox" id="time" name="evening" value="evening" v-model="evening">
            <label for="time"> | Evening (5pm to 9pm) </label>
            <br /><br />
            <button class="btn btn-info recolor bold" v-on:click="addTime">Add Time(s)</button>
          </div>
          <div class="col-7">
            <!-- put selected times preview and removal option here -->
            <h3>Selected Times:</h3>
            <p v-for="(time, index) in newUserParams.preferredTimes">
              {{time.day}} - {{time.time_slot}} <button class="btn btn-secondary bold"
                v-on:click="newUserParams.preferredTimes.splice(index, 1)">remove</button>
            </p>
          </div>
          <!-- end testing -->
        </div>

      </div>
    </div>
    <br />
    <button class="btn btn-info recolor bold" v-on:click="submit()">Create User</button>
  </div>
</template>

<style>
.bold {
  font-weight: bold;
}
</style>