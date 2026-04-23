import Vue from "vue"
const baseUrl = "portfolios"

export const state = () => ({
  portfolios: [],
  portfolio: null,
  loading: false,
  error: null,
  currentPortfolio: null,
  submitting: false,
  formErrors: {}
})

export const mutations = {
  SET_PORTFOLIOS(state, portfolios) {
    state.portfolios = portfolios
  },
  SET_PORTFOLIO(state, portfolio) {
    state.portfolio = portfolio
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_FORM_ERRORS(state, errors) {
    state.formErrors = errors
  },
  SET_SUBMITTING(state, value) {
    state.submitting = value
  },
  SET_CURRENT_PORTFOLIO(state, portfolio) {
    state.currentPortfolio = portfolio
  },
  ADD_PORTFOLIO(state, portfolio) {
    state.portfolios.push(portfolio)
  },
  UPDATE_PORTFOLIO(state, updatedPortfolio) {
    const index = state.portfolios.findIndex((portfolio) => portfolio.id === updatedPortfolio.id)
    if (index !== -1) {
      state.portfolios.splice(index, 1, updatedPortfolio)
    }
  },
  REMOVE_PORTFOLIO(state, portfolioId) {
    state.portfolios = state.portfolios.filter((portfolio) => portfolio.id !== portfolioId)
  },
  CLEAR_FORM_ERRORS(state) {
    state.formErrors = {}
  },
  UPDATE_DATA_ACCESS(state, { itemId, updatedUser }) {
    const portfolioIndex = state.portfolios.findIndex((portfolio) => portfolio.id === itemId)
    if (portfolioIndex !== -1) {
      const portfolio = state.portfolios[portfolioIndex]
      const userIndex = portfolio.master_access.findIndex((user) => user.user_id === updatedUser.user_id)

      if (userIndex !== -1) {
        // Update existing user

        Vue.set(portfolio.master_access, userIndex, updatedUser)
      } else {
        // Add new user
        portfolio.master_access.push(updatedUser)
      }
    }
  },
  REMOVE_DATA_ACCESS(state, { itemId, userId }) {
    const portfolioIndex = state.portfolios.findIndex((portfolio) => portfolio.id === itemId)
    if (portfolioIndex !== -1) {
      const portfolio = state.portfolios[portfolioIndex]
      const userIndex = portfolio.master_access.findIndex((user) => user.user_id === userId)
      if (userIndex !== -1) {
        portfolio.master_access.splice(userIndex, 1)
      }
    }
  }
}

export const actions = {
  updateDataAccess({ commit }, { itemId, updatedUser }) {
    commit("UPDATE_DATA_ACCESS", { itemId, updatedUser })
  },

  removeDataAccess({ commit }, { itemId, userId }) {
    commit("REMOVE_DATA_ACCESS", { itemId, userId })
  },
  async fetchPortfolios({ commit }, project_id) {
    commit("SET_PORTFOLIOS", [])
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)
    const params = project_id ? `?project_id=${project_id}` : ""
    try {
      const response = await this.$axios.get(`${baseUrl}${params}`)
      commit("SET_PORTFOLIOS", response.data.data)
      return response.data
    } catch (error) {
      console.error("Error fetching portfolios:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async getPortfolioById({ commit }, id) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.get(`${baseUrl}/${id}`)
      commit("SET_PORTFOLIO", response.data.data)
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      commit("SET_ERROR", error.message)
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async createPortfolio({ commit }, payload) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.post(baseUrl, payload)
      commit("ADD_PORTFOLIO", response.data.data)
      return response.data.data
    } catch (error) {
      if (error?.response?.data?.errors) {
        commit("SET_FORM_ERRORS", error.response.data.errors)
      }
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async updatePortfolio({ commit }, { id, payload }) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.put(`${baseUrl}/${id}`, payload)
      const updatedPortfolio = response.data.data
      commit("UPDATE_PORTFOLIO", updatedPortfolio)
      return updatedPortfolio
    } catch (error) {
      if (error?.response?.data?.errors) {
        commit("SET_FORM_ERRORS", error.response.data.errors)
      }
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async deletePortfolio({ commit }, id) {
    commit("SET_SUBMITTING", true)
    try {
      await this.$axios.delete(`${baseUrl}/${id}`)
      commit("REMOVE_PORTFOLIO", id)
    } catch (error) {
      console.error("Error deleting portfolio:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  }
}

export const getters = {
  getPortfolioById: (state) => (id) => {
    return state.portfolios.find((portfolio) => portfolio.id === id)
  },
  isSubmitting: (state) => state.submitting,
  formErrors: (state) => state.formErrors
}
