<template>
  <div>
    <div v-if="!loading">
      <slot />
    </div>
    <div v-else><p>loading spinner</p></div>
  </div>
</template>
<!-- TODO test this loading wrapper at somepoint -->
<script>
export default {
  name: "PageWrapper",
  props: {
    loading: { type: Boolean }
  }
}
</script>

<style></style>
