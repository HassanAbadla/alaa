import Vue from "vue"
export const state = () => ({
  lists: [],
  listsSelection: [],
  filteredTasks: [],
  listViewTasks: [],
  tasksByReceiver: [],
  tasksByModule: []
})

export const mutations = {
  setLists(state, lists) {
    state.lists = lists
  },
  ADD_LIST(state, list) {
    state.lists.push(list)
  },
  UPDATE_LISTS(state, lists) {
    state.lists = lists
  },
  UPDATE_PERMISSIONS(state, { index, users }) {
    // Create new array reference for reactivity
    const lists = [...state.lists]
    lists[index].users = users
    state.lists = lists
  },
  UPDATE_LIST_ORDERS(state, { listId, orders }) {
    const list = state.lists.find((l) => l.id === listId)
    if (list) {
      list.orders = orders
    }
  },
  SYNC_ORDERS_DATA(state, ordersData) {
    state.lists = ordersData
  },
  UPDATE_TASK(state, task) {
    console.log("Updating task:", task)

    const list = state.lists.find((l) => l.id === task.list_id)
    const taskInFilteredList = state.filteredTasks.find((l) => l.id === task.id)
    console.log("list:", list)
    console.log("taskInFilteredList:", taskInFilteredList)

    if (!list && !taskInFilteredList) {
      console.warn("No list found for task", task)
      return
    }
    if (list) {
      const taskIndex = list.orders.findIndex((t) => t.id === task.id)
      if (taskIndex !== -1) {
        list.orders[taskIndex] = task
        Vue.set(list.orders, taskIndex, task)
      }
    }
  },
  // Update a specific task in the filtered tasks
  UPDATE_FILTERED_TASK(state, task) {
    // Update in filteredTasks
    const taskIndex = state.filteredTasks.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      Vue.set(state.filteredTasks, taskIndex, task)
    }
    // Update in lists.orders
    const list = state.lists.find((l) => l.id === task.list_id)
    if (list && Array.isArray(list.orders)) {
      const orderIndex = list.orders.findIndex((o) => o.id === task.id)
      if (orderIndex !== -1) {
        Vue.set(list.orders, orderIndex, task)
      }
    }
  },
  ADD_ITEM_ATTACHMENT(state, response) {
    // Find the list containing the order
    console.log("response:", response)

    // const list = state.lists.find(
    //   (l) => Array.isArray(l.orders) && l.orders.some((o) => o.id === Number(response.order.id))
    // )
    // console.log("list:", list)
    // if (list) {
    //   const orderIndex = list.orders.findIndex((o) => o.id === Number(response.order.id))
    //   if (orderIndex !== -1) {
    //     // Ensure orderAttachements is an array
    //     if (!Array.isArray(list.orders[orderIndex].orderAttachements)) {
    //       Vue.set(list.orders[orderIndex], "orderAttachements", [])
    //     }
    //     // Add the new attachment
    //     list.orders[orderIndex].orderAttachements.push(response)
    //   }
    // }

    // Update in filteredTasks if present
    const filteredTaskIndex = state.filteredTasks.findIndex((t) => t.id === Number(response.order.id))
    console.log("filteredTaskIndex:", filteredTaskIndex)
    if (filteredTaskIndex !== -1) {
      if (!Array.isArray(state.filteredTasks[filteredTaskIndex].orderAttachements)) {
        Vue.set(state.filteredTasks[filteredTaskIndex], "orderAttachements", [])
      }
      state.filteredTasks[filteredTaskIndex].orderAttachements.push(response)
    }
  },
  UPDATE_LIST(state, list) {
    const index = state.lists.findIndex((item) => item.id === list.id)
    if (index !== -1) {
      state.lists[index] = list
    }
  },
  setListsSelection(state, lists) {
    state.listsSelection = lists
  },
  REMOVE_LIST(state, id) {
    const index = state.lists.findIndex((list) => list.id === id)
    if (index !== -1) {
      state.lists.splice(index, 1)
    }
  },
  setFilteredTasks(state, tasks) {
    state.filteredTasks = tasks
  },
  SET_LIST_VIEW_TASKS(state, tasks) {
    state.listViewTasks = tasks
  },
  RESET_STATE(state) {
    state.lists = []
    state.listsSelection = []
    state.filteredTasks = []
    state.listViewTasks = []
  },
  setSammary(state, sammary) {
    state.tasksByReceiver = sammary.grouped_by_receiver
    state.tasksByModule = sammary.grouped_by_module
  }
}

export const actions = {
  async fetchLists({ commit }, filters = {}) {
    const res = await this.$axios.$get("/tasks", { params: filters })
    commit("setLists", res.data)
  },
  async addList({ commit, dispatch }, list) {
    const res = await this.$axios.post("/tasks", list)
    commit("ADD_LIST", res.data.data)
    await dispatch("fetchLists")
  },
  async updateList({ commit, dispatch }, { id, payload }) {
    const res = await this.$axios.put(`/tasks/${id}`, payload)
    await dispatch("fetchLists")
    commit("UPDATE_LIST", res.data.data)
  },
  async deleteList({ commit, dispatch }, id) {
    const res = await this.$axios.delete(`/tasks/${id}`)
    await dispatch("fetchLists")
  },

  // for list view
  async getListsSelection({ commit }) {
    const res = await this.$axios.$get("/lists")
    commit("setListsSelection", res.data)
  },

  // display orders/Tasks in list view
  async getListViewTasks({ commit }, listId) {
    const res = await this.$axios.$get("/tasks", { params: filters })
    commit("SET_LIST_VIEW_TASKS", res.data)
  },
  async tasksSammary({ commit }, filters = {}) {
    const res = await this.$axios.$get("/tasks-sammary", { params: filters })
    commit("setSammary", res.data)
  }
}
