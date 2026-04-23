# SmallText.vue
<template>
  <p class="ma-0 pa-1 text-content" style="line-height: 1.4" v-html="text"></p>
</template>

<script>
export default {
  name: "SmallText",
  props: {
    text: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped>
.text-content {
  /* word-break: break-word; */
}
</style>
