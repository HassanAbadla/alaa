// mixins/heatmapHandler.js
export default {
  computed: {
    impactLabels() {
      // Define the correct order of impact codes
      const orderMap = {
        Negligble: 1,
        Minor: 2,
        Moderate: 3,
        Major: 4,
        Critical: 5
      }

      return [...this.impacts].sort((a, b) => {
        return orderMap[a.code] - orderMap[b.code]
      })
    },
    likelihoodLabels() {
      // Define the logical order from highest to lowest probability
      const orderMap = {
        "Almost Certain": 0, // Highest probability
        "Very Likely": 1,
        Likely: 2,
        Possible: 3,
        Unlikely: 4 // Lowest probability
      }

      // Sort based on the probability order
      return [...this.likelihoods].sort((a, b) => {
        const indexA = orderMap[a.code] ?? 999 // Fallback for unknown codes
        const indexB = orderMap[b.code] ?? 999
        return indexA - indexB
      })
    }
  }
}
