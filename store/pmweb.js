export const state = () => ({
  PMWebAuth: null,
  authError: null,
  isAuthenticating: false
})

export const mutations = {
  setPMWebAuth(state, token) {
    state.PMWebAuth = token
  },
  setAuthError(state, error) {
    state.authError = error
  },
  setIsAuthenticating(state, value) {
    state.isAuthenticating = value
  }
}

export const actions = {
  async authenticate({ commit, state }) {
    if (state.PMWebAuth) {
      console.log("Already authenticated")
      return state.PMWebAuth
    }

    if (state.isAuthenticating) {
      console.log("Authentication already in progress")
      return null
    }

    console.log("Starting authentication process")
    commit("setIsAuthenticating", true)
    commit("setAuthError", null)
    try {
      console.log("Sending authentication request")
      const response = await this.$pmwebApi.get(`token`, { timeout: 10000 })
      console.log("Authentication response received")
      console.log("Response status:", response.status)

      if (typeof response.data === "object" && response.data !== null) {
        const token = response.data.Token
        if (typeof token === "string" && token.length > 0) {
          console.log("Valid token received")
          commit("setPMWebAuth", token)
          return token
        } else {
          throw new Error("Invalid token received")
        }
      } else {
        throw new Error("Unexpected response format")
      }
    } catch (error) {
      console.error("Authentication failed", error)
      commit("setAuthError", error.message || "Authentication failed")
      throw error
    } finally {
      commit("setIsAuthenticating", false)
    }
  }
}
