// store/drawer.js

export const state = () => ({
  isOpen: true
})

export const mutations = {
  SET_OPEN(state, isOpen) {
    state.isOpen = isOpen
  },
  TOGGLE(state) {
    state.isOpen = !state.isOpen
  }
}

export const actions = {
  setOpen({ commit }, isOpen) {
    commit("SET_OPEN", isOpen)
  },

  toggle({ commit }) {
    commit("TOGGLE")
  },

  open({ commit }) {
    commit("SET_OPEN", true)
  },

  close({ commit }) {
    commit("SET_OPEN", false)
  }
}

export const getters = {
  isOpen: (state) => state.isOpen
}
