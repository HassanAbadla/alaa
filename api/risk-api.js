const baseUrl = "risk"

// CRUD

export function getAllRisk($axios, filters = {}) {
  const params = new URLSearchParams()

  if (filters.risk_priority_id) {
    params.append("risk_priority_id", filters.risk_priority_id)
  }

  if (filters.risk_capacity_id) {
    params.append("risk_capacity_id", filters.risk_capacity_id)
  }

  if (filters.risk_type_id) {
    params.append("risk_type_id", filters.risk_type_id)
  }

  if (filters.risk_category_id) {
    params.append("risk_category_id", filters.risk_category_id)
  }

  if (filters.risk_status_id) {
    params.append("risk_status_id", filters.risk_status_id)
  }

  if (filters.risk_swot_id) {
    params.append("risk_swot_id", filters.risk_swot_id)
  }

  if (filters.impact_id) {
    params.append("impact_id", filters.impact_id)
  }

  if (filters.likely_hood_id) {
    params.append("likely_hood_id", filters.likely_hood_id)
  }

  const queryString = params.toString()
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

  return $axios.get(url)
}
export function getRiskById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}
export function createRisk(payload, $axios) {
  return $axios.post(`${baseUrl}`, payload)
}
export function bulkCreateRisks(risks, $axios) {
  return $axios.post(`${baseUrl}/bulk-create`, { risks })
}
export function updateRisk(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}
export function deleteRisk(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

// LOOKUPS

export function getRiskCapacities($axios) {
  return $axios.get(`${baseUrl}-capacities`)
}
export function getRiskSWOTs($axios) {
  return $axios.get(`${baseUrl}-swots`)
}
export function getRiskCategories($axios) {
  return $axios.get(`${baseUrl}-categories`)
}
export function getRiskTypes($axios) {
  return $axios.get(`${baseUrl}-types`)
}
export function getRiskPriorities($axios) {
  return $axios.get(`${baseUrl}-priorities`)
}
export function getRiskStatuses($axios) {
  return $axios.get(`${baseUrl}-statuses`)
}
export function getRiskLikelihoods($axios) {
  return $axios.get("likelihoods")
}
export function getRiskImpacts($axios) {
  return $axios.get("impacts")
}

export function getAllRiskAttachments(id, $axios) {
  return $axios.get(`${baseUrl}-attachment?risk_id=${id}`)
}
export function createRiskAttachment(payload, $axios) {
  return $axios.post(`${baseUrl}-attachment`, payload)
}

export function updateRiskAttachment(riskId, payload, $axios) {
  return $axios.put(`${baseUrl}-attachment/${riskId}`, payload)
}
export function deleteRiskAttachment(attId, $axios) {
  return $axios.delete(`${baseUrl}-attachment/${attId}`)
}
