import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignupView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "about" */ '../views/LogoutView.vue')
  },
  {
    path: '/pickup-events',
    name: 'events',
    component: () => import(/* webpackChunkName: "about" */ '../views/EventsView.vue')
  },
  {
    path: '/events/new',
    name: 'postevent',
    component: () => import(/* webpackChunkName: "about" */ '../views/PostEvent.vue')
  },
  {
    path: '/events/:id',
    name: 'showevent',
    component: () => import(/* webpackChunkName: "about" */ '../views/ShowEvent.vue')
  },
  {
    path: '/events/:id/edit',
    name: 'editevent',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditEvent.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
