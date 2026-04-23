<template>
  <v-tooltip v-if="tooltip" bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
        @click="handleClick"
        :color="color"
        :size="size"
        :disabled="disabled"
        :class="{ 'clickable-icon': !disabled }"
      >
        {{ icon }}
      </v-icon>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>

  <v-icon
    v-else
    @click="handleClick"
    :color="color"
    :size="size"
    :disabled="disabled"
    :class="{ 'clickable-icon': !disabled }"
  >
    {{ icon }}
  </v-icon>
</template>

<script>
export default {
  name: "ClickableIcon",

  props: {
    icon: {
      type: String,
      required: true,
      validator: (value) => value.trim().length > 0
    },

    route: {
      type: String,
      default: null
    },

    tooltip: {
      type: String,
      default: null
    },

    color: {
      type: String,
      default: ""
    },

    size: {
      type: [String, Number],
      default: "default"
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClick() {
      if (this.disabled) return

      // Emit click event first
      this.$emit("click", { route: this.route })

      // Handle navigation if route is provided
      if (this.route) {
        this.navigateToRoute()
      }
    },

    navigateToRoute() {
      // Use localePath for i18n routing
      this.$router.push(this.localePath(this.route))
    }
  }
}
</script>

<style scoped>
.clickable-icon {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.clickable-icon:hover {
  opacity: 0.7;
}

.v-icon.v-icon--disabled {
  cursor: not-allowed !important;
}
</style>
