export function getInitials(fullName) {
  if (!fullName) return ""

  const nameArray = fullName.trim().split(" ")
  const initials = nameArray.map((name) => name.charAt(0).toUpperCase())
  return initials.join("")
}

export function formatDate(date) {
  if (!date) return { date: "N/A", time: "N/A" }

  const d = new Date(date)

  const formattedDate = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}/${d.getFullYear()}`
  const formattedTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`

  return {
    date: formattedDate,
    time: formattedTime
  }
}

export function getFileIcon(fileName) {
  const extension = fileName.split(".").pop().toLowerCase()
  switch (extension) {
    case "pdf":
      return "mdi-file-pdf-box"
    case "doc":
    case "docx":
      return "mdi-file-word-box"
    case "xls":
    case "xlsx":
      return "mdi-file-excel-box"
    case "ppt":
    case "pptx":
      return "mdi-file-powerpoint-box"
    case "zip":
    case "rar":
      return "mdi-zip-box"
    default:
      return "mdi-file-outline"
  }
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - 3) + "..."
}

export function roundToDecimalPlaces(value, decimalPlaces = 1) {
  const parsedValue = parseFloat(value)

  if (isNaN(parsedValue)) {
    return "0"
  }

  return Number(parsedValue.toFixed(decimalPlaces))
}

export function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number)
}

export function toSnakeCase(str) {
  return (
    str
      // Insert underscore before uppercase letters that follow lowercase letters or numbers
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      // Insert underscore before uppercase letters that are followed by lowercase letters (for handling acronyms)
      .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
      // Replace spaces, hyphens, and other common separators with underscores
      .replace(/[\s\-\.]+/g, "_")
      // Convert to lowercase
      .toLowerCase()
      // Remove any leading/trailing underscores and collapse multiple underscores
      .replace(/^_+|_+$/g, "")
      .replace(/_+/g, "_")
  )
}
