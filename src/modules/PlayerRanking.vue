<template>
  <div id="main">
      <div id="top-three">
      <div class="rank" id="rank-silver">
          <div
                  v-for="player in spieler.filter(i => i.position === 2)"
                  :key="'spieler'+ player.id"
                  class="rank-player-name"
          >
              {{ player.name }}
          </div>
          <div class="rank-bar">
              <span>2.</span>
          </div>
      </div>
      <div class="rank" id="rank-gold">
          <div
                  v-for="player in spieler.filter(i => i.position === 1)"
                  :key="'spieler'+ player.id"
                  class="rank-player-name"
          >
              {{ player.name }}
          </div>
          <div class="rank-bar">
              <span>1.</span>
          </div>
      </div>
      <div class="rank" id="rank-bronze">
          <div
                  v-for="player in spieler.filter(i => i.position === 3)"
                  :key="'spieler'+ player.id"
                  class="rank-player-name"
          >
              {{ player.name }}
          </div>
          <div class="rank-bar">
              <span>3.</span>
          </div>
      </div>
      </div>
      <div id="last-ranks-box">
          <div
              v-for="player in spieler.filter(i => i.position === 4)"
              :key="'spieler'+ player.id"
              class="last-ranks"
          >
              <span>4.</span>
              <span class="player-name">{{ player.name }}</span>
          </div>
          <div
              v-for="player in spieler.filter(i => i.position === 5)"
              :key="'spieler'+ player.id"
              class="last-ranks"
          >
              <span>5.</span>
              <span class="player-name">{{ player.name }}</span>
          </div>
      </div>
      <!-- <div
              v-for="player in spieler"
              :key="'spieler'+ player.id"
              :class="{
                  'winner': player.position === 1,
                  'second': player.position === 2,
                  'third' : player.position === 3
              }">
          {{ player.name }}
      </div> -->
  </div>
</template>

<script>
export default {
    name: "PlayerRanking.vue",
    props: {  spieler: {
            type: Array,
            default: () => {
                [];
            }
        }}
}
</script>

<style scoped>
#top-three{
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
}
#top-three > * {
    flex: 1;
    text-align: center;
}
.rank-player-name{
    margin-bottom: 2px;
    text-shadow: 1px 1px 0 black;
}
.rank-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-shadow: 1px 1px 4px black;
}
#rank-gold > .rank-bar {
    background: rgb(222,220,27);
    background: linear-gradient(145deg, rgba(222,220,27,1) 0%, rgba(237,187,35,1) 47%, rgba(253,187,45,1) 100%);
    box-shadow: 0 1px 12px -4px black;
    font-size: 1.4em;
    height: 82px;
    border-radius: 4px 4px 0 0;
}
#rank-silver > .rank-bar{
    background: silver;
    background: linear-gradient(145deg, silver 0%, cornsilk 100%);
    box-shadow: 0 1px 12px -6px black;
    padding-top: 4px;
    height: 60px;
    border-radius: 8px 0 0 0;
}
#rank-bronze > .rank-bar{
    background: saddlebrown;
    box-shadow: 0 1px 12px -8px black;
    height: 42px;
    border-radius: 0 8px 0 0;
}
</style>