import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.config.productionTip = false

// http://192.168.0.158:5000/
console.log(process.env, process.env.VUE_APP_BACKEND_URL);
Vue.prototype.$hostname = process.env.VUE_APP_BACKEND_URL;


import NewGame from "@/views/NewGame"
import Game from "@/views/Game"
import Eingabe from "@/views/Eingabe";
import Login from "@/views/Login";
import User from "@/views/MainPage";
import axios from "axios";
import CreateUser from "@/views/CreateUser";
import Upload from "@/views/Upload";
import GameOverview from "@/views/GameOverview";
import PlayerOverview from "@/views/PlayerOverview";
import PlayerHistory from "@/views/PlayerHistory.vue";

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: User
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/me",
      name: "MainPage",
      component: User
    },
    {
      path: "/create_user/:token",
      name: "CreateUser",
      component: CreateUser
    },
    {
      path: "/game/",
      name: "game_without_id",
      component: NewGame
    },
    {
      path: "/stats",
      name: "stats",
      component: PlayerOverview
    },
    {
      path: "/history",
      name: "history",
      component: PlayerHistory
    },
    {
      path: "/game/:id",
      name: "game",
      component: Game
    },
    {
      path: "/game/:id/stats",
      name: "game_stats",
      component: GameOverview
    },
    {
      path: "/game/:id/entry",
      name: "Eingabe",
      component: Eingabe
    },
    {
      path: "/upload",
      name: "DasIstSuperDumm",
      component: Upload
    },
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
            if(!(router.currentRoute.name === "Login" || router.currentRoute.name === "CreateUser")){
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
