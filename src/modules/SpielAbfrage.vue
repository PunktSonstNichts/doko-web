<template>
<div id="abfrage">
  <div id="title-wrapper">
    <span>{{ereignis}}</span>
  </div>
  <div id="player-wrapper">
    <div v-for="player in players"
         :key="player.id"
         :class="['player-selection', player.aussetzen ? 'player-disabled' : '']"
         @click="progressSelection(player)">
        {{player.name}}
    </div>
  </div>
  <div id="abort" @click="progressSelection(null)">
    Keiner hatte {{ereignis}} (weiter)
  </div>
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
    }
  },
  methods: {
    progressSelection(player){
        if(player == null){
          this.$emit("eingabe", null);
        } else {
          if(!player.aussetzen){
            this.$emit("eingabe", player.id);
          }
        }
    }
  }
}
</script>

<style scoped>
#abfrage{
  display: flex;
  flex-direction: column;
}
#title-wrapper{
  height: 20vmax;
  width: 20vmax;;
  margin: 16px auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #42b983;
  box-shadow: inset 0 0 12px #1f2a34;
  background: #42b983;
  font-weight: bold;
  font-size: 1.4em;
}
#player-wrapper{
  display: flex;

  border-top: 1px solid #1f2a34;
  border-bottom: 1px solid #1f2a34;
}
.player-selection{
  flex: 1;
  font-size: 1.2em;
  text-align: center;
  padding: 4px 6px;
  border-left: 1px solid #2c3e50;
}
.player-selection.selected-player{
  background: #2c3e50;
  color: white;
}
#abort{
  text-align: center;
  padding: 6px;
}
</style>