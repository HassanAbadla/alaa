// store/alert.js
export const state = () => ({
  message: null,
  color: null
})

export const mutations = {
  showMessage(state, { content, color }) {
    state.message = content
    state.color = color
  }
}
