<template>
  <v-layout column>
    <form-wrapper v-if="!error && !loading" :title="title" @submit="submitProgram" :loading="isSubmitting">
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
      <custom-input
        :label="$t('form.code')"
        v-model="fields.code"
        :required="true"
        :errors="formErrors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        :label="$t('form.estimated_cost')"
        v-model="fields.estimated_cost"
        :required="true"
        type="number"
        :errors="formErrors.estimated_cost"
        @clear-errors="clearError('estimated_cost')"
      />
      <custom-dropdown
        :items="portfolios"
        item-value="id"
        item-text="name"
        :label="$t('form.portfolio')"
        :required="true"
        v-model="fields.portfolio_id"
        :errors="formErrors.portfolio_id"
        @clear-errors="clearError('portfolio_id')"
        :loading="loadingPortfolios"
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
        @clear-errors="clearError('description')"
      />
      <custom-checkbox v-model="fields.active" :label="$t('form.active')" />
    </form-wrapper>

    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex"
import { getCitiesByCountryId, getCountries } from "../../api/location-api"
import { getAllPortfolios } from "../../api/portfolios-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  name: "ProgramForm",
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
        code: "",
        estimated_cost: "",
        description: "",
        city_id: "",
        portfolio_id: "",
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        active: false,
        lng: 123,
        lat: 456
      },
      country_id: "",
      countries: [],
      cities: [],
      portfolios: [],
      error: null,
      loadingPortfolios: false,
      loadingCountries: false,
      loadingCities: false
    }
  },
  computed: {
    ...mapState("programs", ["formErrors", "program"]),
    ...mapGetters("programs", ["isSubmitting"]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.program")}`
    }
  },
  methods: {
    ...mapActions("programs", ["createProgram", "updateProgram", "getProgramById"]),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapMutations("programs", ["CLEAR_FORM_ERRORS", "CLEAR_FIELD_ERROR"]),

    async submitProgram() {
      const payload = { ...this.fields }
      try {
        if (this.editForm) {
          await this.updateProgram({ id: this.itemId || this.$route.params.id, payload })
        } else {
          await this.createProgram(payload)
        }
        this.closeDrawer()
      } catch (error) {
        // Error handling is now in the store
      }
    },

    async fetchProgram() {
      if (this.editForm) {
        try {
          const programId = this.itemId || this.$route.params.id
          await this.getProgramById(programId)
          if (this.program) {
            this.fields = {
              name: this.program.name,
              short_name: this.program.short_name,
              code: this.program.code,
              estimated_cost: this.program.estimated_cost,
              description: this.program.description,
              city_id: this.program.city.id,
              portfolio_id: this.program.portfolio.id,
              start_date: this.program.start_date,
              end_date: this.program.end_date,
              active: this.program.active,
              lng: 123,
              lat: 456
            }
            this.country_id = this.program.city.country.id
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

    async fetchPortfolios() {
      this.loadingPortfolios = true
      try {
        const response = await getAllPortfolios(this.$axios)
        this.portfolios = response.data.data
      } catch (error) {
        console.error("Error fetching portfolios:", error)
      } finally {
        this.loadingPortfolios = false
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
    this.fetchPortfolios()
    if (this.editForm) {
      this.fetchProgram()
    }
  }
}
</script>

<style scoped>
.locationBtn {
  margin-top: 20px;
}
</style>
