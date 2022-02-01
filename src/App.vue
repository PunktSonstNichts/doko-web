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

<style>
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
  color: #2c3e50;
}
#header{
  background: #42b983;
  padding: 14px;
  text-align: center;
  color: white;
  text-shadow: 1px 1px 2px #2c3e50;
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
