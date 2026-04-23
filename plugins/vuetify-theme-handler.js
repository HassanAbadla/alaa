// plugins/vuetify-theme-handler.js
export default function ({ app, store, $vuetify }) {
  if (!app.vuetify) {
    console.error("Vuetify instance not found in plugin")
    return
  }

  // Load theme preference on app initialization
  if (process.client) {
    const savedTheme = localStorage.getItem("pmis-theme")
    if (savedTheme) {
      app.vuetify.framework.theme.dark = savedTheme === "dark"
    } else {
      // Optional: Check system preference if no saved theme
      // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      // app.vuetify.framework.theme.dark = prefersDark
      // localStorage.setItem("pmis-theme", prefersDark ? "dark" : "light")
    }
  }
  //!  Make sure to remove when deploying to production
  localStorage.setItem("pmis-theme", "light")

  const updateThemeColors = (settings) => {
    if (!Array.isArray(settings)) return

    const themeSettings = Object.fromEntries(settings.map((item) => [item.key, item.value]))

    // Handle light theme colors
    const lightThemeColors = Object.entries(themeSettings).reduce((colors, [key, value]) => {
      if (key.startsWith("THEME_COLOR_LIGHT_")) {
        const colorKey = key.replace("THEME_COLOR_LIGHT_", "").toLowerCase()
        if (/^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(value)) {
          colors[colorKey] = value
        }
      }
      return colors
    }, {})

    // Handle dark theme colors
    const darkThemeColors = Object.entries(themeSettings).reduce((colors, [key, value]) => {
      if (key.startsWith("THEME_COLOR_DARK_")) {
        const colorKey = key.replace("THEME_COLOR_DARK_", "").toLowerCase()
        if (/^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(value)) {
          colors[colorKey] = value
        }
      }
      return colors
    }, {})

    // Update light theme
    if (Object.keys(lightThemeColors).length > 0) {
      app.vuetify.framework.theme.themes.light = {
        ...app.vuetify.framework.theme.themes.light,
        ...lightThemeColors
      }
    }

    // Update dark theme
    if (Object.keys(darkThemeColors).length > 0) {
      app.vuetify.framework.theme.themes.dark = {
        ...app.vuetify.framework.theme.themes.dark,
        ...darkThemeColors
      }
    }
  }

  // Watch for auth changes
  store.watch(
    (state) => {
      const settings = app.$auth?.user?.tenant?.settings
      return settings
    },
    (newSettings) => {
      if (newSettings) {
        updateThemeColors(newSettings)
      }
    },
    { immediate: true, deep: true }
  )
}
