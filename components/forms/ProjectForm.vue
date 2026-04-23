<template>
  <div>
    <form-wrapper v-if="!error && !loading" :title="title" @submit="submitProject" :loading="isSubmitting">
      <v-tabs v-model="tab">
        <v-tab>{{ $t("form.global_info") }}</v-tab>
        <v-tab>{{ $t("form.ids") }}</v-tab>
        <v-tab>{{ $t("form.vrp") }}</v-tab>
        <v-tab>{{ $t("form.timeline") }}</v-tab>
        <v-tab>{{ $t("form.location") }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-input
                  :label="$t('form.name')"
                  v-model="fields.name"
                  :errors="formErrors.name"
                  @clear-errors="clearError('name')"
                />
                <custom-input
                  :label="$t('form.short_name')"
                  v-model="fields.short_name"
                  :errors="formErrors.short_name"
                  @clear-errors="clearError('short_name')"
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
                  :items="project_types"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.project_type_id')"
                  v-model="fields.project_type_id"
                  :errors="formErrors.project_type_id"
                  @clear-errors="clearError('project_type_id')"
                  :loading="loadingProjectTypes"
                />
                <custom-dropdown
                  :label="$t('table.methodology')"
                  item-value="id"
                  item-text="name"
                  :items="methodologies"
                  v-model="fields.methodology_id"
                  :errors="formErrors.methodology_id"
                  @clear-errors="clearError('methodology_id')"
                  :loading="loadingMethodologies"
                  :disabled="editForm"
                  required
                />
                <custom-dropdown
                  :items="categories"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.category_id')"
                  v-model="fields.category_id"
                  :errors="formErrors.category_id"
                  @clear-errors="clearError('category_id')"
                  :loading="loadingCategories"
                />
                <custom-dropdown
                  v-if="fields.category_id"
                  :items="sub_categories"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.sub_category_id')"
                  v-model="fields.sub_category_id"
                  :errors="formErrors.sub_category_id"
                  @clear-errors="clearError('sub_category_id')"
                  :loading="loadingSubCategories"
                />
                <custom-dropdown
                  :items="departments"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.department_id')"
                  v-model="fields.department_id"
                  :errors="formErrors.department_id"
                  @clear-errors="clearError('department_id')"
                  :loading="loadingDepartments"
                />
                <custom-dropdown
                  :items="programs"
                  item-value="id"
                  item-text="name"
                  :label="$t('form.program_id')"
                  v-model="fields.program_id"
                  :errors="formErrors.program_id"
                  @clear-errors="clearError('program_id')"
                  :loading="loadingPrograms"
                />
                <custom-text-area
                  v-model="fields.description"
                  :label="$t('form.description')"
                  outlined
                  :errors="formErrors.description"
                  @clear-errors="clearError('description')"
                />
                <custom-checkbox v-model="fields.active" :label="$t('form.active')" />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-input
                  :label="$t('form.id_cse')"
                  v-model="fields.id_cse"
                  :errors="formErrors.id_cse"
                  @clear-errors="clearError('id_cse')"
                />
                <custom-input
                  :label="$t('form.id_MOF')"
                  v-model="fields.id_MOF"
                  :errors="formErrors.id_MOF"
                  @clear-errors="clearError('id_MOF')"
                />
                <custom-input
                  :label="$t('form.id_etimad')"
                  v-model="fields.id_etimad"
                  :errors="formErrors.id_etimad"
                  @clear-errors="clearError('id_etimad')"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-input
                  :label="$t('form.vrp_name')"
                  v-model="fields.vrp_name"
                  :errors="formErrors.vrp_name"
                  @clear-errors="clearError('vrp_name')"
                />
                <custom-input
                  :label="$t('form.vrp_initiative')"
                  v-model="fields.vrp_initiative"
                  :errors="formErrors.vrp_initiative"
                  @clear-errors="clearError('vrp_initiative')"
                />
                <custom-input
                  :label="$t('form.vrp_uic')"
                  v-model="fields.vrp_uic"
                  :errors="formErrors.vrp_uic"
                  @clear-errors="clearError('vrp_uic')"
                />
                <custom-checkbox v-model="fields.is_vrp" :label="$t('form.is_vrp')" />
                <custom-checkbox v-model="fields.is_linked" :label="$t('form.is_linked')" />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12" md="8" lg="5" class="mt-15">
              <v-card flat>
                <custom-dropdown
                  :items="statuses"
                  item-value="name"
                  item-text="name"
                  :label="$t('form.project_status')"
                  v-model="fields.project_status"
                  :errors="formErrors.project_status"
                  @clear-errors="clearError('project_status')"
                />
                <custom-dropdown
                  :items="phases"
                  item-value="name"
                  item-text="name"
                  :label="$t('form.project_phase')"
                  v-model="fields.project_phase"
                  :errors="formErrors.project_phase"
                  @clear-errors="clearError('project_phase')"
                />
                <custom-input
                  :label="$t('form.distressed_projects')"
                  v-model="fields.distressed_projects"
                  :errors="formErrors.distressed_projects"
                  @clear-errors="clearError('distressed_projects')"
                />
                <custom-input
                  :label="$t('form.project_duration')"
                  v-model="fields.project_duration"
                  :errors="formErrors.project_duration"
                  @clear-errors="clearError('project_duration')"
                />
                <custom-date-picker
                  v-model="fields.scheduled_initiation_start_date"
                  :label="$t('form.scheduled_initiation_start_date')"
                  :errors="formErrors.scheduled_initiation_start_date"
                  @clear-errors="clearError('scheduled_initiation_start_date')"
                />
                <custom-date-picker
                  v-model="fields.scheduled_delivery_start_date"
                  :label="$t('form.scheduled_delivery_start_date')"
                  :errors="formErrors.scheduled_delivery_start_date"
                  @clear-errors="clearError('scheduled_delivery_start_date')"
                />
                <custom-date-picker
                  v-model="fields.scheduled_delivery_end_date"
                  :label="$t('form.scheduled_delivery_end_date')"
                  :errors="formErrors.scheduled_delivery_end_date"
                  :start-date="fields.scheduled_delivery_start_date"
                  :is-end-date="true"
                  @clear-errors="clearError('scheduled_delivery_end_date')"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col class="locationBtn" cols="12" md="8" lg="5">
              <custom-dropdown
                :items="countries"
                item-value="id"
                item-text="name"
                :label="$t('auth.country_id')"
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
                v-model="fields.city_id"
                :errors="formErrors.city_id"
                @clear-errors="clearError('city_id')"
                :loading="loadingCities"
              />
              <MapComponent :location.sync="location" :polygonPaths.sync="polygonPaths" :addPath="addPath" />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </form-wrapper>
    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex"
import MapComponent from "../map/Map.vue"
import { getCitiesByCountryId, getCountries } from "../../api/location-api"
import { getAllDepartments } from "../../api/departments-api"
import { getAllPrograms } from "../../api/programs-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  name: "ProjectForm",
  components: { MapComponent, MessageDisplay },
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: Number }
  },
  data() {
    return {
      tab: null,
      location: {
        lat: 24.74253477396743,
        lng: 46.72719751640623
      },
      polygonPaths: [],
      addPath: false,
      loading: false,
      fields: {
        methodology_id: null,
        estimated_cost: "",
        active: false,
        description: "",
        name: "",
        short_name: "",
        department_id: "",
        program_id: "",
        project_type_id: "",
        category_id: "",
        sub_category_id: "",
        city_id: "",
        lat: null,
        lng: null,
        id_cse: "",
        id_MOF: "",
        id_etimad: "",
        vrp_name: "",
        vrp_initiative: "",
        vrp_uic: "",
        is_vrp: false,
        is_linked: false,
        project_status: "",
        distressed_projects: "",
        project_duration: "",
        scheduled_initiation_start_date: new Date().toISOString().substr(0, 10),
        scheduled_delivery_start_date: new Date().toISOString().substr(0, 10),
        scheduled_delivery_end_date: new Date().toISOString().substr(0, 10),
        project_phase: "",
        title: "PLACE HOLDER"
      },
      project_types: [],
      departments: [],
      programs: [],
      categories: [],
      sub_categories: [],
      cities: [],
      countries: [],
      country_id: "",
      statuses: [
        { id: 1, name: "Active" },
        { id: 2, name: "Cancelled" },
        { id: 3, name: "On Hold" }
      ],
      phases: [
        { id: 1, name: "Start" },
        { id: 2, name: "On Execution" },
        { id: 3, name: "Delivery" }
      ],
      error: null,
      loadingProjectTypes: false,
      loadingCategories: false,
      loadingSubCategories: false,
      loadingDepartments: false,
      loadingPrograms: false,
      loadingCountries: false,
      loadingCities: false
    }
  },
  computed: {
    ...mapState("projects", ["formErrors", "project"]),
    ...mapGetters("projects", ["isSubmitting"]),
    ...mapGetters({
      methodologies: "pmisMethodologies/getMethodologies",
      loadingMethodologies: "pmisMethodologies/isLoading"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.project")}`
    }
  },
  methods: {
    ...mapActions("projects", ["createProject", "updateProject", "getProjectById"]),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapMutations("projects", ["CLEAR_FORM_ERRORS", "CLEAR_FIELD_ERROR"]),
    ...mapActions({ fetchMethodologies: "pmisMethodologies/fetchMethodologies" }),

    async submitProject() {
      this.fields.lat = this.location.lat
      this.fields.lng = this.location.lng
      const payload = { ...this.fields }

      try {
        if (this.editForm) {
          await this.updateProject({
            id: this.itemId || this.$route.params.id,
            payload
          })
        } else {
          await this.createProject(payload)
        }
        this.closeDrawer()
      } catch (error) {
        // Error handling is now in the store
      }
    },

    async fetchProject() {
      if (this.editForm) {
        try {
          const projectId = this.itemId || this.$route.params.id
          await this.getProjectById(projectId)
          if (this.project) {
            this.fields = {
              ...this.fields,
              estimated_cost: this.project.estimated_cost,
              name: this.project.name,
              short_name: this.project.short_name,
              description: this.project.description,
              department_id: this.project.department?.id || "",
              program_id: this.project.program?.id || "",
              project_type_id: this.project.type?.id || "",
              category_id: this.project.category?.id || "",
              sub_category_id: this.project.sub_category?.id || "",
              city_id: this.project.city?.id || "",
              lat: this.project.lat,
              lng: this.project.lng,
              id_cse: this.project.id_cse,
              id_MOF: this.project.id_MOF,
              id_etimad: this.project.id_etimad,
              vrp_name: this.project.vrp_name,
              vrp_initiative: this.project.vrp_initiative,
              vrp_uic: this.project.vrp_uic,
              is_vrp: this.project.is_vrp,
              is_linked: this.project.is_linked,
              project_status: this.project.project_status,
              distressed_projects: this.project.distressed_projects,
              project_duration: this.project.project_duration,
              scheduled_initiation_start_date: this.project.scheduled_initiation_start_date,
              scheduled_delivery_start_date: this.project.scheduled_delivery_start_date,
              scheduled_delivery_end_date: this.project.scheduled_delivery_end_date,
              project_phase: this.project.project_phase,
              active: this.project.active,
              methodology_id: this.project.methodology_id
            }
            this.country_id = this.project.city?.country.id || ""
            this.location = { lat: this.project.lat, lng: this.project.lng }
            if (this.country_id) {
              await this.fetchCities()
            }
          }
        } catch (error) {
          this.error = generateErrorMessage(error, this.$i18n)
        }
      }
    },

    async fetchProjectTypes() {
      this.loadingProjectTypes = true
      try {
        const response = await this.$axios.get("projects_types")
        this.project_types = response.data.data
      } catch (error) {
        console.error("Error fetching projects_types:", error)
      } finally {
        this.loadingProjectTypes = false
      }
    },

    async fetchCategories() {
      this.loadingCategories = true
      try {
        const response = await this.$axios.get("categories")
        this.categories = response.data.data
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        this.loadingCategories = false
      }
    },

    async fetchSubCategories() {
      if (this.fields.category_id) {
        this.loadingSubCategories = true
        try {
          const response = await this.$axios.get(`sub-categories?category_id=${this.fields.category_id}`)
          this.sub_categories = response.data.data
        } catch (error) {
          console.error("Error fetching sub categories:", error)
        } finally {
          this.loadingSubCategories = false
        }
      } else {
        this.sub_categories = []
      }
    },

    async fetchDepartments() {
      this.loadingDepartments = true
      try {
        const response = await getAllDepartments(this.$axios)
        this.departments = response.data.data
      } catch (error) {
        console.error("Error fetching departments:", error)
      } finally {
        this.loadingDepartments = false
      }
    },

    async fetchPrograms() {
      this.loadingPrograms = true
      try {
        const response = await getAllPrograms(this.$axios)
        this.programs = response.data.data
      } catch (error) {
        console.error("Error fetching programs:", error)
      } finally {
        this.loadingPrograms = false
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

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }
    },

    showPosition(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    },

    clearError(field) {
      this.CLEAR_FIELD_ERROR(field)
    }
  },
  watch: {
    "fields.category_id"(newVal) {
      this.fetchSubCategories(newVal)
    },
    country_id(newVal) {
      this.fetchCities(newVal)
    }
  },
  mounted() {
    this.CLEAR_FORM_ERRORS()
    this.fetchProjectTypes()
    this.fetchDepartments()
    this.fetchPrograms()
    this.fetchCategories()
    this.fetchCountries()
    this.fetchMethodologies()
    if (this.editForm) {
      this.fetchProject()
    }
  }
}
</script>

<style scoped>
.success-message {
  font-size: 2em;
  text-align: center;
  padding: 20px;
  color: #20bb69;
  border-radius: 5px;
}
.locationBtn {
  padding-top: 40px;
}
</style>
