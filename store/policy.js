const ENDPOINTS = {
  policies: "policies",
  items: "policy-items",
  createPolicy: "policies",
  updatePolicy: "policies/{id}",
  deletePolicy: "policies/{id}",
  statuses: "policy-statuses",
  categories: "policy-categories",
  usages: "policy-usages",
  disciplines: "policy-disciplines",
  documents: "policy-documents"
}

export const state = () => ({
  policies: [],
  policiesChart: [],
  categories: [],
  usages: [],
  statuses: [],
  policyItemStatuses: [],
  disciplines: [],
  items: [],
  documents: []
})

export const mutations = {
  SET_POLICIES(state, policies) {
    state.policies = policies
  },
  SET_POLICIES_CHART(state, chartData) {
    state.policiesChart = chartData
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_USAGES(state, usages) {
    state.usages = usages
  },
  SET_STATUSES(state, statuses) {
    state.statuses = statuses
  },
  SET_POLICY_ITEM_STATUSES(state, policyItemStatuses) {
    state.policyItemStatuses = policyItemStatuses
  },
  SET_DISCIPLINES(state, disciplines) {
    state.disciplines = disciplines
  },
  SET_ITEMS(state, items) {
    state.items = items
  },
  SET_PROCESS_DOCUMENT(state, documents) {
    state.documents = documents
  }
}

export const actions = {
  async fetchPolicies({ commit }, filters = {}) {
    try {
      const response = await this.$axios.get(ENDPOINTS.policies, { params: filters })
      commit("SET_POLICIES", response.data.data)
      commit("SET_POLICIES_CHART", response.data.chart_data)
    } catch (error) {
      console.error("Error fetching policies:", error)
      throw error
    }
  },

  async createPolicy({ commit }, payload) {
    try {
      console.log("create function running")
      const response = await this.$axios.post(ENDPOINTS.createPolicy, payload)
      commit("SET_POLICIES", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error creating policy:", error)
      throw error
    }
  },

  async updatePolicy({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`${ENDPOINTS.policies}/${id}`, payload)
      await dispatch("fetchPolicies")
      return response.data.data
    } catch (error) {
      console.error("Error updating order:", error)
      throw error
    }
  },

  async deletePolicy({ commit, dispatch }, id) {
    try {
      const response = await this.$axios.delete(`${ENDPOINTS.policies}/${id}`)
      await dispatch("fetchPolicies")
      return response.data.data
    } catch (error) {
      console.error("Error deleting policy:", error)
      throw error
    }
  },

  async createDocument({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post(ENDPOINTS.documents, payload)
      await dispatch("fetchPolicies")
      return response.data.data
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  },
  async deleteDocument({ commit, dispatch }, id) {
    try {
      const response = await this.$axios.delete(`${ENDPOINTS.documents}/${id}`)
      await dispatch("fetchPolicies")
      return response.data.data
    } catch (error) {
      console.error("Error deleting policy:", error)
      throw error
    }
  },

  // Lookups
  async fetchCategories({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.categories)
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },
  async fetchUsages({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.usages)
      commit("SET_USAGES", response.data.data)
    } catch (error) {
      console.error("Error fetching usages:", error)
      throw error
    }
  },
  async fetchStatuses({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.statuses)
      commit("SET_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error fetching statuses:", error)
      throw error
    }
  },
  async fetchDisciplines({ commit }) {
    try {
      const response = await this.$axios.get(ENDPOINTS.disciplines)
      commit("SET_DISCIPLINES", response.data.data)
    } catch (error) {
      console.error("Error fetching disciplines:", error)
      throw error
    }
  },
  async fetchItems({ commit }, { id, filters = {} }) {
    try {
      console.log(id, filters)
      const response = await this.$axios.get(`policy-items`, {
        params: {
          policyId: id,
          ...filters
        }
      })
      commit("SET_ITEMS", response.data.data)
    } catch (error) {}
  },

  async fetchPolicyItemStatuses({ commit }) {
    try {
      const response = await this.$axios.get("policy-item-statuses")
      commit("SET_POLICY_ITEM_STATUSES", response.data.data)
    } catch (error) {
      console.error("Error fetching policy item statuses:", error)
      throw error
    }
  },
  // Policy Items
  async createPolicyItem({ commit }, payload) {
    try {
      const response = await this.$axios.post("policy-items", payload)
      return response.data.data
    } catch (error) {
      console.error("Error creating policy item:", error)
      throw error
    }
  },
  async updatePolicyItem({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`policy-items/${id}`, payload)
      return response.data.data
    } catch (error) {
      console.error("Error updating policy item:", error)
      throw error
    }
  },
  async deleteItem({ commit, dispatch }, id) {
    try {
      const response = await this.$axios.delete(`${ENDPOINTS.items}/${id}`)
      // await dispatch("fetchItems")
      return response.data.data
    } catch (error) {
      console.error("Error deleting policy:", error)
      throw error
    }
  },
  // Policy Transactions
  async addPolicyTransaction({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post("policy-transactions", payload)
      await dispatch("fetchPolicies")
      return response.data.data
    } catch (error) {
      console.error("Error adding policy transaction:", error)
      throw error
    }
  },

  async updatePolicyTransaction({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`policy-transactions/${id}`, payload)
      await dispatch("fetchPolicies")
      return response.data.data
    } catch (error) {
      console.error("Error updating policy transaction:", error)
      throw error
    }
  },
  async deletePolicyTransaction({ commit, dispatch }, { id }) {
    try {
      const response = await this.$axios.delete(`policy-transactions/${id}`)
      return response.data.data
    } catch (error) {
      console.error("Error deleting item transaction:", error)
      throw error
    }
  },
  // Item Transactions
  async addItemTransaction({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post("item-transactions", payload)
      return response.data.data
    } catch (error) {
      console.error("Error adding item transaction:", error)
      throw error
    }
  },

  async updateItemTransaction({ commit, dispatch }, { id, payload }) {
    try {
      const response = await this.$axios.put(`item-transactions/${id}`, payload)
      return response.data.data
    } catch (error) {
      console.error("Error updating item transaction:", error)
      throw error
    }
  },
  async deleteItemTransaction({ commit, dispatch }, { id }) {
    try {
      const response = await this.$axios.delete(`item-transactions/${id}`)
      return response.data.data
    } catch (error) {
      console.error("Error deleting item transaction:", error)
      throw error
    }
  },
  async uploadTemplate({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post("process-document", payload)
      return response
      commit("SET_PROCESS_DOCUMENT", response.data.content)
      // return response.data.data
    } catch (error) {
      console.error("Error uploading template:", error)
      throw error
    }
  },
  async policyArchive({ commit, dispatch }, { id, payload }) {
    try {
      await this.$axios.put(`policy-archive/${id}`, payload)
      await dispatch("fetchPolicies")
    } catch (error) {
      console.error("Error archiving policy:", error)
      throw error
    }
  },
  async exportDocx({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.post(`export-policy`, { id: payload.id, responseType: "blob" })

      const blob = new Blob([response.data], {
        type: "application/vnd.ms-word"
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${payload.name}_${new Date().toISOString().split("T")[0]}.docx`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      return response.data
    } catch (error) {
      console.error("Error exporting docx:", error)
      throw error
    }
  }
}
