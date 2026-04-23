export const state = () => ({
  categories: []
})

export const mutations = {
  setCategories(state, categories) {
    state.categories = categories
  }
}

export const actions = {
  async getCategories({ commit }) {
    const { data } = await this.$axios.get("/edu-categories")
    commit("setCategories", data.data)
  },
  async addCategory({ commit }, category) {
    const { data } = await this.$axios.post("edu-categories", category)
    commit("setCategories", data.data)
  },
  async updateCategory({ commit }, { id, payload }) {
    // const { data } = await this.$axios.post("category/update", category.id);
    const { data } = await this.$axios.post(`edu-categories/${id}`, payload)
    commit("setCategories", data.data)
  },
  async deleteCategory({ commit }, id) {
    const { data } = await this.$axios.delete(`edu-categories/${id}`)
    commit("setCategories", data.data)
  }
}
