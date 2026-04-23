// languageHandler mixin
export default {
  mounted() {
    this.$nextTick(() => {
      const savedLang = this.$cookies.get("lang") || this.$i18n.defaultLocale
      this.$store.dispatch("updateLanguage", savedLang)
    })
  },
  watch: {
    "$store.state.isRTL": {
      immediate: true,
      handler(newValue) {
        if (this.$vuetify) {
          this.$vuetify.rtl = newValue
        }
      }
    },
    "$i18n.locale": {
      immediate: true,
      handler(newLocale) {
        // Set the HTML lang attribute for font switching
        document.documentElement.setAttribute("lang", newLocale)
      }
    }
  }
}
