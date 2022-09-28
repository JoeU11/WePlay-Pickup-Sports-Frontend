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
      access_token: {},
      calendarEvent: {},
      onCalendar: false
      // testEvent: {
      //   'summary': 'Testing Post event to Google Calendar API',
      //   'location': '800 Howard St., San Francisco, CA 94103',
      //   'description': 'A test of the google calendar api post route',
      //   'start': {
      //     'dateTime': '2022-09-28T09:00:00-07:00',
      //     'timeZone': 'America/Los_Angeles'
      //   },
      //   'end': {
      //     'dateTime': '2022-09-28T17:00:00-07:00',
      //     'timeZone': 'America/Los_Angeles'
      //   },
      //   'recurrence': [
      //     'RRULE:FREQ=DAILY;COUNT=2'
      //   ],
      //   'attendees': [
      //     { 'email': 'lpage@example.com' },
      //     { 'email': 'sbrin@example.com' }
      //   ],
      //   'reminders': {
      //     'useDefault': false,
      //     'overrides': [
      //       { 'method': 'email', 'minutes': 24 * 60 },
      //       { 'method': 'popup', 'minutes': 10 }
      //     ]
      //   }
      // }
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
          this.addEventToCalendar()
          this.onCalendar = true
        },
      });
    },
    getToken: function () {
      this.client.requestAccessToken()
    },
    getCalendar: function () {
      console.log("getting calendar")
      axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events/', { headers: { 'Authorization': `Bearer ${this.access_token}` } }).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error.response.data.error)
      })
    },
    addEventToCalendar: function () {
      axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events/', this.calendarEvent, {
        headers: { 'Authorization': `Bearer ${this.access_token}` }
      }).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error.response.data.error)
      })
    },
    revokeToken: function () {
      google.accounts.oauth2.revoke(this.access_token, () => { console.log('access token revoked') });
    },
    getEvent: function () {
      console.log("getting events")
      axios.get(`http://localhost:3000/events/${this.$route.params.id}.json`).then(response => {
        this.event = response.data
        console.log(response.data)
        this.calendarEvent = { 'summary': `WePlay Pickup ${this.event.sport.name}`, 'location': this.event.location.address, 'description': 'Pickup sports activity scheduled through the WePlay App', 'start': { 'dateTime': this.event.start }, 'end': { 'dateTime': this.event.end } }
      })
    },
    signUp: function (eventID) {
      console.log("signing up to event " + eventID)
      this.newParticipant.event_id = eventID
      axios.post(`http://localhost:3000/event_participants.json`, this.newParticipant).then(response => {
        console.log(this.newParticipant)
        this.event.attending = true
        this.event.event_participant = {}
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
      <button v-if="!onCalendar" class="btn btn-info recolor bold" v-on:click='getToken'>Add event to google
        calendar</button> <small v-else>Event added to calendar!</small>
      <br />
      <small>can't make it? -> <button class="btn btn-secondary transparent" v-on:click="deleteParticipant">unsign
          up</button></small>
      <br /><br />
      <!-- <button v-on:click="revokeToken">revoke token</button> -->
    </div> <br />
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