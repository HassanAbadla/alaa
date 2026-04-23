export function getAllAudits($axios) {
  return $axios.get("audit-contracts")
}
export function addRound(payload, $axios) {
  return $axios.post("audit", payload)
}
export function closeRound(roundId, $axios) {
  return $axios.post(`audit/${roundId}/close`)
}

export function getAuditItems(auditId, $axios, filters = {}) {
  const params = new URLSearchParams()

  if (filters.audit_status_id) {
    params.append("audit_status_id", filters.audit_status_id)
  }

  if (filters.user_ids && Array.isArray(filters.user_ids) && filters.user_ids.length > 0) {
    filters.user_ids.forEach((id) => params.append("user_ids[]", id))
  }

  if (filters.closeStatus && filters.closeStatus !== "all") {
    params.append("status", filters.closeStatus === "closed" ? "closed" : "opened")
  }

  return $axios.get(`audit/${auditId}?${params}`)
}

export function getAuditContractsChart($axios) {
  return $axios.get("audit-contracts-chart")
}
export function getSubscriptionChart($axios) {
  return $axios.get("subscription-chart")
}

export function auditRoundReviewersChart(auditRoundId, $axios) {
  return $axios.get(`audit/${auditRoundId}/chart/users`)
}
export function auditRoundRoundChart(auditRoundId, $axios) {
  return $axios.get(`audit/${auditRoundId}/chart/parent`)
}

export function calculateAuditScore(auditId, $axios) {
  return $axios.get(`audit/calculate-score/${auditId}`)
}

export function getAuditStatusOptions($axios, params = {}) {
  // return $axios.get("audit-statuses?all=1")
  return $axios.get("audit-statuses", {
    params: {
      all: 1,
      ...params
    }
  })
}

export function updateAuditItem(auditId, payload, $axios) {
  return $axios.put(`audit/${auditId}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export function updateAuditItems(auditId, payload, $axios) {
  return $axios.put(`audit-item/${auditId}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// subscription
const subUrl = "subscription"
export function closeSubscription(subId, $axios) {
  return $axios.post(`${subUrl}/${subId}/close`)
}

export function updateSubscription(subId, payload, $axios) {
  return $axios.put(`${subUrl}/${subId}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}
// Audit Reviews
const reviewsUrl = "audit-item-reviews"

export function getReviewsByControlId(controlId, $axios) {
  return $axios.get(`${reviewsUrl}?audit_item_id=${controlId}`)
}
export function getControlReviewById(reviewId, $axios) {
  return $axios.get(`${reviewsUrl}/${reviewId}`)
}
export function createControlReview(payload, $axios) {
  return $axios.post(`${reviewsUrl}`, payload)
}
export function updateControlReview(payload, $axios, controlReviewId) {
  return $axios.put(`${reviewsUrl}/${controlReviewId}`, payload)
}

export function deleteControlReview(reviewId, $axios) {
  return $axios.delete(`${reviewsUrl}/${reviewId}`)
}

export function getControlReviewStasuses($axios) {
  return $axios.get("review-statuses")
}

// Review Attachments
const reviewAttachmentUrl = "review-attachment"
export function getReviewAttachments(reviewId, $axios) {
  return $axios.get(`${reviewAttachmentUrl}?audit_item_review_id=${reviewId}`)
}

export function createReviewAttachment(payload, $axios) {
  return $axios.post(`${reviewAttachmentUrl}`, payload)
}
export function updateReviewAttachment(attachmentId, payload, $axios) {
  return $axios.put(`${reviewAttachmentUrl}/${attachmentId}`, payload)
}

export function deleteReviewAttachment(attId, $axios) {
  return $axios.delete(`${reviewAttachmentUrl}/${attId}`)
}

// Attachment typs & porposes

export function getReviewAttachmentTypes($axios) {
  return $axios.get("attachment-types")
}
export function getReviewAttachmentPurposes($axios) {
  return $axios.get("attachment-purposes")
}

const reviewersURL = "audit-reviewers"

export function removeReviewer(payload, $axios) {
  const params = new URLSearchParams()
  params.append("audit_item_id", payload.audit_item_id)
  params.append("user_id", payload.user_id)
  return $axios.delete(
    `${reviewersURL}?${params}`,
    {},
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}
export function addReviewer(payload, $axios) {
  return $axios.post(reviewersURL, payload)
}
export function addReviewerToAllControls(payload, $axios) {
  return $axios.post("bulk-audit-reviewers", payload)
}
export function removeReviewerFromAllControls(payload, $axios) {
  return $axios.post("bulk-remove-reviewers", payload)
}
