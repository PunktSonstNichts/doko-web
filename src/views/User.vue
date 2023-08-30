<template>
  <div id="root-element">
      <div id="create-game">
          <router-link to="/game" tag="button" id="new-game-btn">Neues Spiel starten!</router-link>
      </div>
    <div id="add-player">
      <h2>Benutzers einladen</h2>
      <PlayerSearch
          autocomplete="off"
          type="text"
          placeholder="Spieler*in zum Hinzufügen auswählen"
          v-model="playerToAdd"
          :user-has-account="true" />
      <div id="add-player-btn-wrapper">
        <button class="btn" @click="generateToken()">Zugangslink generieren</button>
      </div>
      <div v-if="token" id="token-url-wrapper">
        <input id="token-url" :disabled="true" :value="`${baseUrl}${token}`"/>
      </div>
    </div>
    <div id="stats-overview">
        <h2>Auswertung</h2>
        <!-- Hier ist Platz für 1, 2 schnelle Auswertungskarten, z.B. wieviele Spiele diese Woche, mit wem am häufigsten zusammengespielt, sowas halt? -->
        <router-link to="/stats" tag="button" id="stats-btn">Statistik</router-link>
    </div>
    <div id="history">
      <h2>gespielte Games</h2>
      <Loading v-if="this.loading"/>
      <div v-else-if="this.gameList.length === 0">
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
  </div>
</template>

<script>
import PlayerSearch from "@/modules/PlayerSearch"
import axios from "axios";
import HumanReadableTime from "@/modules/HumanReadableTime";
import moment from "moment";
import Loading from "@/modules/Loading.vue";
export default {
  // eslint-disable-next-line
  name: "User",
  components: {Loading, HumanReadableTime, PlayerSearch},
  data(){
    return {
      playerToAdd: null,
      token: null,
      baseUrl: null,
      loading: false,
      gameList: []
    }
  },
  created() {
    this.baseUrl = location.origin + "/create_user/";
    this.loading = true;
    axios.get(`${this.$hostname}/get_player_stats`).then(result => {
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
    generateToken(){
      console.log(location);
      console.log(this.playerToAdd);
      if(!this.playerToAdd){
        alert("kein User ausgewählt");
        return;
      }
      axios.get(`${this.$hostname}/get_token?user_id=${this.playerToAdd.user_id}`).then(result => {
        //this.loading = false;
        this.token = result.data;
      });
    },
    getTime(ts) {
      return moment(ts, "DD/MM/YYYY hh:mm:ss").toDate();
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#root-element{
  background: none !important;
  box-shadow: none !important;
  min-height: calc(100% - 50px);
}
#create-game {
  display: flex;
  justify-content: center;
  padding: 5vh;
  align-items: center;
}
#new-game-btn {
  color: $accentColor;
  background: $secondColor;
  border: 1px solid $secondColorDark;
  padding: 8px 12px;
  border-radius: 2px;
  font-size: 1.2em;
}
#new-game-btn:hover{
  color: $accentColorDark;
}
#stats-btn {
  /* background: gold;
  background: linear-gradient(145deg, gold 0%, #edbb23 47%, #fdbb2d 100%);
  text-shadow: 0px 0px 2px goldenrod;
  border: 1px solid gold;
  color: #1f2a34; */
  background: none;
  border: 3px solid gold;
  color: goldenrod;
  box-shadow: 0 1px 6px -3px black;
  transition: all 0.32s cubic-bezier(0.66, 0.13, 0.4, 0.99);
  border-radius: 4px;
  font-size: 1.8em;
  font-weight: bold;
  margin: 6px 12px;
  width: calc(100% - 24px);
}
#stats-btn:hover{
  /*  background: linear-gradient(145deg, #edbb23 0%, gold 47%, #e7aa28 100%); */
  color: gold;
  box-shadow: 0 2px 7px -2px black;
}


#add-player, #history{
  margin: 40px 12px;
  padding: 6px 8px;
  border-radius: 6px;
  box-shadow: 0 0 2px $mainColor;
  background: $background;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
h2{
  text-align: center;
}

#add-player-btn-wrapper{
  display: flex;
}
#add-player-btn-wrapper > button{
  flex: 1;
}

#token-url-wrapper{
  overflow-x: auto;
  margin: 6px 8px;
}
#token-url{
  background: darken($background, 20%);
  border-radius: 2px;
  padding: 4px 6px;
  width: 100%;
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