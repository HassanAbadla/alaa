import Vue from "vue"

export const state = () => ({
  posts: [],
  isLoadingPosts: false,
  isDeletingPost: false,
  isSubmittingPost: false,
  isfetchingPost: false,
  selectedPost: null,
  expandAll: false,
  showMessageForm: false,
  isEditForm: false
})

const customPostProperties = [
  { name: "expanded", value: false },
  { name: "showReplies", value: false },
  { name: "showReplyInput", value: false },
  { name: "replyText", value: "" },
  { name: "isSubmitting", value: false }
]

export const mutations = {
  setPosts(state, posts) {
    // Transform the incoming posts array
    state.posts = posts.map((post) => {
      // Add custom properties to each post
      customPostProperties.forEach(({ name, value }) => {
        post[name] = value
      })

      // Add isSubmitting property to each comment in the post
      post.comments = post.comments.map((comment) => ({
        ...comment,
        isSubmitting: false,
        editBody: comment.body,
        isEditing: false
      }))

      return post
    })
  },
  addPost(state, post) {
    state.posts.push(post)
  },
  updatePost(state, updatedPost) {
    // Find the index of the post to update
    const index = state.posts.findIndex((post) => post.id === updatedPost.id)

    if (index !== -1) {
      // Create an array of custom property names for easy checking
      const customPropertyNames = customPostProperties.map((prop) => prop.name)

      // Update each property individually to maintain reactivity
      Object.keys(updatedPost).forEach((key) => {
        // Only update properties that are not custom properties
        if (!customPropertyNames.includes(key)) {
          Vue.set(state.posts[index], key, updatedPost[key])
        }
      })

      // Ensure all custom properties exist on the post
      customPostProperties.forEach(({ name, value }) => {
        if (!state.posts[index].hasOwnProperty(name)) {
          Vue.set(state.posts[index], name, value)
        }
      })
    }
  },
  deletePost(state) {
    if (state.selectedPost) {
      state.posts = state.posts.filter((post) => post.id !== state.selectedPost.id)
      state.selectedPost = null
    }
  },
  setSelectedPost(state, post) {
    state.selectedPost = post
  },
  setLoading(state, { stateName, value }) {
    state[stateName] = value
  },
  toggleExpand(state, index) {
    Vue.set(state.posts[index], "expanded", !state.posts[index].expanded)
  },
  setExpandAll(state, value) {
    state.expandAll = value
    state.posts.forEach((post, index) => {
      Vue.set(state.posts[index], "expanded", value)
    })
  },
  toggleShowReplies(state, index) {
    Vue.set(state.posts[index], "showReplies", !state.posts[index].showReplies)
  },
  toggleReplyInput(state, index) {
    Vue.set(state.posts[index], "showReplyInput", !state.posts[index].showReplyInput)
    if (!state.posts[index].showReplyInput) {
      Vue.set(state.posts[index], "replyText", "")
    }
  },
  setReplyText(state, { index, text }) {
    Vue.set(state.posts[index], "replyText", text)
  },
  setCommentText(state, { index, commentIndex, text }) {
    Vue.set(state.posts[index].comments[commentIndex], "editBody", text)
  },

  setShowMessageForm(state, value) {
    state.showMessageForm = value
  },
  setEditFormValue(state, value) {
    state.isEditForm = value
  },
  isSubmittingComment(state, { index, value }) {
    Vue.set(state.posts[index], "isSubmitting", value)
  },
  addComment(state, { index, comment }) {
    state.posts[index].comments.push(comment)
    Vue.set(state.posts[index], "replyText", "")
    Vue.set(state.posts[index], "showReplyInput", false)
    Vue.set(state.posts[index], "showReplies", true)
  }
}

export const actions = {
  async fetchAllPosts({ commit }, { postableType, postableId }) {
    commit("setLoading", { stateName: "isLoadingPosts", value: true })
    try {
      const { data } = await this.$axios.get(`posts?postable_type=${postableType}&postable_id=${postableId}`)
      commit("setPosts", data.data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      commit("setLoading", { stateName: "isLoadingPosts", value: false })
    }
  },

  async createPost({ commit }, payload) {
    commit("setLoading", { stateName: "isSubmittingPost", value: true })
    try {
      const res = await this.$axios.post("posts", payload)
      commit("addPost", res.data.data)

      commit("setShowMessageForm", false)
      return res
    } catch (error) {
      console.error("Error creating post:", error)
      return error
    } finally {
      commit("setLoading", { stateName: "isSubmittingPost", value: false })
    }
  },
  async updatePost({ commit }, { postId, payload }) {
    commit("setLoading", { stateName: "isSubmittingPost", value: true })
    try {
      const res = await this.$axios.put(`posts/${postId}`, payload)
      commit("updatePost", res.data.data)
      commit("setShowMessageForm", false)
      return res
    } catch (error) {
      console.error("Error updating post:", error)
      return error
    } finally {
      commit("setLoading", { stateName: "isSubmittingPost", value: false })
    }
  },
  async deletePost({ commit, state }) {
    commit("setLoading", { stateName: "isDeletingPost", value: true })
    try {
      const res = await this.$axios.delete(`posts/${state.selectedPost?.id}`)
      commit("deletePost")
    } catch (error) {
    } finally {
      commit("setLoading", { stateName: "isDeletingPost", value: false })
    }
  },
  async createComment({ commit, state }, index) {
    commit("isSubmittingComment", { index, value: true })
    try {
      const post = state.posts[index]
      const res = await this.$axios.post("comments", { post_id: post.id, body: post.replyText })
      const comment = res.data.data
      commit("addComment", { index, comment })
    } catch (error) {
    } finally {
      commit("isSubmittingComment", { index, value: false })
    }
  },
  toggleExpand({ commit }, index) {
    commit("toggleExpand", index)
  },
  toggleAllMessages({ commit, state }) {
    commit("setExpandAll", !state.expandAll)
  },
  showReplies({ commit }, index) {
    commit("toggleShowReplies", index)
  },
  toggleReplyInput({ commit }, index) {
    commit("toggleReplyInput", index)
  },

  toggleShowMessageForm({ commit, state }) {
    commit("setShowMessageForm", !state.showMessageForm)
  },
  setEditFormValue({ commit }, value) {
    commit("setEditFormValue", value)
  },
  setSelectedPost({ commit }, post) {
    commit("setSelectedPost", post)
  },
  setReplyText({ commit }, { index, text }) {
    commit("setReplyText", { index, text })
  },
  setCommentText({ commit }, { index, commentIndex, text }) {
    commit("setCommentText", { index, commentIndex, text })
  }
}
