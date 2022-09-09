<script>
import axios from "axios";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: {
    Datepicker
  },
  data: function () {
    return {
      event: {},
      errors: [],
      sport: "",
      locations: [],
      place: "",
      sport: ""
    };
  },
  created: function () {
    this.getLocations(),
      this.getEvent()
  },
  methods: {
    updateEvent: function () {
      console.log("creating event")
      axios
        .patch(`/events/${this.$route.params.id}`, this.event)
        .then((response) => {
          console.log(response.data);
          this.$router.push(`/events/${this.event.id}`);
        })
        .catch((error) => {
          this.errors = error.response.data.errors
          document.querySelector("#error").showModal()
        });
    },
    getLocations: function () {
      console.log("getting locations")
      axios.get("/locations").then(response => {
        this.locations = response.data
      })
    },
    getEvent: function () {
      console.log("getting events")
      axios.get(`http://localhost:3000/events/${this.$route.params.id}.json`).then(response => {
        this.event = response.data
        this.sport = response.data.sport.name
        this.place = response.data.location.name
        console.log(response.data)
      })
    },
    showDelete: function () {
      document.querySelector("#remove").showModal()
    },
    deleteEvent: function () {
      console.log("deleting event")
      axios.delete(`/events/${this.event.id}`).then(response => {
        console.log(response.data)
        this.$router.push("/pickup-events")
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    }
  },
};
</script>
    
<template>
  <div class="newEvent">
    <h1 id="customH1">Edit Event</h1>

    <div class="container text-center">
      <div class="row">
        <div class="col-5">
          <div id="eventcreate">
            <h2>Select a Sport</h2>
            <h2>
              <button class="btn btn-info recolor bold"
                v-on:click="sport = `soccer`; event.sport_id = 1">Soccer</button>|<button
                class="btn btn-info recolor bold"
                v-on:click="sport = `tennis`; event.sport_id = 2">Tennis</button>|<button
                class="btn btn-info recolor bold"
                v-on:click="sport = `basketball`; event.sport_id = 3">Basketball</button>
            </h2>
          </div>
          <div id="eventcreate">
            <h2>Pick a Time</h2>
            <Datepicker class="btn btn-secondary" v-model="event.time" />
          </div>
          <div id="eventcreate">
            <h2>Add a Location</h2>
            <div class="row" v-for="location in locations">
              <div class="col-5 align-right">
                <button class="btn btn-info recolor bold"
                  v-on:click="place = location.name; event.location_id = location.id">select</button>
              </div>
              <div class="col align-left increase-size">
                {{ location.name }} - {{location.address}}
              </div>
              <br /><br />
            </div>
          </div>
        </div>
        <div class="col">
          <div class="increase-size">
            <h2>Event Preview</h2>
            <p>
              Sport: {{ sport }} <br />
              Time: {{ event.time }} <br />
              Location: {{ place }}
            </p>
          </div>
          <button class="btn btn-info recolor bold" v-on:click="updateEvent">Update Event</button>
          <br /><br />
          <button class="btn btn-warning bold" v-on:click="showDelete">Delete Event</button>
        </div>
      </div>
    </div>
  </div>

  <dialog id="remove">
    <form method="dialog">
      Are you sure? <br />
      <button class="btn btn-secondary bold">No</button> ||
      <button class="btn btn-warning bold" v-on:click="deleteEvent">Yes</button>
    </form>
  </dialog>


  <dialog id="error">
    <form method="dialog">
      Error:
      <p v-for="error in errors"> {{ error }} </p>
      <button class="btn btn-warning bold">OK</button>
    </form>
  </dialog>
</template>
  
  
<style>
#eventcreate {
  margin-bottom: 50px
}

#remove {
  background-color: #241137;
  color: azure;
}

.bold {
  font-weight: bold;
}
</style>