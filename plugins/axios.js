// plugins/axios.js
export default function ({ $axios, $cookies, $toast, store, route, redirect }) {
  $axios.setHeader("lang", $cookies.get("lang"))

  $axios.onResponse((res) => {
    if (res.data) {
      if (res.data.message) {
        $toast.showMessage(res.data)
      }
    }
    if (res.data.status == "error") {
      let { errors } = res.data
      errors = Object.values(errors)
      errors.map((item) => {
        $toast.showError(item[0])
      })
    }
  })

  $axios.onError((res) => {
    if (res.response.data.has_no_access) {
      // Only redirect if not already on /main
      if (route.path !== "/main") {
        redirect("/main")
      } else {
        console.log("Access denied on main page")
      }
      return
    }

    if (res.response.status === 401) {
      store.$auth.logout()
    }
    if (res.response.data.errors) {
      let { errors } = res.response.data
      errors = Object.values(errors)
      errors.forEach((items) => {
        items.forEach((item) => $toast.showError(item))
      })
    }
    if (res.response.data.message) {
      $toast.showError(res.response.data.message)
    }
  })
}
