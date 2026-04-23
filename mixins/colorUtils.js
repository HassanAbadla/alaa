// mixins/colorUtils.js
export const colorUtils = {
  methods: {
    getTextColorForBackground(bgColor) {
      if (!bgColor) {
        return "black"
      }

      try {
        let hexColor = bgColor

        // Check if it's a Vuetify theme color (primary, secondary, etc.)
        if (this.isVuetifyThemeColor(bgColor)) {
          hexColor = this.getVuetifyThemeColor(bgColor)
          if (!hexColor) {
            return "white" // fallback if theme color not found
          }
        }

        let hex = hexColor.replace("#", "")

        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
        }

        if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
          return "white"
        }

        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255

        return brightness > 0.5 ? "black" : "white"
      } catch (error) {
        console.warn("Error calculating text color:", error)
        return "black"
      }
    },

    isVuetifyThemeColor(color) {
      const themeColors = ["primary", "secondary", "accent", "error", "info", "success", "warning"]
      return themeColors.includes(color)
    },

    getVuetifyThemeColor(colorName) {
      try {
        const theme = this.$vuetify.theme.themes[this.$vuetify.theme.dark ? "dark" : "light"]
        return theme[colorName]
      } catch (error) {
        console.warn(`Could not get Vuetify theme color: ${colorName}`, error)
        return null
      }
    }
  }
}
