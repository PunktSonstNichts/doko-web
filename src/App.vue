<template>
  <div id="app">
    <div id="header">
      <router-link to="/me" tag="span">Online DoppelKopf Tracker</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if(!localStorage.getItem("access_token") && this.$route.name !== "Login"){
      console.error(localStorage.getItem("access_token"));
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
  background: $background;
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

</style>
