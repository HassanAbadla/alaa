<template>
  <div>
    <v-can :permission="permission">
      <v-sheet
        @click="onClick"
        class="d-flex align-center pa-2 clickable sidebar-btn"
        rounded
        :class="{ 'active-border': isActive }"
        style="cursor: pointer"
      >
        <!-- /style="transform: rotate(90deg)" -->
        <v-icon small class="mx-1 white--text">
          {{ icon || "mdi-circle-small" }}
        </v-icon>
        <span class="body-2 text-capitalize white--text text-start">
          {{ text }}
        </span>
      </v-sheet>
    </v-can>
    <slot />
  </div>
</template>

<script>
import VCan from "../VCan.vue"
export default {
  components: { VCan },
  name: "SidebarPanelBtn",
  props: {
    text: { type: String, required: true },
    permission: { type: String, required: true },
    icon: { type: String, required: false },
    link: { type: String, required: false },
    isActive: { type: Boolean, default: false }
  },
  computed: {
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary
    }
  },
  methods: {
    onClick() {
      this.$emit("click")
    }
  }
}
</script>

<style lang="scss">
.sidebar-btn {
  background-color: transparent !important;
  transition: all 0.2s ease-in-out !important;
  margin: 2px 0 !important;
}

.sidebar-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: translateX(4px);
}

.sidebar-btn.active-border {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-left: 3px solid white !important;
  padding-left: 13px !important;
  border-radius: 4px !important;
}

.sidebar-btn .v-icon,
.sidebar-btn span {
  color: rgba(255, 255, 255, 0.8) !important;
}

.sidebar-btn:hover .v-icon,
.sidebar-btn:hover span,
.sidebar-btn.active-border .v-icon,
.sidebar-btn.active-border span {
  color: white !important;
}
</style>
