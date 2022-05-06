<template>
  <Loading v-if="loading"></Loading>
  <div v-else id="create-user-wrapper">
    <div id="welcome">
      <h3>Herzlich Willkommen, {{ username }}</h3>
      <p>
        Bist du bereit, loszulegen?
        Erstelle nurnoch schnell deinen Account,<br>
        schon kannst du deine Doppelkopf-Runden digital speichern und
        auswerten lassen!
      </p>
    </div>
    <div id="choose-password">
      <h3>Passwort wählen</h3>
      <TextInput autocomplete="false" type="password" placeholder="Passwort" v-model="password" v-on:keyup.enter="handleLoginClick"/>
    </div>
    <div id="create-user">
      <button>Account anlegen</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "@/modules/Loading";
import TextInput from "@/modules/TextInput";

export default {
  name: "CreateUser",
  components: {Loading, TextInput},
  computed: {
    token () {
      return this.$route.params.token
    }
  },
  data(){
    return {
      loading: false,
      username: "Till", // just for testing
      email: null,
      password: null,
    }
  },
  created() {
    this.loading = true;
    axios.post(`${this.$hostname}/create_user/${this.token}`).then(result => {
      this.loading = false;
      console.log(result);
    });
  },
  methods: {
    createAccount(){

    }
  }
}
</script>

<style scoped>
#create-user-wrapper{
  display: flex;
  flex-direction: column;
  height: 100%;
}
#welcome, #choose-password{
  flex: 1;
  margin: 16px;
  text-align: center;
}
#welcome{
  padding-top: 42px;
}
</style>