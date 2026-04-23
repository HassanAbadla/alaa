<template>
  <v-btn v-if="show" color="blue darken-1" text @click="$emit('clear')" :disabled="disabled">
    {{ computedButtonText }}
  </v-btn>
</template>

<script>
export default {
  name: "ClearFilterBtn",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String
    }
  },
  computed: {
    computedButtonText() {
      return this.buttonText || this.$t("page.clear_filters")
    }
  }
}
</script>
