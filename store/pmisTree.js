// store/pmisTree.js - Clean version

// Tree construction logic
function constructTreeView(data) {
  if (!Array.isArray(data)) {
    return []
  }

  const processItem = (item, parentId = null) => {
    let icon = ""

    switch (item.link) {
      case "portfolio":
        icon = "mdi-briefcase-outline"
        break
      case "program":
        icon = "mdi-folder-outline"
        break
      case "project":
        icon = "mdi-file-document-outline"
        break
      case "contract":
        icon = "mdi-file-certificate-outline"
        break
      default:
        icon = ""
    }

    const treeItem = {
      id: item.id,
      name: item.name ? `${item.name}` : `${item.link}`,
      type: item.link,
      icon: icon,
      children: [],
      parentId: parentId
    }

    if (item.projects && item.link === "program") {
      treeItem.children = item.projects.map((project) => processItem(project, item.id))
    } else if (item.contracts && item.link === "project") {
      treeItem.children = item.contracts.map((contract) => processItem(contract, item.id))
    } else if (item.programs && item.link === "portfolio") {
      treeItem.children = item.programs.map((program) => processItem(program, item.id))
    }

    return treeItem
  }

  return data.map((item) => processItem(item))
}

export const state = () => ({
  treeData: [],
  loading: false,
  error: null
})

export const mutations = {
  SET_TREE_DATA(state, data) {
    state.treeData = data
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchTreeData({ commit }) {
    try {
      commit("SET_LOADING", true)
      commit("SET_TREE_DATA", [])

      const response = await this.$axios.get("tree_menu")

      // Handle different possible response structures
      let responseData = []
      if (response.data?.data) {
        responseData = response.data.data
      } else if (Array.isArray(response.data)) {
        responseData = response.data
      } else if (response.data) {
        responseData = [response.data]
      }

      if (!Array.isArray(responseData)) {
        responseData = [responseData]
      }

      const transformedData = constructTreeView(responseData)

      commit("SET_TREE_DATA", transformedData)
      commit("SET_ERROR", null)

      return transformedData
    } catch (error) {
      commit("SET_ERROR", error)
      console.error("Error fetching tree data:", error)
      throw error
    } finally {
      commit("SET_LOADING", false)
    }
  }
}

export const getters = {
  getTreeData: (state) => state.treeData,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}
