export const state = () => ({
  workspaces: [],
  workspaceId: null,
});

export const mutations = {
  set(state, items) {
    state.workspaces = items;
  },

  ADD_WORKSPACE(state, workspace) {
    state.workspaces.push(workspace);
  },

  REMOVE_WORKSPACE(state, id) {
    state.workspaces = state.workspaces.map((category) => ({
      ...category,
      workspaces: category.workspaces.filter(
        (workspace) => workspace.id !== id
      ),
    }));
  },
  SET_WORKSPACE_ID(state, id) {
    state.workspaceId = id;
  },
};

export const actions = {
  async fetchWorkspaces({ commit }) {
    const res = await this.$axios.get("/workspaces");
    commit("set", res.data.data);
  },

  async create({ commit }, workspace) {
    const res = await this.$axios.post("/workspace/store", workspace);
    commit("ADD_WORKSPACE", res.data.data);
  },

  async update({ commit }, { id, payload }) {
    const res = await this.$axios.post(`/workspace/update/${id}`, payload);
    // commit("ADD_WORKSPACE", res.data.data);
  },

  async delete({ commit }, id) {
    const res = await this.$axios.delete(`/workspace/delete/${id}`);
    commit("REMOVE_WORKSPACE", id);
  },

  setCurrentWorkspace({ commit }, id) {
    commit("SET_WORKSPACE_ID", id);
  },
};
