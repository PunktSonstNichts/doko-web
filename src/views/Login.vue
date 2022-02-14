<template>
  <div id="login-wrapper">
    <TextInput type="text" placeholder="Name" v-model="login.username"/>
    <TextInput type="password" placeholder="Passwort" v-model="login.password"/>
    <button id="login-btn" @click="handleLoginClick">anmelden</button>
  </div>
</template>

<script>
import axios from "axios";
import TextInput from "@/modules/TextInput";

export default {
  name: "Login.vue",
  components: {TextInput},
  data(){
    return {
      loading: false,
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
      axios.post(`${this.$hostname}/login`, this.login).then(response => {
        this.loading = false;
        console.log(response);
        window.localStorage.setItem("access_token", response.data.access_token);
        console.log(response.data.access_token);
      }).catch(error => console.error(error));
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#login-wrapper{
  display: flex;
  flex-direction: column;
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