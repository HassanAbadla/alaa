// mixins/dynamicBackNavigation.js
import { mapState } from "vuex"

export default {
  data() {
    return {
      // Store the referrer path
      referrerPath: null,
      // Default path to use if no referrer is found
      defaultBackPath: "/grc/risk-register",
      // Storage key prefix - will be combined with the entity type and ID
      storageKeyPrefix: "grc_navigation_referrer"
    }
  },

  computed: {
    ...mapState("navigation", ["previousRoute"]),

    /**
     * The entity ID from the route params
     */
    entityId() {
      return this.$route.params.id
    },

    /**
     * The type of entity being viewed (e.g., 'consequences', 'treatments')
     * Should be overridden by the component using this mixin
     */
    entityType() {
      // This should be overridden by the component
      return ""
    },

    /**
     * Storage key used for localStorage
     */
    storageKey() {
      return `${this.storageKeyPrefix}_${this.entityType}_${this.entityId}`
    },

    /**
     * Dynamic back button path based on available navigation info
     */
    backBtnPath() {
      // Priority 1: Use query parameter if available
      if (this.referrerPath) {
        return this.referrerPath
      }

      // Priority 2: Use navigation history from Vuex if available
      if (this.previousRoute && this.previousRoute.path !== this.$route.path) {
        return this.previousRoute.path
      }

      // Priority 3: Use default path
      return this.defaultBackPath
    },

    /**
     * Dynamic tooltip for the back button
     */
    backBtnTooltip() {
      // Generate tooltip based on path pattern
      if (this.backBtnPath === this.defaultBackPath) {
        return this.$t("page.risk_register")
      }

      if (this.backBtnPath.includes("/risk-register/") && !this.backBtnPath.includes(`/${this.entityType}`)) {
        return this.$t("page.risk_details")
      }

      return this.$t("common.back")
    }
  },

  methods: {
    /**
     * Store the referrer path from various sources
     */
    storeReferrerPath() {
      // Priority 1: Get referrer from query params
      const queryReferrer = this.$route.query.from
      if (queryReferrer) {
        this.referrerPath = queryReferrer
        // Store in localStorage for persistence across refreshes
        this.saveToLocalStorage(queryReferrer)
        return
      }

      // Priority 2: Check localStorage for previously saved referrer
      const savedReferrer = this.getFromLocalStorage()
      if (savedReferrer) {
        this.referrerPath = savedReferrer
        return
      }

      // Priority 3: Use Vuex navigation store if available
      if (this.previousRoute && this.previousRoute.path !== this.$route.path) {
        this.referrerPath = this.previousRoute.path
        // Also save this to localStorage for refresh persistence
        this.saveToLocalStorage(this.previousRoute.path)
      }
    },

    /**
     * Save referrer path to localStorage with proper error handling
     */
    saveToLocalStorage(path) {
      try {
        localStorage.setItem(this.storageKey, path)
        // Also save to session storage as backup
        sessionStorage.setItem(this.storageKey, path)
      } catch (e) {
        console.error("Failed to save navigation path to storage:", e)
      }
    },

    /**
     * Get referrer path from localStorage with proper error handling
     */
    getFromLocalStorage() {
      try {
        // Try localStorage first
        let saved = localStorage.getItem(this.storageKey)

        // Fall back to sessionStorage if needed
        if (!saved) {
          saved = sessionStorage.getItem(this.storageKey)
        }

        return saved
      } catch (e) {
        console.error("Failed to retrieve navigation path from storage:", e)
        return null
      }
    }
  },

  created() {
    // Initialize referrer path when component is created
    this.storeReferrerPath()
  },

  beforeRouteLeave(to, from, next) {
    // Special case - if navigating to a page we want to return to later,
    // save that path for potential returns
    // This handles cases where users navigate away then press back button in browser
    try {
      // Only save if we're not going to the default path
      if (to.path !== this.defaultBackPath) {
        const backPath = to.path

        // Check if it's a page we would want to return to
        if (backPath.includes("/risk-register")) {
          sessionStorage.setItem("last_risk_page", backPath)
        }
      }
    } catch (e) {
      console.error("Error saving route path on leave:", e)
    }

    next()
  },

  mounted() {
    // Additional initialization for browser refresh cases
    if (!this.referrerPath) {
      try {
        // If no other referrer is found, check if we have a global last visited page
        const lastRiskPage = sessionStorage.getItem("last_risk_page")
        if (lastRiskPage && lastRiskPage !== this.$route.path) {
          this.referrerPath = lastRiskPage
        }
      } catch (e) {
        console.error("Error retrieving last_risk_page:", e)
      }
    }
  }
}
