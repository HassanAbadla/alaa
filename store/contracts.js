import Vue from "vue"
export const state = () => ({
  contracts: [],
  contract: null,
  loading: false,
  error: null,
  currentContract: null,
  submitting: false,
  formErrors: {}
})

export const mutations = {
  SET_CONTRACTS(state, contracts) {
    state.contracts = contracts
  },
  SET_CONTRACT(state, contract) {
    state.contract = contract
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
  SET_CURRENT_CONTRACT(state, contract) {
    state.currentContract = contract
  },
  ADD_CONTRACT(state, contract) {
    state.contracts.push(contract)
  },
  UPDATE_CONTRACT(state, updatedContract) {
    const index = state.contracts.findIndex((contract) => contract.id === updatedContract.id)
    if (index !== -1) {
      state.contracts.splice(index, 1, updatedContract)
    }
  },
  REMOVE_CONTRACT(state, contractId) {
    state.contracts = state.contracts.filter((contract) => contract.id !== contractId)
  },
  CLEAR_FORM_ERRORS(state) {
    state.formErrors = {}
  },
  UPDAT_MESSAGE_COUNT(state, contractId) {
    const contract = state.contracts.find((contract) => contract.id === contractId)
    if (contract) {
      contract.posts_count = contract.posts_count ? contract.posts_count + 1 : 1
    }
  },
  UPDATE_DATA_ACCESS(state, { itemId, updatedUser }) {
    const contractIndex = state.contracts.findIndex((contract) => contract.id === itemId)
    if (contractIndex !== -1) {
      const contract = state.contracts[contractIndex]
      const userIndex = contract.master_access.findIndex((user) => user.user_id === updatedUser.user_id)

      if (userIndex !== -1) {
        // Update existing user

        Vue.set(contract.master_access, userIndex, updatedUser)
      } else {
        // Add new user
        contract.master_access.push(updatedUser)
      }
    }
  },
  REMOVE_DATA_ACCESS(state, { itemId, userId }) {
    const contractIndex = state.contracts.findIndex((contract) => contract.id === itemId)
    if (contractIndex !== -1) {
      const contract = state.contracts[contractIndex]
      const userIndex = contract.master_access.findIndex((user) => user.user_id === userId)
      if (userIndex !== -1) {
        contract.master_access.splice(userIndex, 1)
      }
    }
  }
}

const contractsUrl = "contracts"

export const actions = {
  updateDataAccess({ commit }, { itemId, updatedUser }) {
    commit("UPDATE_DATA_ACCESS", { itemId, updatedUser })
  },

  removeDataAccess({ commit }, { itemId, userId }) {
    commit("REMOVE_DATA_ACCESS", { itemId, userId })
  },
  async fetchContracts({ commit }, project_id) {
    commit("SET_CONTRACTS", [])
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)
    const params = project_id ? `?project_id=${project_id}` : ""
    try {
      const response = await this.$axios.get(`${contractsUrl}${params}`)
      commit("SET_CONTRACTS", response.data.data)
      return response.data
    } catch (error) {
      console.error("Error fetching contracts:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },
  async getContractById({ commit }, id) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.get(`${contractsUrl}/${id}`)
      commit("SET_CONTRACT", response.data.data)
    } catch (error) {
      console.error("Error fetching contract:", error)
      commit("SET_ERROR", error.message)
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async createContract({ commit }, payload) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.post(contractsUrl, payload)
      commit("ADD_CONTRACT", response.data.data)
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

  async updateContract({ commit }, { id, payload }) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.put(`${contractsUrl}/${id}`, payload)
      const updatedContract = response.data.data
      commit("UPDATE_CONTRACT", updatedContract)
      return updatedContract
    } catch (error) {
      if (error?.response?.data?.errors) {
        commit("SET_FORM_ERRORS", error.response.data.errors)
      }
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },
  updateMessageCount({ commit }, contractId) {
    commit("UPDAT_MESSAGE_COUNT", contractId)
  },
  async deleteContract({ commit }, id) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.delete(`${contractsUrl}/${id}`)
      // Remove the contract from the array since deletion was successful
      commit("REMOVE_CONTRACT", id)
      return response.data // Returns { status: "success", message: "contract deleted with success" }
    } catch (error) {
      if (error?.response?.data?.errors) {
        commit("SET_FORM_ERRORS", error.response.data.errors)
      }
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  }
}

export const getters = {
  getContractById: (state) => (id) => {
    return state.contracts.find((contract) => contract.id === id)
  },
  isSubmitting: (state) => state.submitting,
  formErrors: (state) => state.formErrors
}
