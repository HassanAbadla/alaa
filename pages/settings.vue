<template>
  <div>
    <v-container fluid>
      <back-btn />
      <!-- Avatar Section -->
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <div class="position-relative d-inline-block">
            <custom-avatar :name="user.full_name" :image="displayAvatar" :size="150" />

            <!-- Hidden File Input -->
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileSelect" />

            <!-- Action Buttons -->
            <div class="mt-4">
              <template v-if="displayAvatar">
                <v-btn color="primary" class="mr-2" @click="triggerFileInput">
                  <v-icon left>mdi-camera</v-icon>
                  {{ $t("page.update") }}
                </v-btn>
                <v-btn color="error" @click="removeAvatar">
                  <v-icon left>mdi-delete</v-icon>
                  {{ $t("page.delete") }}
                </v-btn>
              </template>
              <v-btn v-else color="primary" @click="triggerFileInput">
                <v-icon left>mdi-plus</v-icon>
                {{ $t("page.add_photo") }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Profile Information Section -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <form-wrapper
                :title="$t('form.profile_information')"
                @submit="saveProfile"
                :loading="isSubmittingProfile"
                :submit-text="$t('form.save')"
              >
                <custom-input
                  v-for="field in profileFormFields"
                  :key="field.name"
                  :name="field.name"
                  :label="$t(`auth.${field.name}`)"
                  :type="field.type"
                  v-model="field.value"
                  :icon="field.icon"
                  :required="field.required"
                  :disabled="field.disabled"
                  :errors="field.errors"
                  @clear-errors="field.errors = []"
                  @input="field.inputAction"
                />
              </form-wrapper>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Password Change Section -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <form-wrapper
                :title="$t('auth.change_password')"
                @submit="changePassword"
                :loading="loading"
                :key="formKey"
                :submit-text="$t('form.save')"
              >
                <p v-if="passwordChangeErrorMessage" class="error-message">
                  {{ passwordChangeErrorMessage.text }}
                </p>
                <custom-input
                  v-for="field in passwordFormFields"
                  :key="field.name"
                  :name="field.name"
                  :label="$t(`auth.${field.name}`)"
                  :type="field.type"
                  v-model="field.value"
                  :icon="field.icon"
                  :required="field.required"
                  :disabled="field.disabled"
                  :valid-password="field.validPassword"
                  :errors="field.errors"
                  @clear-errors="field.errors = []"
                  @input="field.inputAction"
                />
              </form-wrapper>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- MFA Management Section -->
      <v-row>
        <v-col cols="12">
          <mfa-management />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { changeUserPassword, updateProfileDetails } from "../api/user-api"
import BackBtn from "../components/custom-table/BackBtn.vue"
import CustomAvatar from "../components/profile/CustomAvatar.vue"
import MfaManagement from "../components/mfa/MfaManagement.vue"
import { layoutPicker } from "../helpers/auth"
import { generateErrorMessage } from "../helpers/error-helpers"
import { objectFromFields } from "../helpers/field-helper"

export default {
  components: { CustomAvatar, BackBtn, MfaManagement },
  name: "SettingsPage",
  middleware: ["auth"],

  layout: "dashboard-layout",

  data() {
    return {
      formKey: 0,
      loading: false,
      isSubmittingProfile: false,
      avatarFile: null,
      passwordChangeErrorMessage: "",
      user: this.$auth.user,

      profileFormFields: [
        {
          name: "full_name",
          type: "text",
          icon: "mdi-account",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("full_name")
        },
        {
          name: "email",
          type: "email",
          icon: "mdi-email",
          required: true,
          value: "",
          errors: [],
          disabled: true,
          inputAction: this.clearError("email")
        },
        {
          name: "phone",
          type: "number",
          icon: "mdi-phone",
          required: false,
          value: "",
          errors: [],
          validPhone: true,
          inputAction: this.clearError("phone")
        }
      ],

      passwordFormFields: [
        {
          name: "current_password",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("current_password")
        },
        {
          name: "new_password",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "",
          errors: [],
          validPassword: true,
          inputAction: this.clearError("new_password")
        },
        {
          name: "new_password_confirmation",
          type: "password",
          icon: "mdi-lock",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("new_password_confirmation")
        }
      ]
    }
  },

  computed: {
    displayAvatar() {
      return this.$auth.user?.avatar || null
    }
  },

  methods: {
    // Avatar Methods
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    async handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith("image/")) {
        this.$toast.error(this.$t("page.invalid_file_type"))
        return
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$toast.error(this.$t("page.file_too_large"))
        return
      }

      this.avatarFile = file
      await this.uploadAvatar()
    },

    async uploadAvatar() {
      if (!this.avatarFile) return

      const formData = new FormData()
      formData.append("avatar", this.avatarFile)

      try {
        const response = await this.$axios.post("/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })

        const updatedUser = {
          ...this.$auth.user,
          avatar: `https://api.ordonsoft.com/storage/${response.data.avatar}`
        }

        await this.$auth.setUser(updatedUser)
      } catch (error) {
        console.error("Avatar upload failed:", error)
      } finally {
        this.avatarFile = null
      }
    },

    async removeAvatar() {
      try {
        await this.$axios.delete("delete-avatar")
        const updatedUser = {
          ...this.$auth.user,
          avatar: null
        }
        await this.$auth.setUser(updatedUser)
      } catch (error) {
        console.error("Avatar removal failed:", error)
      }
    },

    handleImageError() {
      const updatedUser = {
        ...this.$auth.user,
        avatar: null
      }
      this.$auth.setUser(updatedUser)
    },

    // Form Methods
    clearError(field) {
      return () => {
        const fieldData =
          this.profileFormFields.find((attr) => attr.name === field) ||
          this.passwordFormFields.find((attr) => attr.name === field)
        if (fieldData) {
          fieldData.errors = []
        }
        if (field === "current_password") {
          this.passwordChangeErrorMessage = ""
        }
      }
    },

    async saveProfile() {
      this.isSubmittingProfile = true
      try {
        const payload = objectFromFields(this.profileFormFields)
        await updateProfileDetails(payload, this.$axios)
        this.$toast.success(this.$t("page.successfully"))
      } catch (error) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors
          this.profileFormFields.forEach((field) => {
            if (apiErrors[field.name]) {
              field.errors = apiErrors[field.name]
            }
          })
        }
      } finally {
        this.isSubmittingProfile = false
      }
    },

    async changePassword() {
      this.loading = true
      this.passwordChangeErrorMessage = ""

      try {
        const payload = objectFromFields(this.passwordFormFields)
        await changeUserPassword(payload, this.$axios)
        this.$toast.success(this.$t("page.password_changed_successfully"))

        // Reset form
        this.passwordFormFields.forEach((field, index) => {
          this.$set(this.passwordFormFields[index], "value", "")
          this.$set(this.passwordFormFields[index], "errors", [])
        })
        this.formKey += 1
      } catch (error) {
        if (error.response?.data?.errors) {
          const apiErrors = error.response.data.errors
          this.passwordFormFields.forEach((field) => {
            if (apiErrors[field.name]) {
              field.errors = apiErrors[field.name]
            }
          })
        } else if (error.response) {
          this.passwordChangeErrorMessage = generateErrorMessage(error, this.$i18n)
        }
      } finally {
        this.loading = false
      }
    },

    fetchProfile() {
      const userFields = this.profileFormFields.map((field) => field.name)
      userFields.forEach((field) => {
        const userData = this.$auth.user[field]
        const fieldData = this.profileFormFields.find((attr) => attr.name === field)
        if (fieldData) {
          fieldData.value = userData
        }
      })
    }
  },

  mounted() {
    this.fetchProfile()
  }
}
</script>

<style scoped>
.position-relative {
  position: relative;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

.success-message {
  font-size: 2em;
  text-align: center;
  padding: 20px;
  color: #120505;
  border-radius: 5px;
}
</style>
