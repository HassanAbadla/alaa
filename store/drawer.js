// store/modules/drawer.js
export default {
  namespaced: true,
  state: () => {
    return { isOpen: false, component: null, props: {}, title: "", width: 700 }
  },
  mutations: {
    setDrawerOpen(state, isOpen) {
      state.isOpen = isOpen
    },
    setDrawerContent(state, { component, props, title, width }) {
      state.component = component
      state.props = props || {}
      state.title = title || ""
      state.width = width || 700
    }
  },
  actions: {
    openDrawer({ commit }, { component, props, title, width }) {
      commit("setDrawerContent", { component, props, title, width })
      commit("setDrawerOpen", true)
    },
    closeDrawer({ commit }) {
      commit("setDrawerOpen", false)
    }
  }
}
