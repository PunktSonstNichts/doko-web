<template>
  <Loading v-if="loading"></Loading>
  <div v-else id="create-user-wrapper">
    <div id="welcome">
      <h1>Herzlich Willkommen{{ username ? ', ' + username : "" }}</h1>
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
    <div id="choose-email">
      <h3>E-Mail</h3>
      <p>Willst du deine E-Mail Adresse angeben, falls du mal dein Passwort vergisst?</p>
      <TextInput autocomplete="false" type="email" placeholder="E-Mail" v-model="email" v-on:keyup.enter="handleLoginClick"/>
    </div>
    <div id="create-user">
      <button class="btn" @click="createAccount">Account anlegen</button>
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
      username: null,
      user_id: null,
      email: null,
      password: null,
    }
  },
  created() {
    this.loading = true;
    axios.get(`${this.$hostname}/get_token_info/${this.token}`).then(result => {
      this.loading = false;
      console.log(result);
      this.user_id = result.data.user_id;
      this.username = result.data.username;
      this.email = result.data.email;
    });
  },
  methods: {
    handleLoginClick(){
      this.createAccount()
    },
    createAccount(){
      this.loading = true;
      axios.post(`${this.$hostname}/create_user/${this.token}`,{
        user_id: this.user_id,
        password: this.password,
        email: this.email
      }).then(response => {
        this.loading = false;
        if(response.data.access_token){
          window.localStorage.setItem("access_token", response.data.access_token);
          this.$router.push("/")
        }
      }).catch(result => {
        this.loading = false;
        console.error(result);
      });
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
#welcome, #choose-password, #choose-email{
  flex: 1;
  margin: 16px;
  text-align: center;
}
#welcome{
  padding-top: 42px;
}
#choose-email{
  margin-bottom: 42px;
}
#create-user{
  display: grid;
}
#create-user > button{
  font-size: 1.4em;
}
</style>