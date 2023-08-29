<template>
  <div id="input-wrapper">
    <input type="number" id="punkte-ohne-bock" :class="{'wide-input': bockCount === 0}" v-model="punkteOhneBock" @input="calculateBockPunkte()"/>
    <ShowBock :bock-count="bockCount" v-if="bockCount > 0" id="bock-count"/>
    <input v-if="bockCount > 0" type="number" id="punkte-mit-bock" :value="punkteMitBock" :disabled="true"/>
  </div>
</template>

<script>
import ShowBock from "@/modules/ShowBock";
export default {
  name: "PunkteEingabe",
  components: {ShowBock},
  props: {
    bockCount: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: null
    }
  },
  data(){
    return {
      punkteOhneBock: this.value,
      punkteMitBock: null
    }
  },
    created() {
      console.log("this.value", this.value);
      console.log(this.punkteOhneBock);
    },
    methods: {
    calculateBockPunkte(){
      this.punkteMitBock = this.punkteOhneBock * Math.pow(2 , this.bockCount);
      this.$emit("input", this.punkteMitBock);
    }
  }
}
</script>

<style scoped>
#input-wrapper{
  display: flex;
  align-items: center;
}
input{
  width: 42px;
}
.wide-input{
  width: 68px;
}
#bock-count{
  margin: 2px 4px;
}
</style>