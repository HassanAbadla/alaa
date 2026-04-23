const baseUrl = "treatments"

// CRUD

export function getAllRiskTreatments(riskId, $axios, params = {}) {
  // const params = new URLSearchParams()
  // if (filters.treatment_status_id) {
  //   params.append("treatment_status_id", filters.treatment_status_id)
  // }
  // if (filters.min_budget) {
  //   params.append("min_budget", filters.min_budget)
  // }
  // if (filters.max_budget) {
  //   params.append("max_budget", filters.max_budget)
  // }
  // const queryString = params.toString()
  // const url = queryString ? `${baseUrl}?risk_id=${riskId}&${queryString}` : `${baseUrl}?risk_id=${riskId}`
  return $axios.get(`${baseUrl}?risk_id=${riskId}`, { params })
}
export function getRiskTreatmentById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}
export function createRiskTreatment(payload, $axios) {
  return $axios.post(`${baseUrl}`, payload)
}
export function updateRiskTreatment(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}
export function deleteRiskTreatment(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

// Lookups
export function getRiskTreatmentStatuses($axios) {
  return $axios.get("treatment-statuses")
}
