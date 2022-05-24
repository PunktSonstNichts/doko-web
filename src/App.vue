<template>
  <div id="app">
    <div id="header">
      <router-link :is="notLoggedInYet ? 'span' : 'router-link'" to="/me" tag="span">Online DoppelKopf Tracker</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    notLoggedInYet(){
      return !!(this.$route.name === "Login" || this.$route.name === "CreateUser");
    }
  },
  created() {
    if(!localStorage.getItem("access_token") && !this.notLoggedInYet){
      console.error(localStorage.getItem("access_token"), this.$route.name);
      this.$router.replace({
        path: "/login",
        query: { redirect: this.$router.currentRoute.fullPath }
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/css/colors.scss";

* {
  box-sizing: border-box;
}
body, html{
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $secondColor;
  background: mix($background, $mainColor, 92%);
}
#header{
  background: $mainColor;
  padding: 14px;
  text-align: center;
  color: $mainColorText;
  text-shadow: 1px 1px 2px $secondColorDark;
  border-bottom: 1px solid $mainColorDark;
  font-weight: bold;
  font-size: 1.2em;
}

button {
  border: 0;
  background: white;
  padding: 6px 8px;
}
.btn {
  display: flex;
  justify-content: center;
  background: $secondColor;
  color: $secondColorText;
  margin: 5px;
  padding: 6px 8px;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
}

label {
  text-align: center;
  padding: 6px 8px;
}
label > input[type=radio]{
/*  display: none; */
}

/* https://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile */
#app > *:not(#header){
  width: 100%;
  background: $background;
  overflow-y: auto;
}
/* @media (min-width:320px)  { /* smartphones, iPhone, portrait 480x320 phones / }
@media (min-width:481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. / } */
@media (min-width:641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  #app > *:not(#header){
    margin: 0 42px;
    width: calc(100% - 84px);
    box-shadow: 0 4px 8px rgba($mainColorDark, .5);
  }
}
@media (min-width:961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */
  #app > *:not(#header){
    margin: 0 19vw;
    width: 62vw;
  }
}
/*
@media (min-width:1025px) { /* big landscape tablets, laptops, and desktops / }*/
@media (min-width:1281px) { /* hi-res laptops and desktops */
  #app > *:not(#header){
    margin: 0 auto;
    width: 960px;
  }
}
</style>
