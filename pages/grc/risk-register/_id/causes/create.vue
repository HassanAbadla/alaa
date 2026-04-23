<template><risk-cause-form /></template>

<script>
import RiskCauseForm from "@/components/forms/RiskCauseForm.vue"

export default {
  name: "CreateRiskCausesPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskCauseForm }
}
</script>

<style></style>
