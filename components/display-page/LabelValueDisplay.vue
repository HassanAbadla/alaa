<template>
  <p>
    <strong>{{ label }}:</strong>
    {{ computedValue }}
  </p>
</template>

<script>
export default {
  name: "LabelValueDisplay",
  props: {
    label: {
      type: String,
      required: true
    },
    // skipcq: JS-0683
    value: {
      required: true
    }
  },
  computed: {
    computedValue() {
      if (this.value === null || this.value === undefined || this.value === "") {
        return "N/A"
      }
      return this.value
    }
  }
}
</script>
