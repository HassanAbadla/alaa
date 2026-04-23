<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-subtitle class="text--secondary">{{ label }}</v-list-item-subtitle>
      <v-list-item-title class="d-flex align-center">
        {{ showChip ? "" : value[valueField] || $t("page.not_applicable_short") }}
        <v-chip
          v-if="showChip"
          small
          label
          :color="value?.color"
          :text-color="getTextColorForBackground(value?.color)"
          class=""
        >
          {{ value[valueField] }}
        </v-chip>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { colorUtils } from "@/mixins/colorUtils"

export default {
  name: "DisplayListItem",
  mixins: [colorUtils],
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    },
    showChip: {
      type: Boolean,
      default: true
    },
    // For cases where we want to display something other than code (like score)
    chipField: {
      type: String,
      default: "code"
    },
    valueField: {
      type: String,
      default: "name"
    }
  },
  computed: {
    chipText() {
      return this.value?.[this.chipField]
    }
  }
}
</script>
