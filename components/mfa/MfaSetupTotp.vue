<template>
  <div>
    <!-- Step 1: Get QR Code -->
    <div v-if="!qrCodeUrl">
      <v-alert type="info" text class="mb-4">
        {{ $t("mfa.setup_totp_instructions") }}
      </v-alert>
      <v-btn color="primary" @click="getQrCode" :loading="loading" block>
        {{ $t("mfa.get_qr_code") }}
      </v-btn>
    </div>

    <!-- Step 2: Scan QR Code and Verify -->
    <div v-else-if="!isVerified">
      <v-alert type="info" text class="mb-4">
        <strong>{{ $t("mfa.scan_qr_code") }}</strong>
        <ol class="mt-2">
          <li>{{ $t("mfa.step_1_open_app") }}</li>
          <li>{{ $t("mfa.step_2_scan_qr") }}</li>
          <li>{{ $t("mfa.step_3_enter_code") }}</li>
        </ol>
      </v-alert>

      <!-- QR Code Display -->
      <v-card outlined class="pa-4 mb-4 text-center">
        <div v-if="qrCodeImageUrl">
          <img :src="qrCodeImageUrl" alt="QR Code" style="max-width: 256px; width: 100%" @error="handleQrError" />
          <p class="mt-2 caption grey--text">
            {{ $t("mfa.scan_with_app") }}
          </p>
        </div>
        <div v-else>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Manual Entry Option -->
        <v-expansion-panels flat class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t("mfa.cant_scan") }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="mb-2">{{ $t("mfa.manual_entry_instructions") }}</p>
              <div class="secret-code pa-3">
                <strong>{{ secret }}</strong>
              </div>
              <v-btn small text @click="copySecret" class="mt-2">
                <v-icon small left>mdi-content-copy</v-icon>
                {{ secretCopied ? $t("mfa.copied") : $t("mfa.copy_secret") }}
              </v-btn>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>

      <!-- Verification Code Input -->
      <form-wrapper @submit="verifyAndEnable" :loading="loading" :submit-text="$t('mfa.verify_and_enable')">
        <custom-input
          :label="$t('mfa.verification_code')"
          type="text"
          v-model="verificationCode"
          icon="mdi-shield-key"
          :required="true"
          :errors="codeErrors"
          @clear-errors="codeErrors = []"
        />
      </form-wrapper>

      <v-btn text @click="cancel" class="mt-2" block>
        {{ $t("page.cancel") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "MfaSetupTotp",
  data() {
    return {
      loading: false,
      qrCodeUrl: null,
      secret: null,
      verificationCode: "",
      codeErrors: [],
      isVerified: false,
      secretCopied: false
    }
  },
  computed: {
    qrCodeImageUrl() {
      if (!this.qrCodeUrl) return null
      // Convert otpauth:// URL to actual QR code image using free service
      return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(this.qrCodeUrl)}`
    }
  },
  methods: {
    async getQrCode() {
      this.loading = true
      try {
        const response = await this.$axios.post("/mfa/enable", {
          method: "totp"
        })

        this.qrCodeUrl = response.data.qr_code_url
        this.secret = response.data.secret
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
          method: "totp",
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

    copySecret() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.secret).then(() => {
          this.secretCopied = true
          this.$toast.success(this.$t("mfa.copied"))
          setTimeout(() => {
            this.secretCopied = false
          }, 3000)
        })
      }
    },

    handleQrError() {
      console.error("QR code failed to load. Using alternative generation method.")
      // Try alternative QR service as fallback
      if (this.qrCodeUrl && this.qrCodeImageUrl.includes("qrserver.com")) {
        // Could try another service like chart.googleapis.com
        // For now, just log - manual entry is still available
        this.$toast.error("QR code failed to load. Please use manual entry below.")
      }
    },

    cancel() {
      this.qrCodeUrl = null
      this.secret = null
      this.verificationCode = ""
      this.codeErrors = []
      this.$emit("cancel")
    }
  }
}
</script>

<style scoped>
.secret-code {
  background: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
  font-size: 18px;
  letter-spacing: 2px;
  word-break: break-all;
}
</style>
