const baseUrl = "companies"

export function getAllCompanies($axios) {
  return $axios.get(baseUrl)
}

export function getCompanyById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}

export function createCompany(payload, $axios) {
  return $axios.post(baseUrl, payload)
}
export function updateCompany(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export function deleteCompany(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

export function getCompanyTypes($axios) {
  return $axios.get(`${baseUrl}/types`)
}

export function getCompanyGrades($axios) {
  return $axios.get(`${baseUrl}/grades`)
}
