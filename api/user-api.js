export function updateProfileDetails(payload, $axios) {
  return $axios.put("update-user", payload)
}
export function changeUserPassword(payload, $axios) {
  return $axios.put("change-password", payload)
}

export function userChart($axios) {
  return $axios.get("user-chart")
}
