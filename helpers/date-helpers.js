/**
 * Checks if end date is valid (greater than or equal to start date)
 */
export function isEndDateValid(startDate, endDate) {
  if (!startDate || !endDate) return true
  return new Date(endDate) >= new Date(startDate)
}

/**
 * Formats a date for display in ISO format (YYYY-MM-DD)
 */
export function formatDateForDisplay(date) {
  if (!date) return ""
  return new Date(date).toISOString().split("T")[0]
}

/**
 * Parses a PMWEB date string and returns a JavaScript Date object
 * @param {string} dateString - The date string in the format '/Date(timestamp-offset)/'
 * @returns {Date|null} - JavaScript Date object or null if invalid
 */
export function parsePMWEBDate(dateString) {
  if (!dateString) return null

  try {
    // Extract the timestamp from the date string
    const timestamp = dateString.match(/\/Date\((\d+)(?:[-+]\d+)?\)\//)

    if (!timestamp || !timestamp[1]) {
      console.warn("Invalid PMWEB date format:", dateString)
      return null
    }

    // Create a Date object from the timestamp (in milliseconds)
    return new Date(parseInt(timestamp[1]))
  } catch (error) {
    console.error("Error parsing PMWEB date:", error)
    return null
  }
}

/**
 * Formats a date string from '/Date(timestamp-offset)/' format to DD/MM/YYYY
 * @param {string} dateString - The date string in the format '/Date(timestamp-offset)/'
 * @returns {string} - Formatted date string in DD/MM/YYYY format
 */
export function formatPMISDate(dateString) {
  if (!dateString) return ""

  try {
    const date = parsePMWEBDate(dateString)
    if (!date) return ""

    // Format the date to DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-based
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

/**
 * Formats a timestamp into a human-readable relative time using i18n translations
 * @param {string} timestamp - ISO timestamp string
 * @param {Function} i18n - Vue i18n $t function to use for translation
 * @returns {string} - Formatted date/time string
 */
export function formatNotificationTime(timestamp, i18n) {
  if (!timestamp) return ""

  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    // Less than a minute
    if (diffInSeconds < 60) {
      return i18n("notification_time.just_now")
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      // Ensure count is passed as an object property for proper pluralization
      return i18n("notification_time.minutes_ago", { count: minutes })
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      // Ensure count is passed as an object property for proper pluralization
      return i18n("notification_time.hours_ago", { count: hours })
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      // Ensure count is passed as an object property for proper pluralization
      return i18n("notification_time.days_ago", { count: days })
    }

    // Format as date
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return i18n("notification_time.date_at_time", {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`
    })
  } catch (error) {
    console.error("Error formatting notification time:", error)
    return timestamp || "" // Return the original timestamp as fallback
  }
}

/**
 * Formats a date string from '/Date(timestamp-offset)/' format to YYYY-MM-DD
 * for use with HTML date inputs
 * @param {string} dateString - The date string in the format '/Date(timestamp-offset)/'
 * @returns {string} - Formatted date string in YYYY-MM-DD format
 */
export function formatPMWEBDateForPicker(dateString) {
  if (!dateString) return ""

  try {
    const date = parsePMWEBDate(dateString)
    if (!date) return ""

    // Format as YYYY-MM-DD for HTML date input
    return date.toISOString().split("T")[0]
  } catch (error) {
    console.error("Error formatting date for picker:", error)
    return ""
  }
}

/**
 * Converts a standard date string (YYYY-MM-DD) to PMWEB format '/Date(timestamp)/'
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Date in PMWEB format
 */
export function convertToPMWEBFormat(dateString) {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ""
    }

    // Create the PMWEB date format
    return `/Date(${date.getTime()})/`
  } catch (error) {
    console.error("Error converting to PMWEB format:", error)
    return ""
  }
}
