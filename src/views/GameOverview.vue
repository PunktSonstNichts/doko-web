<template>
  <div>
    <h1>Übersicht über Spiel #{{ gameID }}</h1>
    <loading v-if="loading"></loading>
    <div v-else>

    </div>
  </div>
</template>

<script>
import Loading from "@/modules/Loading";

export default {
  name: "GameOverview",
  components: {Loading},
  computed: {
    gameID () {
      return this.$route.params.id
    }
  },
}
</script>

<style scoped>

</style>