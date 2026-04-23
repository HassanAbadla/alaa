const baseUrl = "risk-consequences"

// CRUD

export function getAllRiskConsequences(riskId, $axios) {
  return $axios.get(`${baseUrl}?risk_id=${riskId}`)
}
export function getRiskConsequenceById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}
export function createRiskConsequence(payload, $axios) {
  return $axios.post(`${baseUrl}`, payload)
}
export function updateRiskConsequence(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}
export function deleteRiskConsequence(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}
