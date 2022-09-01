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
    <h1>New Event</h1>
    <div>
      <h2>Select a sport</h2>
      <button v-on:click="sport = `soccer`; newEvent.sport_id = 1">soccer</button> |
      <button v-on:click="sport = `tennis`; newEvent.sport_id = 2">tennis</button> |
      <button v-on:click="sport = `basketball`; newEvent.sport_id = 3">basketball</button>
    </div>
    <div>
      <h2>Pick a time</h2>
      <Datepicker v-model="newEvent.time" />
    </div>
    <div>
      <h2>Add a location</h2>
      <div v-for="location in locations">
        <button v-on:click="place = location.name; newEvent.location_id = location.id">select</button> {{ location.name
        }}
      </div>
    </div>
    <div>
      <br />
      <hr />
      <h3>Event preview:</h3>
      <p>
        Sport: {{ sport }} <br />
        Time: {{ newEvent.time }} <br />
        Location: {{ place }}
      </p>
    </div>
    <button v-on:click="postEvent">Add Event</button>
  </div>

  <dialog id="error">
    <form method="dialog">
      Error:
      <p v-for="error in errors"> {{ error }} </p>
      <button>OK</button>
    </form>
  </dialog>
</template>