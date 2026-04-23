// store/pmwebProgressInvoices.js

export const state = () => ({
  progressInvoices: [],
  currentProgressInvoice: null,
  loading: false,
  error: null
})

export const mutations = {
  SET_PROGRESS_INVOICES(state, progressInvoices) {
    state.progressInvoices = progressInvoices
  },
  SET_CURRENT_PROGRESS_INVOICE(state, progressInvoice) {
    state.currentProgressInvoice = progressInvoice
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchProgressInvoices({ commit }, filters = {}) {
    try {
      commit("SET_LOADING", true)
      commit("SET_PROGRESS_INVOICES", [])

      // Clean up filters - remove null/undefined values
      const cleanFilters = {}
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          cleanFilters[key] = filters[key]
        }
      }

      // Pass filters as params to API
      const response = await this.$pmwebApi.get("CostManagement/ProgressInvoices.svc/GetProgressInvoices", {
        params: cleanFilters
      })

      commit("SET_PROGRESS_INVOICES", response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching progress invoices:", error)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchProgressInvoiceById({ commit }, id) {
    try {
      commit("SET_LOADING", true)
      commit("SET_CURRENT_PROGRESS_INVOICE", null)

      // Call the GetProgressInvoiceById endpoint with numeric ID
      const response = await this.$pmwebApi.get(`CostManagement/ProgressInvoices.svc/GetProgressInvoiceById/${id}`)

      commit("SET_CURRENT_PROGRESS_INVOICE", response.data)
      commit("SET_ERROR", null)
      return response.data
    } catch (error) {
      commit("SET_ERROR", error)
      console.error(`Error fetching progress invoice with ID ${id}:`, error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getProgressInvoices: (state) => state.progressInvoices,
  getCurrentProgressInvoice: (state) => state.currentProgressInvoice,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
