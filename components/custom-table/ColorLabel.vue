<template>
  <v-chip
    @click="clicked"
    :color="color"
    small
    label
    class="px-2 full-width text-center chip-base"
    :class="{ clickable: isClickable }"
    :text-color="textColor"
    style="font-size: 1em"
  >
    {{ text }}
    <v-icon v-if="isClickable" right x-small :color="'blue'">mdi-open-in-new</v-icon>
  </v-chip>
</template>

<script>
import { colorUtils } from "@/mixins/colorUtils" // Adjust path as needed

export default {
  name: "ColorLabel",
  mixins: [colorUtils],
  props: {
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "" // white
    },
    isClickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    textColor() {
      return this.getTextColorForBackground(this.color)
    }
  },
  methods: {
    clicked() {
      this.$emit("clicked")
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
  display: flex;
  justify-content: center;
}

.chip-base {
  cursor: default !important;
}

.clickable {
  cursor: pointer !important;
}
</style>
