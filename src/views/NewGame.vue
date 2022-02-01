<template>
  <div id="create-game">
    <h1>neues Spiel starten</h1>
      <TextInput placeholder="Spieler 1" v-model="players.player1" />
      <TextInput type="text" placeholder="Spieler 2" v-model="players.player2"/>
      <TextInput type="text" placeholder="Spieler 3" v-model="players.player3"/>
      <TextInput type="text" placeholder="Spieler 4" v-model="players.player4"/>
      <TextInput type="text" placeholder="Spieler 5" v-model="players.player5"/>
    <button id="create-game-btn" @click="createRound()">Spiel starten!</button>
  </div>
</template>

<script>
import axios from "axios";
import TextInput from "@/modules/TextInput";

export default {
  name: 'HelloWorld',
  components: {TextInput},
  props: {
    msg: String
  },
  data() {
    return {
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
      if (this.checkUserInput()) {
        axios.post(`${this.$hostname}/new`, this.players).then(result => {
          console.log(result);
          this.$router.push({path: `/game/${result.data._id}`});
        }).catch(error => console.error(error));
      }
    },
    checkUserInput() {
      return this.players.player1 && this.players.player2 && this.players.player3 && this.players.player4
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

#create-game-btn {
  color: #2c3e50;
  background: #FFE1C6;
  border: 1px solid #FFA85C;
  margin: 5px;
  border-radius: 2px;
  font-size: 1.2em;
}
</style>
