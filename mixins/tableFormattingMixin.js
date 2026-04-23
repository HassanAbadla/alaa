// mixins/tableFormattingMixin.js

export const tableFormattingMixin = {
  computed: {
    computedHeaders() {
      return this.headers.map((header) => {
        return {
          cellClass: "no-wrap",
          uncenterBody: true,
          ...header // This will override the default uncenterBody if provided
        }
      })
    },

    formattedHeaders() {
      return this.headers.filter(
        (header) =>
          header.type === "date" ||
          header.type === "currency" ||
          header.type === "percentage" ||
          header.type === "number" ||
          header.type === "boolean"
      )
    }
  },

  methods: {
    formatCellValue(value, type, item) {
      switch (type) {
        case "date":
          return this.formatDate(value)
        case "currency":
          return this.currencyFormatter(value, item?.currency)
        case "percentage":
          return this.formatPercentage(value)
        case "number":
          return this.formatNumber(value)
        case "boolean":
          return value ? this.$t("page.yes") : this.$t("page.no")
        default:
          return value
      }
    },

    formatPercentage(value) {
      if (value === null || value === undefined || value === "") return ""
      const num = parseFloat(value)
      if (isNaN(num)) return value
      return `${num.toFixed(2)}%`
    },

    formatNumber(value, decimals = 2) {
      if (value === null || value === undefined || value === "") return ""
      const num = parseFloat(value)
      if (isNaN(num)) return value
      return num.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    },

    formatDate(dateValue) {
      if (!dateValue) return ""

      // Handle different date formats
      const date = new Date(dateValue)

      // Check if date is valid
      if (isNaN(date.getTime())) return dateValue

      // Format as dd/mm/yyyy
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    },

    currencyFormatter(value, currency) {
      if (value === null || value === undefined || value === "") {
        return ""
      }

      if (!currency) {
        return String(value)
      }

      const numericValue = parseFloat(value)
      if (isNaN(numericValue)) {
        return String(value)
      }

      const precision = parseInt(currency.SubDivisionPrecision) || 2
      const formattedValue = numericValue.toFixed(precision)
      const symbol = (currency.Symbol || currency.Code || "").trim()
      const position = (currency.SymbolPosition || "LEFT").toUpperCase()

      return position === "RIGHT" ? `${formattedValue} ${symbol}` : `${symbol} ${formattedValue}`
    }
  }
}
