<template>
  <div>
    <p class="font-weight-bold mb-0">{{ label }}:</p>
    <span v-html="description" class="body-1 font-italic pb-4"></span>
  </div>
</template>

<script>
export default {
  name: "LabeledDescription",
  props: {
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    }
  }
}
</script>
