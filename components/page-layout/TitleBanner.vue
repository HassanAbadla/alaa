<template>
  <!-- Styled title matching CustomTable -->
  <div class="d-flex align-center justify-space-between primary white--text rounded-lg pa-3 mb-2">
    <div class="title white--text">{{ title }}</div>
    <div class="d-flex align-center">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleBanner",
  props: {
    title: { type: String, default: "" }
  }
}
</script>

<style></style>
