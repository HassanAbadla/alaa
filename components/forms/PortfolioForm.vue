<template>
  <v-layout column>
    <form-wrapper v-if="!error && !loading" :title="title" @submit="submitPortfolio" :loading="isSubmitting">
      <custom-input
        :label="$t('form.name')"
        v-model="fields.name"
        :required="true"
        :errors="formErrors.name"
        @clear-errors="clearError('name')"
      />
      <custom-input
        :label="$t('form.short_name')"
        v-model="fields.short_name"
        :required="true"
        :errors="formErrors.short_name"
        @clear-errors="clearError('short_name')"
      />
      <custom-dropdown
        :items="countries"
        item-value="id"
        item-text="name"
        :label="$t('auth.country_id')"
        :required="true"
        @change="fetchCities"
        v-model="country_id"
        :errors="formErrors.country_id"
        @clear-errors="clearError('country_id')"
        :loading="loadingCountries"
      />
      <custom-dropdown
        v-if="country_id"
        :items="cities"
        item-value="id"
        item-text="name"
        :label="$t('auth.city_id')"
        :required="true"
        v-model="fields.city_id"
        :errors="formErrors.city_id"
        @clear-errors="clearError('city_id')"
        :loading="loadingCities"
      />
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <custom-date-picker
            v-model="fields.start_date"
            :label="$t('form.start_date')"
            :errors="formErrors.start_date"
            @clear-errors="clearError('start_date')"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <custom-date-picker
            v-model="fields.end_date"
            :label="$t('form.end_date')"
            :errors="formErrors.end_date"
            :start-date="fields.start_date"
            :is-end-date="true"
            @clear-errors="clearError('end_date')"
          />
        </v-col>
      </v-row>
      <custom-text-area
        v-model="fields.description"
        :label="$t('form.description')"
        required
        :errors="formErrors.description"
        @focus="clearError('description')"
      />
      <custom-checkbox v-model="fields.active" :label="$t('form.active')" />
    </form-wrapper>

    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex"
import { getCitiesByCountryId, getCountries } from "../../api/location-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  name: "PortfolioForm",
  components: { MessageDisplay },
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: Number }
  },
  data() {
    return {
      loading: false,
      fields: {
        name: "",
        short_name: "",
        description: "",
        city_id: "",
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        active: false
      },
      country_id: "",
      countries: [],
      cities: [],
      error: null,
      loadingCountries: false,
      loadingCities: false
    }
  },
  computed: {
    ...mapState("portfolios", ["formErrors", "portfolio"]),
    ...mapGetters("portfolios", ["isSubmitting"]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.portfolio")}`
    }
  },
  methods: {
    ...mapActions("portfolios", ["createPortfolio", "updatePortfolio", "getPortfolioById"]),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapMutations("portfolios", ["CLEAR_FORM_ERRORS", "CLEAR_FIELD_ERROR"]),

    async submitPortfolio() {
      const payload = { ...this.fields, lng: "1", lat: "1" }
      try {
        if (this.editForm) {
          await this.updatePortfolio({ id: this.itemId, payload })
        } else {
          await this.createPortfolio(payload)
        }
        this.closeDrawer()
      } catch (error) {
        // Error handling is now in the store
      }
    },

    async fetchPortfolio() {
      if (this.editForm) {
        try {
          await this.getPortfolioById(this.itemId)
          if (this.portfolio) {
            this.fields = {
              name: this.portfolio.name,
              short_name: this.portfolio.short_name,
              description: this.portfolio.description,
              city_id: this.portfolio.city.id,
              start_date: this.portfolio.start_date,
              end_date: this.portfolio.end_date,
              active: this.portfolio.active
            }
            this.country_id = this.portfolio.city.country.id
            await this.fetchCities()
          }
        } catch (error) {
          this.error = generateErrorMessage(error, this.$i18n)
        }
      }
    },

    async fetchCountries() {
      this.loadingCountries = true
      try {
        const response = await getCountries(this.$axios)
        this.countries = response.data.data
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        this.loadingCountries = false
      }
    },

    async fetchCities() {
      if (this.country_id) {
        this.loadingCities = true
        try {
          const response = await getCitiesByCountryId(this.country_id, this.$axios)
          this.cities = response.data.data
        } catch (error) {
          console.error("Error fetching cities:", error)
        } finally {
          this.loadingCities = false
        }
      } else {
        this.cities = []
      }
    },

    clearError(field) {
      this.CLEAR_FIELD_ERROR(field)
    }
  },
  watch: {
    country_id(newVal) {
      this.fetchCities(newVal)
    }
  },
  mounted() {
    this.CLEAR_FORM_ERRORS()
    this.fetchCountries()
    if (this.editForm) {
      this.fetchPortfolio()
    }
  }
}
</script>

<style scoped>
.locationBtn {
  margin-top: 20px;
}
</style>
