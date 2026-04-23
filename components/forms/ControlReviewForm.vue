<template>
  <v-layout column>
    <form-wrapper
      v-if="!error && !loading"
      :title="title"
      @submit="submitControlReview"
      :loading="isSubmittingReview || isLoadingSingleReview"
    >
      <custom-input
        :label="$t('form.content')"
        v-model="fields.content"
        :required="true"
        :errors="errors.content"
        @clear-errors="clearError('content')"
      />
      <custom-text-area
        v-model="fields.description"
        :label="$t('form.description')"
        required
        :errors="errors.description"
        @focus="clearError('description')"
      />
      <custom-dropdown
        :items="reviewStatuses"
        item-value="id"
        item-text="name"
        :label="$t('form.status')"
        :required="true"
        v-model="fields.review_status_id"
        :errors="errors.review_status_id"
        @clear-errors="clearError('review_status_id')"
        :loading="loadingReviewStatuses"
      />
    </form-wrapper>

    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex"

import { generateErrorMessage } from "@/helpers/error-helpers"
import { getControlReviewStasuses } from "../../api/audit-api"

export default {
  name: "ControlReviewForm",
  props: { editForm: { type: Boolean, default: false }, itemId: { type: Number } },
  data() {
    return {
      valid: false,
      fields: {
        content: "",
        description: "",
        review_status_id: ""
      },
      reviewStatuses: [],
      errors: {},
      error: null,
      loadingReviewStatuses: false
    }
  },
  methods: {
    ...mapActions("controlReviews", ["createControlReview", "updateControlReview", "getControlReviewById"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async submitControlReview() {
      this.errors = {}
      const payload = {
        ...this.fields,
        audit_item_id: this.$route.params.control_id
      }

      const controlReviewId = this.itemId
      try {
        const apiToCall = this.editForm ? this.updateControlReview : this.createControlReview
        await apiToCall({ payload, controlReviewId })
        this.closeDrawer()
      } catch (error) {}
    },
    async getControlReview() {
      if (this.editForm) {
        const controlReviewId = this.itemId
        await this.getControlReviewById(controlReviewId)
          .then((data) => {
            this.fields = {
              content: data.content,
              description: data.description,
              review_status_id: data.review_status_id
            }
          })
          .catch((err) => {
            this.error = generateErrorMessage(err, this.$i18n)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    fetchReviewStatuses() {
      this.loadingReviewStatuses = true

      getControlReviewStasuses(this.$axios)
        .then((res) => {
          this.reviewStatuses = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching review statuses:", error)
        })
        .finally(() => {
          this.loadingReviewStatuses = false
        })
    },
    clearError(field) {
      this.errors[field] = []
    }
  },
  computed: {
    ...mapState("controlReviews", ["isSubmittingReview", "isLoadingSingleReview", "errors"]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.review")}`
    }
  },
  mounted() {
    this.fetchReviewStatuses()
    if (this.editForm) {
      this.getControlReview()
    }
  }
}
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
