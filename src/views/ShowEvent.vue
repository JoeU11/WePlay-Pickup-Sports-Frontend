<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      message: "WePlay Pickup Sports",
      event: {},
      newParticipant: {},
      errors: [],
      participant: {}
    };
  },
  created: function () {
    this.getEvent();
  },
  methods: {
    getEvent: function () {
      console.log("getting events")
      axios.get(`http://localhost:3000/events/${this.$route.params.id}.json`).then(response => {
        this.event = response.data
        console.log(response.data)
      })
    },
    signUp: function (eventID) {
      console.log("signing up to event " + eventID)
      this.newParticipant.event_id = eventID
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        console.log(this.newParticipant)
        this.event.attending = true
        this.event.event_participant.id = response.data.id
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    },
    deleteParticipant: function () {
      console.log("deleting participant")
      axios.delete(`/event_participants/${this.event.event_participant.id}`).then(response => {
        console.log("registration cancelled")
        this.event.attending = false
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
    Date: {{ event.time }} <br />
    Sport: {{ event.sport.name }} <br />
    Location: {{ event.location.name }} - {{ event.location.address }} <br /> <br />
    <div v-if="!event.attending">
      <button class="btn btn-info recolor bold" v-on:click="signUp(event.id)">Sign
        up</button>
    </div>
    <div v-else>
      <p class="bold">You're going! <br /> </p>
      <small>can't make it? -> <button class="btn btn-secondary transparent" v-on:click="deleteParticipant">unsign
          up</button></small> <br /><br />
    </div>
    <a v-if="event.edit_permission" v-bind:href="`/events/${event.id}/edit`">Edit Event</a>
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
}

a:hover {
  color: white;
  font-weight: bold;
}

#cancel {
  width: 115px;
  height: 40px;
}

.transparent {
  background-color: transparent;
  border-color: transparent;
}
</style>