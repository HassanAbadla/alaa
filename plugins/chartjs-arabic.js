import Chart from "chart.js/auto"
import ArabicReshaper from "arabic-reshaper"

export default ({ store }) => {
  // Set Cairo font as default
  Chart.defaults.font.family = "Cairo, sans-serif"

  // Check if we need Arabic text processing
  const isRTL = store.state.isRTL

  if (!isRTL) return // Only process for Arabic

  // Helper function to process Arabic text
  const processArabicText = (text) => {
    if (!text || typeof text !== "string") return text

    try {
      // Just reshape - canvas handles RTL naturally
      const reshaped = ArabicReshaper.convertArabic(text)
      return reshaped
    } catch (error) {
      console.error("Error processing Arabic text:", error)
      return text
    }
  }

  // Override Chart.js beforeInit to process Arabic text in chart data
  Chart.register({
    id: "arabicTextProcessor",
    beforeInit: (chart) => {
      if (!isRTL) return

      // Process labels
      if (chart.data.labels) {
        chart.data.labels = chart.data.labels.map((label) => processArabicText(label))
      }

      // Process dataset labels
      if (chart.data.datasets) {
        chart.data.datasets.forEach((dataset) => {
          if (dataset.label) {
            dataset.label = processArabicText(dataset.label)
          }
        })
      }

      // Process title
      if (chart.options?.plugins?.title?.text) {
        chart.options.plugins.title.text = processArabicText(chart.options.plugins.title.text)
      }
    }
  })
}
