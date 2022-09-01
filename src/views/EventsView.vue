<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      message: "WePlay Pickup Sports",
      events: [],
      newParticipant: {},
      errors: []
    };
  },
  created: function () {
    this.getEvents()
  },
  methods: {
    getEvents: function () {
      console.log("getting events")
      axios.get('http://localhost:3000/events.json').then(response => {
        this.events = response.data
        console.log(response.data)
      })
    },
    signUp: function (eventID) {
      console.log("signing up to event " + eventID)
      this.newParticipant.event_id = eventID
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        console.log(this.newParticipant)
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    }
  },
};
</script>
  
  <template>
  <div class="home">
    <h1 id="customH1">{{ message }}</h1>
    <div v-for="event in events">
      Date: {{ event.time }} <br />
      Sport: {{ event.sport.name }} <br />
      Location: {{ event.location.name }} - {{ event.location.address }} <br /> <br />
      <button class="btn btn-info recolor bold" v-on:click="signUp(event.id)">Sign up</button>
      <hr />
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
  .bold {
    font-weight: bold;
  }
  </style>