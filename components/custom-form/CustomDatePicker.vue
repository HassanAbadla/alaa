<template>
  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :class="`pb-2`"
        :value="displayValue"
        :label="computedLabel"
        readonly
        v-bind="attrs"
        v-on="on"
        :error-messages="errorMessages"
        :rules="validationRules"
        outlined
        dense
        clearable
        @click:clear="clearDate"
        :disabled="disabled"
        :required="required"
        :hide-details="hideDetails"
      ></v-text-field>
    </template>
    <v-date-picker v-model="pickerDate" no-title @input="updateValue"></v-date-picker>
  </v-menu>
</template>

<script>
import { formatPMISDate, formatPMWEBDateForPicker, convertToPMWEBFormat } from "@/helpers/date-helpers"

export default {
  name: "CustomDatePicker",
  props: {
    value: {
      type: [String, Date],
      default: null
    },
    label: {
      type: String,
      default: "Date"
    },
    errorMessages: {
      type: [String, Array],
      default: ""
    },
    isPMWEB: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: [Boolean, String],
      default: "auto" // 'auto' hides details when no errors, true/false for always hide/show
    }
  },
  data() {
    return {
      menu: false,
      pickerDate: null
    }
  },
  computed: {
    computedLabel() {
      return this.required ? `${this.label} *` : this.label
    },
    displayValue() {
      if (!this.value) return ""

      if (this.isPMWEB) {
        // Format PMWEB date for display (DD/MM/YYYY)
        return formatPMISDate(this.value)
      } else {
        // Format regular date for display
        const date = new Date(this.value)
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
      }
    },
    // Add validation rules
    validationRules() {
      const rules = []

      if (this.required) {
        // Check the actual value prop, not the displayed formatted value
        rules.push(() => !!this.value || (this.$t ? this.$t("validation.required") : "This field is required"))
      }

      return rules
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          this.pickerDate = null
          return
        }

        if (this.isPMWEB) {
          // Convert PMWEB date to picker format (YYYY-MM-DD)
          this.pickerDate = formatPMWEBDateForPicker(newVal)
        } else {
          // Convert regular date to picker format
          const date = new Date(newVal)
          if (!isNaN(date.getTime())) {
            this.pickerDate = date.toISOString().split("T")[0]
          }
        }
      }
    }
  },
  methods: {
    updateValue(date) {
      this.menu = false

      if (this.isPMWEB) {
        // Convert picked date to PMWEB format
        this.$emit("input", convertToPMWEBFormat(date))
      } else {
        // Emit the selected date in the original format
        this.$emit("input", date)
      }
    },
    clearDate() {
      this.pickerDate = null
      this.$emit("input", null)
    }
  }
}
</script>

<style scoped></style>
