<template>
  <div id="root-element">
    <div id="welcome-box">
        <h1>Hallo {{user_info.name}}</h1>
        <p id="welcome_text">Was möchtest du machen?</p>
    </div>


    <div id="add-player">
      <h2 style="margin: calc(0.83em - 4px) 0 4px 0;">Benutzers einladen</h2>
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



    <router-link to="/stats" tag="button" id="stats-btn">
        <PlayerHistoryUI :pointHistory="user_info.lastTwentyPoints"/>
        Statistik
    </router-link>



    <router-link to="/game" tag="button" id="new-game-btn">Neues Spiel starten!</router-link>

    <router-link to="/history" tag="button" id="history-btn">
      <router-link v-for="game in gameList" :key="'spiel'+ game._id" tag="div" :to="'/game/' + game._id" :class="['game_overview', !game.gesperrt || 'locked']">
        <HumanReadableTime
            class="game_timestamp"
            :time="getTime(game.timestamp)"
        />
        <div class="second_row">
          <span v-for="player in game.spieler" :key="'spieler'+ player.id" :class="{'winner': player.position === 1}">{{ player.name }}</span>
        </div>
      </router-link>
      <span id="history-btn-text">gespielte Games</span>
    </router-link>
  </div>
</template>

<script>
import PlayerSearch from "@/modules/PlayerSearch"
import axios from "axios";
import moment from "moment";
import PlayerHistoryUI from "@/views/PlayerHistoryUI.vue";
import HumanReadableTime from "@/modules/HumanReadableTime.vue";

export default {
  // eslint-disable-next-line
  name: "User",
  components: {HumanReadableTime, PlayerHistoryUI, PlayerSearch},
  data(){
    return {
      playerToAdd: null,
      token: null,
      baseUrl: null,
      loading: false,
      gameList: [],
      user_info: {
          name: "admin",
          lastTwentyPoints: Array.from({length: 20}, () => Math.floor(Math.random() * 200 - 100))
      }
    }
  },
  created() {
    this.baseUrl = location.origin + "/create_user/";
    this.loading = true;
    axios.get(`${this.$hostname}/get_player_history`).then(result => {
      console.log("get_player_history", result.data);
      this.gameList = result.data.filter((game) => !game.gesperrt).sort(
          (objA, objB) => Number(this.getTime(objB.timestamp)) - Number(this.getTime(objA.timestamp)),
      );
      console.info(result);
    }).finally(() => {
      this.loading = false;
    });

    axios.get(`${this.$hostname}/get_player_info`).then(result => {
      console.log("get_player_info", result.data);
      this.user_info.name = result.data.name;
      this.user_info.lastTwentyPoints = result.data.historie;
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
#welcome-box{
  margin: 7px;
}
#welcome_text{
  text-align: center;
}
#new-game-btn, #stats-btn, #add-player, #history-btn{
  width: calc(100% - 16px);
  margin: 8px;
  aspect-ratio: 8 / 4;
}
@media (min-width:641px) and (max-width: 960px){
  #root-element {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(3, 1fr);
    align-items: stretch;
  }
  #welcome-box{
    grid-column: 1 / 3;
    grid-row: 1 / 1;
  }
  #add-player{
    grid-column: 1 / 3;
    grid-row: 2 / 2;
  }
  #history{
    grid-column: 1 / 3;
    grid-row: 4 / 4;
  }
}
@media (min-width:961px) and (max-width: 1280px){
  #root-element{
    display: grid;
    grid-template-columns: repeat(3, 33.333%);
    grid-template-rows: repeat(4, 1fr);
    gap: 0 0;
    grid-template-areas:
    "welcome-box welcome-box welcome-box"
    "add-player add-player ."
    "add-player add-player ."
    ". . .";
    width: calc(100% - 84px) !important;
    margin: 0 42px !important;
  }

  #welcome-box{
    grid-area: welcome-box;
  }
  #add-player{
    grid-area: add-player;
  }
  #stats-btn{
    grid-column: 3/3;
    grid-row: 3/3;
  }
  #new-game-btn{
    grid-column: 3/3;
    grid-row: 2/2;
  }
  #history-btn {
    grid-column: 1 / 4;
    grid-row: 4 / 4;
  }
}
@media (min-width:1281px) {
  #root-element{
    display: grid;
    grid-template-columns: repeat(3, 33.333%);
    grid-template-rows: repeat(3, 1fr);
    gap: 0 0;
    align-items: stretch;
  }

  #welcome-box{
    grid-column: 1 / 4;
    grid-row: 1 / 1;
  }
  #history {
    grid-column: 1 / 4;
    grid-row: 3 / 3;
  }
}

#new-game-btn, #history {
  color: $accentColor;
  background: $secondColor;
  border: 1px solid $secondColorDark;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 1.8em;
  font-weight: bold;
}
#new-game-btn:hover{
  color: $accentColorDark;
}
#history-btn{
  border-radius: 6px;
  background: $oneMoreColor;
  color: $mainColorDark;
}
#history-btn:hover{
  color: $mainColor;
}
#stats-btn {
  background: gold;
  background: linear-gradient(145deg, gold 0%, #edbb23 47%, #fdbb2d 100%);
  text-shadow: 0 0 2px goldenrod;
  border: 1px solid gold;
  color: $secondColorDark;
  box-shadow: 0 1px 6px -3px black;
  transition: all 0.32s cubic-bezier(0.66, 0.13, 0.4, 0.99);
  border-radius: 6px;
  font-size: 1.8em;
  font-weight: bold;
}
#stats-btn:hover{
  background: linear-gradient(145deg, #edbb23 0%, gold 47%, #e7aa28 100%);
  color: $secondColorDark;
  box-shadow: 0 2px 7px -2px $secondColorDark;
}


#add-player{
  padding: 6px 8px;
  border-radius: 6px;
  box-shadow: 0 0 2px $mainColor;
  background: $background;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
}
h2{
  text-align: center;
}
#history{
  margin: 7px;
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
/* TODO ab jetzt Duplikat aus PlayerHistory -> Muss in eine Komponente */
.game_overview {
  margin: 12px;
  padding: 4px;
  border-radius: 3px;
  border: 1px solid $secondColor;
  background: $secondColorText;
  color: $secondColorDark;
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
/* TODO bis hierin Duplikat aus PlayerHistory */
#history-btn-text {
  font-size: 1.8em;
  font-weight: bold;
}
</style>