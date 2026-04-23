<template><RiskCauseForm editForm /></template>

<script>
import RiskCauseForm from "@/components/forms/RiskCauseForm.vue"

export default {
  name: "EditRiskCausesPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskCauseForm }
}
</script>

<style></style>
