import colors from "vuetify/es5/util/colors"
require("dotenv").config({
  path: `.env.${process.env.BUILD_TARGET || "default"}`
})

const buildTarget = process.env.BUILD_TARGET || "default"
const isUnderMaintenance = process.env.MAINTENANCE_MODE === "true"

const buildTargets = require("./build-targets.config.js")
const config = buildTargets[buildTarget] || buildTargets.default

const baseURL = config.apiUrl
const disableRecaptcha = buildTarget === "pss"

export default {
  publicRuntimeConfig: {
    buildTarget,
    isNourNet: buildTarget === "nournet",
    disableRecaptcha,
    isDeployBuild: buildTarget !== "default" && buildTarget !== "local",
    navbarLogo: config.navbarLogo,
    pmwebKey: process.env.PMWEB_API_KEY,
    isUnderMaintenance
  },
  env: {
    buildTarget,
    pmwebKey: process.env.PMWEB_API_KEY,
    isUnderMaintenance
  },

  ssr: false,

  head: {
    title: config.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: config.description },

      // Open Graph tags
      { hid: "og:type", property: "og:type", content: "website" },
      { hid: "og:url", property: "og:url", content: config.siteUrl },
      { hid: "og:title", property: "og:title", content: config.name },
      { hid: "og:description", property: "og:description", content: config.description },
      {
        hid: "og:image",
        property: "og:image",
        content: `${config.siteUrl}/${config.iconFile}`
      },

      // Twitter Card tags
      { hid: "twitter:card", name: "twitter:card", content: "summary" },
      { hid: "twitter:title", name: "twitter:title", content: config.name },
      { hid: "twitter:description", name: "twitter:description", content: config.description },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: `${config.siteUrl}/${config.iconFile}`
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/png",
        href: `/${config.iconFile}`
      }
    ]
  },

  css: ["~/assets/droid.css", "@/assets/global.css", "quill/dist/quill.core.css", "quill/dist/quill.snow.css","@mdi/font/css/materialdesignicons.min.css","animate.css/animate.min.css"],

  plugins: [
    "plugins/toast.js",
    "plugins/axios.js",
    "plugins/gmap.js",
    "~/plugins/global-components.js",
    "~/plugins/pmwebApi",
    "~/plugins/orsApi",
    "~/plugins/build-info",
    "~/plugins/vuetify-theme-handler",
    "~/plugins/navigation-history.js",
    "~/plugins/drag-resize.js",
    "~/plugins/chartjs-arabic.js",
    "~/plugins/permissions",
    "~/plugins/silverwolf.js",
    { src: "~/plugins/module-route-sync.js", mode: "client" }
  ],

  components: true,

  buildModules: ["@nuxtjs/vuetify", "@nuxtjs/google-fonts"],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/i18n",
    "cookie-universal-nuxt",
    "@nuxtjs/auth-next",
    ...(!disableRecaptcha ? ["@nuxtjs/recaptcha"] : [])
  ],

  googleFonts: {
    families: {
      Cairo: [300, 400, 500, 600, 700],
      Roboto: [300, 400, 500, 700]
    },
    display: "swap",
    download: true,
    inject: true
  },

  recaptcha: !disableRecaptcha
    ? {
        hideBadge: true,
        mode: "base",
        version: 3,
        siteKey: process.env.RECAPTCHA_SITE_KEY
      }
    : {},

  i18n: {
    baseUrl: "/",
    parsePages: false,
    seo: false,
    defaultLocale: "en",
    strategy: "no_prefix",
    locales: [
      {
        code: "ar",
        name: "Arabic",
        iso: "ar-SA",
        file: "ar.js",
        dir: "rtl"
      },
      {
        code: "en",
        name: "English",
        iso: "en-US",
        file: "en.js",
        dir: "ltr"
      },
      {
        code: "fr",
        name: "French",
        iso: "fr-FR",
        file: "fr.js",
        dir: "ltr"
      },
      {
        code: "cn",
        name: "Chinese",
        iso: "CN-CN",
        file: "cn.js",
        dir: "ltr"
      }
    ],
    lazy: true,
    langDir: "lang/",
    vueI18n: { fallbackLocale: "en" },
    detectBrowserLanguage: false,
    onLanguageSwitched: (previous, current) => {
      if (process.client) {
        const DATE = new Date()
        DATE.setTime(DATE.getTime() + 365 * 24 * 3600 * 1000)
        document.cookie = "lang=" + current + "; path=/; expires=" + DATE.toUTCString()
      }
    }
  },

  axios: {
    baseURL: baseURL + "/api"
  },

  pwa: {
    icon: {
      iconSrc: `static/${config.iconFile}`,
      fileName: config.iconFile,
      sizes: [64, 120, 144, 152, 192, 384, 512],
      purpose: ["any", "maskable"],
      cacheDir: config.iconDir
    },
    manifest: {
      lang: "en",
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      background_color: "#ffffff",
      theme_color: config.pwa.themeColor,
      display: "standalone",
      icons: []
    },
    meta: {
      name: config.name,
      author: config.pwa.author,
      description: config.description,
      theme_color: config.pwa.themeColor,
      ogTitle: config.name,
      ogDescription: config.description,
      ogSiteName: config.shortName,
      ogHost: config.siteUrl,
      ogImage: `/${config.iconFile}`,
      twitterCard: "summary",
      mobileApp: true,
      mobileAppIOS: true,
      appleStatusBarStyle: "default",
      favicon: `/${config.iconFile}`,
      iconFileName: config.iconFile
    }
  },

  vuetify: {
    rtl: true,
    customVariables: ["~/assets/variables.scss"],
    defaultAssets: {
      font: false,
      icons: false
    },
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#9EC75D",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: config.colors
      },
      typography: {}
    }
  },

  auth: {
    redirect: {
      login: "/",
      home: false
    },
    watchLoggedIn: true,

    strategies: {
      local: {
        token: {
          property: "token",
          maxAge: 60 * 60 * 24 * 10
        },
        endpoints: {
          login: {
            url: baseURL + "/api/login",
            method: "post",
            propertyName: "token"
          },
          logout: false,
          user: {
            url: "user",
            method: "get",
            propertyName: "user",
            autoFetch: true
          }
        }
      }
    },
    rewriteRedirects: false
  },

  build: {
    transpile: [
      "quill",
      /^gmap-vue($|\/)/,
      /^@fullcalendar\/.*/,
      "@editorjs/editorjs",
      "@editorjs/header",
      "@editorjs/list",
      "@editorjs/checklist",
      "@editorjs/quote",
      "@editorjs/code",
      "@editorjs/inline-code",
      "@editorjs/embed",
      "@editorjs/table",
      "@editorjs/link",
      "@editorjs/warning",
      "@editorjs/marker",
      "@editorjs/delimiter",
      "@editorjs/raw",
      "@editorjs/image",
      "@editorjs/attaches",
      "mammoth",
      "jszip"
    ],
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/
      })

      // Add rule to handle .mjs files from Editor.js
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      })
    }
  }
}
