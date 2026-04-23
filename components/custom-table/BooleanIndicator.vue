<template>
  <v-icon small :color="value ? color : 'grey'">
    {{ value ? "mdi-checkbox-marked-circle-outline" : "mdi-alpha-x-circle-outline" }}
  </v-icon>
</template>

<script>
export default {
  name: "BooleanIndicator",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    color: { type: String, default: "success" }
  }
}
</script>
