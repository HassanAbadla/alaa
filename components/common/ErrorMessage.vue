<!-- components/common/ErrorMessage.vue -->
<template>
  <div class="d-flex flex-column justify-center align-center my-8">
    <v-icon large :color="iconColor" class="mb-4">{{ icon }}</v-icon>
    <div class="text-h6 text-center">{{ defaultTitle }}</div>
    <div class="text-subtitle-1 text-center grey--text">
      {{ message }}
    </div>
    <v-btn v-if="hasRetryAction" :color="buttonColor" class="mt-4" @click="$emit('retry')">
      {{ $t("page.try_again") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: {
    title: {
      type: String
    },
    message: {
      type: String,
      default: "Unable to load data. Please try again later."
    },
    icon: {
      type: String,
      default: "mdi-alert-circle"
    },
    iconColor: {
      type: String,
      default: "error"
    },
    hasRetryAction: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String
    },
    buttonColor: {
      type: String,
      default: "primary"
    }
  },
  computed: {
    defaultTitle() {
      return this.title || this.$t("error.wrong")
    }
  }
}
</script>
