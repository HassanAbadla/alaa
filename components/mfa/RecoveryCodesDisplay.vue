<template>
  <custom-dialog v-model="internalDialog" :title="$t('mfa.recovery_codes_title')" width="600px" persistent>
    <v-alert type="warning" text class="mb-4">
      <strong>{{ $t("mfa.recovery_codes_warning") }}</strong>
    </v-alert>

    <div class="recovery-codes-container">
      <v-card outlined class="pa-4 mb-4">
        <h3 class="mb-3">{{ $t("mfa.recovery_codes_list") }}</h3>
        <v-row>
          <v-col v-for="(code, index) in recoveryCodes" :key="index" cols="6" class="py-1">
            <div class="code-item">
              <v-icon small class="mr-2">mdi-key</v-icon>
              <span class="code-text">{{ code }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-layout justify-space-between class="mb-4">
        <v-btn color="primary" outlined @click="downloadCodes">
          <v-icon left>mdi-download</v-icon>
          {{ $t("mfa.download_codes") }}
        </v-btn>
        <v-btn color="primary" outlined @click="copyCodes">
          <v-icon left>mdi-content-copy</v-icon>
          {{ copied ? $t("mfa.copied") : $t("mfa.copy_codes") }}
        </v-btn>
      </v-layout>

      <v-checkbox v-model="confirmed" :label="$t('mfa.i_have_saved')" color="primary" class="mt-2"></v-checkbox>

      <v-btn color="primary" block :disabled="!confirmed" @click="closeDialog">
        {{ $t("page.continue") }}
      </v-btn>
    </div>
  </custom-dialog>
</template>

<script>
export default {
  name: "RecoveryCodesDisplay",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    recoveryCodes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      confirmed: false,
      copied: false
    }
  },
  computed: {
    internalDialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.confirmed = false
        this.copied = false
      }
    }
  },
  methods: {
    copyCodes() {
      const codesText = this.recoveryCodes.join("\n")
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codesText).then(() => {
          this.copied = true
          this.$toast.showMessage({ message: this.$t("mfa.copied") })
          setTimeout(() => {
            this.copied = false
          }, 3000)
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = codesText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        this.copied = true
        this.$toast.showMessage({ message: this.$t("mfa.copied") })
        setTimeout(() => {
          this.copied = false
        }, 3000)
      }
    },
    downloadCodes() {
      const codesText = this.recoveryCodes.join("\n")
      const blob = new Blob([codesText], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "mfa-recovery-codes.txt"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
    closeDialog() {
      if (this.confirmed) {
        this.$emit("confirmed")
        this.internalDialog = false
      }
    }
  }
}
</script>

<style scoped>
.recovery-codes-container {
  padding: 10px;
}

.code-item {
  display: flex;
  align-items: center;
  font-family: monospace;
  font-size: 16px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.code-text {
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
