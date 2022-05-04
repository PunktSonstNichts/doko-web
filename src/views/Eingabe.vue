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
    <div v-if="firstPlayer" @click="processSelection(null)" id="solo-btn">
      {{ firstPlayer ? firstPlayer.name : '' }} hat Solo gespielt
    </div>
  </div>
  <div id="punkte-abfrage" v-else-if="punkteEingabe">
    <div id="winner-partei-wrapper">
      <span class="question">Wer hat gewonnen?</span>
      <div id="winner-partei-selection">
        <label><input type="radio" v-model="winner" value="Re"/><span>Re</span></label>
        <label><input type="radio" v-model="winner" value="Kontra"/><span>Kontra</span></label>
      </div>
      <span>{{ winningPlayersString }} </span>
    </div>
    <div id="punkte-wrapper">
      <span class="question">Und wieviele Punkte?</span>
      <input type="number" v-model="punkte"/><ShowBock :bock-count="bockCountForRound"></ShowBock>
    </div>
    <div id="bock-wrapper">
      <span class="question">Gab es Bock?</span>
      <label>
        <input type="checkbox" v-model="bock"/>
        bockt!
      </label>
    </div>
    <div id="ereignis-wrapper">
      <div v-for="(x, ereignis) in ereignisse" :key="ereignis + x" @click="current_ereignis = ereignis" class="ereignis">
        <img class="ereignis-icon" width="42px" height="42px" :src="getImgUrl(ereignis)"/>
        <span>{{ereignis}}</span>
        <div>{{idToName(x)}}</div>
      </div>
    </div>
    <div id="btn-wrapper">
      <div id="entry-error" :class="errorMsg ? 'active' : ''">&nbsp;{{errorMsg}}&nbsp;</div>
      <router-link :to="`/game/${gameID}`" tag="button">abbrechen</router-link>
      <button @click="checkAndSend()" id="more-info-btn">speichern & zurück zum Spiel</button>
    </div>
  </div>
  <spiel-abfrage
      v-else
      :players="players"
      :ereignis="current_ereignis"
      :player-id="whichPlayerHas(current_ereignis)"
      @eingabe="processEingabe"
  />
</template>

<script>
import SpielAbfrage from "@/modules/SpielAbfrage";
import axios from "axios";
import Loading from "@/modules/Loading";
import ShowBock from "@/modules/ShowBock";

export default {
  // eslint-disable-next-line
  name: "Eingabe",
  components: {ShowBock, Loading, SpielAbfrage},
  computed: {
    gameID() {
      return this.$route.params.id
    },
    parteiEingabe() {
      return this.current_ereignis === "Partei";
    },
    punkteEingabe() {
      return this.current_ereignis === "Punkte";
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
      this.loading = false;
      this.players = result.data.spieler.filter(spieler => !spieler.aussetzen);
      this.bockCountForRound = result.data.remainingBock[0] || 0;
    }).catch(error => console.error(error));
  },
  data() {
    return {
      loading: true,
      errorMsg: null,
      ereignisse: {
          "Hochzeit": null,
          "Schweine": null,
          "Armut": null,
      },
      current_ereignis: "Partei",
      firstPlayer: null,
      punkte: null,
      bock: false,
      bockCountForRound: 0,
      winner: null,
      players: []
    }
  },
  methods: {
    getImgUrl(ereignis) {
      var images = require.context('../assets/', false, /\.png$/)
      return images('./' + ereignis + "_Icon.png")
    },
    whichPlayerHas(ereignis){
      // returns null or playerId
      return this.ereignisse[ereignis];
    },
    idToName(playerId){
      return this.players.find(player => player.id === playerId)?.name;
    },
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
      this.ereignisse[this.current_ereignis] = playerID;

      // go back to "Punkte"-page
      this.current_ereignis = "Punkte";
    },
    processRe(playerIDarray) {

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
      this.current_ereignis = "Punkte";
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
    checkAndSend() {
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
        "solo": this.solo,
        "bock": this.bock,
        "hochzeit": this.ereignisse.Hochzeit,
        "schweine": this.ereignisse.Schweine,
        "armut": this.ereignisse.Armut,
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
#solo-btn{
  margin: 12px 16px;
  padding: 12px 14px;
  text-align: center;
  font-size: 1.2em;
  color: $secondColor;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
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

#winner-partei-wrapper, #punkte-wrapper, #bock-wrapper, #ereignis-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 16px 5px;
  flex: 1;
}

#winner-partei-wrapper > *, #punkte-wrapper > *, bock-wrapper > * {
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

#ereignis-wrapper{
  flex-direction: row;
  justify-content: space-evenly;
}
.ereignis{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 6px;
  margin: 6px;
  height: 86px;
  width: 86px;
  border-radius: 4px;
  border: 1px solid $secondColorDark;
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