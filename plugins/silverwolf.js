import axios from "axios"

export default ({}, inject) => {
  const silverwolf = axios.create({
    baseURL: "https://silverwolf.dphish.live/api/"
  })

  inject("silverwolf", silverwolf)
}
