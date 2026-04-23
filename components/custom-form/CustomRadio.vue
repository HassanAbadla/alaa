<template>
  <v-radio :label="label" :value="value" color="primary" />
</template>

<script>
export default {
  name: "CustomRadio",
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number, Boolean],
      default: ""
    }
  },
  computed: {
    modelValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit("input", newValue)
      }
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("input", event)
    }
  }
}
</script>
