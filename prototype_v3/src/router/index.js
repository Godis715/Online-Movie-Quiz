import Vue from 'vue'
import Router from 'vue-router'

import Welcome from '@/components/Welcome'
// import Profile from '@/components/Profile'
import Quiz from '@/components/Quiz'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },

    /* {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    }, */

    {
      path: '/Quiz',
      name: 'Quiz',
      component: Quiz
    },

    {
      path: '/About',
      name: 'About',
      component: About
    },
  ]
})
