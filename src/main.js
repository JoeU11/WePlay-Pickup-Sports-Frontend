import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"


import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App);
app.component('Datepicker', Datepicker);

axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/"
var jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}
createApp(App).use(router).mount('#app')
