// plugins/navigation-history.js
export default ({ app, store }) => {
  // Create navigation store if it doesn't exist
  if (!store.state.navigation) {
    store.registerModule("navigation", {
      namespaced: true,
      state: () => ({
        previousRoute: null
      }),
      mutations: {
        SET_PREVIOUS_ROUTE(state, route) {
          state.previousRoute = route
        }
      }
    })
  }

  // Track route changes
  app.router.beforeEach((to, from, next) => {
    // Skip if this is initial navigation
    if (from.name) {
      const fromRouteData = {
        path: from.path,
        fullPath: from.fullPath,
        name: from.name
      }
      store.commit("navigation/SET_PREVIOUS_ROUTE", fromRouteData)
    }
    next()
  })
}
