export const state = () => ({
  displayCount: true
})

export const mutations = {
  TOGGLE_DISPLAY(state) {
    state.displayCount = !state.displayCount
  }
}

export const actions = {
  toggleHeatmapDisplay({ commit }) {
    commit("TOGGLE_DISPLAY")
  }
}
