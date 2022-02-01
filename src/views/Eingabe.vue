<template>
  <div id="abfrage" v-if="parteiEingabe">
    <div id="title-wrapper">
      <span>Re</span>
    </div>
    <div id="player-wrapper">
      <div v-for="player in players"
           :key="player.id"
           :class="['player-selection', firstPlayer && firstPlayer.id === player.id ? 'selected-player' : '']"
           @click="processSelection(player)">
        {{ player.name }}
      </div>
    </div>
    <div v-if="firstPlayer" @click="processSelection(null)">
      {{ firstPlayer ? firstPlayer.name : '' }} hat Solo gespielt
    </div>
  </div>
  <div id="punkte-abfrage" v-else-if="punkteEingabe">
    <div id="winner-partei-wrapper">
      Wer hat gewonnen?
      <div id="winner-partei-selection">
        <label><input type="radio" v-model="winner" value="Re"/><span>Re</span></label>
        <label><input type="radio" v-model="winner" value="Kontra"/><span>Kontra</span></label>
      </div>
      {{ winningPlayersString }}
    </div>
    <div id="punkte-wrapper">
      Und wieviele Punkte?
      <input type="number" v-model="punkte"/>
    </div>
    <div id="btn-wrapper">
      <button @click="skipDetailedEntry()">Zurück zum Spiel</button>
      <button @click="processPunkte()" id="more-info-btn">Weitere Infos eingeben</button>
    </div>
  </div>
  <spiel-abfrage
      v-else
      :players="players"
      :ereignis="ereignis"
      @eingabe="processEingabe"
  />
</template>

<script>
import SpielAbfrage from "@/modules/SpielAbfrage";
import axios from "axios";

export default {
  name: "Eingabe",
  components: {SpielAbfrage},
  computed: {
    gameID() {
      return this.$route.params.id
    },
    ereignis() {
      return this.ereignisse[this.current_ereignis_index];
    },
    parteiEingabe() {
      return this.current_ereignis_index === 0;
    },
    punkteEingabe() {
      return this.current_ereignis_index === 1;
    },
    solo() {
      const winnerArray = this.players.filter(player => player.partei === this.winner);
      if (winnerArray.length === 1){
        return winnerArray[0].id;
      }
      return null;
    },
    winningPlayersString() {
      var str = "";
      this.players.filter(player => player.partei === this.winner).forEach(player => str = str + " " + player.name);
      return str;
    }
  },
  created() {
    axios.get(`${this.$hostname}/game/${this.gameID}`).then(result => {
      console.log(result);
      this.players = result.data.spieler.filter(spieler => !spieler.aussetzen);
      if(result.data.spieler.filter(spieler => spieler.aussetzen).length === 1){
        this.aussetzer = result.data.spieler.filter(spieler => spieler.aussetzen)[0];
        this.aussetzer.punkte = 0;
        delete this.aussetzer.kommt_raus;
        delete this.aussetzer.name;
        delete this.aussetzer.aussetzen;
      }
    }).catch(error => console.error(error));
  },
  data() {
    return {
      ereignisse: ["Partei", "Punkte", "Hochzeit", "Schweine", "Armut"],
      current_ereignis_index: 0,
      firstPlayer: null,
      punkte: null,
      winner: null,
      aussetzer: null,
      players: []
    }
  },
  methods: {
    processSelection(player) {
      // one player if he/she played a solo or two players for RE-Partei
      if (this.firstPlayer) {
        // delete firstPlayer before the emit
        let temp;
        temp = this.firstPlayer.id;
        this.firstPlayer = null;
        if (player) {
          if (player.id !== temp) {
            this.processRe([player.id, temp]);
          }
        } else {
          this.processRe([temp]);
        }
      } else {
        this.firstPlayer = player;
      }
    },
    processEingabe(playerID) {
      //put the eingabe to the player
      if (playerID) {
        const ereignis = this.ereignisse[this.current_ereignis_index].toLowerCase();
        this.players.find(player => player.id === playerID)[ereignis] = true;
      }

      // check for next ereignis
      this.current_ereignis_index++;
      if (this.current_ereignis_index >= this.ereignisse.length) {
        this.sendResults();
      }
    },
    processRe(playerIDarray) {
      this.current_ereignis_index++;

      this.players.forEach(player => {
        if (playerIDarray.includes(player.id)) {
          player.partei = "Re";
        } else {
          player.partei = "Kontra";
        }

        //mulitplicator is used for solo
        if (playerIDarray.length === 1 && playerIDarray.includes(player.id)) {
          // only the player who played alone gets the multiplier
          player.multiplicator = 3;
        } else {
          player.multiplicator = 1;
        }
      });
      console.log(playerIDarray)
    },
    processPunkte() {
      this.current_ereignis_index++;

      this.players.forEach(player => {
        if (player.partei === this.winner) {
          player.punkte = this.punkte * player.multiplicator;
        } else {
          // negative Punkte for loosing team
          player.punkte = this.punkte * -1 * player.multiplicator;
        }
      });
    },
    skipDetailedEntry() {
      this.processPunkte();
      this.sendResults();
    },
    sendResults() {
      // todo loading animation here

      // sanitze data
      this.players.forEach(player => {
        delete player.name;
        delete player.kommt_raus;
        delete player.multiplicator;
        delete player.aussetzen;
      });
      let requestPlayerBody = this.players;
      if(this.aussetzer){
        requestPlayerBody.push(this.aussetzer);
      }
      const requestBody = {
        "spielerArray": requestPlayerBody,
        "punkte": this.punkte * 1, // *1 is used to convert string to int
        "solo": this.solo
      }
      axios.post(`${this.$hostname}/game/${this.gameID}`, requestBody).then(data => {
        console.log(data);
        this.$router.push({path: `/game/${this.gameID}`});
      }).catch(error => console.error(error));
    }
  }
}
</script>

<style scoped>
#abfrage {
  display: flex;
  flex-direction: column;
}

#title-wrapper {
  height: 20vmax;
  width: 20vmax;;
  margin: 16px auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #42b983;
  box-shadow: inset 0 0 12px #1f2a34;
  background: #42b983;
  font-weight: bold;
  font-size: 1.4em;
}

#player-wrapper {
  display: flex;

  border-top: 1px solid #1f2a34;
  border-bottom: 1px solid #1f2a34;
}

.player-selection {
  flex: 1;
  font-size: 1.2em;
  text-align: center;
  padding: 4px 6px;
}

.player-selection:not(:first-of-type) {
  border-left: 1px solid #2c3e50;
}

.player-selection.selected-player {
  background: #2c3e50;
  color: white;
}

#abort {
  text-align: center;
  padding: 6px;
}

#punkte-abfrage {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#winner-partei-wrapper, #punkte-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 16px 5px;
  flex: 1;
}

#winner-partei-wrapper > *, #punkte-wrapper > * {
  margin: 6px 0;
}

#winner-partei-selection {
  display: flex;
}

#winner-partei-selection label {
  padding: 0;
}

#winner-partei-selection input {
  display: none;
}

#winner-partei-selection span {
  text-align: center;
  padding: 6px 8px;
  border: 1px solid #2c3e50;
}

#winner-partei-selection :checked + span {
  background: #2c3e50;
  color: white;
}

#btn-wrapper {
  display: flex;
  flex-direction: column;
}

#more-info-btn {
  background: #2c3e50;
  color: white;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid black;
  font-size: 1.2em;
}
</style>