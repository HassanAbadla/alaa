<!-- ContentWrapper.vue -->
<template>
  <div class="content-wrapper d-flex flex-column">
    <h2 v-if="title" class="mb-4">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ContentWrapper",
  props: {
    title: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.content-wrapper {
  padding: 24px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
