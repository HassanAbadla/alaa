export const state = () => ({
  language: "en",
  isRTL: false
})

export const mutations = {
  setLanguage(state, lang) {
    state.language = lang
    const locale = this.$i18n.locales.find((l) => l.code === lang)
    state.isRTL = locale?.dir === "rtl"
  }
}

export const actions = {
  updateLanguage({ commit }, lang) {
    commit("setLanguage", lang)
    this.$i18n.setLocale(lang)
    this.$cookies.set("lang", lang)
    document.documentElement.dir = this.state.isRTL ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }
}
