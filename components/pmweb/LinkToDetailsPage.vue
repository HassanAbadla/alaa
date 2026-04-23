<template>
  <div class="d-flex justify-space-between" :style="{ cursor: 'pointer' }" @click="routeTo(path)">
    <div style="text-decoration: underline">{{ title }}</div>
    <v-icon right x-small :color="'blue'">mdi-open-in-new</v-icon>
  </div>
</template>

<script>
export default {
  name: "LinkToDetailsPage",
  props: {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  methods: {
    routeTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style></style>
