// helpers/currency-formatters.js

/**
 * Gets the current locale based on the i18n instance
 * @param {object} i18n - Vue i18n instance
 * @returns {string} Current locale code
 */
const getCurrentLocale = (i18n) => {
  return "en-US" // Always use en-US for number formatting
}

/**
 * Gets the currency symbol based on locale
 * @param {object} i18n - Vue i18n instance
 * @returns {string} Currency symbol
 */
const getCurrencySymbol = (i18n) => {
  return i18n?.locale === "ar" ? "﷼" : "SAR"
}

/**
 * Formats a number with thousand separators only
 * @param {number|string} value - The number to format
 * @param {boolean} [includeDecimals=true] - Whether to include decimal places
 * @param {object} [i18n] - Vue i18n instance for localization
 * @returns {string} Formatted number with commas
 */
export const formatNumberWithCommas = (value, includeDecimals = true, i18n = null) => {
  if (!value && value !== 0) return ""

  const numValue = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value

  // Always use en-US for number formatting
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  }).format(numValue)
}

/**
 * Formats a number as currency with appropriate symbol
 * @param {number|string} value - The number to format
 * @param {boolean} [includeDecimals=true] - Whether to include decimal places
 * @param {string} [position='suffix'] - Position of the currency symbol ('prefix' or 'suffix')
 * @param {object} [i18n] - Vue i18n instance for localization
 * @returns {string} Formatted number with currency symbol
 */
export const formatCurrency = (value, includeDecimals = true, position = "suffix", i18n = null) => {
  const formattedNumber = formatNumberWithCommas(value, includeDecimals, i18n)
  if (!formattedNumber) return ""

  const currencySymbol = getCurrencySymbol(i18n)

  // For Arabic, always use suffix position regardless of the position parameter
  // For English, use the specified position
  const effectivePosition = i18n?.locale === "ar" ? "suffix" : position
  return effectivePosition === "prefix"
    ? `${currencySymbol} ${formattedNumber}`
    : `${formattedNumber} ${currencySymbol}`
}

/**
 * Removes all formatting from a number string
 * @param {string} value - The formatted string
 * @returns {string} Clean number string without formatting
 */
export const unformatNumber = (value) => {
  if (!value) return ""
  return value.toString().replace(/[,﷼SAR\s]/g, "") // Remove commas, currency symbols, and spaces
}

/**
 * Formats a number as SAR currency using Intl formatter
 * @param {number|string} value - The number to format
 * @param {object} [i18n] - Vue i18n instance for localization
 * @returns {string} Formatted currency with symbol
 */
export const formatWithCurrencySymbol = (value, i18n = null) => {
  if (!value && value !== 0) return ""

  const numValue = typeof value === "string" ? parseFloat(unformatNumber(value)) : value

  // Format number in Western numerals
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)

  // Add appropriate currency symbol based on locale
  const currencySymbol = getCurrencySymbol(i18n)
  return i18n?.locale === "ar" ? `${formattedNumber} ${currencySymbol}` : `${formattedNumber} ${currencySymbol}`
}

/**
 * Formats a percentage value
 * @param {number|string} value - The number to format
 * @param {boolean} [includeDecimals=false] - Whether to include decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, includeDecimals = true) => {
  if (!value && value !== 0) return ""

  const numValue = typeof value === "string" ? parseFloat(value) : value

  // Using fixed() instead of Intl.NumberFormat to avoid commas
  return numValue.toFixed(includeDecimals ? 2 : 0) + "%"
}

export function formatDate(dateValue) {
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
}

export function currencyFormatter(value, currency) {
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
