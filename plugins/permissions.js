export default ({ app }, inject) => {
  // Inject $hasPermission into Vue, context, and store
  inject("hasPermission", (permission) => {
    if (!app.$auth.loggedIn || !app.$auth.user) {
      return false
    }

    const userPermissions = app.$auth.user.permissions || []

    // Handle single permission (string)
    if (typeof permission === "string") {
      return userPermissions.includes(permission)
    }

    // Handle multiple permissions (array) - returns true if user has ANY
    if (Array.isArray(permission)) {
      return permission.some((perm) => userPermissions.includes(perm))
    }

    return false
  })

  // Optional: Inject $hasAllPermissions for AND logic
  inject("hasAllPermissions", (permissions) => {
    if (!app.$auth.loggedIn || !app.$auth.user) {
      return false
    }

    const userPermissions = app.$auth.user.permissions || []

    if (!Array.isArray(permissions)) {
      permissions = [permissions]
    }

    return permissions.every((perm) => userPermissions.includes(perm))
  })
}
