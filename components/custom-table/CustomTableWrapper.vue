<template>
  <v-card flat :class="`${bgColor} px-4 `">
    <slot />
  </v-card>
</template>

<script>
export default {
  name: "CustomTableWrapper",
  props: {
    bgColor: {
      type: String,
      default: "globalBg"
    }
  }
}
</script>

<style></style>
