<!-- ConfirmDialog.vue -->
<template>
  <custom-dialog v-model="dialog" :title="title" :width="width">
    <v-card-text v-html="message"></v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" :disabled="disableConfirmButton" :color="confirmButtonColor" text @click="onConfirm">
        {{ confirmBtnText }}
      </v-btn>
      <v-btn v-if="showCancelButton" :color="cancelButtonColor" text @click="onCancel">
        {{ cancelBtnText }}
      </v-btn>
    </v-card-actions>
  </custom-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    value: Boolean,
    title: {
      type: String,
      default() {
        return this.$t("page.confirm")
      }
    },
    message: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: "400px"
    },
    confirmButtonText: {
      type: String
    },
    confirmButtonColor: {
      type: String,
      default: "primary"
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    cancelButtonText: {
      type: String
    },
    cancelButtonColor: {
      type: String,
      default: "grey"
    },
    loading: { type: Boolean, default: false },
    disableConfirmButton: { type: Boolean, default: false }
  },
  computed: {
    confirmBtnText() {
      return this.confirmButtonText || this.$t("page.confirm")
    },
    cancelBtnText() {
      return this.cancelButtonText || this.$t("page.cancel")
    },
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    }
  },
  methods: {
    onConfirm() {
      this.$emit("confirm")
      this.dialog = false
    },
    onCancel() {
      this.$emit("cancel")
      this.dialog = false
    }
  }
}
</script>
