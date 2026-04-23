<template>
  <v-btn small color="primary" :outlined="filterApplied" @click="click">
    {{ $t("page.filter") }}
    <v-icon right>{{ filterApplied ? "mdi-filter-check" : "mdi-filter" }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "FilterBtn",
  props: {
    filterApplied: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click() {
      this.$emit("click")
    }
  }
}
</script>

<style></style>
