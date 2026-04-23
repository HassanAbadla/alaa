<template><risk-treatment-form /></template>

<script>
import RiskTreatmentForm from "@/components/forms/RiskTreatmentForm.vue"

export default {
  name: "CreateRiskTreatmentsPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskTreatmentForm }
}
</script>

<style></style>
