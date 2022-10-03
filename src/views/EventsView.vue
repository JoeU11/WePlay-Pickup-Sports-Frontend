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
    this.getEvents();
  },
  methods: {
    getEvents: function () {
      axios.get('http://localhost:3000/events.json').then(response => {
        this.events = response.data
        // console.log(response.data)
      })
    },
    signUp: function (event, index) {
      this.newParticipant.event_id = event.id
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        // console.log(this.newParticipant)
        this.events[index].attending = true
        this.events[index].event_participant = {}
        this.events[index].event_participant.id = response.data.id
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    },
    deleteParticipant: function (event, index) {
      axios.delete(`/event_participants/${event.event_participant.id}`).then(response => {
        this.events[index].attending = false
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    },
    humanReadableTime: function (parsedTime) {
      var hour = parsedTime[4].slice(0, -3).split(':')[0]
      var time = ""
      if (hour > 12) {
        time = `${hour - 12}:${parsedTime[4].slice(0, -3).split(':')[1]} PM`
      }
      else if (hour == 12) {
        time = `${hour}:${parsedTime[4].slice(0, -3)} PM`
      }
      else {
        if (hour[0] === '0') { hour = hour.slice(1) }
        time = `${hour}:${parsedTime[4].slice(0, -3).split(':')[1]} AM`
      }
      return `${parsedTime[0]}, ${parsedTime[1]} ${parsedTime[2]} ${time} ${parsedTime[6]} ${parsedTime[7]} ${parsedTime[8]}`
    }
  },
};
</script>
  
<template>

  <div class="home">
    <h1 id="customH1">{{ message }}</h1>
    <div v-for="(event, index) in events">
      <a v-bind:href="`/events/${event.id}`">
        <div>
          {{ humanReadableTime(new Date(event.time).toString().split(' ')) }} <br />
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