<template>
  <div id="input-wrapper" v-if="!selectedPlayer">
    <TextInput v-bind="$attrs" v-model="textInput" autocomplete="off"/>
    <div id="floaty-piece" v-if="textInput">
      <div id="add-player-wrapper">
        <button id="add-player-btn" @click="createPlayer()" v-if="canAddPlayer">{{textInput}} hinzufügen</button>
      </div>
      <div id="result-box" v-if="filteredResults">
        <button v-for="player in filteredResults"
             :key="player.user_id"
             :class="['player-wrapper', selectedPlayer === player ? 'selected' : '']"
             @click="selectPlayer(player)">
          <span class="player-name">{{player.username}}</span>
        </button>
      </div>
      <div id="error-box">
        {{ errorMsg }}
      </div>
    </div>
  </div>
  <div id="player-wrapper" v-else>
    <span id="player-name">{{ selectedPlayer.username }}</span>
    <button id="deselect-player" @click="selectPlayer(null)">X</button>
  </div>
</template>

<script>
import axios from "axios";
import TextInput from "@/modules/TextInput";

export default {
  name: "PlayerSearch.vue",
  components: {TextInput},
  props: {
    userHasAccount: {
      type: Boolean,
      default: false
    },
    ignorePlayers: {
      type: Array,
      default: () => { return [] }
    }
  },
  computed: {
    canAddPlayer(){
      return this.textInput.length >= 3 &&
          this.result.length === 0 &&
          !this.errorMsg &&
          !this.userHasAccount;

    }
  },
  data(){
    return {
      textInput: null,
      loading: false,
      errorMsg: null,
      cache: {},
      result: {},
      filteredResults: [],
      selectedPlayer: null,
    }
  },
  watch: {
    textInput: {
      deep: true,
      handler: "checkForPlayers"
    },
    ignorePlayers: {
      deep: true,
      handler: "removePlayers"
    }
  },
  methods: {
    removePlayers(){
      this.filteredResults = [];
      if(this.result){
        Object.keys(this.result).forEach(player => {
         if(!this.ignorePlayers.includes(this.result[player].user_id)){
            this.filteredResults.push(this.result[player]);
          }
        });
      }
    },
    checkForPlayers(){
      let textInput = "";
      // totally weird, textInput is either InputEvent or String
      if(this.textInput instanceof InputEvent){
        textInput = this.textInput.data
      }else{
        textInput = this.textInput;
      }
      if(textInput){
        this.errorMsg = null;
        if(this.cache[textInput]){
          this.result = this.cache[textInput]
        }else{
          axios.get(`${this.$hostname}/namelist/${textInput}?userHasAccount=${this.userHasAccount}`).then(response => {
            this.loading = false;
            this.result = this.cache[textInput] = response.data.player;
            this.removePlayers();
          }).catch(error => {
            console.error(error);
            this.errorMsg = error.data.msg;
          });
        }

      }
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
  padding: 0 !important;
  right: 12px;
  background: $dangerColorText;
  width: 1.2em;
  height: 1.2em;
  color: $dangerColorDark;
  top: calc(50% - 0.6em);
  border-radius: 0.4em;
}
</style>