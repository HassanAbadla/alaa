// utils/statusColorUtil.js

const colorPalette = {
  primary: "#9EC75D",
  secondary: "#4D9998",
  warning: "#FFA000",
  danger: "#D32F2F",
  info: "#2196F3",
  success: "#4CAF50"
}

export const getStatusColor = (statusId) => {
  switch (statusId) {
    case 1:
      return colorPalette.secondary
    case 2:
      return colorPalette.success
    case 3:
      return colorPalette.danger
    case 4:
      return colorPalette.warning
    default:
      return colorPalette.secondary // Default color
  }
}
