import axios from "axios"

const orsApi = axios.create({
  baseURL: "https://rasidapi.ut.edu.sa/api/",
  // baseURL: "https://pmis.ut.edu.sa/API/PMWeb/Rest/",
  headers: {}
})

export default function ({ $axios, store }, inject) {
  orsApi.interceptors.request.use(async (config) => {
    return config
  })

  inject("orsApi", orsApi)
}
