<template>
  <div>
    <v-alert v-if="errorMessage" type="error" text class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <!-- Show recovery code input or regular MFA code input -->
    <div v-if="useRecoveryCode">
      <v-alert type="warning" text class="mb-4">
        <strong>{{ $t("mfa.recovery_code_warning") }}</strong>
        <br />
        {{ $t("mfa.recovery_code_single_use") }}
      </v-alert>

      <form-wrapper @submit="submitRecoveryCode" :loading="loading" :submit-text="$t('auth.login')">
        <custom-input
          :label="$t('mfa.recovery_code')"
          type="text"
          v-model="recoveryCode"
          icon="mdi-key"
          :required="true"
          :errors="recoveryCodeErrors"
          @clear-errors="recoveryCodeErrors = []"
        />

        <v-btn text plain class="text-decoration-underline pa-0 text-none primary--text" @click="toggleRecoveryCode">
          {{ $t("mfa.back_to_code") }}
        </v-btn>
      </form-wrapper>
    </div>

    <div v-else>
      <v-alert type="info" text class="mb-4">
        <div v-if="mfaMethod === 'totp'">
          {{ $t("mfa.enter_totp_code") }}
        </div>
        <div v-else>
          {{ $t("mfa.enter_email_code") }}
        </div>
      </v-alert>

      <form-wrapper @submit="submitMfaCode" :loading="loading" :submit-text="$t('auth.login')">
        <custom-input
          :label="$t('mfa.verification_code')"
          type="text"
          v-model="mfaCode"
          icon="mdi-shield-key"
          :required="true"
          :errors="mfaCodeErrors"
          @clear-errors="mfaCodeErrors = []"
          @input="handleCodeInput"
        />

        <v-layout align-center justify-space-between class="mb-3">
          <v-btn text plain class="text-decoration-underline pa-0 text-none primary--text" @click="toggleRecoveryCode">
            {{ $t("mfa.use_recovery_code") }}
          </v-btn>

          <v-btn
            v-if="mfaMethod === 'email'"
            text
            plain
            class="text-decoration-underline pa-0 text-none primary--text"
            :disabled="resendLoading || resendCooldown > 0"
            @click="resendOtp"
          >
            <span v-if="resendCooldown > 0">{{ $t("mfa.resend_in") }} ({{ resendCooldown }}s)</span>
            <span v-else>{{ $t("mfa.resend_code") }}</span>
          </v-btn>
        </v-layout>

        <v-btn text plain class="text-decoration-underline pa-0 text-none" @click="$emit('back')">
          {{ $t("mfa.back_to_login") }}
        </v-btn>
      </form-wrapper>
    </div>
  </div>
</template>

<script>
export default {
  name: "MfaVerification",
  props: {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    rememberMe: {
      type: Boolean,
      default: true
    },
    mfaMethod: {
      type: String,
      required: true,
      validator: (value) => ["totp", "email"].includes(value)
    },
    recaptchaToken: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      resendLoading: false,
      resendCooldown: 0,
      resendTimer: null,
      mfaCode: "",
      mfaCodeErrors: [],
      recoveryCode: "",
      recoveryCodeErrors: [],
      useRecoveryCode: false,
      errorMessage: ""
    }
  },
  methods: {
    handleCodeInput() {
      this.mfaCodeErrors = []
      this.errorMessage = ""
    },

    async submitMfaCode() {
      this.loading = true
      this.errorMessage = ""
      this.mfaCodeErrors = []

      try {
        const payload = {
          email: this.email,
          password: this.password,
          remember_me: this.rememberMe,
          mfa_code: this.mfaCode
        }

        // Add recaptcha token if provided
        if (this.recaptchaToken) {
          payload.recaptcha_token = this.recaptchaToken
        }

        // Make direct axios call to avoid interceptor issues
        const response = await this.$axios.post("/login", payload, {
          validateStatus: (status) => status < 500
        })

        if (response.data.status && response.data.token) {
          // Manually set the token and fetch user
          this.$auth.setUserToken(response.data.token)
          await this.$auth.fetchUser()
          this.$emit("success")
          this.$router.push(this.localePath("/main"))
        } else {
          this.errorMessage = response.data.message || this.$t("mfa.verification_failed")
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors
          if (apiErrors.mfa_code) {
            this.mfaCodeErrors = apiErrors.mfa_code
          }
        } else if (error.response?.data?.message) {
          this.errorMessage = error.response.data.message
        } else {
          this.errorMessage = this.$t("mfa.verification_failed")
        }
      } finally {
        this.loading = false
      }
    },

    async submitRecoveryCode() {
      this.loading = true
      this.errorMessage = ""
      this.recoveryCodeErrors = []

      try {
        const payload = {
          email: this.email,
          password: this.password,
          remember_me: this.rememberMe,
          recovery_code: this.recoveryCode
        }

        // Add recaptcha token if provided
        if (this.recaptchaToken) {
          payload.recaptcha_token = this.recaptchaToken
        }

        // Make direct axios call to avoid interceptor issues
        const response = await this.$axios.post("/login", payload, {
          validateStatus: (status) => status < 500
        })

        if (response.data.status && response.data.token) {
          // Manually set the token and fetch user
          this.$auth.setUserToken(response.data.token)
          await this.$auth.fetchUser()
          this.$emit("success")
          this.$router.push(this.localePath("/main"))
        } else {
          this.errorMessage = response.data.message || this.$t("mfa.recovery_code_failed")
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors
          if (apiErrors.recovery_code) {
            this.recoveryCodeErrors = apiErrors.recovery_code
          }
        } else if (error.response?.data?.message) {
          this.errorMessage = error.response.data.message
        } else {
          this.errorMessage = this.$t("mfa.recovery_code_failed")
        }
      } finally {
        this.loading = false
      }
    },

    async resendOtp() {
      if (this.resendCooldown > 0) return

      this.resendLoading = true
      try {
        // Send email OTP during login - we need to call the login endpoint again
        // But this time just to trigger the OTP send, not to complete login
        const response = await this.$axios.post(
          "/login",
          {
            email: this.email,
            password: this.password
          },
          {
            validateStatus: (status) => status < 500
          }
        )

        if (response.data.requires_mfa && response.data.mfa_method === "email") {
          // Success message will be shown by axios interceptor
          this.startResendCooldown()
        }
      } catch (error) {
        // Error is handled by axios plugin
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

    toggleRecoveryCode() {
      this.useRecoveryCode = !this.useRecoveryCode
      this.mfaCode = ""
      this.mfaCodeErrors = []
      this.recoveryCode = ""
      this.recoveryCodeErrors = []
      this.errorMessage = ""
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
