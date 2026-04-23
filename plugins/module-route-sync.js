// plugins/module-route-sync.js
export default function ({ app, store }) {
  // Function to find module by checking if current route matches any sub-module link
  function findModuleByRoute(currentRoute) {
    const modules = store.state.modules.modules || []

    for (const module of modules) {
      if (module.sub_modules && module.sub_modules.length > 0) {
        // Check if any sub-module link matches the current route
        const matchingSubModule = module.sub_modules.find((subModule) => {
          if (!subModule.link) return false

          // Clean the link - remove leading slash for comparison
          const cleanLink = subModule.link.startsWith("/") ? subModule.link.slice(1) : subModule.link

          // Clean the current route
          const cleanRoute = currentRoute.startsWith("/") ? currentRoute.slice(1) : currentRoute

          // Check for exact match or if route starts with the link
          return cleanRoute === cleanLink || cleanRoute.startsWith(cleanLink + "/")
        })

        if (matchingSubModule) {
          return module
        }
      }
    }

    return null
  }

  // Function to sync module selection with current route
  function syncModuleWithRoute() {
    const currentRoute = app.router.currentRoute.path
    const foundModule = findModuleByRoute(currentRoute)

    if (foundModule) {
      const currentlySelected = store.state.modules.selectedModule

      // Only update if it's different from currently selected
      if (!currentlySelected || currentlySelected.id !== foundModule.id) {
        // Use the store action to set the module (this handles persistence too)
        store.commit("modules/SET_SELECTED_MODULE", foundModule)
        console.log(`Auto-selected module: ${foundModule.name} for route: ${currentRoute}`)
      }
    }
    // If no module found, keep current selection (as per your requirement)
  }

  // Run on initial load
  if (process.client) {
    // Wait for modules to be loaded
    const unsubscribe = store.watch(
      (state) => state.modules.modules,
      (modules) => {
        if (modules && modules.length > 0) {
          syncModuleWithRoute()
          unsubscribe() // Stop watching once we've synced
        }
      },
      { immediate: true }
    )
  }

  // Run on every route change
  app.router.afterEach((to, from) => {
    if (process.client) {
      // Small delay to ensure the route change is complete
      setTimeout(() => {
        syncModuleWithRoute()
      }, 50)
    }
  })
}
