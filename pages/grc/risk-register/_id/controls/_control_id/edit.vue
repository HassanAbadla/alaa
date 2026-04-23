<template><RiskControlForm editForm /></template>

<script>
import RiskControlForm from "@/components/forms/RiskControlForm.vue"

export default {
  name: "EditRiskControlsPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskControlForm }
}
</script>

<style></style>
