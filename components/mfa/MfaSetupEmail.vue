<template>
  <div>
    <!-- Step 1: Request Email OTP -->
    <div v-if="!otpSent">
      <v-alert type="info" text class="mb-4">
        {{ $t("mfa.setup_email_instructions") }}
      </v-alert>
      <v-btn color="primary" @click="requestOtp" :loading="loading" block>
        {{ $t("mfa.send_verification_code") }}
      </v-btn>
    </div>

    <!-- Step 2: Verify Code and Enable -->
    <div v-else-if="!isVerified">
      <v-alert type="info" text class="mb-4">
        {{ $t("mfa.email_code_sent") }}
        <br />
        <strong>{{ userEmail }}</strong>
      </v-alert>

      <form-wrapper @submit="verifyAndEnable" :loading="loading" :submit-text="$t('mfa.verify_and_enable')">
        <custom-input
          :label="$t('mfa.verification_code')"
          type="text"
          v-model="verificationCode"
          icon="mdi-email-check"
          :required="true"
          :errors="codeErrors"
          @clear-errors="codeErrors = []"
        />

        <v-layout justify-space-between class="mb-3">
          <v-btn
            text
            plain
            small
            class="text-decoration-underline pa-0 text-none primary--text"
            :disabled="resendLoading || resendCooldown > 0"
            @click="resendOtp"
          >
            <span v-if="resendCooldown > 0">{{ $t("mfa.resend_in") }} ({{ resendCooldown }}s)</span>
            <span v-else>{{ $t("mfa.resend_code") }}</span>
          </v-btn>
        </v-layout>
      </form-wrapper>

      <v-btn text @click="cancel" class="mt-2" block>
        {{ $t("page.cancel") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "MfaSetupEmail",
  data() {
    return {
      loading: false,
      resendLoading: false,
      resendCooldown: 0,
      resendTimer: null,
      otpSent: false,
      verificationCode: "",
      codeErrors: [],
      isVerified: false
    }
  },
  computed: {
    userEmail() {
      return this.$auth.user?.email || ""
    }
  },
  methods: {
    async requestOtp() {
      this.loading = true
      try {
        await this.$axios.post("/mfa/enable", {
          method: "email"
        })

        this.otpSent = true
        this.startResendCooldown()
      } catch (error) {
        // Error handled by axios interceptor
      } finally {
        this.loading = false
      }
    },

    async verifyAndEnable() {
      this.loading = true
      this.codeErrors = []

      try {
        const response = await this.$axios.post("/mfa/enable", {
          method: "email",
          code: this.verificationCode
        })

        this.isVerified = true
        this.$emit("mfa-enabled", response.data.recovery_codes)
      } catch (error) {
        if (error.response?.data?.errors?.code) {
          this.codeErrors = error.response.data.errors.code
        }
      } finally {
        this.loading = false
      }
    },

    async resendOtp() {
      if (this.resendCooldown > 0) return

      this.resendLoading = true
      try {
        await this.$axios.post("/mfa/enable", {
          method: "email"
        })

        // Success message will be shown by axios interceptor
        this.startResendCooldown()
      } catch (error) {
        // Error handled by axios interceptor
      } finally {
        this.resendLoading = false
      }
    },

    startResendCooldown() {
      this.resendCooldown = 60
      this.resendTimer = setInterval(() => {
        this.resendCooldown--
        if (this.resendCooldown <= 0) {
          clearInterval(this.resendTimer)
        }
      }, 1000)
    },

    cancel() {
      this.otpSent = false
      this.verificationCode = ""
      this.codeErrors = []
      if (this.resendTimer) {
        clearInterval(this.resendTimer)
      }
      this.$emit("cancel")
    }
  },
  beforeDestroy() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer)
    }
  }
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
