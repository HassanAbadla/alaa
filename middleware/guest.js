export default function ({ store, redirect, i18n }) {
  // If the user is authenticated
  if (store.$auth.loggedIn) {
    let locale = i18n.locale === i18n.defaultLocale ? "" : "/" + i18n.locale
    redirect(locale + "/")
  }
}
