<template>
  <Loading v-if="loading"/>
  <div id="game" v-else-if="gameFound">
    <!-- <div id="konsum">
      <button id="konsum-btn" @click="toggleKonsumModal()">{{isKonsumView ? "Zurück zum Spiel" : "Konsum eintragen"}}</button>
    </div>  -->
    <div v-if="isKonsumView" id="konsum-overview">
      <div class="konsum-element">1 Bier</div>
      <div class="konsum-element">1 Wein</div>
    </div>
    <table id="overview">
        <thead id="overview-header">
        <tr>
          <th v-for="player in spieler" :key="player.id">
            <button v-if="isKonsumView" class="player-konsum">
              +
            </button>
            <div class="player-wrapper" :class="getHeaderInfo(player).class">
              <span class="player-name">{{ player.name }}</span>
              <span class="player-info" v-if="getHeaderInfo(player).text">{{ getHeaderInfo(player).text }}</span>
            </div>
          </th>
          <th v-if="!isKonsumView">
            <div id="punkte-wrapper">
              <span id="punkte-header">P</span>
            </div>
          </th>
        </tr>
        </thead>
        <tbody id="overview-punkte" v-if="!isKonsumView">
          <tr v-for="(runde, index) in runden" :key="runde.id" :class="{row: true, divider: index % spieler.length === spieler.length - 1}">
            <td v-for="(player, index) in pointsPerRound(runde)" :key="player.id + '.' + index + '.' + runde.punkte">
              <div class="player-points">{{ player.punkte }} <span v-if="player.solo">S</span></div>
            </td>
            <td class="punkte-per-round">
              <div class="runden-points">{{ runde.punkte }} <span v-if="runde.solo">S</span><ShowBock :bock-count="runde.bock"/></div>
            </td>
          </tr>
        <tr v-for="(bockCount, index) in remainingBock" :key="index" :class="{row: true, divider: (runden.length + index) % spieler.length === spieler.length - 1}">
          <td :colspan="spieler.length">
            <div class="player-points">&nbsp;</div>
          </td>
          <td>
            <ShowBock :bock-count="bockCount" class="runden-points"/>
          </td>
        </tr>
        <tr id="footer-row">
          <td :colspan="spieler.length + 1"></td>
        </tr>
        </tbody>
      </table>
    <div id="interaction-wrapper">
      <div id="complicated-btn">
        <button class="interaction-w-confirmation" @click="areYouSure = !areYouSure">
          {{areYouSure ? 'abbrechen' : 'beenden'}}
        </button>
        <button class="are-you-sure-interaction" v-if="areYouSure" @click="lockGame()">Spiel beenden!</button>
        <router-link :to="`/game/${gameID}/entry`" tag="button" id="enter-results-btn" v-else>Ergebnisse eintragen</router-link>
      </div>
    </div>
  </div>
  <div v-else id="game-not-found">
    <span v-if="gameID">Kein Spiel unter <i>{{gameID}}</i> gefunden.</span>
    <span v-else>Ohne gameID wirds schwierig, ein Spiel zu finden.</span>
    <router-link to="/">Neues Spiel anlegen</router-link>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "@/modules/Loading";
import ShowBock from "@/modules/ShowBock";
export default {
  // eslint-disable-next-line
  name: "Game",
  components: {ShowBock, Loading},
  computed: {
    gameID () {
      return this.$route.params.id
    }
  },
  created() {
    console.log("this.gameID", this.$route.params.id);
    if(!this.gameID){
      console.log("no gameID, no luck")
      this.loading = false;
      this.gameFound = false;
      return;
    }
    axios.get(`${this.$hostname}/game/${this.gameID}`).then(result => {
      this.loading = false;
      console.log(result);
      this.spieler = result.data.spieler;
      this.runden = result.data.runden;
      this.remainingBock = result.data.remainingBock;
      this.gameFound = true;
    }).catch(error => {
      console.error(error);
      this.loading = false;
      this.gameFound = false;
    });
  },
  data(){
    return {
      loading: true,
      spieler: [],
      runden: [],
      remainingBock: [],
      isKonsumView: false,
      areYouSure: false,
      gameFound: false
    }
  },
  methods: {
    pointsPerRound(runde){
      let result = [];
      this.spieler.forEach(spieler => {
        const player = runde.spielerArray.find(player => player.id === spieler.id);
        if(player){
          console.log(player, player.zwischenstand);
          result.push({punkte: player.zwischenstand, solo: player.id === runde.solo});
        }else{
          result.push({punkte: "-/-"});
        }
      });
      console.log(result);
      return result;
    },
    toggleKonsumModal(){
      this.isKonsumView = !this.isKonsumView;
    },
    getHeaderInfo(player){
      if(player.kommt_raus){
        return {class: "kommt_raus", text: "kommt\nraus"};
      }
      if(player.aussetzen){
        return {class: "aussetzen", text: "setzt\naus"};
      }
      return {class: null, text: null};
    },
    lockGame(){
      this.loading = true;
      axios.post(`${this.$hostname}/game/${this.gameID}/lock`).then(result => {
        this.loading = false;
        console.log(result);
      }).catch(error => {
        console.error(error);
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#konsum{
  display: flex;
  background: $dangerColorDark;
}
#konsum-btn{
  flex: 1;
  background: $background;
  color: $secondColor;
  box-shadow: 0 1px 2px $secondColorDark;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
  font-size: 1.2em;
  box-sizing: border-box;
}
.konsum-element{
  margin: 12px;
  padding: 6px;
  border: 5px solid $background;
  background: $secondColor;
  font-size: 1.6rem;
  font-weight: bold;
  color: $secondColorText;
}
.konsum-element:hover{
  border-color: $dangerColorDark;
  background: $secondColorDark;
  color: $dangerColor;
}

.player-konsum{
  margin: 4px 6px;
  text-align: center;
}

#game{
  height: 100%;
  max-height: 100vh;
  overflow-y: auto;
}
/** Table **/
table#overview {
  width: 100%;
  border-collapse: collapse;
}
table#overview td, table#overview th {
  padding: 0;
  margin: 0;
}
table#overview th {
  position: sticky;
  top: 0;
}
.player-wrapper, #punkte-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 7px;
  text-align: center;
  background: $secondColor;
  border-bottom: 1px solid $secondColorDark;
  height: 60px;
}


.player-wrapper.kommt_raus{
  background: $accentColor;
  border-bottom: 1px solid $accentColorDark;
  font-size: 0.8em;
}

.player-wrapper.kommt_raus > .player-name{
  color: $accentColorText;
}
.player-wrapper.aussetzen {
  background: $dangerColor;
  border-bottom: 1px solid $dangerColorDark;
  font-size: 0.8em;
}
.player-wrapper.aussetzen > .player-name{
  color: $dangerColorText;
}
.player-info {
  line-height: 0.8em;
  margin-bottom: -6px;
}

.player-name, #punkte-header {
  font-size: 1.2rem;
  color: $secondColorText;
}
.player-points, .runden-points{
  padding: 12px 16px;
  text-align: center;
}
.player-points{
  border-right: 1px solid $secondColor;
}
tr.row.divider {
  border-bottom: 1px solid $secondColor;
}
#footer-row{
  height: 96px;
  vertical-align: top;
}



/** Interaction **/
#interaction-wrapper{
  position: fixed;
  bottom: 0;
  width: 100%;
  background: linear-gradient(0deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0) 69%);
  display: flex;
}
#complicated-btn{
  flex: 1;
  display: flex;
  background: $secondColor;
  color: $secondColorText;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
}
#enter-results-btn, .interaction-w-confirmation, .are-you-sure-interaction{
  background: transparent;
  color: $secondColorText;
  font-size: 1.2em;
  padding: 6px 8px;
}
#enter-results-btn, .are-you-sure-interaction{
  border-left: 1px solid $secondColorText;
  flex: 1;
}
.are-you-sure-interaction{
  background: $dangerColorDark;
  color: $dangerColorText;
}

#game-not-found {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 8vmin;
}
</style>