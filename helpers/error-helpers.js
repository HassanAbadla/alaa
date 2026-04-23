export function generateErrorMessage(error, $i18n) {
  console.log(error)
  let message = {
    title: $i18n.t("error.error"),
    text: $i18n.t("error.generic"),
    code: null
  }

  if (error.response) {
    message.code = error.response.status

    switch (error.response.status) {
      case 400:
        message.text = $i18n.t("error.bad_request")
        break
      case 401:
        message.text = $i18n.t("error.unauthorized")
        break
      case 403:
        message.text = $i18n.t("error.forbidden")
        break
      case 404:
        message.text = $i18n.t("error.not_found")
        break
      case 429:
        message.text = $i18n.t("error.too_many_requests")
        break
      case 500:
        message.text = $i18n.t("error.server_error")
        break
      default:
        message.text = $i18n.t("error.generic")
    }
  }

  return message
}
