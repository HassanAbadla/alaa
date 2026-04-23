<template>
  <v-checkbox
    v-model="internalValue"
    :label="label"
    color="primary"
    dense
    hide-details
    class="my-2 py-0"
    :disabled="disabled"
  />
</template>

<script>
export default {
  name: "CustomCheckbox",
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      internalValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.internalValue = newValue
    },
    internalValue(newValue) {
      this.$emit("input", newValue)
    }
  }
}
</script>
