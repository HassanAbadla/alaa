<template>
  <v-dialog v-model="dialogModel" :max-width="isFullWidth ? '100vw' : width" content-class="rounded-dialog" persistent>
    <v-card :width="isFullWidth ? '100%' : width" class="d-flex flex-column globalBg">
      <div class="sticky-header">
        <div
          :class="`primary white--text font-weight-bold title py-2 ${titlePadding} d-flex flex-row align-start justify-space-between`"
        >
          <v-card-title class="title primary white--text pa-2">
            {{ title }}
          </v-card-title>
          <!-- <v-spacer></v-spacer> -->
          <div class="d-flex flex-row align-start">
            <v-btn icon @click="toggleWidth" class="mr-2">
              <v-icon color="white">
                {{ isFullWidth ? "mdi-arrow-collapse" : "mdi-arrow-expand" }}
              </v-icon>
            </v-btn>
            <v-btn icon @click="closeDialog">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- <v-divider></v-divider> -->
      </div>
      <v-card-text class="scrollable-content">
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: "CustomDialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    width: {
      type: [Number, String],
      default: "500px"
    },
    maxHeight: {
      type: [Number, String],
      default: "95vh"
    }
  },
  data() {
    return {
      isFullWidth: false
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    titlePadding() {
      return this.isRTL ? "pr-4 pl-2" : "pr-2 pl-4"
    },
    dialogModel: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    }
  },
  methods: {
    closeDialog() {
      this.dialogModel = false
      this.$emit("close-dialog")
    },
    toggleWidth() {
      this.isFullWidth = !this.isFullWidth
    }
  },
  watch: {
    value(newVal) {
      // Reset to original width when dialog is closed
      if (!newVal) {
        this.isFullWidth = false
      }
    }
  }
}
</script>

<style>
.rounded-dialog {
  border-radius: 10px !important;
  overflow: hidden !important;
}

.rounded-dialog .v-card {
  border-radius: 10px !important;
  display: flex !important;
  flex-direction: column !important;
  max-height: 80vh !important;
}

/* Add transition for smooth width change */
.v-dialog {
  transition: max-width 0.3s ease-in-out !important;
}

.v-card {
  transition: width 0.3s ease-in-out !important;
}
</style>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: inherit;
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
}
</style>
