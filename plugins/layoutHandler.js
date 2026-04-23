// plugins/layoutFix.js
export default ({ app }) => {
  if (!process.client) return

  // Create a global helper function to get the layout
  app.$getCorrectLayout = ($auth) => {
    if (!$auth || !$auth.loggedIn || !$auth.user) {
      console.log("Auth not ready, using default layout")
      return "default"
    }

    if ($auth.user.type) {
      console.log("User has type, using oss layout")
      return "oss"
    } else if ($auth.user.tenant) {
      const layout = $auth.user.tenant.is_grc ? "grc" : "dashboard-layout"
      console.log("Using tenant-based layout:", layout)
      return layout
    }

    return "default"
  }
}
