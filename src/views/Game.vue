<template>
  <Loading v-if="loading"/>
  <div id="game" v-else-if="gameFound">
    <div id="overview">
      <div v-for="player in spieler" :key="player.id" class="player">
        <div v-if="isKonsumView" class="player-konsum">
          {{ player.name }} hat schon X Bier getrunken.
        </div>
        <div class="player-wrapper kommt_raus" v-if="player.kommt_raus">
          <span class="player-name">{{ player.name }}</span>
          <span class="player-info">kommt raus</span>
        </div>
        <div class="player-wrapper aussetzen" v-else-if="player.aussetzen">
          <span class="player-name">{{ player.name }}</span>
          <span class="player-info">setzt aus</span>
        </div>
        <div class="player-wrapper" v-else>
          <span class="player-name">{{ player.name }}</span>
        </div>
        <div v-if="!isKonsumView">
          <div v-for="(runde, index) in pointsForPlayer(player.id)" :key="player.id + '.' + index + '.' + punkte">
            <div class="player-points">{{ runde.punkte }} <span v-if="runde.solo">S</span></div>
            <div class="divider" v-if="index % spieler.length === spieler.length - 1"></div>
          </div>
        </div>
      </div>
      <div id="overview-punkte" v-if="!isKonsumView">
        <div id="punkte-wrapper">
          <span id="punkte-header">P</span>
        </div>
        <div v-for="(runde, index) in runden" :key="runde.punkte + '-' +index">
          <div class="player-points">
            <span>{{runde.punkte}}</span>
            <span v-if="runde.solo">
              Solo
            </span>
            <!-- #todo hier kommen dann Solo und BockRunden rein-->
          </div>
          <div class="divider" v-if="index % spieler.length === spieler.length - 1"></div>
        </div>
      </div>
    </div>
    <router-link :to="`/game/${gameID}/entry`" tag="button" id="enter-results-btn">Ergebnisse eintragen</router-link>
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
export default {
  name: "Game",
  components: {Loading},
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
      isKonsumView: false,
      gameFound: false
    }
  },
  methods: {
    pointsForPlayer(playerId){
      let result = [];
      this.runden.forEach(runde => {
        const player = runde.spielerArray.find(player => player.id === playerId);
        console.log(player);
        if(player){
          console.log(player.name, player.zwischenstand);
          result.push({punkte: player.zwischenstand, solo: player.id === runde.solo});
        }else{
          result.push({punkte: "-/-"});
        }
      });
      return result;
    },
    toggleKonsumModal(){
      this.isKonsumView = !this.isKonsumView;
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#game{
  display: flex;
  flex-direction: column;
  height: 100%;
}
#overview{
  flex: 1;
  display: flex;
  overflow-y: scroll;
}
.player, #overview-punkte{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.player-wrapper, .player-points{
  display: inline-block;
}
.player-wrapper, #punkte-wrapper{
  padding: 7px;
  text-align: center;
  background: $secondColor;
  border-bottom: 1px solid $secondColorDark;
  display: flex;
  flex-direction: column;
  height: 60px;
  margin-bottom: 12px;
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
.player-name, #punkte-header{
  font-size: 1.2rem;
  color: $secondColorText;
}
.player-info{
  line-height: 0.7rem;
  margin-top: -2px;
}
.player:not(:last-of-type){
  border-right: 1px solid $secondColorDark;
}
#overview-punkte{
  border-left: 1px solid $secondColorDark;
}
.player-points{
  padding: 7px;
  width: 100%;
  text-align: center;
}
.divider{
  background: $secondColorDark;
  height: 1px;
  width: 100%;
}
#enter-results-btn{
  background: $secondColor;
  color: $secondColorText;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
  font-size: 1.2em;
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