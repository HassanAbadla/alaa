export const state = () => ({
  project_checklist: [],
  selected_stage: [],
  doneItems: new Set(),
  openNodes: [],
  loading: true
})

export const getters = {
  getProjectChecklist(state) {
    return state.project_checklist.map((item) => {
      if (item.hasOwnProperty("project_checklists")) {
        item.project_checklists.map((checklist) => {
          checklist.disabled = !item.project_stage[0] || item.project_stage[0].is_started == 0
          checklist.children.map((child) => {
            child.disabled = !item.project_stage[0] || item.project_stage[0].is_started == 0
          })
        })
        return {
          ...item,
          children: item.project_checklists,
          project_checklists: undefined
        }
      } else {
        return item
      }
    })
  },
  getSelectedStage(state) {
    return state.selected_stage.map((item) => {
      // Add a check to ensure project_checklists exists
      const projectChecklists = item.project_checklists || []

      return {
        ...item,
        children: projectChecklists.map((checklist) => {
          // Add a check to ensure children exists
          const children = checklist.children || []

          return {
            ...checklist,
            done: state.doneItems.has(checklist.id),
            children: children.map((child) => ({
              ...child,
              done: state.doneItems.has(child.id)
            }))
          }
        })
      }
    })
  },
  getOpenNodes(state) {
    return state.openNodes
  },
  getLoading(state) {
    return state.loading
  },
  isDoneItem: (state) => (id) => {
    const result = state.doneItems.has(id)

    return result
  }
}

export const mutations = {
  SET_PROJECT_CHECKLIST(state, project_checklist) {
    state.project_checklist = project_checklist
  },
  UPDATE_CHECKLIST_ITEM(state, { id, done, status }) {
    if (done) {
      state.doneItems.add(id)
    } else {
      state.doneItems.delete(id)
    }

    const updateItemRecursively = (items) => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, done, status }
        }
        if (item.children) {
          return { ...item, children: updateItemRecursively(item.children) }
        }
        return item
      })
    }

    state.selected_stage = updateItemRecursively(state.selected_stage)
    state.project_checklist = updateItemRecursively(state.project_checklist)
  },
  SET_INITIAL_DONE_ITEMS(state, project_checklist) {
    state.doneItems.clear()
    const addDoneItems = (items) => {
      items.forEach((item) => {
        if (item.done) {
          state.doneItems.add(item.id)
        }
        if (item.project_checklists) {
          addDoneItems(item.project_checklists)
        }
        if (item.children) {
          addDoneItems(item.children)
        }
      })
    }
    addDoneItems(project_checklist)
  },
  SET_SELECTED_STAGE(state, { stage_id, project_checklist }) {
    state.selected_stage = project_checklist.filter((item) => item.id == stage_id)
  },
  SET_OPEN_NODES(state, nodeIds) {
    state.openNodes = nodeIds
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ITEM_LOGS(state, { id, logs }) {
    const updateItemLogsRecursively = (items) => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, logs }
        }
        if (item.children) {
          return { ...item, children: updateItemLogsRecursively(item.children) }
        }
        if (item.project_checklists) {
          return { ...item, project_checklists: updateItemLogsRecursively(item.project_checklists) }
        }
        return item
      })
    }

    state.project_checklist = updateItemLogsRecursively(state.project_checklist)
    state.selected_stage = updateItemLogsRecursively(state.selected_stage)
  }
}

export const actions = {
  fetchProjectChecklist({ commit }, { project_id, stage_id, contract_id }) {
    commit("SET_LOADING", true)
    return this.$axios
      .get(`project-checklist?project_id=${project_id}&contract_id=${contract_id}`)
      .then((res) => {
        commit("SET_PROJECT_CHECKLIST", res.data.data)
        commit("SET_INITIAL_DONE_ITEMS", res.data.data)
        commit("SET_SELECTED_STAGE", {
          stage_id,
          project_checklist: res.data.data
        })
      })
      .finally(() => {
        commit("SET_LOADING", false)
      })
  },
  openNodes({ commit }, nodeIds) {
    commit("SET_OPEN_NODES", nodeIds)
  },
  updateChecklistItem({ commit }, { updatedItem, projectId, contractId }) {
    // Build the payload with conditionally included fields
    const payload = {
      project_checklist_id: updatedItem.id,
      project_id: projectId,
      contract_id: contractId,
      done: updatedItem.done
    }

    // Add status if provided
    if (updatedItem.status) {
      payload.checklist_status_id = updatedItem.status.id
    }

    // Add dates if provided (including null values to clear dates)
    if (updatedItem.hasOwnProperty("start_date")) {
      payload.start_date = updatedItem.start_date
    }
    if (updatedItem.hasOwnProperty("end_date")) {
      payload.end_date = updatedItem.end_date
    }

    return this.$axios.post("project-checklist/update", payload).then((response) => {
      commit("UPDATE_CHECKLIST_ITEM", {
        id: updatedItem.id,
        done: updatedItem.done,
        status: updatedItem.status
      })
      if (response.data && response.data?.data && response.data.data.logs) {
        commit("SET_ITEM_LOGS", { id: updatedItem.id, logs: response.data.data.logs })
      }
    })
  }
}
