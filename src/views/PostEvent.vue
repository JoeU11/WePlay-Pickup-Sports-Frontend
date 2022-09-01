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
      newEvent: { time: "", sport_id: 0, location_id: 0 },
      sport: "",
      locations: [],
      place: ""
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
            <h2>Select a sport</h2>
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
            <h2>Pick a time</h2>
            <Datepicker class="btn btn-secondary" v-model="newEvent.time" />
          </div>
          <div id="eventcreate">
            <h2>Add a location</h2>
            <div class="row" v-for="location in locations">
              <div class="col align-right">
                <button class="btn btn-info recolor bold"
                  v-on:click="place = location.name; newEvent.location_id = location.id">select</button>
              </div>
              <div class="col align-left increase-size">
                {{ location.name }}
              </div>
              <br /><br />
            </div>
          </div>
        </div>
        <div class="col">
          <div class="increase-size">
            <h2>Event preview:</h2>
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




  <dialog id="error">
    <form method="dialog">
      Error:
      <p v-for="error in errors"> {{ error }} </p>
      <button>OK</button>
    </form>
  </dialog>
</template>


<style>
#eventcreate {
  margin-bottom: 50px
}
</style>