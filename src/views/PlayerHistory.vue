<template>
  <div id="history">
    <h2>gespielte Games</h2>
    <Loading v-if="this.loading"/>
    <div v-else-if="this.gameList.length === 0" id="no-games-yet-interaction">
      Starte mit einem
      <router-link to="/game" tag="a">Klick</router-link>
      dein erstes Spiel!
    </div>
    <div v-else>
      <router-link v-for="game in gameList" :key="'spiel'+ game._id" tag="div" :to="'/game/' + game._id" :class="['game_overview', !game.gesperrt || 'locked']">
        <HumanReadableTime
            class="game_timestamp"
            :time="getTime(game.timestamp)"
        />
        <div class="second_row">
          <span v-for="player in game.spieler" :key="'spieler'+ player.id" :class="{'winner': player.position === 1}">{{ player.name }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import HumanReadableTime from "@/modules/HumanReadableTime.vue";
import Loading from "@/modules/Loading.vue";
import axios from "axios";
import moment from "moment/moment";

export default {
  // eslint-disable-next-line
  name: "PlayerHistory",
  components: {Loading, HumanReadableTime},
  data(){
    return {
      loading: true,
      gameList: [],
    }
  },
  created() {
    axios.get(`${this.$hostname}/get_player_history`).then(result => {
      this.gameList = result.data;
      this.gameList.sort(
          (objA, objB) => Number(this.getTime(objB.timestamp)) - Number(this.getTime(objA.timestamp)),
      );
      console.info(result);
    }).finally(() => {
      this.loading = false;
    });
  },
  methods: {
    getTime(ts) {
      return moment(ts, "DD/MM/YYYY hh:mm:ss").toDate();
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/css/colors.scss";
#no-games-yet-interaction{
  margin: 20vmin;
  text-align: center;
}
.game_overview {
  margin: 12px;
  padding: 4px;
  border-radius: 3px;
  border: 1px solid $secondColor;
  background: $secondColorText;
  color: $secondColorDark;
}
.game_overview.locked{
  border: 1px solid $secondColorDark;
  background: $secondColor;
  color: $secondColorText;
}
.game_timestamp{
  margin-top: 4px;
  font-size: 1.2em;
  font-weight: bold;
}
.second_row{
  margin: 6px 0;
}
.second_row > * {
  padding: 6px 4px;
  margin: 2px;
}
.second_row > .winner {
  background: gold;
  background: linear-gradient(145deg, rgba(222,220,27,1) 0%, rgba(237,187,35,1) 47%, rgba(253,187,45,1) 100%);
  text-shadow: 0px 0px 2px goldenrod;
  box-shadow: 0 1px 8px -6px black;
  color: $secondColorDark;
  border-radius: 2px;
}
</style>