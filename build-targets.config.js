/**
 * Centralized build-target configuration.
 * Add a new entry here to support a new build target — no other config files need touching
 * (except package.json for dev/build scripts and .env.<target> for secrets).
 */
module.exports = {
  default: {
    name: "PMIS",
    shortName: "PMIS",
    description: "PMIS",
    apiUrl: "https://api.ordonsoft.com",
    siteUrl: "https://ordonsoft.com",
    iconFile: "icon.png",
    iconDir: "default-icons",
    navbarLogo: "logos/OrdonSoft-logo.png",
    colors: {
      primary: "#061E37",
      secondary: "#2F5597",
      tertiary: "#58B1ED",
      globalBg: "#F2F4F8"
    },
    pwa: {
      author: "PMIS",
      themeColor: "#061E37"
    }
  },

  zain: {
    name: "Zain GRC Platform",
    shortName: "GRC Platform",
    description: "GRC WOLF Platform",
    apiUrl: "https://grc-api.zaincloud.com.sa",
    siteUrl: "https://grc.zaincloud.com.sa",
    iconFile: "zain-transparent-logo.png",
    iconDir: "zain-icons",
    navbarLogo: "logos/zain-text.png",
    colors: {
      primary: "#79B440",
      secondary: "#242756",
      tertiary: "#56679D",
      globalBg: "#F2F4F8"
    },
    pwa: {
      author: "Zain",
      themeColor: "#79B440"
    }
  },

  nournet: {
    name: "NourNet Platform",
    shortName: "NourNet",
    description: "NourNet GRC Platform",
    apiUrl: "https://api.nournet.example.com", // PLACEHOLDER — update when known
    siteUrl: "https://nournet.example.com", // PLACEHOLDER — update when known
    iconFile: "nournet-logo.png",
    iconDir: "nournet-icons",
    navbarLogo: "logos/NourNet.png",
    colors: {
      primary: "#143866",
      secondary: "#254f89",
      tertiary: "#6fedf2",
      globalBg: "#F2F4F8"
    },
    pwa: {
      author: "NourNet",
      themeColor: "#143866"
    }
  },

  local: {
    name: "PMIS (Local)",
    shortName: "PMIS",
    description: "PMIS",
    apiUrl: "http://127.0.0.1:8000",
    siteUrl: "http://localhost:3000",
    iconFile: "icon.png",
    iconDir: "default-icons",
    navbarLogo: "logos/OrdonSoft-logo.png",
    colors: {
      primary: "#061E37",
      secondary: "#2F5597",
      tertiary: "#58B1ED",
      globalBg: "#F2F4F8"
    },
    pwa: {
      author: "PMIS",
      themeColor: "#061E37"
    }
  },

  pss: {
    name: "PSS",
    shortName: "PSS",
    description: "PSS",
    apiUrl: "",
    siteUrl: "",
    iconFile: "icon.png",
    iconDir: "default-icons",
    navbarLogo: "logos/OrdonSoft-logo.png",
    colors: {
      primary: "#061E37",
      secondary: "#2F5597",
      tertiary: "#58B1ED",
      globalBg: "#F2F4F8"
    },
    pwa: {
      author: "PSS",
      themeColor: "#061E37"
    }
  }
}
