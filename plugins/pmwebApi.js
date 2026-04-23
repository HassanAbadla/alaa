import axios from "axios"

const pmwebApi = axios.create({
  baseURL: "https://api.ordonsoft.com/api/pmweb/",
  headers: {}
})

export default function ({ $axios, store }, inject) {
  pmwebApi.interceptors.request.use(async (config) => {
    if (!store.state.pmweb.PMWebAuth && !store.state.pmweb.isAuthenticating) {
      console.log("No auth token, attempting to authenticate")
      try {
        await store.dispatch("pmweb/authenticate")
      } catch (error) {
        console.error("Authentication failed in interceptor", error)
      }
    }

    const PMWebAuth = store.state.pmweb.PMWebAuth
    if (PMWebAuth) {
      config.headers.PMWebAuth = PMWebAuth
    } else {
      console.warn("No PMWebAuth token available for request")
    }
    return config
  })

  inject("pmwebApi", pmwebApi)
}
