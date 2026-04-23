<template>
  <v-btn
    :color="colorScheme.btnBg"
    :class="fullWidth ? 'mb-1 full-width-btn' : 'mr-1 mb-1'"
    :dense="!fullWidth"
    :small="!fullWidth"
    @click="selectModule(module)"
  >
    <v-icon v-if="module.icon" :color="getTextColorForBackground(colorScheme.btnBg)" size="16" class="mr-1">
      {{ module.icon || "mdi-view-dashboard" }}
    </v-icon>
    <v-avatar v-else :color="colorScheme.iconBg" size="16" class="mr-1">
      <span class="white--text caption font-weight-bold" style="font-size: 10px">
        {{ module.code.charAt(0).toUpperCase() }}
      </span>
    </v-avatar>
    <span class="text-caption font-weight-medium" :style="{ color: getTextColorForBackground(colorScheme.btnBg) }">
      {{ module.name }}
    </span>
  </v-btn>
</template>

<script>
import { mapState } from "vuex"
import { colorUtils } from "@/mixins/colorUtils"
export default {
  name: "ModuleBox",
  mixins: [colorUtils],
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
        btnBg: this.isSelected ? "tertiary" : "primary",
        iconBg: this.isSelected ? "primary" : "primary"
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
}

.v-btn:hover {
  transform: translateY(-1px);
}

.full-width-btn {
  width: 100% !important;
}
</style>
