// assets.js store
export const state = () => ({
  assets: [],
  assetsChart: [],
  assetsCategories: [],
  criticalities: [],
  loadingAssets: false,
  loadingCategories: false,
  loadingCriticalities: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingImport: false
})

export const mutations = {
  SET_ASSETS(state, assets) {
    state.assets = assets
  },
  SET_ASSETS_CHART(state, chartData) {
    state.assetsChart = chartData
  },
  SET_CATEGORIES(state, assetsCategories) {
    state.assetsCategories = assetsCategories
  },
  SET_CRITICALITIES(state, criticalities) {
    state.criticalities = criticalities
  },
  SET_LOADING_ASSETS(state, status) {
    state.loadingAssets = status
  },
  SET_LOADING_CATEGORIES(state, status) {
    state.loadingCategories = status
  },
  SET_LOADING_CRITICALITIES(state, status) {
    state.loadingCriticalities = status
  },
  SET_LOADING_CREATE(state, status) {
    state.loadingCreate = status
  },
  SET_LOADING_UPDATE(state, status) {
    state.loadingUpdate = status
  },
  SET_LOADING_DELETE(state, status) {
    state.loadingDelete = status
  },
  SET_LOADING_IMPORT(state, status) {
    state.loadingImport = status
  }
}

export const getters = {
  assets: (state) => state.assets,
  assetsChart: (state) => state.assetsChart,
  categories: (state) => state.assetsCategories,
  criticalities: (state) => state.criticalities,
  loadingAssets: (state) => state.loadingAssets,
  loadingCategories: (state) => state.loadingCategories,
  loadingCriticalities: (state) => state.loadingCriticalities,
  loadingCreate: (state) => state.loadingCreate,
  loadingUpdate: (state) => state.loadingUpdate,
  loadingDelete: (state) => state.loadingDelete,
  loadingImport: (state) => state.loadingImport
}

export const actions = {
  async fetchAssets({ commit }, filters = {}) {
    commit("SET_LOADING_ASSETS", true)
    try {
      const response = await this.$axios.get("grc-assets", { params: filters })
      commit("SET_ASSETS", response.data.data)
      commit("SET_ASSETS_CHART", response.data.chart_data)
    } catch (error) {
      console.error("Error fetching assets:", error)
      throw error
    } finally {
      commit("SET_LOADING_ASSETS", false)
    }
  },

  async createAsset({ commit }, payload) {
    commit("SET_LOADING_CREATE", true)
    try {
      const response = await this.$axios.post("grc-assets", payload)
      return response.data.data
    } catch (error) {
      console.error("Error creating asset:", error)
      throw error
    } finally {
      commit("SET_LOADING_CREATE", false)
    }
  },

  async updateAsset({ commit, dispatch }, { id, payload }) {
    commit("SET_LOADING_UPDATE", true)
    try {
      const response = await this.$axios.put(`grc-assets/${id}`, payload)
      await dispatch("fetchAssets")
      return response.data.data
    } catch (error) {
      console.error("Error updating asset:", error)
      throw error
    } finally {
      commit("SET_LOADING_UPDATE", false)
    }
  },

  async deleteAsset({ commit, dispatch }, id) {
    commit("SET_LOADING_DELETE", true)
    try {
      const response = await this.$axios.delete(`grc-assets/${id}`)
      await dispatch("fetchAssets")
      return response.data.data
    } catch (error) {
      console.error("Error deleting asset:", error)
      throw error
    } finally {
      commit("SET_LOADING_DELETE", false)
    }
  },

  // Lookups
  async fetchCategories({ commit }) {
    commit("SET_LOADING_CATEGORIES", true)
    try {
      const response = await this.$axios.get("grc-asset-categories")
      commit("SET_CATEGORIES", response.data.data)
    } catch (error) {
      console.error("Error fetching assets categories:", error)
      throw error
    } finally {
      commit("SET_LOADING_CATEGORIES", false)
    }
  },

  async fetchCriticalities({ commit }) {
    commit("SET_LOADING_CRITICALITIES", true)
    try {
      const response = await this.$axios.get("criticalities")
      commit("SET_CRITICALITIES", response.data.data)
    } catch (error) {
      console.error("Error fetching assets criticalities:", error)
      throw error
    } finally {
      commit("SET_LOADING_CRITICALITIES", false)
    }
  },

  async importAssets({ commit, dispatch }, payload) {
    commit("SET_LOADING_IMPORT", true)
    try {
      const response = await this.$axios.post("assets/import", payload)
      return response
    } catch (error) {
      console.error("Error importing assets:", error)
      throw error
    } finally {
      commit("SET_LOADING_IMPORT", false)
    }
  }
}
