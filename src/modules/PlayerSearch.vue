<template>
  <div id="input-wrapper" v-if="!selectedPlayer">
    <TextInput
        v-bind="$attrs" v-model="textInput" @change="checkForPlayers"/>
    <div id="floaty-piece" v-if="textInput">
      <div id="add-player-wrapper">
        <button id="add-player-btn" @click="createPlayer()">{{textInput}} hinzufügen</button>
      </div>
      <div id="result-box">
        <div v-for="player in result" :key="player.id" :class="['player-wrapper', selectedPlayer === player ? 'selected' : '']" @click="selectPlayer(player)">
          <span class="player-name">{{player.username}}</span>
        </div>
      </div>
    </div>
  </div>
  <div id="player-wrapper" v-else>
    <span id="player-name">{{ selectedPlayer.username }}</span>
    <span id="deselect-player" @click="selectPlayer(null)">X</span>
  </div>
</template>

<script>
import axios from "axios";
import TextInput from "@/modules/TextInput";

export default {
  name: "PlayerSearch.vue",
  components: {TextInput},
  data(){
    return {
      textInput: null,
      loading: false,
      errorMsg: null,
      result: [],
      selectedPlayer: null
    }
  },
  watch: {
    textInput: {
      deep: true,
      handler: "checkForPlayers"
    }
  },
  methods: {
    checkForPlayers(){
      axios.get(`${this.$hostname}/namelist/${this.textInput}`).then(response => {
        this.loading = false;
        this.result = response.data.player;
        console.log(response);
      }).catch(error => {
        console.error(error);
        this.errorMsg = error.data.msg;
      });
    },
    selectPlayer(player){
      this.$emit("input", player);
      this.selectedPlayer = player;
    },
    createPlayer(){
      axios.post(`${this.$hostname}/new_player`, {username: this.textInput}).then(response => {
        console.log(response);
        this.$emit("input", response.data);
        this.selectedPlayer = response.data;
      });

    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#input-wrapper{
  position: relative;
}

#floaty-piece {
  position: absolute;
  box-sizing: border-box;
  width: calc(100% - 16px);
  margin: 0 8px;
  padding: 5px;
  z-index: 2;
  background: white;
  border: 1px solid $secondColorDark;
}

#player-wrapper, .player-wrapper{
  margin: 8px;
  padding: 5px;
  border-radius: 4px 3px;
  border: 1px solid $mainColor;
  box-shadow: 0 0 12px -8px $mainColorDark;
  text-align: center;
  font-size: 1.2em;
  color: $secondColor;
}
.player-wrapper.selected, .player-wrapper:hover, #player-wrapper{
  background: $mainColor;
  color: $mainColorText;
  box-shadow: 0 0 12px -8px $secondColor;
}
#player-wrapper{
  position: relative;
}
#deselect-player {
  position: absolute;
  right: 12px;
  background: $dangerColorText;
  width: 1.2em;
  height: 1.2em;
  color: $dangerColorDark;
  top: calc(50% - 0.6em);
  border-radius: 0.4em;
}
</style>