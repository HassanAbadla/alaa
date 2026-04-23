<template>
  <div>
    <v-text-field
      v-model="displayValue"
      :id="label"
      :label="computedLabel"
      :placeholder="label"
      @input="updateValue"
      @keypress="onKeyPress"
      @paste="onPaste"
      @focus="onFocus"
      @blur="onBlur"
      :rules="getRules()"
      :type="computedType"
      :prepend-inner-icon="computedInnerIcon"
      :append-icon="computedOuterIcon"
      :append-outer-icon="fieldInfoText ? 'mdi-information-outline' : undefined"
      @click:append="togglePasswordVisibility"
      @click:append-outer="openInfoDialog"
      @click="onClick"
      color="primary"
      :outlined="outlined"
      :readonly="readonly"
      :disabled="disabled"
      :dense="true"
      :error-count="errorCount"
      :error-messages="allErrors.concat(languageError ? [languageError] : [])"
      :prefix="prefix"
      :hide-details="hideDetails"
      :class="`custom-text-field pb-2`"
    >
      <template v-slot:error>
        {{ allErrors.length > 0 ? $t(allErrors[0]) : "" }}
      </template>
    </v-text-field>

    <custom-dialog v-model="showInfoDialog" :title="computedInfoLabel" width="400px">
      <div class="" v-html="fieldInfoText"></div>
    </custom-dialog>
  </div>
</template>

<script>
import { formatNumberWithCommas, unformatNumber } from "@/helpers/formatters"

export default {
  name: "CustomInput",
  components: {},
  props: {
    label: {
      type: String,
      default: "",
      required: true
    },
    type: {
      type: String,
      default: "text"
    },
    value: {
      type: [String, Number],
      default: ""
    },
    icon: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => []
    },
    validPassword: {
      type: Boolean,
      default: false
    },
    validPhone: {
      type: Boolean,
      default: false
    },
    nonNegative: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: ""
    },
    allowDecimals: {
      type: Boolean,
      default: true
    },
    isCurrency: {
      type: Boolean,
      default: false
    },
    fieldInfoText: {
      type: String,
      default: ""
    },
    restrictLanguage: {
      type: String,
      default: ""
    },
    dense: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: [Boolean, String],
      default: "auto" // 'auto' hides details when no errors, true/false for always hide/show
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showPassword: false,
      internalErrors: [],
      displayValue: "",
      isInputFocused: false,
      showInfoDialog: false,
      languageError: ""
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (!this.isInputFocused) {
          this.formatDisplayValue(newValue)
        }
      }
    }
  },
  computed: {
    computedInfoLabel() {
      return this.$t("page.info_for", { itemName: this.label })
    },
    computedLabel() {
      return this.required ? `${this.label} *` : this.label
    },
    computedInnerIcon() {
      if (this.icon) {
        return this.icon
      }

      if (this.isCurrency) {
        return "mdi-currency-rial"
      }

      let icon = "mdi-text"

      if (this.type === "password") {
        icon = "mdi-lock"
      }
      if (this.type === "email") {
        icon = "mdi-at"
      }
      if (this.type === "number") {
        icon = "mdi-numeric"
      }

      return icon
    },
    computedOuterIcon() {
      if (this.type === "password") {
        return this.showPassword ? "mdi-eye" : "mdi-eye-off"
      }
      return ""
    },
    allErrors() {
      return [...this.errors, ...this.internalErrors]
    },
    errorCount() {
      if (this.allErrors.length === 0) {
        return 2
      }
      return this.allErrors.length
    },
    computedType() {
      if (this.type) {
        if (this.type === "password") {
          return this.showPassword ? "text" : "password"
        }
        return this.type
      }
      return "text"
    },
    numberRegex() {
      return this.allowDecimals ? /^\d*\.?\d*$/ : /^\d*$/
    }
  },
  methods: {
    openInfoDialog() {
      if (this.fieldInfoText) {
        this.showInfoDialog = true
      }
    },
    formatDisplayValue(value) {
      if (this.isCurrency) {
        this.displayValue = formatNumberWithCommas(value, this.allowDecimals, this.$i18n)
      } else {
        this.displayValue = value
      }
    },
    onFocus() {
      this.isInputFocused = true
      if (this.isCurrency) {
        this.displayValue = unformatNumber(this.displayValue)
      }
      this.clearErrors()
    },
    onBlur() {
      this.isInputFocused = false
      if (this.isCurrency) {
        this.formatDisplayValue(this.displayValue)
      }
    },
    getRules() {
      const rules = []
      const requiredField = (v) => Boolean(v) || this.$t("validation.required")
      const validEmail = (v) => /.+@.+\..+/.test(v) || this.$t("validation.email")
      const validPassword = (v) =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v) || this.$t("validation.password")
      const validPhone = (v) =>
        /^(\+966|0)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{3})[-.\s]?([0-9]{3,4})$/.test(v) || this.$t("validation.phone")

      if (this.required) {
        rules.push(requiredField)
      }
      if (this.type === "email") {
        rules.push(validEmail)
      }
      if (this.type === "password" && this.validPassword) {
        rules.push(validPassword)
      }
      if (this.validPhone) {
        rules.push(validPhone)
      }
      if (this.nonNegative && (this.type === "number" || this.type === "text")) {
        rules.push(this.validateNonNegative)
      }

      return [...rules, ...this.rules]
    },
    validateNonNegative(v) {
      const numValue = parseFloat(unformatNumber(v))
      if (isNaN(numValue) || numValue < 0) {
        return this.$t("validation.non_negative")
      }
      return true
    },
    onKeyPress(event) {
      if (this.type === "number" || this.isCurrency) {
        const charCode = event.charCode || event.keyCode
        const char = String.fromCharCode(charCode)

        if (charCode < 32) return true

        if (
          (!this.numberRegex.test(char) && char !== ".") ||
          (char === "." && !this.allowDecimals) ||
          (char === "." && unformatNumber(this.displayValue).includes("."))
        ) {
          event.preventDefault()
          return false
        }
      }

      if (this.restrictLanguage === "en" && /[^\u0000-\u007F]/.test(event.key)) {
        this.languageError = this.$t("page.only_english_characters")
        event.preventDefault()
        return false
      }

      // Fixed Arabic validation - include space and use proper single character test
      if (this.restrictLanguage === "ar" && !/[\u0600-\u06FF0-9!@#$%^&*(),.?":{}|<>\s]/.test(event.key)) {
        this.languageError = this.$t("page.only_arabic_characters")
        event.preventDefault()
        return false
      }

      this.languageError = ""
      return true
    },
    onPaste(event) {
      if (this.type === "number" || this.isCurrency) {
        const pastedData = (event.clipboardData || window.clipboardData).getData("text")
        if (!this.numberRegex.test(unformatNumber(pastedData))) {
          event.preventDefault()
          return false
        }
      }

      const pastedText = event.clipboardData.getData("text")

      if (this.restrictLanguage === "en" && /[^\u0000-\u007F]/.test(pastedText)) {
        this.languageError = "Only English characters are allowed."
        event.preventDefault()
        return false
      }

      // Fixed Arabic validation - include spaces and use proper regex for full text
      if (this.restrictLanguage === "ar" && !/^[\u0600-\u06FF0-9!@#$%^&*(),.?":{}|<>\s]*$/.test(pastedText)) {
        this.languageError = "Only Arabic characters are allowed."
        event.preventDefault()
        return false
      }

      this.languageError = ""
      return true
    },
    updateValue(value) {
      if (this.isCurrency || this.type === "number") {
        const unformattedValue = unformatNumber(value)
        let sanitizedValue = unformattedValue.replace(this.allowDecimals ? /[^\d.]/g : /[^\d]/g, "")

        if (this.allowDecimals) {
          const parts = sanitizedValue.split(".")
          if (parts.length > 2) {
            sanitizedValue = parts[0] + "." + parts.slice(1).join("")
          }
        }

        this.$emit("input", sanitizedValue)
        this.validateInput(sanitizedValue)
      } else {
        this.$emit("input", value)
        this.validateInput(value)
      }
    },
    validateInput(value) {
      this.internalErrors = []
      if (this.nonNegative && (this.type === "number" || this.type === "text")) {
        const numValue = parseFloat(unformatNumber(value))
        if (!isNaN(numValue) && numValue < 0) {
          this.internalErrors.push(this.$t("validation.non_negative"))
        }
      }
      this.$emit("update:errors", this.allErrors)
    },
    clearErrors() {
      this.$emit("clear-errors")
      this.internalErrors = []
    },
    togglePasswordVisibility() {
      if (this.type === "password") {
        this.showPassword = !this.showPassword
      }
    }
  }
}
</script>

<style scoped>
.v-text-field .v-input__control {
  color: rgb(107, 107, 107) !important;
}
.theme--light.v-input {
  color: rgb(122, 122, 122) !important;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 0;
}
.custom-text-field {
  margin-bottom: 0;
}
</style>
