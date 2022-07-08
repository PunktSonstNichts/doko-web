<template>
  <div id="create-game">
    <h1>neues Spiel starten</h1>
    <PlayerSearch
        autocomplete="off"
        type="text"
        placeholder="Spieler*in 1"
        v-model="players.player1"
        :ignore-players="ignorePlayerIdsArray"/>
    <span class="input-helper">Spieler*in 1 mischt die Karten</span>
    <PlayerSearch
        autocomplete="off"
        type="text"
        placeholder="Spieler*in 2"
        v-model="players.player2"
        :ignore-players="ignorePlayerIdsArray"/>
    <span class="input-helper">Spieler*in 2 kommt raus</span>
    <PlayerSearch
        autocomplete="off"
        type="text"
        placeholder="Spieler*in 3"
        v-model="players.player3"
        :ignore-players="ignorePlayerIdsArray"/>
    <PlayerSearch
        autocomplete="off"
        type="text"
        placeholder="Spieler*in 4"
        v-model="players.player4"
        :ignore-players="ignorePlayerIdsArray"/>
    <PlayerSearch
        autocomplete="off"
        type="text"
        placeholder="Spieler*in 5 (optional)"
        v-model="players.player5"
        :ignore-players="ignorePlayerIdsArray"/>

    <div id="game-options">
      <h2>Optionen</h2>
      <div>
        <TextInput v-model="maxBock" type="number" placeholder="Maximale Anzahl an Bock"/>
        <span class="input-helper">0 = ohne Bock</span>
      </div>
      <div id="game-options-solo">
        <span>kommt der Solo-Spieler raus?</span>
        <label>
          <input type="checkbox" v-model="soloKommtRaus"><span>{{soloKommtRaus ? "ja" : "nein"}}</span>
        </label>
      </div>
    </div>

    <div id="entry-error" :class="errorMsg ? 'active' : ''">&nbsp;{{errorMsg}}&nbsp;</div>
    <button id="create-game-btn" @click="createRound()">Spiel starten!</button>
  </div>
</template>

<script>
import axios from "axios";
import PlayerSearch from "@/modules/PlayerSearch"
import TextInput from "@/modules/TextInput";

export default {
  name: 'HelloWorld',
  components: {TextInput, PlayerSearch},
  props: {
    msg: String
  },
  watch: {
    players: {
      deep: true,
      handler: "ignorePlayerIds"
    }
  },
  data() {
    return {
      errorMsg: null,
      players: {
        player1: null,
        player2: null,
        player3: null,
        player4: null,
        player5: null,
      },
      maxBock: 0,
      soloKommtRaus: false,
      ignorePlayerIdsArray: [],
      }
  },
  methods: {
    ignorePlayerIds(){
      let playerIDArray = [];
      Object.keys(this.players).forEach(player => {
        if(this.players[player]?.user_id){
          playerIDArray.push(this.players[player])
        }
      });
      console.log(playerIDArray);
      this.ignorePlayerIdsArray=  playerIDArray;
    },
    createRound() {
      this.errorMsg = null;
      if (this.checkUserInput()) {
        const options = {
          maxBock: this.maxBock,
          soloKommtRaus: this.soloKommtRaus
        }
        axios
            .post(`${this.$hostname}/new`, {"players": this.players, "options": options})
            .then(result => {
              console.log(result);
              this.$router.push({path: `/game/${result.data._id}`});
            }).catch(error => console.error(error));
      }else{
        this.errorMsg = "Spieler 1-4 müssen gesetzt sein."
      }
    },
    checkUserInput() {
      return this.players.player1 && this.players.player2 && this.players.player3 && this.players.player4
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/css/colors.scss";

h1 {
  margin: 32px 0 0;
  text-align: center;
}

a {
  color: #42b983;
}

#create-game {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.player-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 6px;
  font-size: 1.2em;
  margin-bottom: 12px;
}
.input-helper{
  margin: 0 8px 2px;
}

#game-options{
  margin: 12px;
  border-radius: 3px;
  border: 1px solid grey;
}
#game-options > *{
  margin: 6px 0;
  padding: 4px;
}
#game-options > div{
  border-top: 1px solid grey;
}
#game-options-solo{
  padding: 4px 12px !important;
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
#create-game-btn {
  color: $accentColorText;
  background: $accentColor;
  border: 1px solid $accentColorDark;
  margin: 5px;
  border-radius: 2px;
  font-size: 1.2em;
}
</style>
