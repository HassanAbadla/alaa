<template>
  <v-btn
    :color="colorScheme.btnBg"
    :class="fullWidth ? 'mb-1 full-width-btn text-left' : 'mr-1 mb-1 text-left'"
    :dense="!fullWidth"
    :small="!fullWidth"
    @click="selectModule(module)"
    text
  >
    <v-icon v-if="module.icon" color="tertiary" size="16" class="mr-2">
      {{ module.icon || "mdi-view-dashboard" }}
    </v-icon>
    <v-avatar v-else color="tertiary" size="16" class="mr-2">
      <span class="white--text caption font-weight-bold" style="font-size: 10px">
        {{ module.code.charAt(0).toUpperCase() }}
      </span>
    </v-avatar>
    <span class="text-caption font-weight-medium tertiary--text">
      {{ module.name }}
    </span>
  </v-btn>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "SidebarModuleDisplay",
  props: {
    module: {
      type: Object,
      required: true
    },
    selectedModule: {
      type: Object,
      default: null
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    isSelected() {
      if (!this.selectedModule) return false
      return this.selectedModule && this.selectedModule.id === this.module.id
    },
    colorScheme() {
      return {
        btnBg: this.isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent"
      }
    }
  },
  methods: {
    selectModule(module) {
      this.$emit("select-module", module)
    }
  }
}
</script>

<style scoped>
.v-btn {
  transition: all 0.2s ease;
  justify-content: flex-start !important;
  cursor: default !important;
}

.v-btn:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.full-width-btn {
  width: 100% !important;
}

.text-left {
  text-align: left !important;
}
</style>
