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
import Game from "@/views/Game"
import Eingabe from "@/views/Eingabe";
import Login from "@/views/Login";
import axios from "axios";

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: NewGame
    },
    {
      path: "/login",
      name: "Login",
      component: Login
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



axios.defaults.timeout = 10000;
axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.common["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
    error => {
      if (error.response.status) {
        switch (error.response.status) {
          case 400:

            //do something
            break;

          case 401:
          case 403:
            if(router.currentRoute.name !== "Login"){
              router.replace({
                path: "/login",
                query: { redirect: router.currentRoute.fullPath }
              });
            }
            break;
          case 404:
            alert('page not exist');
            break;
          case 502:
            setTimeout(() => {
              router.replace({
                path: "/login",
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }, 1000);
        }
        return Promise.reject(error.response);
      }
    }
);


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
