export function getAllusers($axios) {
  return $axios.get("orders-users")
}
const baseUrl = "orders"
export function getAllOrders($axios, filters = {}) {
  const params = new URLSearchParams()
  if (filters.orders_priority_id) {
    params.append("orders_priority_id", filters.orders_priority_id)
  }
  if (filters.orders_category_id) {
    params.append("orders_category_id", filters.orders_category_id)
  }
  if (filters.orders_type_id) {
    params.append("orders_type_id", filters.orders_type_id)
  }
  if (filters.orders_status_id) {
    params.append("orders_status_id", filters.orders_status_id)
  }
  const queryString = params.toString()
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

  return $axios.get(url)
}

export function getbuildings($axios) {
  return $axios.get("orders-buildings")
}
export function deleteOrder(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

export function updateDatePromised(data, $axios) {
  return $axios.put(`${baseUrl}/${data.order_id}`, data)
}

export function AddOrder(payload, $axios) {
  return $axios.post(baseUrl, payload)
}

export function getAllCategories($axios) {
  return $axios.get("orders-categories")
}

export function getPriorities($axios) {
  return $axios.get("priorities")
}
export function getTypes($axios) {
  return $axios.get("types")
}

export function getOrdersStatus($axios) {
  return $axios.get("orders-status")
}

export function getUserTypes($axios) {
  return $axios.get("user-types")
}
