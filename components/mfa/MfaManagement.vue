<template>
  <div>
    <v-card>
      <v-card-text>
        <h2 class="title pb-4">{{ $t("mfa.enable_mfa") }}</h2>

        <!-- Loading State -->
        <div v-if="loadingStatus" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- MFA Status Display -->
        <div v-else>
          <mfa-status-card :mfa-enabled="mfaEnabled" :mfa-method="mfaMethod" class="mb-4" />

          <!-- Not Enabled - Show Setup Options -->
          <div v-if="!mfaEnabled">
            <v-alert type="info" text class="mb-4">
              {{ $t("mfa.choose_method") }}
            </v-alert>

            <!-- Method Selection Buttons -->
            <v-row v-if="!setupMode">
              <v-col cols="12" md="6">
                <v-card outlined hover @click="startSetup('totp')" class="pa-4 text-center" style="cursor: pointer">
                  <v-icon size="64" color="primary" class="mb-2">mdi-cellphone-key</v-icon>
                  <h3>{{ $t("mfa.authenticator_app") }}</h3>
                  <p class="mb-0 mt-2 grey--text">{{ $t("mfa.totp_description") }}</p>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card outlined hover @click="startSetup('email')" class="pa-4 text-center" style="cursor: pointer">
                  <v-icon size="64" color="primary" class="mb-2">mdi-email-lock</v-icon>
                  <h3>{{ $t("mfa.email_otp") }}</h3>
                  <p class="mb-0 mt-2 grey--text">{{ $t("mfa.email_description") }}</p>
                </v-card>
              </v-col>
            </v-row>

            <!-- Setup Components -->
            <div v-else class="mt-4">
              <mfa-setup-totp v-if="setupMode === 'totp'" @mfa-enabled="handleMfaEnabled" @cancel="cancelSetup" />
              <mfa-setup-email
                v-else-if="setupMode === 'email'"
                @mfa-enabled="handleMfaEnabled"
                @cancel="cancelSetup"
              />
            </div>
          </div>

          <!-- Already Enabled - Show Management Options -->
          <div v-else class="mt-4">
            <v-row>
              <!-- View Recovery Codes -->
              <v-col cols="12" md="6">
                <v-btn color="primary" outlined block @click="viewRecoveryCodes" :loading="loadingCodes">
                  <v-icon left>mdi-eye</v-icon>
                  {{ $t("mfa.view_codes") }}
                </v-btn>
              </v-col>

              <!-- Regenerate Recovery Codes -->
              <v-col cols="12" md="6">
                <v-btn color="warning" outlined block @click="openRegenerateDialog">
                  <v-icon left>mdi-refresh</v-icon>
                  {{ $t("mfa.regenerate_codes") }}
                </v-btn>
              </v-col>

              <!-- Disable MFA -->
              <v-col cols="12">
                <v-btn color="error" outlined block @click="openDisableDialog">
                  <v-icon left>mdi-shield-off</v-icon>
                  {{ $t("mfa.disable_mfa") }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Recovery Codes Display Modal -->
    <recovery-codes-display
      v-model="showRecoveryCodes"
      :recovery-codes="recoveryCodes"
      @confirmed="handleCodesConfirmed"
    />

    <!-- Regenerate Recovery Codes Dialog -->
    <custom-dialog v-model="regenerateDialog" :title="$t('mfa.regenerate_codes')" width="500px">
      <v-alert type="warning" text class="mb-4">
        {{ $t("mfa.regenerate_confirm") }}
      </v-alert>

      <form-wrapper @submit="regenerateRecoveryCodes" :loading="regenerateLoading" :submit-text="$t('page.confirm')">
        <custom-input
          :label="$t('auth.password')"
          type="password"
          v-model="regeneratePassword"
          icon="mdi-lock"
          :required="true"
          :errors="regeneratePasswordErrors"
          @clear-errors="regeneratePasswordErrors = []"
        />
      </form-wrapper>
    </custom-dialog>

    <!-- Disable MFA Dialog -->
    <custom-dialog v-model="disableDialog" :title="$t('mfa.disable_mfa')" width="500px">
      <v-alert type="error" text class="mb-4">
        {{ $t("mfa.disable_confirm") }}
      </v-alert>

      <form-wrapper @submit="disableMfa" :loading="disableLoading" :submit-text="$t('page.confirm')">
        <custom-input
          :label="$t('auth.password')"
          type="password"
          v-model="disablePassword"
          icon="mdi-lock"
          :required="true"
          :errors="disablePasswordErrors"
          @clear-errors="disablePasswordErrors = []"
        />
      </form-wrapper>
    </custom-dialog>
  </div>
</template>

<script>
import MfaStatusCard from "./MfaStatusCard.vue"
import MfaSetupTotp from "./MfaSetupTotp.vue"
import MfaSetupEmail from "./MfaSetupEmail.vue"
import RecoveryCodesDisplay from "./RecoveryCodesDisplay.vue"

export default {
  name: "MfaManagement",
  components: {
    MfaStatusCard,
    MfaSetupTotp,
    MfaSetupEmail,
    RecoveryCodesDisplay
  },
  data() {
    return {
      loadingStatus: false,
      loadingCodes: false,
      mfaEnabled: false,
      mfaMethod: null,
      setupMode: null, // 'totp' or 'email' or null
      recoveryCodes: [],
      showRecoveryCodes: false,
      // Regenerate dialog
      regenerateDialog: false,
      regenerateLoading: false,
      regeneratePassword: "",
      regeneratePasswordErrors: [],
      // Disable dialog
      disableDialog: false,
      disableLoading: false,
      disablePassword: "",
      disablePasswordErrors: []
    }
  },
  methods: {
    async fetchMfaStatus() {
      this.loadingStatus = true
      try {
        const response = await this.$axios.get("/mfa/status")
        this.mfaEnabled = response.data.mfa_enabled
        this.mfaMethod = response.data.mfa_method
      } catch (error) {
        // Error handled by axios interceptor
      } finally {
        this.loadingStatus = false
      }
    },

    startSetup(method) {
      this.setupMode = method
    },

    cancelSetup() {
      this.setupMode = null
    },

    handleMfaEnabled(codes) {
      this.recoveryCodes = codes
      this.showRecoveryCodes = true
    },

    handleCodesConfirmed() {
      // Refresh status
      this.fetchMfaStatus()
      this.setupMode = null
      // Toast removed - status refresh is enough feedback
    },

    async viewRecoveryCodes() {
      this.loadingCodes = true
      try {
        const response = await this.$axios.get("/mfa/recovery-codes")
        this.recoveryCodes = response.data.recovery_codes
        this.showRecoveryCodes = true
      } catch (error) {
        // Error handled by axios interceptor
      } finally {
        this.loadingCodes = false
      }
    },

    openRegenerateDialog() {
      this.regenerateDialog = true
      this.regeneratePassword = ""
      this.regeneratePasswordErrors = []
    },

    async regenerateRecoveryCodes() {
      this.regenerateLoading = true
      this.regeneratePasswordErrors = []

      try {
        const response = await this.$axios.post("/mfa/regenerate-recovery-codes", {
          password: this.regeneratePassword
        })

        this.recoveryCodes = response.data.recovery_codes
        this.regenerateDialog = false
        this.showRecoveryCodes = true
        // Success message will be shown by axios interceptor
      } catch (error) {
        if (error.response?.data?.errors?.password) {
          this.regeneratePasswordErrors = error.response.data.errors.password
        }
      } finally {
        this.regenerateLoading = false
      }
    },

    openDisableDialog() {
      this.disableDialog = true
      this.disablePassword = ""
      this.disablePasswordErrors = []
    },

    async disableMfa() {
      this.disableLoading = true
      this.disablePasswordErrors = []

      try {
        await this.$axios.post("/mfa/disable", {
          password: this.disablePassword
        })

        this.disableDialog = false
        this.mfaEnabled = false
        this.mfaMethod = null
        // Success message will be shown by axios interceptor
      } catch (error) {
        if (error.response?.data?.errors?.password) {
          this.disablePasswordErrors = error.response.data.errors.password
        }
      } finally {
        this.disableLoading = false
      }
    }
  },
  mounted() {
    this.fetchMfaStatus()
  }
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
