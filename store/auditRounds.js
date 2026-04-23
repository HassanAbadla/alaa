// store/auditRounds.js
export const state = () => ({
  selectedItemId: null,
  parentIdOfSelectedItem: null
})

export const mutations = {
  SET_SELECTED_ITEM(state, itemId) {
    state.selectedItemId = itemId
  },
  SET_PARENT_ITEM(state, parentId) {
    state.parentIdOfSelectedItem = parentId
  },
  CLEAR_SELECTED_ITEM(state) {
    state.selectedItemId = null
    state.parentIdOfSelectedItem = null
  }
}

export const getters = {
  selectedItemId: (state) => state.selectedItemId,
  parentIdOfSelectedItem: (state) => state.parentIdOfSelectedItem
}

export const actions = {
  saveSelectedItem({ commit }, { itemId, parentId = null }) {
    commit("SET_SELECTED_ITEM", itemId)
    commit("SET_PARENT_ITEM", parentId)
  },
  clearSelectedItem({ commit }) {
    commit("CLEAR_SELECTED_ITEM")
  }
}
