<template>
  <div class="d-flex align-center">
    <!-- Color square -->
    <div
      :class="`color-square ${isRTL ? 'ml-2' : 'mr-2'}`"
      :style="{ backgroundColor: isValidColor ? color : '#f5f5f5' }"
    >
      <!-- Show X if no valid color -->
      <v-icon v-if="!isValidColor" small color="grey">mdi-close</v-icon>
    </div>

    <!-- Color name/text -->
    <span class="text-body-2">
      {{ isValidColor ? colorName : $t("page.no_color") }}
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: "ColorSelected",
  props: {
    color: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    isValidColor() {
      if (!this.color) return false

      // Check if it's a valid hex color (3 or 6 digits)
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

      // Check if it's a valid CSS color name or other format
      const testDiv = document.createElement("div")
      testDiv.style.color = this.color

      return hexRegex.test(this.color) || testDiv.style.color !== ""
    },

    colorName() {
      if (!this.isValidColor) return ""

      // If it's a hex color, return the hex value
      if (this.color.startsWith("#")) {
        return this.color.toUpperCase()
      }

      // For named colors or other formats, return as-is
      return this.color
    }
  }
}
</script>

<style scoped>
.color-square {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
