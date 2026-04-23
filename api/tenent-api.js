const baseUrl = "tenant"

export function createTenent(payload, $axios) {
  return $axios.post(`${baseUrl}-request/store`, payload)
}

export function registerTenent(payload, $axios) {
  return $axios.post(`${baseUrl}/register`, payload)
}
export function getTenent(token, $axios) {
  return $axios.get(`${baseUrl}-request?token=${token}`)
}

const usersUrl = "users"

export function createUser(payload, $axios) {
  return $axios.post(`${baseUrl}/${usersUrl}`, payload)
}
export function changeUserRole(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${usersUrl}/${id}/change-role`, payload)
}

export function getUsers($axios) {
  return $axios.get(`${baseUrl}/${usersUrl}`)
}
export function getUserById(id, $axios) {
  return $axios.get(`${baseUrl}/${usersUrl}/${id}`)
}

export function giveDataAccess(payload, $axios) {
  return $axios.post(`${baseUrl}/access`, payload)
}

export function removeDataAccess(payload, $axios) {
  return $axios.post(`${baseUrl}/access/remove`, payload)
}
