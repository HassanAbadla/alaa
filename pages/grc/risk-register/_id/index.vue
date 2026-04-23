<template>
  <risk-details />
</template>

<script>
import RiskDetails from "../../../../components/risk/RiskDetails.vue"
export default {
  name: "RiskDetailsPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: { RiskDetails }
}
</script>

<style></style>
