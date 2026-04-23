// mixins/layoutHandler.js
export default {
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        try {
          let newLayout = to?.matched[0]?.components?.default?.options?.layout

          // on pages where we use layoutPicker function to determine which layout to user we need to run the function
          if (typeof newLayout === "function") {
            newLayout = newLayout()
          }

          if (newLayout && this.$nuxt) {
            // Only change if it's not already the current layout
            if (this.$nuxt.layoutName !== newLayout) {
              this.$nextTick(() => {
                this.$nuxt.setLayout(newLayout)
              })
            }
          }
        } catch (error) {
          console.warn("Layout switch error:", error)
        }
      }
    }
  }
}
