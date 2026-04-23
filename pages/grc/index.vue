<template></template>

<script>
export default {
  name: "GrcPage",
  layout: "dashboard-layout",

  mounted() {
    // Redirect to the first module in the GRC section
    this.$router.push(this.localePath("/"))
  }
}
</script>

<style></style>
