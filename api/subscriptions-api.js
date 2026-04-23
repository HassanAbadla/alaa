export function getAllSubcriptions($axios, params = {}) {
  return $axios.get("compliance-packages", { params })
}

export function subscribe(payload, $axios) {
  return $axios.post("subscribe", payload)
}

export function checkForSubscription($axios) {
  return $axios.get("subscription")
}
