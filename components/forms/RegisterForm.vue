<template>
  <div>
    <form-wrapper
      v-if="!successMessage"
      @submit="submitRequest"
      :loading="loading"
      :submit-text="$t('auth.submit_request')"
    >
      <custom-input
        v-for="field in formFields"
        :key="field.name"
        :name="field.name"
        :label="$t(`auth.${field.name}`)"
        :type="field.type"
        v-model="field.value"
        :icon="field.icon"
        :required="field.required"
        :validPhone="field.validPhone"
        :disabled="field.disabled"
        :errors="field.errors"
        @clear-errors="field.errors = []"
        @input="field.inputAction"
      />
      <custom-dropdown
        v-for="dropdown in formDropdowns"
        :key="dropdown.name"
        :name="dropdown.name"
        :label="$t(`auth.${dropdown.name}`)"
        :items="dropdown.items"
        v-model="dropdown.value"
        :item-text="dropdown.itemText"
        :item-value="dropdown.itemValue"
        :icon="dropdown.icon"
        :required="dropdown.required"
        :disabled="dropdown.disabled"
        :errors="dropdown.errors"
        @clear-errors="dropdown.errors = []"
        @change="dropdown.changeAction"
        :loading="dropdown.loading"
      />
      <!-- <div>
        <strong>{{ $t("auth.platform") }}</strong>
      </div> -->
      <!-- <v-radio-group v-model="platform" row mandatory>
        <v-radio label="PMIS" :value="0"></v-radio>
        <v-radio label="GRC" :value="1"></v-radio>
      </v-radio-group> -->
    </form-wrapper>
    <v-layout v-if="successMessage" column align-center justify-center>
      <p class="font-weight-medium">{{ successMessage }}</p>
    </v-layout>
  </div>
</template>

<script>
import { objectFromFields } from "@/helpers/field-helper"
import { createTenent } from "@/api/tenent-api"
import { getCitiesByCountryId, getCountries } from "@/api/location-api"

export default {
  name: "RegisterForm",
  middleware: "guest",
  data() {
    return {
      overlay: false,
      valid: false,
      loading: false,
      platform: null,
      formFields: [
        {
          name: "company_name",
          type: "text",
          icon: "mdi-domain",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("company_name")
        },
        {
          name: "email",
          type: "email",
          icon: "mdi-at",
          required: true,
          value: "",
          errors: [],
          inputAction: this.extractDomain
        },
        {
          name: "domain_name",
          type: "text",
          icon: "mdi-web",
          required: false,
          value: "",
          errors: [],
          inputAction: this.clearError("domain_name"),
          disabled: true
        },
        {
          name: "phone",
          type: "",
          icon: "mdi-phone",
          required: true,
          validPhone: true,
          value: "",
          errors: [],
          inputAction: this.clearError("phone")
        },
        {
          name: "full_name",
          type: "text",
          icon: "mdi-account-tie",
          required: true,
          value: "",
          errors: [],
          inputAction: this.clearError("full_name")
        }
      ],
      formDropdowns: [
        {
          name: "country_id",
          items: [],
          required: true,
          value: "",
          errors: [],
          itemText: "name",
          itemValue: "id",
          changeAction: this.fetchCities,
          loading: false
        },
        {
          name: "city_id",
          items: [],
          required: true,
          value: "",
          errors: [],
          itemText: "name",
          itemValue: "id",
          changeAction: this.clearError("city_id"),
          disabled: true,
          loading: false
        }
      ],
      successMessage: null,
      files: []
    }
  },
  computed: {
    selectedCountry() {
      return this.formDropdowns.find((dropdown) => dropdown.name === "country_id").value
    }
  },
  watch: {
    selectedCountry(newVal) {
      this.fetchCities()
    }
  },
  methods: {
    extractDomain() {
      const emailField = this.formFields.find((field) => field.name === "email")
      const domainField = this.formFields.find((field) => field.name === "domain_name")

      if (emailField.value) {
        domainField.value = emailField.value.split("@")[1]
        emailField.errors = []
      }
    },
    fetchCountries() {
      const countryDropdown = this.formDropdowns.find((dropdown) => dropdown.name === "country_id")
      countryDropdown.loading = true
      getCountries(this.$axios)
        .then((res) => {
          countryDropdown.items = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching countries:", error)
        })
        .finally(() => {
          countryDropdown.loading = false
        })
    },
    fetchCities() {
      const countryDropdown = this.formDropdowns.find((dropdown) => dropdown.name === "country_id")
      const cityDropdown = this.formDropdowns.find((dropdown) => dropdown.name === "city_id")
      if (countryDropdown.value) {
        cityDropdown.loading = true
        getCitiesByCountryId(countryDropdown.value, this.$axios)
          .then((res) => {
            cityDropdown.items = res.data.data
            cityDropdown.disabled = false // Enable the city dropdown when cities are fetched
          })
          .catch((error) => {
            console.error("Error fetching cities:", error)
          })
          .finally(() => {
            cityDropdown.loading = false
          })
      } else {
        cityDropdown.items = []
        cityDropdown.disabled = true // Disable the city dropdown
      }
    },
    submitRequest() {
      this.loading = true

      const payload = {
        ...objectFromFields(this.formFields),
        ...objectFromFields(this.formDropdowns),
        is_grc: Boolean(this.platform)
      }

      createTenent(payload, this.$axios)
        .then((response) => {
          this.successMessage = this.$t("auth.registration_sent_message")
        })
        .catch((error) => {
          const errorData = error.response.data.errors

          this.formFields.forEach((field) => {
            if (errorData[field.name]) {
              field.errors = errorData[field.name]
            }
          })
          this.formDropdowns.forEach((dropdown) => {
            if (errorData[dropdown.name]) {
              dropdown.errors = errorData[dropdown.name]
            }
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    clearError(field) {
      return () => {
        const fieldData =
          this.formFields.find((attr) => attr.name === field) || this.formDropdowns.find((attr) => attr.name === field)
        fieldData.errors = []
      }
    }
  },
  mounted() {
    this.fetchCountries()
  }
}
</script>

<style scoped>
.success-message {
  font-size: 2em; /* Adjust the font size as needed */
  text-align: center;
  padding: 20px;
  color: #120505; /* Change the text color to your desired color */
  border-radius: 5px;
}
</style>
