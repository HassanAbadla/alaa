const baseUrl = "portfolios"
export function getAllPortfolios($axios) {
  return $axios.get(baseUrl)
}

export function getPortfolioById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}

export function createPortfolio(payload, $axios) {
  return $axios.post(baseUrl, payload)
}
export function updatePortfolio(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload)
}

export function deletePortfolio(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}
