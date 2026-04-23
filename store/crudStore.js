// store/factory/crudStore.js
export const createCrudStore = (resourceName, customActions = {}, customMutations = {}, customGetters = {}) => {
  const baseUrl = resourceName

  const state = () => ({
    [resourceName]: [],
    loading: false,
    submitting: false
  })

  const baseGetters = {
    getItems: (state) => state[resourceName],
    getLoading: (state) => state.loading,
    getSubmitting: (state) => state.submitting,
    ...customGetters
  }

  const baseMutations = {
    storeItems(state, data) {
      state[resourceName] = data
    },
    switchLoading(state, status) {
      state.loading = status
    },
    setState(state, { name, value }) {
      state[name] = value
    },
    addItem(state, item) {
      state[resourceName].push(item)
    },
    updateItem(state, updatedItem) {
      const index = state[resourceName].findIndex((item) => item.id === updatedItem.id)
      if (index !== -1) {
        state[resourceName].splice(index, 1, updatedItem)
      }
    },
    deleteItem(state, itemId) {
      state[resourceName] = state[resourceName].filter((item) => item.id !== itemId)
    },
    ...customMutations
  }

  const baseActions = {
    async fetchItems({ commit }) {
      commit("setState", { name: "loading", value: true })
      try {
        const res = await this.$axios.get(baseUrl)
        commit("storeItems", res.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        commit("setState", { name: "loading", value: false })
      }
    },

    async createItem({ commit }, payload) {
      commit("setState", { name: "submitting", value: true })
      try {
        const res = await this.$axios.post(baseUrl, payload)
        commit("addItem", res.data.data)
        return res.data.data
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        commit("setState", { name: "submitting", value: false })
      }
    },

    async updateItem({ commit }, { id, payload }) {
      commit("setState", { name: "submitting", value: true })
      try {
        const res = await this.$axios.put(`${baseUrl}/${id}`, payload)
        commit("updateItem", res.data.data)
        return res.data.data
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        commit("setState", { name: "submitting", value: false })
      }
    },

    async deleteItem({ commit }, id) {
      commit("setState", { name: "submitting", value: true })
      try {
        await this.$axios.delete(`${baseUrl}/${id}`)
        commit("deleteItem", id)
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        commit("setState", { name: "submitting", value: false })
      }
    },
    ...customActions
  }

  return {
    state,
    getters: baseGetters,
    mutations: baseMutations,
    actions: baseActions,
    namespaced: true
  }
}
