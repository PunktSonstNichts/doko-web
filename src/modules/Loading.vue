<template>
  <div id="loading-screen">
    <div id="animation">hier passiert ne animation</div>
    <div id="text">{{ currentText }}...</div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  // todo get Player names as prop in order to include their name to the textes as well
  created() {
    setInterval(() => {
      this.currentText = this.textes[Math.floor(Math.random() * this.textes.length)];
    }, 2930);
  },
  data() {
    return {
      textes: [
          "Die Meinung der Kartengöttin wird eingeholt",
          "Daten werden BASE64 codiert",
          "Daten werden BASE64 codiert",
          "Wer ist eigentlich dran mit mischen",
          "Daten werden gesammelt",
          "Daten werden gesammelt",
          "Daten werden gesammelt",
          "Daten werden gesammelt",
          "Daten werden gesendet",
          "Daten werden gesendet",
          "Daten werden empfangen",
          "Daten werden nochmal gesendet",
      ],
      currentText: "Die Meinung der Kartengöttin wird eingeholt",
    }
  }
}
</script>

<style scoped>
#loading-screen{
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-evenly;
}
</style>