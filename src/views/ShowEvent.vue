<script>
import axios from 'axios'


export default {
  data: function () {
    return {
      message: "WePlay Pickup Sports",
      event: { time: "", sport: { name: "" }, location: { name: "", address: "" } },
      newParticipant: {},
      errors: [],
      participant: {},
      clientID: process.env.VUE_APP_GOOGLE_CLIENTID,
      apiKey: process.env.VUE_APP_GOOGLE_API,
      client: {},
      access_token: localStorage.googleOAuthToken,
      calendarEvent: {},
      OAuthToken: !!localStorage.googleOAuthToken,
      onCalendar: false,
      readableTime: ""
    };
  },
  created: function () {
    this.getEvent();
    this.initClient();
  },
  methods: {
    initClient: function () {
      this.client = google.accounts.oauth2.initTokenClient({
        client_id: this.clientID,
        api_key: this.apiKey,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: (tokenResponse) => {
          this.access_token = tokenResponse.access_token;
          // write acess token to local storage
          localStorage.setItem("googleOAuthToken", tokenResponse.access_token);
          this.addEventToCalendar()
          this.onCalendar = true
          this.OAuthToken = true
        },
      });
    },
    getToken: function () {
      if (!localStorage.googleOAuthToken) {
        this.client.requestAccessToken()
      }
      else {
        // this.access_token = localStorage.googleOAuthToken
        this.addEventToCalendar()
      }
    },
    getCalendar: function () {
      // console.log("getting calendar")
      axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events/', { headers: { 'Authorization': `Bearer ${this.access_token}` } }).then(response => {
        // console.log(response)
      }).catch(error => {
        // console.log(error.response.data.error)
      })
    },
    addEventToCalendar: function () {
      axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events/', this.calendarEvent, {
        headers: { 'Authorization': `Bearer ${this.access_token}` }
      }).then(response => {
        // console.log(response)
        document.querySelector('#added').showModal()
      }).catch(error => {
        // console.log(error.response.data.error)
      })
    },
    revokeToken: function () {
      google.accounts.oauth2.revoke(this.access_token, () => { console.log('access token revoked') });
      localStorage.removeItem("googleOAuthToken");
      this.OAuthToken = false
    },
    humanReadableTime: function (date) {
      var parsedTime = date.split(' ')
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
      this.readableTime = `${parsedTime[0]}, ${parsedTime[1]} ${parsedTime[2]} ${time} ${parsedTime[6]} ${parsedTime[7]} ${parsedTime[8]}`
    },
    getEvent: function () {
      axios.get(`http://localhost:3000/events/${this.$route.params.id}.json`).then(response => {
        this.event = response.data
        // console.log(response.data)        
        this.humanReadableTime(new Date(response.data.time).toString())
        this.calendarEvent = { 'summary': `WePlay Pickup ${this.event.sport.name}`, 'location': this.event.location.address, 'description': 'Pickup sports activity scheduled through the WePlay App', 'start': { 'dateTime': this.event.start }, 'end': { 'dateTime': this.event.end } }
      })
    },
    signUp: function (eventID) {
      this.newParticipant.event_id = eventID
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        // console.log(this.newParticipant)
        this.event.attending = true
        this.event.event_participant = {}
        this.event.event_participant.id = response.data.id
      }).catch(error => {
        this.errors = error.response.data
        document.querySelector("#error").showModal()
      })
    },
    deleteParticipant: function () {
      axios.delete(`/event_participants/${this.event.event_participant.id}`).then(response => {
        this.event.attending = false
      }).catch(error => {
        this.errors = error.response.data
        // document.querySelector("#error").showModal()
      })
    }
  },
};
</script>
    
<template>
  <div class="home">
    <h1 id="customH1">{{ message }}</h1>
    {{ readableTime }} <br />
    {{ event.sport.name }} <br />
    {{ event.location.name }} - {{ event.location.address }} <br /> <br />
    <div v-if="!event.attending">
      <button class="btn btn-info recolor bold" v-on:click="signUp(event.id)">Sign
        up</button>
    </div>
    <div v-else>
      <p class="bold">You're going! <br /> </p>
      <button v-if="!onCalendar" class="btn btn-info recolor bold" v-on:click='getToken'>Add event to google
        calendar</button> <small v-else>Event added to calendar!</small>
      <button class="btn btn-secondary bold" v-if="OAuthToken" v-on:click="revokeToken">revoke google
        token</button>
      <br />
      <small>can't make it? -> <button class="btn btn-secondary transparent" v-on:click="deleteParticipant">unsign
          up</button></small>
    </div> <br />
    <p v-if="event.estimated > event.total_going">{{event.estimated}} player(s) are expected to join!</p>
    <p v-else>{{event.total_going}} player(s) have signed up!</p>
    <a v-if="event.edit_permission" v-bind:href="`/events/${event.id}/edit`">Edit Event</a>
  </div>

  <dialog id="error">
    <form class="white" method="dialog">
      Error:
      <p v-for="error in errors"> {{ error }} </p>
      <button class="btn btn-warning bold">OK</button>
    </form>
  </dialog>

  <dialog id="added">
    <form class="white" method="dialog">
      <p> Event added! </p>
      <button class="btn btn-info recolor bold">OK</button>
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

#added {
  background-color: #241137;
  color: azure;
}
</style>