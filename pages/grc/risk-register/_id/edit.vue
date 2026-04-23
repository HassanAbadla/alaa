<template>
  <risk-register-form editForm />
</template>

<script>
import RiskRegisterForm from "@/components/forms/RiskRegisterForm.vue"
export default {
  components: { RiskRegisterForm },
  name: "EditRiskRegisterPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"]
}
</script>

<style></style>
