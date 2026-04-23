<template>
  <div>
    <!-- Show MFA Verification if required -->
    <mfa-verification
      v-if="showMfaVerification"
      :email="formFields[0].value"
      :password="formFields[1].value"
      :remember-me="rememberMe"
      :mfa-method="mfaMethod"
      :recaptcha-token="recaptchaToken"
      @success="handleLoginSuccess"
      @back="resetMfaState"
    />

    <!-- Show regular login form -->
    <form-wrapper v-else @submit="login" :loading="loading" :submit-text="$t('auth.login')">
      <v-alert icon="mdi-alert-circle" text type="error" v-model="notAuthenticate">
        {{ $t("auth.not_authorized") }}
      </v-alert>
      <!-- recaptcha errors -->
      <v-alert icon="mdi-shield-alert" text type="error" v-model="recaptchaError" class="mb-4">
        {{ recaptchaErrorMessage }}
      </v-alert>
      <custom-input
        v-for="field in formFields"
        :key="field.name"
        :label="$t(`auth.${field.name}`)"
        :type="field.type"
        v-model="field.value"
        :icon="field.icon"
        :required="field.required"
        :errors="field.errors"
        @clear-errors="field.errors = []"
        @input="field.inputAction"
      />
      <v-layout align-center justify-space-between>
        <custom-checkbox v-model="rememberMe" :label="$t('auth.remember')" />
        <v-btn
          text
          plain
          class="text-decoration-underline pa-0 text-none primary--text text--darken-2"
          :ripple="false"
          @click="openDialog('password')"
        >
          {{ $t("auth.forgot_password") }}
        </v-btn>
      </v-layout>
    </form-wrapper>

    <!-- reCAPTCHA branding -->
    <div class="text-center mt-3" v-if="!$config.disableRecaptcha">
      <small class="grey--text">
        {{ $t("recaptcha.branding") }}
        <a href="https://policies.google.com/privacy" target="_blank" class="primary--text">
          {{ $t("recaptcha.privacy_policy") }}
        </a>
        {{ $t("page.and") }}
        <a href="https://policies.google.com/terms" target="_blank" class="primary--text">
          {{ $t("recaptcha.terms_of_service") }}
        </a>
        {{ $t("recaptcha.apply") }}
      </small>
    </div>
    <custom-dialog v-model="dialog['password']" :title="$t('auth.forgot_password')">
      <forgot-password-form />
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from "../CustomDialog.vue"
import ForgotPasswordForm from "./ForgotPasswordForm.vue"
import MfaVerification from "../mfa/MfaVerification.vue"

export default {
  components: { CustomDialog, ForgotPasswordForm, MfaVerification },
  name: "LoginForm",
  data() {
    return {
      dialog: { password: false },
      loading: false,
      valid: false,
      notAuthenticate: false,
      rememberMe: true,
      errorMsg: "",
      recaptchaError: false,
      recaptchaErrorMessage: "",
      // MFA state
      showMfaVerification: false,
      mfaMethod: null,
      recaptchaToken: "",
      formFields: [
        {
          name: "email",
          type: "email",
          icon: "mdi-at",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("email")
        },
        {
          name: "password",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("password")
        }
      ]
    }
  },

  methods: {
    openDialog(name) {
      this.dialog[name] = true
    },

    async login() {
      this.loading = true
      this.notAuthenticate = false
      this.recaptchaError = false
      this.errorMsg = ""

      try {
        // Execute reCAPTCHA first
        let recaptchaToken = ""
        if (!this.$config.disableRecaptcha && this.$recaptcha) {
          recaptchaToken = await this.$recaptcha.execute("login")
        }

        // Prepare login payload with reCAPTCHA token
        const payload = {
          remember_me: this.rememberMe,
          recaptcha_token: recaptchaToken,
          ...Object.fromEntries(this.formFields.map((field) => [field.name, field.value]))
        }

        // Make a direct axios call first to check for MFA
        // This bypasses the auth module and prevents automatic redirects
        const response = await this.$axios.post("/login", payload, {
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        })

        // Check if MFA is required
        if (response.data.requires_mfa) {
          this.showMfaVerification = true
          this.mfaMethod = response.data.mfa_method
          this.recaptchaToken = recaptchaToken // Store for later use
          return // Stop here, don't proceed with normal login
        }

        // If no MFA required, complete login normally
        if (response.data.status && response.data.token) {
          // Manually set the token and user
          this.$auth.setUserToken(response.data.token)
          await this.$auth.fetchUser()
          this.$router.push(this.localePath("/main"))
        } else {
          this.notAuthenticate = true
        }
      } catch (error) {
        // Check if it's a reCAPTCHA error
        if (error.message && error.message.includes("recaptcha")) {
          this.recaptchaError = true
          this.recaptchaErrorMessage = "Security verification failed. Please try again."
        }
        // Regular login error
        else {
          this.notAuthenticate = true
        }
      } finally {
        this.loading = false
      }
    },

    handleLoginSuccess() {
      // Login successful, close dialog if in modal
      this.$emit("login-success")
    },

    resetMfaState() {
      this.showMfaVerification = false
      this.mfaMethod = null
      this.recaptchaToken = ""
    },

    clearError(field) {
      return () => {
        const fieldData = this.formFields.find((attr) => attr.name === field)
        if (fieldData) {
          fieldData.errors = []
        }
      }
    }
  },

  async mounted() {
    // Initialize reCAPTCHA
    try {
      if (!this.$config.disableRecaptcha && this.$recaptcha) {
        await this.$recaptcha.init()
      }
    } catch (e) {
      console.error("reCAPTCHA initialization failed:", e)
    }
  },

  beforeDestroy() {
    if (this.$recaptcha) {
      this.$recaptcha.destroy()
    }
  }
}
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
