// plugins/build-info.js
import buildInfo from "../build-info.json"

export default function ({ app }, inject) {
  inject("buildInfo", buildInfo)
}
