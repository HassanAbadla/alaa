<template>
  <div>
    <v-autocomplete
      v-model="modelValue"
      :items="items"
      :label="computedLabel"
      :rules="rules"
      :item-text="itemText"
      :item-value="itemValue"
      :error-messages="errors"
      @change="updateValue"
      @focus="clearErrors"
      :disabled="disabled"
      :loading="loading"
      dense
      :hide-details="hideDetails"
      :required="required"
      :outlined="outlined"
      :clearable="clearable"
      :append-outer-icon="getAppendIcon"
      @click:append-outer="handleAppendClick"
      :class="`pb-2`"
    />

    <custom-dialog v-model="showInfoDialog" :title="computedInfoLabel" width="400px">
      <div class="" v-html="fieldInfoText"></div>
    </custom-dialog>
  </div>
</template>

<script>
export default {
  name: "CustomDropdown",
  components: {},
  props: {
    items: {
      type: Array,
      required: true
    },
    errors: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: "",
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      default: ""
    },
    itemText: {
      type: String,
      default: "text"
    },
    itemValue: {
      type: String,
      default: "value"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
    },
    fieldInfoText: {
      type: String,
      default: ""
    },
    addButton: {
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
      showInfoDialog: false
    }
  },
  computed: {
    computedLabel() {
      return this.required ? `${this.label} *` : this.label
    },
    computedInfoLabel() {
      return this.$t("page.info_for", { itemName: this.label })
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
      const requiredValidation = (v) => Boolean(v) || this.$t("validation.required")
      if (this.required) {
        rules.push(requiredValidation)
      }
      return rules
    },
    getAppendIcon() {
      if (this.addButton) return "mdi-plus"
      if (this.fieldInfoText) return "mdi-information-outline"
      return undefined
    }
  },
  methods: {
    openInfoDialog() {
      if (this.fieldInfoText) {
        this.showInfoDialog = true
      }
    },
    updateValue(event) {
      this.$emit("input", event)
    },
    clearErrors() {
      this.$emit("clear-errors")
    },
    handleAppendClick() {
      if (this.addButton) {
        this.$emit("add-button-click")
      } else if (this.fieldInfoText) {
        this.openInfoDialog()
      }
    }
  }
}
</script>
