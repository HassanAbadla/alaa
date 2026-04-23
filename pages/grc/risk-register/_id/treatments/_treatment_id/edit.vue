<template><RiskTreatmentForm editForm /></template>

<script>
import RiskTreatmentForm from "@/components/forms/RiskTreatmentForm.vue"

export default {
  name: "EditRiskTreatmentsPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskTreatmentForm }
}
</script>

<style></style>
