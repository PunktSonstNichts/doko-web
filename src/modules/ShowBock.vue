<template>
  <span>
    <span v-for="index in bockCount" :key="index">B</span>
  </span>
</template>

<script>
export default {
  name: "ShowBock",
  props: {
    bockCount: {
      type: Number,
      default: null,
    },
  }
}
</script>

<style scoped>

</style>