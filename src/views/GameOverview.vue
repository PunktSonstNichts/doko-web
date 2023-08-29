<template>
  <div>
    <h1>Übersicht über Spiel #{{ gameID }}</h1>
    <loading v-if="loading"></loading>
    <div v-else>
      <img id="graph" :src="graphUrl" />
      <table id="overview">
        <thead id="overview-header">
        <tr>
          <th v-for="player in spieler" :key="player.id">
            <div class="player-wrapper">
              <span class="player-name">{{ player.name }}</span>
            </div>
          </th>
          <th>
            <div id="punkte-wrapper">
              <span id="punkte-header">P</span>
            </div>
          </th>
        </tr>
        </thead>
        <tbody id="overview-punkte">
        <tr v-for="(runde, index) in runden" :key="runde.id" :class="{row: true, divider: index % spieler.length === spieler.length - 1}">
          <td v-for="(player, index) in pointsPerRound(runde)" :key="player.id + '.' + index + '.' + runde.punkte">
            <div class="player-points">{{ player.punkte }} <span v-if="player.solo" class="solo-badge">S</span></div>
          </td>
          <td class="punkte-per-round">
            <div class="runden-points">{{ runde.punkte }} <ShowBock :bock-count="runde.bock"/></div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Loading from "@/modules/Loading";
import ShowBock from "@/modules/ShowBock";
import axios from "axios";

export default {
  name: "GameOverview",
  components: {Loading, ShowBock},
  computed: {
    gameID () {
      return this.$route.params.id
    },
  },
  created() {
    if(!this.gameID){
      console.log("no gameID, no luck")
      this.loading = false;
      this.gameFound = false;
      return;
    }




    axios.get(`${this.$hostname}/game/${this.gameID}`).then(result => {
      this.loading = false;
      if(!result.data.gesperrt){
        this.$router.push(`/game/${this.gameID}`);
      }
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
      loading: false,
      graphUrl: null,
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
  }
}
</script>

<style scoped>
h1{
  text-align: center;
}
#graph{
  max-width: 100%;
}
</style>