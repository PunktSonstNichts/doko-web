<template>
  <Loading v-if="loading" />
  <div id="abfrage" v-else-if="parteiEingabe">
    <span>Zunächst, wer hat zusammengespielt?</span>
    <div id="title-wrapper">
      <span>Re</span>
    </div>
    <span>Welche Spieler waren die "Re"-Partei?</span>
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
      <span>{{ winningPlayersString }} </span>
    </div>
    <div id="punkte-wrapper">
      Und wieviele Punkte?
      <input type="number" v-model="punkte"/>
    </div>
    <div id="btn-wrapper">
      <div id="entry-error" :class="errorMsg ? 'active' : ''">&nbsp;{{errorMsg}}&nbsp;</div>
      <button @click="skipDetailedEntry()">Zurück zum Spiel</button>
      <button @click="enterDetailedEntry()" id="more-info-btn">Weitere Infos eingeben</button>
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
import Loading from "@/modules/Loading";

export default {
  name: "Eingabe",
  components: {Loading, SpielAbfrage},
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
      this.loading = false;
      this.players = result.data.spieler.filter(spieler => !spieler.aussetzen);
    }).catch(error => console.error(error));
  },
  data() {
    return {
      loading: true,
      errorMsg: null,
      ereignisse: ["Partei", "Punkte", "Hochzeit", "Schweine", "Armut"],
      current_ereignis_index: 0,
      firstPlayer: null,
      punkte: null,
      winner: null,
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
      this.players.forEach(player => {
        if (player.partei === this.winner) {
          player.punkte = this.punkte * player.multiplicator;
        } else {
          // negative Punkte for loosing team
          player.punkte = this.punkte * -1 * player.multiplicator;
        }
      });
    },
    enterDetailedEntry() {
      if(this.checkInput()){
        this.processPunkte();
        this.current_ereignis_index++;
      }
    },
    skipDetailedEntry() {
      if(this.checkInput()){
        this.processPunkte();
        this.sendResults();
      }
    },
    checkInput(){
      if(!this.winner){
        this.errorMsg = "Wer hat gewonnen?";
        return false;
      }
      if(!this.punkte){
        this.errorMsg = "Wie viele Punkte gab es?";
        return false;
      }
      this.errorMsg = null;
      return  true;
    },
    sendResults() {
      this.loading = true;
      // sanitze data
      this.players.forEach(player => {
        delete player.name;
        delete player.kommt_raus;
        delete player.multiplicator;
        delete player.aussetzen;
      });
      let requestPlayerBody = this.players;

      const requestBody = {
        "spielerArray": requestPlayerBody,
        "punkte": this.punkte * 1, // *1 is used to convert string to int
        "solo": this.solo
      }
      axios.post(`${this.$hostname}/game/${this.gameID}`, requestBody).then(data => {
        this.loading = false; // useless but whatever
        console.log(data);
        this.$router.push({path: `/game/${this.gameID}`});
      }).catch(error => console.error(error));
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#abfrage {
  display: flex;
  flex-direction: column;
}

#title-wrapper {
  margin: 16px auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

#player-wrapper {
  margin: 8px 16px;
  display: flex;
  border-top: 1px solid $secondColorDark;
  border-bottom: 1px solid $secondColorDark;
}

.player-selection {
  flex: 1;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  padding: 1em 12px;
  border-left: 1px solid $secondColor;
}
.player-selection:last-of-type{
  border-right: 1px solid $secondColor;
}

.player-selection.selected-player {
  background: $secondColor;
  color: $secondColorText;
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
  padding: 8px 16px;
  border: 1px solid $secondColor;
}

#winner-partei-selection :checked + span {
  background: $secondColor;
  color: $secondColorText;
}

#btn-wrapper {
  display: flex;
  flex-direction: column;
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

#more-info-btn {
  background: $secondColor;
  color: $secondColorText;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
  font-size: 1.2em;
}
</style>