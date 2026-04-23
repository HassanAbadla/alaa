<template>
  <v-card outlined class="pa-4">
    <v-layout align-center justify-space-between>
      <div>
        <h3 class="mb-1">{{ $t("mfa.status") }}</h3>
        <div v-if="mfaEnabled" class="d-flex align-center">
          <v-icon color="success" class="mr-2">mdi-shield-check</v-icon>
          <span>
            {{ $t("mfa.enabled_with") }}:
            <strong>{{ mfaMethodDisplay }}</strong>
          </span>
        </div>
        <div v-else class="d-flex align-center">
          <v-icon color="grey" class="mr-2">mdi-shield-off</v-icon>
          <span class="grey--text">{{ $t("mfa.not_enabled") }}</span>
        </div>
      </div>
      <v-icon :color="mfaEnabled ? 'success' : 'grey'" size="48">
        {{ mfaEnabled ? "mdi-lock-check" : "mdi-lock-open" }}
      </v-icon>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "MfaStatusCard",
  props: {
    mfaEnabled: {
      type: Boolean,
      default: false
    },
    mfaMethod: {
      type: String,
      default: null,
      validator: (value) => !value || ["totp", "email"].includes(value)
    }
  },
  computed: {
    mfaMethodDisplay() {
      if (!this.mfaMethod) return ""
      return this.mfaMethod === "totp" ? this.$t("mfa.method_totp") : this.$t("mfa.method_email")
    }
  }
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
