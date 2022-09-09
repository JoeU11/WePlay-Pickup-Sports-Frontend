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
      newEvent: {},
      errors: [],
      newEvent: { sport_id: 0, location_id: 0 },
      sport: "",
      locations: [],
      place: "",
      newLocation: { name: "", address: "" }
    };
  },
  created: function () {
    this.getLocations()
  },
  methods: {
    postEvent: function () {
      console.log("creating event")
      axios
        .post("/events", this.newEvent)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/");
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
    showNewPlace: function () {
      document.querySelector("#newPlace").showModal()
    },
    postLocation: function () {
      console.log("adding place")
      axios.post("locations", this.newLocation).then(response => {
        this.newEvent.location_id = response.data.id
        this.place = response.data.name
        this.locations.push(response.data)
      })
    }
  },
};
</script>
  
<template>
  <div class="newEvent">
    <h1 id="customH1">New Event</h1>

    <div class="container text-center">
      <div class="row">
        <div class="col-5">
          <div id="eventcreate">
            <h2>Select a Sport</h2>
            <h2>
              <button class="btn btn-info recolor bold"
                v-on:click="sport = `soccer`; newEvent.sport_id = 1">Soccer</button>|<button
                class="btn btn-info recolor bold"
                v-on:click="sport = `tennis`; newEvent.sport_id = 2">Tennis</button>|<button
                class="btn btn-info recolor bold"
                v-on:click="sport = `basketball`; newEvent.sport_id = 3">Basketball</button>
            </h2>
          </div>
          <div id="eventcreate">
            <h2>Pick a Time</h2>
            <Datepicker class="btn btn-secondary" v-model="newEvent.time" />
          </div>
          <div id="eventcreate">
            <h2>Add a Location</h2>
            <div class="row" v-for="location in locations">
              <div class="col-5 align-right">
                <button class="btn btn-info recolor bold"
                  v-on:click="place = location.name; newEvent.location_id = location.id">select</button>
              </div>
              <div class="col align-left increase-size">
                {{ location.name }} - {{location.address}}
                <!-- add limit on number of locations shown & modal to show all. can add search here too -->
              </div>
              <br /><br />
            </div>
            <button class="btn btn-info recolor bold" v-on:click="showNewPlace">Add a location</button>
          </div>
        </div>
        <div class="col">
          <div class="increase-size">
            <h2>Event Preview</h2>
            <p>
              Sport: {{ sport }} <br />
              Time: {{ newEvent.time }} <br />
              Location: {{ place }}
            </p>
          </div>
          <button class="btn btn-info recolor bold" v-on:click="postEvent">Add Event</button>
        </div>
      </div>
    </div>
  </div>


  <dialog id="newPlace">
    <form method="dialog">
      Add location: <br /> <br />
      <div class="align-right">
        Name: <input type="text" v-model="newLocation.name"><br />
        Address: <input type="text" v-model="newLocation.address"><br /><br />
      </div>
      <button class="btn btn-info recolor bold" v-on:click="postLocation">Add</button> || <button
        class="btn btn-secondary bold">Cancel</button>
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

.bold {
  font-weight: bold;
}

#newPlace {
  background-color: #241137;
  color: azure;
}
</style>