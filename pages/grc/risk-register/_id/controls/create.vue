<template><risk-control-form /></template>

<script>
import RiskControlForm from "@/components/forms/RiskControlForm.vue"

export default {
  name: "CreateRiskControlsPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskControlForm }
}
</script>

<style></style>
