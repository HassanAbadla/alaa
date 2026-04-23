const baseUrl = "risk-causes"
// CRUD

export function getAllRiskCauses(riskId, $axios) {
  return $axios.get(`${baseUrl}?risk_id=${riskId}`)
}
export function getRiskCauseById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}
export function createRiskCause(payload, $axios) {
  return $axios.post(`${baseUrl}`, payload)
}
export function updateRiskCause(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}
export function deleteRiskCause(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}
