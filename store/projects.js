import Vue from "vue"
const baseUrl = "projects"

export const state = () => ({
  projects: [],
  project: null,
  loading: false,
  error: null,
  currentProject: null,
  submitting: false,
  formErrors: {}
})

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  SET_PROJECT(state, project) {
    state.project = project
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
  SET_CURRENT_PROJECT(state, project) {
    state.currentProject = project
  },
  ADD_PROJECT(state, project) {
    state.projects.push(project)
  },
  UPDATE_PROJECT(state, updatedProject) {
    const index = state.projects.findIndex((project) => project.id === updatedProject.id)
    if (index !== -1) {
      state.projects.splice(index, 1, updatedProject)
    }
  },
  REMOVE_PROJECT(state, projectId) {
    state.projects = state.projects.filter((project) => project.id !== projectId)
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
    const projectIndex = state.projects.findIndex((project) => project.id === itemId)
    if (projectIndex !== -1) {
      const project = state.projects[projectIndex]
      const userIndex = project.master_access.findIndex((user) => user.user_id === updatedUser.user_id)

      if (userIndex !== -1) {
        // Update existing user

        Vue.set(project.master_access, userIndex, updatedUser)
      } else {
        // Add new user
        project.master_access.push(updatedUser)
      }
    }
  },
  REMOVE_DATA_ACCESS(state, { itemId, userId }) {
    const projectIndex = state.projects.findIndex((project) => project.id === itemId)
    if (projectIndex !== -1) {
      const project = state.projects[projectIndex]
      const userIndex = project.master_access.findIndex((user) => user.user_id === userId)
      if (userIndex !== -1) {
        project.master_access.splice(userIndex, 1)
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
  async fetchProjects({ commit }, { program_id, portfolio_id } = {}) {
    commit("SET_PROJECTS", [])
    commit("SET_LOADING", true)
    commit("SET_ERROR", null)

    let params = new URLSearchParams()
    if (program_id) params.append("program_id", program_id)
    if (portfolio_id) params.append("portfolio_id", portfolio_id)
    const queryString = params.toString()

    try {
      const response = await this.$axios.get(`${baseUrl}${queryString ? `?${queryString}` : ""}`)
      commit("SET_PROJECTS", response.data.data)
      return response.data
    } catch (error) {
      console.error("Error fetching projects:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async getProjectById({ commit }, id) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.get(`${baseUrl}/${id}`)
      commit("SET_PROJECT", response.data.data)
      return response.data.data
    } catch (error) {
      console.error("Error fetching project:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async createProject({ commit }, payload) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.post(baseUrl, payload)
      commit("ADD_PROJECT", response.data.data)
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

  async updateProject({ commit }, { id, payload }) {
    commit("SET_SUBMITTING", true)
    commit("CLEAR_FORM_ERRORS")
    try {
      const response = await this.$axios.put(`${baseUrl}/${id}`, payload)
      const updatedProject = response.data.data
      commit("UPDATE_PROJECT", updatedProject)
      return updatedProject
    } catch (error) {
      if (error?.response?.data?.errors) {
        commit("SET_FORM_ERRORS", error.response.data.errors)
      }
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  },

  async deleteProject({ commit }, id) {
    commit("SET_SUBMITTING", true)
    try {
      await this.$axios.delete(`${baseUrl}/${id}`)
      commit("REMOVE_PROJECT", id)
    } catch (error) {
      console.error("Error deleting project:", error)
      commit("SET_ERROR", error.message)
      throw error
    } finally {
      commit("SET_SUBMITTING", false)
    }
  }
}

export const getters = {
  projects: (state) => state.projects,
  getProjectById: (state) => (id) => {
    return state.projects.find((project) => project.id === id)
  },
  isSubmitting: (state) => state.submitting,
  formErrors: (state) => state.formErrors
}
