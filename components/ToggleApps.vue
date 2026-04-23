<template>
  <v-btn @click="toggleName" :to="link">{{ name }}</v-btn>
</template>

<script>
export default {
  name: "ToggleApp",
  data() {
    return {
      name: "GRC"
    }
  },
  computed: {
    link() {
      return this.name === "GRC" ? "/grc" : "/dashboard"
    }
  },
  methods: {
    toggleName() {
      this.name = this.name === "GRC" ? "PMIS" : "GRC"
    },
    setInitialState() {
      const currentPath = this.$route.path
      this.name = currentPath.startsWith("/grc") ? "PMIS" : "GRC"
    }
  },
  mounted() {
    this.setInitialState()
  },
  watch: {
    $route: "setInitialState"
  }
}
</script>

<style></style>
