<template>
  <div>

      <canvas id="myChart"></canvas>
    <h1>Übersicht deiner Gruppen</h1>
    <loading v-if="loading"></loading>
    <div v-else-if="auswertung.length === 0">
      Noch hast du kein Spiel gespielt.<br>
      <router-link to="/game" tag="button">Starte ein Spiel</router-link>
    </div>
    <div v-else>
      <TextInput type="text" id="search" v-model="searchString" placeholder="Spieler*in"/>
      <div v-if="searchedAuswertung.length === 0">
      <h2>Nichts gefunden</h2>
        <p>Vielleicht die Suche etwas anpassen?</p>
      </div>
      <div v-else id="list-of-groups">
        <div v-for="(spielgruppen, index) in searchedAuswertung" :key="index" class="group">
          <div>
            <div class="group-players">
              <span v-for="(spieler) in spielgruppen.spieler" :key="spieler.id">
                {{spieler.name}}
              </span>
            </div>
            <span class="group-last-game">
              zuletzt <HumanReadableTime :time="new Date(spielgruppen.lastPlayed)"/> gezockt
            </span>
          </div>
          <div class="group-rounds-count">
              <div>
                  {{ spielgruppen.rundenCount }}
              </div>
              <span>Abende</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/modules/Loading";
import TextInput from "@/modules/TextInput.vue";
import HumanReadableTime from "@/modules/HumanReadableTime.vue";
import axios from "axios";
// import Chart from 'chart.js/auto';
// import TextInput from "@/modules/TextInput.vue";
//import axios from "axios";

export default {
  name: "GameOverview",
  components: {HumanReadableTime, TextInput, Loading},
  computed: {
    gameID () {
      return this.$route.params.id
    }
  },
  watch: {
    searchString: {
      immediate: true,
      handler: "searchAuswertungByString",
    }
  },
  created() {
    axios.get(`${this.$hostname}/stats/groups`).then(result => {
      if(!result.data){
        // todo error handling
      }
      console.log(result);
      this.auswertung = result.data;
      this.sortResults();
    }).catch(error => {
      console.error(error);
      this.gameFound = false;
    }).finally(() => {
      this.loading = false;
    });
  },
  data(){
    return {
      loading: true,
      searchString: "",
      searchedAuswertung: [],
      auswertung: []
    }
  },
  methods: {
    sortResults(){
      this.auswertung.sort(
          (objA, objB) => Number(objB.rundenCount) - Number(objA.rundenCount) || Number(this.getTime(objB.timestamp)) - Number(this.getTime(objA.timestamp)),
      );
      this.auswertung.forEach(elem => Object.values(elem).sort(
          (objA, objB) => Number(objB.position) - Number(objA.position),
      ));
      this.searchAuswertungByString();
    },
    searchAuswertungByString(){
      let target = this.searchString?.toLocaleLowerCase();
      console.log(target, this.auswertung);
      if(!target){
        this.searchedAuswertung = this.auswertung;
      }else {
        this.searchedAuswertung = this.auswertung.filter((item) =>
            item.spieler[0].name.toLowerCase().indexOf(target) > -1 ||
            item.spieler[1].name.toLowerCase().indexOf(target) > -1 ||
            item.spieler[2].name.toLowerCase().indexOf(target) > -1 ||
            item.spieler[3].name.toLowerCase().indexOf(target) > -1 ||
            item.spieler[4]?.name.toLowerCase().indexOf(target) > -1
        );
      }
    }
  }
}
</script>

<style scoped>
h1{
  text-align: center;
}
.group{
    margin: 14px 6px;
    border: 1px solid #1f2a34;
    border-radius: 8px 3px 12px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    box-shadow: 0 1px 4px -2px #1f2a34;
    transition: box-shadow 0.25s cubic-bezier(0.66, 0.13, 0.4, 0.99);
}
.group:hover{
    box-shadow: 0 2px 12px -4px #1f2a34;
}
.group > *{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 9px 11px;
}
.group-players{
    font-size: 1.2em;
}
.group-last-game{
    color: #2c3e50;
}
.group-rounds-count{
    border-left: 1px solid #1f2a34;
    box-shadow: inset 0 2px 11px -4px #1f2a34;
    background: #2c3e50;
    color: #42b983;
    border-radius: 0 2px 11px 0;
    align-items: center;
}
.group-rounds-count > div{
    font-weight: bold;
    font-size: 1.6em;
    text-shadow: 1px 1px 0 #206042;
}
</style>