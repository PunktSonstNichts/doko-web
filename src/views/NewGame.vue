<template>
  <div id="create-game">
    <h1>neues Spiel starten</h1>
    <PlayerSearch autocomplete="off" type="text" placeholder="Spieler 1" v-model="players.player1" />
    <PlayerSearch autocomplete="off" type="text" placeholder="Spieler 2" v-model="players.player2"/>
    <PlayerSearch autocomplete="off" type="text" placeholder="Spieler 3" v-model="players.player3"/>
    <PlayerSearch autocomplete="off" type="text" placeholder="Spieler 4" v-model="players.player4"/>
    <PlayerSearch autocomplete="off" type="text" placeholder="Spieler 5 (optional)" v-model="players.player5"/>
    <div id="entry-error" :class="errorMsg ? 'active' : ''">&nbsp;{{errorMsg}}&nbsp;</div>
    <button id="create-game-btn" @click="createRound()">Spiel starten!</button>
  </div>
</template>

<script>
import axios from "axios";
import PlayerSearch from "@/modules/PlayerSearch"

export default {
  name: 'HelloWorld',
  components: {PlayerSearch},
  props: {
    msg: String
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
      }
    }
  },
  methods: {
    createRound() {
      this.errorMsg = null;
      if (this.checkUserInput()) {
        axios.post(`${this.$hostname}/new`, this.players).then(result => {
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
}

.player-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 6px;
  font-size: 1.2em;
  margin-bottom: 12px;
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
