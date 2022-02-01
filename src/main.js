import Vue from 'vue'
import App from './App.vue'


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.config.productionTip = false

// http://192.168.0.158:5000/
Vue.prototype.$hostname = 'http://localhost:5000'


import NewGame from "@/views/NewGame"
import Game from "@/modules/Game"
import Eingabe from "@/views/Eingabe";

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: NewGame
    },
    {
      path: "/game/",
      name: "game_without_id",
      component: NewGame
    },
    {
      path: "/game/:id",
      name: "game",
      component: Game
    },

    {
      path: "/game/:id/entry",
      name: "Eingabe",
      component: Eingabe
    }
  ]
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
