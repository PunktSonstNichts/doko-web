<template>
  <div id="root-element">
    <div id="create-game">
      <router-link to="/game" tag="button" id="new-game-btn">Neues Spiel starten!</router-link>
    </div>
    <div id="add-player">
      <h2>Benutzters hinzufügen</h2>
      <PlayerSearch
          autocomplete="off"
          type="text"
          placeholder="Spieler zum Hinzufügen auswählen"
          v-model="playerToAdd"
          :user-has-account="true" />
      <div id="add-player-btn-wrapper">
        <button class="btn" @click="generateToken()">Zugangslink generieren</button>
      </div>
      <div v-if="token" id="token-url-wrapper">
        <span id="token-url">{{`${baseUrl}${token}`}}</span>
      </div>
    </div>
    <div id="history">
      <h2>gespielte Games</h2>
      <div>
        <router-link tag="div" to="/game/24" class="game_overview">
          <div class="game_timestamp">Donnerstag, 12. August 2021</div>
          <div class="second_row">
            <span>Till</span>
            <span class="winner">Malte</span>
            <span>Jannis</span>
            <span>Carl</span>
          </div>
        </router-link>
        <div class="game_overview">
          <div class="game_timestamp">Mittwoch, 11. August 2021</div>
          <div class="second_row">
            <span>Till</span>
            <span>Malte</span>
            <span class="winner">Thibaud</span>
            <span>Alex</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerSearch from "@/modules/PlayerSearch"
import axios from "axios";
export default {
  // eslint-disable-next-line
  name: "User",
  components: {PlayerSearch},
  data(){
    return {
      playerToAdd: null,
      token: null,
      baseUrl: null,
    }
  },
  created() {
    this.baseUrl = location.origin + "/create_user/";
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
#create-game > button {
  padding: 8px 12px;
  font-size: 1.2em;
  font-weight: bold;
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
  height: 1.2em;
}



.game_overview {
  margin: 12px;
  padding: 4px;
  border-radius: 3px;
  border: 1px solid grey;
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
  text-shadow: 0px 0px 2px goldenrod;
  border-radius: 2px;
}
</style>