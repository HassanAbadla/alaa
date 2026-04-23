export const state = () => ({
  stories: []
})

export const mutations = {
  setStories(state, stories) {
    state.stories = stories
  },
  ADD_STORY(state, story) {
    state.stories.push(story)
  },
  UPDATE_STORY(state, story) {
    const index = state.stories.findIndex((s) => s.id === story.id)
    state.stories[index] = story
  },
  REMOVE_STORY(state, id) {
    state.stories = state.stories.filter((s) => s.id !== id)
  }
}

export const actions = {
  async fetchStories({ commit }) {
    const res = await this.$axios.get("/stories")
    commit("setStories", res.data.data)
  },
  async getStories({ commit }, id) {
    const res = await this.$axios.get("/stories/" + id)
    commit("setStories", res.data.data)
  },
  async addStory({ commit }, story) {
    const res = await this.$axios.post("/story/store", story)
    commit("ADD_STORY", res.data.data)
  },
  async updateStory({ commit }, { id, payload }) {
    const res = await this.$axios.post(`/story/update/${id}`, payload)
    commit("UPDATE_STORY", res.data.data)
  },
  async deleteStory({ commit }, id) {
    const res = await this.$axios.delete(`/story/delete/${id}`)
    commit("REMOVE_STORY", id)
  },
  async getMyStories({ commit }) {
    const res = await this.$axios.get("/edu-student-stories/my-stories")
    commit("setStories", res.data.data)
  }
}
