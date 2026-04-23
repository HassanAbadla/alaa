const baseUrl = "departments"

export function getAllDepartments($axios) {
  return $axios.get(baseUrl)
}

export function getDepartmentById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}

export function createDepartment(payload, $axios) {
  return $axios.post(baseUrl, payload)
}

export function updateDepartment(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload)
}

export function deleteDepartment(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}
