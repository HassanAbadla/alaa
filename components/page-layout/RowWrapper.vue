<!-- RowWrapper.vue -->
<template>
  <div class="row-wrapper d-flex">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "RowWrapper"
}
</script>

<style scoped>
.row-wrapper {
  display: flex;
  width: 100%;
  align-items: flex-start;
  margin-top: 4px;
}
.row-wrapper > * {
  margin-right: 8px;
  flex: 1;
}
.row-wrapper > *:last-child {
  margin-right: 0;
}
</style>
