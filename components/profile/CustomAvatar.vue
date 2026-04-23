# CustomAvatar.vue
<template>
  <v-avatar
    :size="size"
    :color="isThemeColor(bgColor) ? bgColor : null"
    :style="!isThemeColor(bgColor) ? { backgroundColor: bgColor } : null"
    class="custom-avatar"
    :class="[getBorderColorClass, `border-size-${borderSizeClass}`, getTextColorClass]"
  >
    <template v-if="image">
      <v-img :src="image" :alt="name"></v-img>
    </template>
    <template v-else>
      <span :class="[`${textSizeClass} font-weight-bold`]">{{ initials }}</span>
    </template>
  </v-avatar>
</template>

<script>
const THEME_COLORS = ["primary", "secondary", "accent", "success", "error", "info", "warning"]

export default {
  name: "CustomAvatar",

  props: {
    name: {
      type: String,
      required: true,
      default: ""
    },
    image: {
      type: String,
      default: null
    },
    size: {
      type: [Number, String],
      default: 40
    },
    bgColor: {
      type: String,
      default: "white"
    },
    borderColor: {
      type: String,
      default: "primary"
    }
  },

  computed: {
    initials() {
      if (!this.name) return ""

      return this.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
    },

    textSizeClass() {
      const numericSize = parseInt(this.size, 10)

      if (numericSize <= 24) return "text-caption"
      if (numericSize <= 32) return "text-subtitle-2"
      if (numericSize <= 48) return "text-subtitle-1"
      if (numericSize <= 64) return "text-h6"
      if (numericSize <= 96) return "text-h5"
      return "text-h4"
    },

    borderSizeClass() {
      const numericSize = parseInt(this.size, 10)

      if (numericSize <= 24) return "xs"
      if (numericSize <= 48) return "sm"
      if (numericSize <= 96) return "md"
      return "lg"
    },

    getBorderColorClass() {
      return this.isThemeColor(this.borderColor) ? `${this.borderColor}--border` : "custom-border"
    },

    getTextColorClass() {
      if (this.bgColor === "white" || this.bgColor === "transparent") {
        return this.isThemeColor(this.borderColor) ? `${this.borderColor}--text` : { color: this.borderColor }
      }
      return "white--text"
    }
  },

  methods: {
    isThemeColor(color) {
      return THEME_COLORS.includes(color)
    }
  }
}
</script>

<style scoped>
.custom-avatar {
  border-style: solid !important;
  box-sizing: border-box !important;
}

/* Border size classes */
.border-size-xs {
  border-width: 1px !important;
}
.border-size-sm {
  border-width: 2px !important;
}
.border-size-md {
  border-width: 3px !important;
}
.border-size-lg {
  border-width: 4px !important;
}

/* For non-theme border colors */
.custom-border {
  border-color: v-bind(borderColor) !important;
}

/* Create border color classes for each Vuetify color */
.primary--border {
  border-color: var(--v-primary-base) !important;
}
.secondary--border {
  border-color: var(--v-secondary-base) !important;
}
.accent--border {
  border-color: var(--v-accent-base) !important;
}
.error--border {
  border-color: var(--v-error-base) !important;
}
.warning--border {
  border-color: var(--v-warning-base) !important;
}
.info--border {
  border-color: var(--v-info-base) !important;
}
.success--border {
  border-color: var(--v-success-base) !important;
}
</style>
