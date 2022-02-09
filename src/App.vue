<template>
  <div id="app">
    <div id="header">
      Online DoppelKopf Tracker
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
@import "@/css/colors.scss";

body, html{
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
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
  font-weight: bold;
  font-size: 1.2em;
}

button {
  border: 0;
  background: white;
  padding: 6px 8px;
}
label {
  text-align: center;
  padding: 6px 8px;
}
label > input[type=radio]{
/*  display: none; */
}
</style>
