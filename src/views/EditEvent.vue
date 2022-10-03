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
      sport: "",
      newLocation: { name: "", address: "" }
    };
  },
  created: function () {
    this.getLocations(),
      this.getEvent()
  },
  methods: {
    updateEvent: function () {
      axios
        .patch(`/events/${this.$route.params.id}`, this.event)
        .then((response) => {
          // console.log(response.data);
          this.$router.push(`/events/${this.event.id}`);
        })
        .catch((error) => {
          this.errors = error.response.data.errors
          document.querySelector("#error").showModal()
        });
    },
    getLocations: function () {
      axios.get("/locations").then(response => {
        this.locations = response.data
      })
    },
    getEvent: function () {
      axios.get(`http://localhost:3000/events/${this.$route.params.id}.json`).then(response => {
        this.event = response.data
        this.sport = response.data.sport.name
        this.place = response.data.location.name
        // console.log(response.data)
      })
    },
    showDelete: function () {
      document.querySelector("#remove").showModal()
    },
    deleteEvent: function () {
      axios.delete(`/events/${this.event.id}`).then(response => {
        // console.log(response.data)
        this.$router.push("/pickup-events")
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    },
    showNewPlace: function () {
      document.querySelector("#newPlace").showModal()
    },
    postLocation: function () {
      axios.post("locations", this.newLocation).then(response => {
        this.newEvent.location_id = response.data.id
        this.place = response.data.name
        this.locations.push(response.data)
      })
    },
    showAllLocations: function () {
      document.querySelector("#allLocations").showModal()
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
            <template v-for="(location, index) in locations">
              <div class="row" v-if="index < 4">
                <div class="col-5 align-right">
                  <button class="btn btn-info recolor bold"
                    v-on:click="place = location.name; event.location_id = location.id">select</button>
                </div>
                <div class="col align-left increase-size">
                  {{ location.name }} - {{location.address}}
                </div>
                <br /><br />
              </div>
            </template>
            <button class="btn btn-info recolor bold" v-on:click="showNewPlace">Add a location</button> |
            <button class="btn btn-info recolor bold" v-on:click="showAllLocations">Show all Locations</button>
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

  <dialog id="allLocations">
    <form method="dialog">
      <div id="eventcreate">
        <h2>All Locations</h2> <br />
        <div class="list">
          <br />
          <div class="row" v-for="location in locations">
            <div class="col-4">
              <button class="btn btn-info recolor bold"
                v-on:click="place = location.name; newEvent.location_id = location.id">select</button>
            </div>
            <div class="col-6 align-left increase-size">
              {{ location.name }} - {{location.address}}
            </div>
            <br /><br />
          </div>
        </div>
        <br />
        <button class="btn btn-info recolor bold" v-on:click="showNewPlace">Add a location</button> |
        <button class="btn btn-info recolor bold">Back</button>
      </div>
    </form>
  </dialog>

  <dialog id="newPlace">
    <form method="dialog">
      Add a Location: <br /> <br />
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

#remove {
  background-color: #241137;
  color: azure;
}

.bold {
  font-weight: bold;
}

#newPlace {
  background-color: #241137;
  color: azure;
}

#allLocations {
  background-color: #241137;
  color: azure;
}

.list {
  max-height: 600px;
  overflow-y: auto;
}
</style>