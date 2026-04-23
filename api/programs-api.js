const baseUrl = "programs"

export function getAllPrograms($axios, portfolioId) {
  const params = new URLSearchParams()

  if (portfolioId) params.append("portfolio_id", portfolioId)
  return $axios.get(`${baseUrl}?${params}`)
}

export function getProgramById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}

export function createProgram(payload, $axios) {
  return $axios.post(baseUrl, payload)
}

export function updateProgram(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload)
}

export function deleteProgram(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}
