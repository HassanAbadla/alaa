<template><risk-consequence-form /></template>

<script>
import RiskConsequenceForm from "@/components/forms/RiskConsequenceForm.vue"

export default {
  name: "CreateRiskConsequencesPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskConsequenceForm }
}
</script>

<style></style>
