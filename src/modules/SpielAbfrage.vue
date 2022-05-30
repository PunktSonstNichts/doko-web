<template>
<div id="abfrage">
  <div id="title-wrapper">
    <img  id="icon" :src="getImgUrl(ereignis)"/>
    <span id="title">{{ereignis}}</span>
    <span id="subtext">
      Wer hatte {{ereignis}}?
    </span>
  </div>
  <div id="player-wrapper">
    <button v-for="player in players"
         :key="player.id"
         :class="{'player-selection': true, 'player-disabled': !!player.disabled, 'selected-player': playerId === player.id}"
         @click="progressSelection(player)">
        {{player.name}}
    </button>
  </div>
  <button id="abort" @click="progressSelection(null)">
    Niemand hatte {{ereignis}} (zurück)
  </button>
</div>
</template>

<script>
export default {
  name: "SpielAbfrage",
  props: {
    players: {
      type: Array,
      default: function () {
        return [];
      }
    },
    // ereignis can be Hochzeit, Armut or Schweine
    ereignis: {
      type: String,
    },
    playerId: {
      type: Number,
    }
  },
  created() {
    // disable Hochzeit or Armut entry for Kontra-Pertei members
    if(this.ereignis === "Hochzeit" || this.ereignis === "Armut"){
      this.players.forEach(player => {
        console.log(this.playerId, player.id, this.playerId === player.id);
        if(player.partei !== "Re"){
          player.disabled = true;
        }
      });
    }else{
      this.players.forEach(player => {
        player.disabled = false
      });
    }
  },
  methods: {
    progressSelection(player){
        if(player == null){
          this.$emit("eingabe", null);
        } else {
          if(!player.disabled){
            this.$emit("eingabe", player.id);
          }
        }
    },
    getImgUrl(ereignis) {
      var images = require.context('../assets/', false, /\.png$/)
      return images('./' + ereignis + "_Icon.png")
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/colors.scss";

#abfrage{
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 50px);
}
#title-wrapper{
  margin: 16px auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

#icon{
  width: 256px;
  height: 256px;
}
#title{
  font-weight: bold;
  font-size: 1.6em;
  color: $secondColorDark;
}
#subtext{
  color: $secondColor;
}

#player-wrapper{
  margin: 12px 16px;
  display: flex;
  border-top: 1px solid $secondColorDark;
  border-bottom: 1px solid $secondColorDark;
}
.player-selection{
  flex: 1;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  padding: 1em 12px;
  border-left: 1px solid $secondColor;
}
.player-selection:last-of-type{
  border-right: 1px solid $secondColor;
}
.player-selection.selected-player{
  background: $secondColor;
  color: $secondColorText;
}
.player-selection.player-disabled{
  text-decoration: line-through;
}
#abort{
  margin: 12px 16px;
  padding: 12px 14px;
  text-align: center;
  font-size: 1.2em;
  color: $secondColor;
  border-radius: 2px;
  border: 1px solid $secondColorDark;
}
</style>