import Vue from "vue"

const reviewsUrl = "audit-item-reviews"
const reviewAttachmentUrl = "review-attachment"

export const state = () => ({
  reviews: [],
  controlItem: null,
  errors: {},
  isLoadingReviews: false,
  isLoadingSingleReview: false,
  isSubmittingReview: false,

  attachments: [],
  isLoadingAttachments: false,
  isSubmittingAttachment: false
})

export const mutations = {
  setReviews(state, data) {
    state.reviews = data.data
    state.controlItem = data.audit_item
  },
  addReview(state, review) {
    state.reviews.push(review)
  },
  updateReview(state, updatedReview) {
    const index = state.reviews.findIndex((review) => review.id === updatedReview.id)

    if (index !== -1) {
      Vue.set(state.reviews, index, { ...state.reviews[index], ...updatedReview })
    }
  },
  setErrors(state, errors) {
    state.errors = errors
  },
  isloadingReviews(state, value) {
    state.isLoadingReviews = value
  },
  isLoadingAttachments(state, value) {
    state.isLoadingAttachments = value
  },
  isLoadingSingleReview(state, value) {
    state.isLoadingSingleReview = value
  },
  isSubmittingReview(state, value) {
    state.isSubmittingReview = value
  },
  isSubmittingAttachment(state, value) {
    state.isSubmittingAttachment = value
  },
  setAttachments(state, attachments) {
    state.attachments = attachments.map((attachment) => ({
      ...attachment,
      isLoading: false
    }))
  },
  removeAttachment(state, attachmentId) {
    state.attachments = state.attachments.filter((att) => att.id !== attachmentId)
  },
  updateAttachment(state, { attachmentId, attachment }) {
    const index = state.attachments.findIndex((att) => att.id === attachmentId)

    if (index !== -1) {
      // backend having trouble sending updated path url
      Vue.set(state.attachments, index, { ...attachment, path: state.attachments[index].path })
    } else {
      console.warn(`attachment with id (${attachmentId}) not in attachment list`)
    }
  },
  updateAttachmentCount(state, { parentId, amount }) {
    const review = state.reviews.find((review) => review.id === parentId)
    if (review) {
      Vue.set(
        review,
        "review_attachments_count",
        review.review_attachments_count ? review.review_attachments_count + amount : 1
      )
    }
  },
  singleAttachmentIsLoading(state, { id, value }) {
    const index = state.attachments.findIndex((att) => att.id === id)
    if (index !== -1) {
      Vue.set(state.attachments, index, { ...state.attachments[index], isLoading: value })
    }
  }
}

export const actions = {
  async getReviewsByControlId({ commit }, controlId) {
    commit("isloadingReviews", true)
    try {
      const res = await this.$axios.get(`${reviewsUrl}?audit_item_id=${controlId}`)
      commit("setReviews", res.data)
    } catch (error) {
      console.error("Failed to fetch reviews", error)
      commit("setErrors", error.response.data.errors || {})
    } finally {
      commit("isloadingReviews", false)
    }
  },
  async getControlReviewById({ commit }, reviewId) {
    commit("isLoadingSingleReview", true)
    try {
      const res = await this.$axios.get(`${reviewsUrl}/${reviewId}`)
      return res.data.data
    } catch (error) {
    } finally {
      commit("isLoadingSingleReview", false)
    }
  },
  async createControlReview({ commit }, { payload }) {
    commit("isSubmittingReview", true)
    try {
      const res = await this.$axios.post(`${reviewsUrl}`, payload)
      commit("addReview", res.data.data)
    } catch (error) {
    } finally {
      commit("isSubmittingReview", false)
    }
  },
  async updateControlReview({ commit }, { payload, controlReviewId }) {
    commit("isSubmittingReview", true)
    try {
      const res = await this.$axios.put(`${reviewsUrl}/${controlReviewId}`, payload)
      commit("updateReview", res.data.data)
    } catch (error) {
    } finally {
      commit("isSubmittingReview", false)
    }
  },
  async getReviewAttachments({ commit }, reviewId) {
    commit("setAttachments", [])
    commit("isLoadingAttachments", true)

    try {
      const res = await this.$axios.get(`${reviewAttachmentUrl}?audit_item_review_id=${reviewId}`)
      commit("setAttachments", res.data.data)
    } catch (error) {
    } finally {
      commit("isLoadingAttachments", false)
    }
  },
  async createReviewAttachment({ commit }, { payload, parentId }) {
    commit("isSubmittingAttachment", true)
    try {
      const res = await this.$axios.post(`${reviewAttachmentUrl}`, payload)
      commit("updateAttachmentCount", { parentId, amount: 1 })
      return res
    } catch (error) {
      console.error(error)
    } finally {
      commit("isSubmittingAttachment", false)
    }
  },
  async deleteReviewAttachment({ commit }, { parentId, attachmentId }) {
    try {
      const res = await this.$axios.delete(`${reviewAttachmentUrl}/${attachmentId}`)
      commit("removeAttachment", attachmentId)
      commit("updateAttachmentCount", { parentId, amount: -1 })
    } catch (error) {
      console.error(error)
    }
  },
  async updateReviewAttachment({ commit }, { attachmentId, payload }) {
    commit("singleAttachmentIsLoading", { id: attachmentId, value: true })
    try {
      const res = await this.$axios.put(`${reviewAttachmentUrl}/${attachmentId}`, payload)
      commit("updateAttachment", { attachmentId, attachment: res.data.data })
    } catch (error) {
      console.error(error)
    } finally {
      commit("singleAttachmentIsLoading", { id: attachmentId, value: false })
    }
  }
}
