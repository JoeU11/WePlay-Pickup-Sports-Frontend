<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      message: "Your Upcoming Events",
      events: [],
      newParticipant: {},
      errors: []
    };
  },
  created: function () {
    this.getEvents();
  },
  methods: {
    getEvents: function () {
      console.log("getting events")
      axios.get('http://localhost:3000/events.json', { params: { myEvents: true } }).then(response => {
        this.events = response.data
        console.log(response.data)
      })
    },
    signUp: function (event, index) {
      console.log("signing up to event " + event.id)
      this.newParticipant.event_id = event.id
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        console.log(this.newParticipant)
        this.events[index].attending = true
        this.events[index].event_participant = {}
        this.events[index].event_participant.id = response.data.id
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    },
    deleteParticipant: function (event, index) {
      console.log("deleting participant")
      axios.delete(`/event_participants/${event.event_participant.id}`).then(response => {
        console.log("registration cancelled")
        this.events[index].attending = false
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
    <p v-if="!events[0]">You aren't signed up for any upcoming events</p>
    <div v-for="(event, index) in events">
      <a v-bind:href="`/events/${event.id}`">
        <div>Date: {{ event.time }} <br />
          Sport: {{ event.sport.name }} <br />
          Location: {{ event.location.name }} - {{ event.location.address }} <br /> <br />
        </div>
      </a>
      <div v-if="!event.attending">
        <button class="btn btn-info recolor bold" v-on:click="signUp(event, index)">Sign
          up</button>
      </div>
      <div v-else>
        <p class="bold">You're going!</p>
        <small>can't make it? -> <button class="btn btn-secondary transparent"
            v-on:click="deleteParticipant(event, index)">unsign
            up</button></small>
      </div>
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

a {
  color: white;
  text-decoration: none;
}

a:hover {
  color: white;
  font-weight: bold;
}

.transparent {
  background-color: transparent;
  border-color: transparent;
}
</style>