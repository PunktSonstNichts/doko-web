<template>
  <div id="login-wrapper">
    <div id="welcome-text">
      <p>
        Herzlich willkommen in dem Bereich des Internets,
        in dem du ganz ungestört deine analogen Doppelkopfspiele
        digital aufschreiben & auswerten lassen kannst..<br>Viel Spaß!
      </p>
    </div>
    <TextInput autocomplete="false" type="text" placeholder="Name" v-model="login.username"/>
    <TextInput autocomplete="false" type="password" placeholder="Passwort" v-model="login.password" v-on:keyup.enter="handleLoginClick"/>
    <div id="entry-error" :class="errorMsg ? 'active' : ''">&nbsp;{{errorMsg}}&nbsp;</div>
    <button id="login-btn" @click="handleLoginClick">anmelden</button>
  </div>
</template>

<script>
import axios from "axios";
import TextInput from "@/modules/TextInput";

export default {
  // eslint-disable-next-line
  name: "Login",
  components: {TextInput},
  data(){
    return {
      loading: false,
      errorMsg: null,
      login: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    handleLoginClick(){
      this.processLogin()
    },
    processLogin(){
      this.loading = true;
      this.errorMsg = null;
      axios.post(`${this.$hostname}/login`, this.login).then(response => {
        this.loading = false;
        console.log(response);
        window.localStorage.setItem("access_token", response.data.access_token);
        console.log(response.data.access_token);
        if(this.$route.query.redirect){
          this.$router.push(this.$route.query.redirect)
        }else{
          this.$router.push('/')
        }
      }).catch(error => {
        console.error(error);
        this.errorMsg = error.data.msg;
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#login-wrapper{
  display: flex;
  flex-direction: column;
  padding: 8px;
  margin: auto !important;
  width: 96% !important;
  max-width: 420px;
}
#entry-error{
  margin: 5px;
  color: $dangerColorDark;
  text-align: center;
  border: 1px transparent;
}
#entry-error.active{
  border: 1px solid $dangerColor;
}
#login-btn{
  background: $secondColor;
  color: $secondColorText;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
  font-size: 1.2em;
}
</style>