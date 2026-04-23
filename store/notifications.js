const state = {
  notifications: [],
  loading: false
}

const getters = {
  allNotifications: (state) => state.notifications,
  isLoading: (state) => state.loading
}

const actions = {
  async fetchNotifications({ commit }) {
    commit("setLoading", true)
    try {
      const response = await this.$axios.get("notifications")

      commit("setNotifications", response.data.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      commit("setLoading", false)
    }
  },
  async markNotificationRead({ commit }, id) {
    if (!id) return
    try {
      const response = await this.$axios.post(`read-notification/${id}`)
      const updatedNotification = response?.data?.data

      if (updatedNotification) {
        commit("updateNotification", updatedNotification)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }
}

const mutations = {
  setNotifications: (state, notifications) => {
    state.notifications = notifications
  },
  setLoading: (state, loading) => {
    state.loading = loading
  },
  updateNotification: (state, updatedNotification) => {
    const index = state.notifications.findIndex((n) => n.id === updatedNotification.id)
    if (index !== -1) {
      state.notifications.splice(index, 1, { ...state.notifications[index], ...updatedNotification })
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
