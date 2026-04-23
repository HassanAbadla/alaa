const baseUrl = "risk-controls"

// CRUD

export function getAllRiskControls(riskId, $axios, filters = {}) {
  const params = new URLSearchParams()
  if (filters.risk_control_type_id) {
    params.append("risk_control_type_id", filters.risk_control_type_id)
  }
  if (filters.risk_control_effectiveness_id) {
    params.append("risk_control_effectiveness_id", filters.risk_control_effectiveness_id)
  }
  if (filters.operational_impact_id) {
    params.append("operational_impact_id", filters.operational_impact_id)
  }
  const queryString = params.toString()
  const url = queryString ? `${baseUrl}?risk_id=${riskId}&${queryString}` : `${baseUrl}?risk_id=${riskId}`
  return $axios.get(url)
}
export function getRiskControlById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}
export function createRiskControl(payload, $axios) {
  return $axios.post(`${baseUrl}`, payload)
}
export function updateRiskControl(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}
export function deleteRiskControl(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

const lookupUrl = "risk-control"
// Lookups
export function getOperationalImpacts($axios) {
  return $axios.get("operational-impacts")
}
export function getImpactReputations($axios) {
  return $axios.get("impact-reputations")
}
export function getRiskControlTypes($axios) {
  return $axios.get(`${lookupUrl}-types`)
}
export function getRiskControlEffectiveness($axios) {
  return $axios.get(`${lookupUrl}-effectiveness`)
}
