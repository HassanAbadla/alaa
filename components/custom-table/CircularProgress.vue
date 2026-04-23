<template>
  <div class="d-flex flex-column align-center">
    <p v-if="title" class="text-subtitle-1 font-weight-bold pb-2 mb-0" :style="{ color: color }">{{ title }}</p>
    <v-progress-circular :rotate="180" :size="circleSize" :width="circleWidth" :value="roundedValue" :color="color">
      <strong :class="`${color}--text  font-wight-bold`">{{ roundedValue }}%</strong>
    </v-progress-circular>
    <strong v-if="showCount" :style="{ color: color }">{{ count }}</strong>
  </div>
</template>

<script>
import { roundToDecimalPlaces } from "../../helpers/misc"

export default {
  name: "CircularProgress",
  props: {
    title: { type: String, default: "" },
    value: { type: [Number, String], default: 0 },
    count: { type: Number },
    color: { type: String, default: "primary" },
    circleSize: { type: Number, default: 75 }, // default keeps all existing usages unchanged
    circleWidth: { type: Number, default: 12 } // default keeps all existing usages unchanged
  },
  computed: {
    showCount() {
      return this.count >= 0
    },
    roundedValue() {
      return roundToDecimalPlaces(this.value)
    }
  }
}
</script>
