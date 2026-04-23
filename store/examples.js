export const state = () => ({
  example: [],
  loading: true
})

export const getters = {
  getData(state) {
    return state.example
  },
  getLoading(state) {
    return state.loading
  }
}

export const mutations = {
  storeData(state, data) {
    state.example = data
  },

  switchLoading(state, status) {
    state.loading = status
  }
}

export const actions = {
  fetchData(store) {
    store.commit("switchLoading", true)
    this.$axios
      .get("example", {})
      .then((res) => {
        if (res.data.status == "success") store.commit("storeData", res.data.data)
      })
      .finally(() => {
        store.commit("switchLoading", false)
      })
  }
}
