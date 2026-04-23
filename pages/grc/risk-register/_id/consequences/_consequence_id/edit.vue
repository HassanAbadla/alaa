<template><RiskConsequenceForm editForm /></template>

<script>
import RiskConsequenceForm from "@/components/forms/RiskConsequenceForm.vue"

export default {
  name: "EditRiskConsequencesPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskConsequenceForm }
}
</script>

<style></style>
