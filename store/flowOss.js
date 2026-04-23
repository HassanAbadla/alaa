const ENDPOINTS = {
  users: "orders-users",
  orders: "orders-workflow",
  projects: "projects",
  buildings: "orders-buildings",
  categories: "orders-categories",
  priorities: "priorities",
  types: "types",
  statuses: "orders-status",
  attachmentTypes: "orders-attachment-types",
  // attachmentTypes: "attachment-types",
  attachment: "order-attachment"
}

export const state = () => ({
  users: [],
  orders: [],
  projects: [],
  buildings: [],
  categories: [],
  priorities: [],
  types: [],
  statuses: [],
  attachmentTypes: [],
  orderAttachments: [],
  mainOrderAttachments: [],

  nodeStatuses: []
})

export const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_ORDERS(state, orders) {
    state.orders = orders
  },

  ADD_ORDER(state, order) {
    state.orders.splice(state.orders.length, 0, order)
  },
  UPDATE_ITEM(state, { id, response }) {
    const item = state.orders.find((item) => item.id === id)
    if (item && response) {
      Object.assign(item, response)
    }
    state.orders = [...state.orders]
    console.log("Updated order in store", id, response, state.orders)
    console.log("Updated item", item)
  },
  UPDATE_ITEM_STATUS(state, data) {
    const item = state.orders.find((item) => item.id === data.order_id)
    if (item) {
      item.status.code = data.orders_status_id
    }
  },

  SET_ATTACHMENT_TYPES(state, attachmentTypes) {
    state.attachmentTypes = attachmentTypes
  },

  SET_PROJECTS(state, projects) {
    state.projects = projects
  },

  SET_BUILDINGS(state, buildings) {
    state.buildings = buildings
  },

  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },

  SET_PRIORITIES(state, priorities) {
    state.priorities = priorities
  },

  SET_TYPES(state, types) {
    state.types = types
  },

  SET_STATUSES(state, statuses) {
    state.statuses = statuses
  },

  SET_ORDER_ATTACHMENTS(state, attachments) {
    state.orderAttachments = attachments
  },
  ADD_ITEM_ATTACHMENT(state, { response }) {
    const order = state.orders.find((order) => order.id === parseInt(response.order_id))
    if (order) {
      order.orderAttachements.push(response)
      state.orders = [...state.orders]
    }
    console.log("order id:", response.order_id)
    console.log("Added attachment to order", response, order)
  },

  UPDATE_ATTACHMENT(state, attachment) {
    console.log("Store attachment", attachment)

    const index = state.orders.findIndex((order) => order.id === attachment.order_id)
    state.orders[index].orderAttachements.push(attachment)
  },
  REMOVE_ATTACHMENT(state, item) {
    const removeFromOrder = (order) => {
      const attachmentIndex = order.orderAttachements.findIndex((attachment) => attachment.id === item.id)
      if (attachmentIndex !== -1) {
        order.orderAttachements.splice(attachmentIndex, 1)
        return true
      }
      return false
    }

    // remove from parent orders
    const orderIndex = state.orders.findIndex((order) => order.id === item.order_id)
    if (orderIndex !== -1) {
      if (removeFromOrder(state.orders[orderIndex])) {
        state.orders = [...state.orders]
        return
      }
    }

    // search in children
    for (let i = 0; i < state.orders.length; i++) {
      if (state.orders[i].children) {
        const childIndex = state.orders[i].children.findIndex((child) => child.id === item.order_id)
        if (childIndex !== -1) {
          if (removeFromOrder(state.orders[i].children[childIndex])) {
            state.orders = [...state.orders]
            return
          }
        }
      }
    }
  },
  SET_FLOW_STATUSES(state, statuses) {
    state.nodeStatuses = statuses
  }
}

export const actions = {
  async getUsers({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.users)
      commit("SET_USERS", response.data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },
  async allOrders({ commit }, filters = {}) {
    try {
      state.orders = []
      const response = await this.$axios.get(ENDPOINTS.orders, { params: filters })
      commit("SET_ORDERS", response.data.orders)
      commit("SET_FLOW_STATUSES", response.data.flowNodes[0].nodeStatuses)
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  },

  async createOrder({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post(ENDPOINTS.orders, payload)
      await dispatch("allOrders")
      return response.data.data
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  },

  async updateOrder({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`${ENDPOINTS.orders}/${id}`, payload)
      // await dispatch("allOrders")
      commit("UPDATE_ITEM", { id, response: response.data.data })
      return response.data.data
    } catch (error) {
      console.error("Error updating order:", error)
      throw error
    }
  },

  async updateOrderStatus({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`${ENDPOINTS.orders}/${id}`, payload)
      commit("UPDATE_ITEM_STATUS", payload)
      await dispatch("allOrders")
      return response.data.data
    } catch (error) {
      console.error("Error updating order status:", error)
      throw error
    }
  },

  async createOrderAttachment({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post(ENDPOINTS.attachment, payload)
      commit("ADD_ITEM_ATTACHMENT", { response: response.data.data })
      // await dispatch("allOrders")
      return response.data.data
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  },

  async addToMainOrder({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post("order-attachment/addToMainOrder", payload)
      await dispatch("allOrders")
      return response.data.data
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  },

  // Lookups

  async getAttachmentTypes({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.attachmentTypes)
      commit("SET_ATTACHMENT_TYPES", response.data.data)
    } catch (error) {
      console.error("Error fetching attachment types:", error)
      throw error
    }
  },
  async removeAttachment({ commit, dispatch }, itemId) {
    try {
      await this.$axios.delete(`/order-attachment/${itemId}`)
      // commit("REMOVE_ATTACHMENT", item)
      await dispatch("allOrders")
    } catch (error) {
      console.error("Error removing attachment:", error)
      throw error
    }
  },

  async getProjects({ commit }) {
    try {
      const response = await this.$axios.get("modules-list")
      commit("SET_PROJECTS", response.data.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      throw error
    }
  },

  async getBuildings({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.buildings)
      commit("SET_BUILDINGS", response.data.data)
    } catch (error) {
      console.error("Error fetching buildings:", error)
      throw error
    }
  },

  async getCategories({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.categories)
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  async getPriorities({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.priorities)
      commit("SET_PRIORITIES", response.data.data)
    } catch (error) {
      console.error("Error fetching priorities:", error)
      throw error
    }
  },

  async getTypes({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.types)
      commit("SET_TYPES", response.data.data)
    } catch (error) {
      console.error("Error fetching types:", error)
      throw error
    }
  },

  async getStatuses({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.statuses)
      commit("SET_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error fetching statuses:", error)
      throw error
    }
  }
}
