// helpers/auth.js
export function layoutPicker($auth) {
  if ($auth.loggedIn) {
    if ($auth.user?.type) {
      if ($auth.user?.type?.code == "teacher" || $auth.user?.type?.code == "student") {
        return "education"
      }
      if ($auth.user?.type?.code == "tasks") {
        return "otm"
      }
      return "oss"
    }
    return $auth.user && $auth.user.tenant && $auth.user.tenant.is_grc ? "grc" : "dashboard-layout"
  }
  return "default"
}
