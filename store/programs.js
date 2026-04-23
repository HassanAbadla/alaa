import Vue from "vue"
const baseUrl = "programs"

export const state = () => ({
  programs: [],
  program: null,
  loading: false,
  error: null,
  currentProgram: null,
  submitting: false,
  formErrors: {}
})

export const mutations = {
  SET_PROGRAMS(state, programs) {
    state.programs = programs
  },
  SET_PROGRAM(state, program) {
    state.program = program
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
  SET_CURRENT_PROGRAM(state, program) {
    state.currentProgram = program
  },
  ADD_PROGRAM(state, program) {
    state.programs.push(program)
  },
  UPDATE_PROGRAM(state, updatedProgram) {
    const index = state.programs.findIndex((program) => program.id === updatedProgram.id)
    if (index !== -1) {
      state.programs.splice(index, 1, updatedProgram)
    }
  },
  REMOVE_PROGRAM(state, programId) {
    state.programs = state.programs.filter((program) => program.id !== programId)
  },
  CLEAR_FORM_ERRORS(state) {
    state.formErrors = {}
  },
  CLEAR_FIELD_ERROR(state, field) {
    if (state.formErrors[field]) {
      state.formErrors[field] = []
    }
  },
  UPDATE_DATA_ACCESS(state, { itemId, updatedUser }) {
    const programIndex = state.programs.findIndex((program) => program.id === itemId)
    if (programIndex !== -1) {
      const program = state.programs[programIndex]
      const userIndex = program.master_access.findIndex((user) => user.user_id === updatedUser.user_id)

      if (userIndex !== -1) {
        // Update existing user

        Vue.set(program.master_access, userIndex, updatedUser)
      } else {
        // Add new user
        program.master_access.push(updatedUser)
      }
    }
  },
  REMOVE_DATA_ACCESS(state, { itemId, userId }) {
    const programIndex = state.programs.findIndex((program) => program.id === itemId)
    if (programIndex !== -1) {
      const program = state.programs[programIndex]
      const userIndex = program.master_access.findIndex((user) => user.user_id === userId)
      if (userIndex !== -1) {
        program.master_access.splice(userIndex, 1)
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
  async fetchPrograms({ commit }, portfolio_id) {
    commit("SET_PROGRAMS", [])
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)
    const params = portfolio_id ? `?portfolio_id=${portfolio_id}` : ""
    try {
      const response = await this.$axios.get(`${baseUrl}${params}`)
      commit("SET_PROGRAMS", response.data.data)
      return response.data
    } catch (error) {
      console.error("Error fetching programs:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async getProgramById({ commit }, id) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.get(`${baseUrl}/${id}`)
      commit("SET_PROGRAM", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error fetching program:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async createProgram({ commit }, payload) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.post(baseUrl, payload)
      commit("ADD_PROGRAM", response.data.data)
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

  async updateProgram({ commit }, { id, payload }) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.put(`${baseUrl}/${id}`, payload)
      const updatedProgram = response.data.data
      commit("UPDATE_PROGRAM", updatedProgram)
      return updatedProgram
    } catch (error) {
      if (error?.response?.data?.errors) {
        commit("SET_FORM_ERRORS", error.response.data.errors)
      }
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async deleteProgram({ commit }, id) {
    commit("SET_SUBMITTING", true)
    try {
      await this.$axios.delete(`${baseUrl}/${id}`)
      commit("REMOVE_PROGRAM", id)
    } catch (error) {
      console.error("Error deleting program:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  }
}

export const getters = {
  getProgramById: (state) => (id) => {
    return state.programs.find((program) => program.id === id)
  },
  isSubmitting: (state) => state.submitting,
  formErrors: (state) => state.formErrors
}
