import { checkForSubscription } from "../api/subscriptions-api"

export default function ({ store, redirect, i18n, $axios }) {
  checkForSubscription($axios).then((res) => {
    // if (!res.data.data) {
    //   redirect("/grc/subscribe")
    // }
  })
}
