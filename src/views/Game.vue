<template>
  <div id="game" v-if="gameFound">
    <div id="overview">
      <div v-for="player in spieler" :key="player.id" class="player">
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
        <div class="player-points"> {{ player.zwischenstand }}</div>
        <div v-for="(punkte, index) in pointsForPlayer(player.id)" :key="player.id + '.' + index + '.' + punkte">
          <div class="player-points">{{ punkte }}</div>
          <div class="divider" v-if="index % spieler.length === spieler.length - 1"></div>
        </div>
      </div>
      <div id="overview-punkte">
        <div id="punkte-wrapper">
          <span id="punkte-header">P</span>
        </div>
        <div class="player-points"></div>
        <div v-for="(runde, index) in runden" :key="runde.punkte + '-' +index">
          <div class="player-points">
            <span>{{runde.punkte}}</span>
            <div v-if="runde.solo">
              Solo
            </div>
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
export default {
  name: "Game",
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
    }).catch(error => console.error(error));
  },
  data(){
    return {
      loading: true,
      spieler: [],
      runden: [],
      player_input_array: [],
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
          result.push(player.zwischenstand);
        }else{
          result.push("Pause");
        }
      });
      return result;
    }
  }
}
</script>

<style scoped>
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
  background: #2c3e50;
  border-bottom: 1px solid #1f2a34;
  display: flex;
  flex-direction: column;
  height: 60px;
}
.player-wrapper.kommt_raus{
  background: #FFE1C6;
  border-bottom: 1px solid #FFA85C;
  font-size: 0.8em;
}

.player-wrapper.kommt_raus > .player-name{
  color: #1f2a34;
}
.player-wrapper.aussetzen {
  background: #FFC6D9;
  border-bottom: 1px solid #FF70A0;
  font-size: 0.8em;
}
.player-wrapper.aussetzen > .player-name{
  color: #1f2a34;
}
.player-name, #punkte-header{
  font-size: 1.2rem;
  color: white;
}
.player-info{
  line-height: 0.7rem;
  margin-top: -2px;
}
.player{
  border-right: 1px solid #1f2a34;
}
#overview-punkte{
  border-left: 1px solid #1f2a34;
}
.player-points{
  padding: 7px;
  width: 100%;
  text-align: center;
}
.divider{
  background: #1f2a34;
  height: 1px;
  width: 100%;
}
#enter-results-btn{
  background: #2c3e50;
  color: white;
  margin: 5px;
  border-radius: 2px;
  border: 1px solid black;
  font-size: 1.2em;
}
</style>