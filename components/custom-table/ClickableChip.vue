<template>
  <v-can disable-only :permission="permission">
    <template #default="{ disabled }">
      <v-chip :disabled="disabled" @click="click" link small dense>{{ value }}</v-chip>
    </template>
  </v-can>
</template>

<script>
import VCan from "../VCan.vue"
export default {
  components: { VCan },
  name: "ClickableChip",
  props: {
    value: { type: [String, Number], default: "" },
    permission: { type: String, required: true }
  },
  methods: {
    click() {
      this.$emit("click")
    }
  }
}
</script>

<style></style>
