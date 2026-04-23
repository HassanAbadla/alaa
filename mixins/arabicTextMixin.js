import ArabicReshaper from "arabic-reshaper"

export default {
  methods: {
    /**
     * Process Arabic text for proper display in charts
     * Reshapes Arabic letters to connect properly
     * @param {string} text - The text to process
     * @returns {string} - Processed text ready for canvas rendering
     */
    processArabicText(text) {
      if (!this.$store.state.isRTL || !text || typeof text !== "string") {
        return text
      }

      try {
        console.group("🔍 Processing Arabic Text")
        console.log("Original:", text)
        console.log("Original length:", text.length)
        console.log(
          "Original chars:",
          text.split("").map((c) => `${c} (U+${c.charCodeAt(0).toString(16).toUpperCase()})`)
        )

        // Reshape Arabic letters for proper connection
        const reshaped = ArabicReshaper.convertArabic(text)

        console.log("Reshaped:", reshaped)
        console.log("Reshaped length:", reshaped.length)
        console.log(
          "Reshaped chars:",
          reshaped.split("").map((c) => `${c} (U+${c.charCodeAt(0).toString(16).toUpperCase()})`)
        )
        console.log("Length difference:", text.length - reshaped.length)
        console.groupEnd()

        return reshaped
      } catch (e) {
        console.error("Error processing Arabic text:", e)
        return text
      }
    },

    /**
     * Get the chart canvas element from the Chart child component
     * Used by ExportToPDF to capture chart images
     * @returns {HTMLCanvasElement|null}
     */
    getChartCanvas() {
      const chartComponent = this.$children.find((child) => child.$options.name === "Chart")
      return chartComponent ? chartComponent.$refs.chartCanvas : null
    }
  }
}
