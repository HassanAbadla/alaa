<template>
  <v-btn
    icon
    :small="!small"
    :x-small="small"
    :color="buttonColor"
    :class="{ 'custom-disabled': isDisabled }"
    @click="handleClick"
    :tabindex="isDisabled ? -1 : 0"
    :aria-disabled="isDisabled"
  >
    <v-icon :small="!small" :x-small="small">{{ lockIcon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "LockButton",
  props: {
    small: {
      type: Boolean,
      default: false
    },
    locked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "primary"
    },
    lockedColor: {
      type: String,
      default: "error"
    },
    unlockedColor: {
      type: String,
      default: "success"
    }
  },
  computed: {
    isDisabled() {
      return this.disabled
    },
    lockIcon() {
      return this.locked ? "mdi-lock" : "mdi-lock-open"
    },
    buttonColor() {
      if (this.color !== "primary") {
        return this.color
      }
      return this.locked ? this.lockedColor : this.unlockedColor
    }
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit("click")
      }
    }
  }
}
</script>

<style scoped>
.custom-disabled {
  cursor: not-allowed !important;
  opacity: 0.7 !important;
  box-shadow: none !important;
  position: relative;
}

.custom-disabled::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  border-radius: inherit;
  /* This transparent overlay prevents clicks while allowing the cursor to show */
}
</style>
