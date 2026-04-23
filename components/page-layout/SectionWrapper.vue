<!-- SectionWrapper.vue -->
<template>
  <div class="section-wrapper" style="width: 300px">
    <h2 v-if="title" class="mb-4 pb-1 text-subtitle-1 font-weight-bold">
      {{ computedTitle }}
    </h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "SectionWrapper",
  props: {
    title: {
      type: String,
      default: null
    }
  },
  computed: {
    computedTitle() {
      if (!this.title) {
        return ""
      }

      const titleWithSpace = this.title + " "
      const underscoreCount = 41 - titleWithSpace.length
      const underscores = "_".repeat(Math.max(0, underscoreCount))

      return titleWithSpace + underscores
    }
  }
}
</script>

<style scoped>
.section-wrapper {
  width: 100%;
}
</style>
