<template>
  <div>
    <h1>Übersicht über Spiel #{{ gameID }}</h1>
    <loading v-if="loading"></loading>
    <div v-else>
      <img id="graph" :src="graphUrl" />
    </div>
  </div>
</template>

<script>
import Loading from "@/modules/Loading";
import axios from "axios";

export default {
  name: "GameOverview",
  components: {Loading},
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

     axios.get(`${this.$hostname}/result_plot/${this.gameID}`).then(result => {
       // super hacky, server is just returning a String of a BASE64 encoded png image
        this.graphUrl = result.data;
     });


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