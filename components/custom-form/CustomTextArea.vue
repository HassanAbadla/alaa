<template>
  <v-textarea
    :class="`pb-2`"
    v-model="modelValue"
    :id="label"
    :label="computedLabel"
    :placeholder="label"
    @input="updateValue"
    @focus="clearErrors"
    :rules="rules"
    color="primary"
    dense
    outlined
    :disabled="disabled"
    :error-count="errorCount"
    :error-messages="errors"
    :hide-details="hideDetails"
    :rows="3"
    auto-grow
    :no-resize="true"
  />
</template>

<script>
export default {
  name: "CustomTextArea",
  props: {
    label: {
      type: String,
      default: "",
      required: true
    },
    value: {
      type: [String, Number],
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    },
    hideDetails: {
      type: [Boolean, String],
      default: "auto" // 'auto' hides details when no errors, true/false for always hide/show
    }
  },
  computed: {
    computedLabel() {
      return this.required ? `${this.label} *` : this.label
    },
    modelValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit("input", newValue)
      }
    },
    rules() {
      const rules = []
      const requiredField = (v) => Boolean(v) || this.$t("validation.required")

      if (this.required) {
        rules.push(requiredField)
      }

      return rules
    },
    errorCount() {
      if (this.errors.length === 0) {
        return 2
      }
      return this.errors.length
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("input", event)
    },
    clearErrors() {
      this.$emit("clear-errors")
    }
  }
}
</script>

<style scoped>
/* Optional: Additional styling for precise height control */
.v-textarea >>> .v-input__control .v-input__slot {
  min-height: 140px !important; /*(roughly 3 times the height of CustomInput) Adjust this value as needed */
}
</style>
