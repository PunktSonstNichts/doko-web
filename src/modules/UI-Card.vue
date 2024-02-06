<template>
  <div id="card-body">

  </div>

</template>

<script>
export default {
    name: "UI-Card",
    props: {
        title: {
            type: String,
            default: ""
        },
        dateOnly: {
            type: Boolean,
            default: false
        }
    },

}
</script>

<style scoped>

</style>