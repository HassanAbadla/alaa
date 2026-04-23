<template>
  <v-container fluid class="pa-4">
    <h1 class="text-h5 font-weight-medium px-4">{{ title }}</h1>

    <div class="pa-4">
      <!-- Loading state -->
      <div v-if="loading" class="d-flex justify-center align-center my-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <!-- Error state -->
      <error-message
        v-else-if="error"
        :title="errorTitle"
        :message="defaultErrorMessage"
        :has-retry-action="hasRetryAction"
        :button-text="retryButtonText"
        @retry="$emit('retry')"
      />

      <!-- Content -->
      <slot v-else></slot>
    </div>
  </v-container>
</template>

<script>
import ErrorMessage from "@/components/common/ErrorMessage.vue"

export default {
  name: "PageWrapper",
  components: {
    ErrorMessage
  },
  props: {
    title: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: [Boolean, Object, String],
      default: null
    },
    errorTitle: {
      type: String
    },
    errorMessage: {
      type: String
    },
    hasRetryAction: {
      type: Boolean,
      default: true
    },
    retryButtonText: {
      type: String,
      default: "Try Again"
    }
  },
  computed: {
    defaultErrorMessage() {
      return this.errorMessage || this.$t("error.unable_to_load_data")
    }
  }
}
</script>
