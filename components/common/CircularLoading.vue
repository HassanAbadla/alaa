<template>
  <div v-if="show" class="loading-container">
    <div class="loading-content">
      <v-progress-circular indeterminate :size="size" :width="width" :color="color"></v-progress-circular>
      <h3 class="mt-4">{{ computedMessage }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "CircularLoading",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      default: null
    },
    size: {
      type: [String, Number],
      default: 64
    },
    width: {
      type: [String, Number],
      default: 4
    },
    color: {
      type: String,
      default: "primary"
    }
  },
  computed: {
    computedMessage() {
      return this.message || this.$t("page.loading")
    }
  }
}
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Custom loading animation for the progress circular */
.v-progress-circular {
  animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
