<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      message: "WePlay Pickup Sports",
      events: [],
      newParticipant: {},
      errors: [],
      eventParticipants: []
    };
  },
  created: function () {
    this.getEvents();
    this.getEventParticipants()
  },
  methods: {
    getEvents: function () {
      console.log("getting events")
      axios.get('http://localhost:3000/events.json').then(response => {
        this.events = response.data
        console.log(response.data)
      })
    },
    getEventParticipants: function () {
      console.log("getting event participants data")
      axios.get('/event_participants').then(response => {
        this.eventParticipants = response.data
        console.log(response.data)
      })
    },
    signUp: function (eventID, index) {
      console.log("signing up to event " + eventID)
      this.newParticipant.event_id = eventID
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        console.log(this.newParticipant)
        this.events[index].attending = true
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
    <div v-for="(event, index) in events">
      Date: {{ event.time }} <br />
      Sport: {{ event.sport.name }} <br />
      Location: {{ event.location.name }} - {{ event.location.address }} <br /> <br />
      <button v-if="!event.attending" class="btn btn-info recolor bold" v-on:click="signUp(event.id, index)">Sign
        up</button>
      <p class="bold" v-else>You're going!</p>
      <hr />
    </div>
  </div>

  <dialog id="error">
    <form class="white" method="dialog">
      Error:
      <p v-for="error in errors"> {{ error }} </p>
      <button class="btn btn-warning bold">OK</button>
    </form>
  </dialog>
</template>
  
  <style>
  .bold {
    font-weight: bold;
  }
  </style>