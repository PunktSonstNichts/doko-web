<template>
  <div id="loading-screen">
    <div id="animation"></div>
    <div id="text">{{ currentText }}<span>.</span><span>.</span><span>.</span></div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line
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
          "Die Meinung des Kartenprinzen wird eingeholt",
          "Daten werden BASE64 codiert",
          "Wer ist eigentlich dran mit mischen",
          "Wer ist eigentlich dran mit mischen",
          "Wer ist eigentlich dran mit mischen",
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
      currentText: "Gleich geht's los",
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/css/colors.scss";

#loading-screen{
  display: flex;
  flex-direction: column;
  min-height: 420px;
  align-items: center;
  justify-content: space-evenly;
}




#animation {
  width: 180px; /* control the size */
  aspect-ratio: 8/5;
  background:
          conic-gradient($mainColorDark   50%,$secondColor   0) no-repeat,
          conic-gradient($secondColorDark 50%,$accentColorDark 0) no-repeat;
  background-size: 200% 50%;
  animation: back 4s infinite cubic-bezier(0.66, 0.13, 0.4, 0.99);
  border-radius: 12px;
}
@keyframes back {
  0%,
  100%{background-position: 0%   0%,0%   100%}
  25% {background-position: 100% 0%,0%   100%}
  50% {background-position: 100% 0%,100% 100%}
  75% {background-position: 0%   0%,100% 100%}
}





@keyframes blink {
    0% {
        opacity: .2;
    }
    20% {
        opacity: 1;
    }
    100% {
        opacity: .2;
    }
}

#text span {
    animation-name: blink;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
}

#text span:nth-child(2) {
    animation-delay: .2s;
}

#text span:nth-child(3) {
    animation-delay: .4s;
}
</style>