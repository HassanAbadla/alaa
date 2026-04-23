<template>
  <risk-register-form />
</template>

<script>
import RiskRegisterForm from "@/components/forms/RiskRegisterForm.vue"
export default {
  components: { RiskRegisterForm },
  name: "CreateRiskRegisterPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"]
}
</script>

<style></style>
