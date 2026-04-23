<!-- FieldWrapper.vue -->
<template>
  <div class="field-wrapper">
    <div class="field-label text-caption text-secondary" v-if="label">{{ label }}</div>
    <div class="input-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FieldWrapper",
  props: {
    label: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.field-wrapper {
  width: 100%;
  margin-top: 4px;
}
.field-label {
  font-size: 12px;
  margin-bottom: 2px;
  min-height: 16px;
  line-height: 1;
}
</style>
