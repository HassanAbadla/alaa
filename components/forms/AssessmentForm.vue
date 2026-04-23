<template>
  <div class="assessment-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.code"
        :label="$t('form.code')"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        v-model="fields.name"
        :label="$t('form.name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />

      <custom-date-picker
        v-model="fields.assessment_date"
        :label="$t('table.assessment_date')"
        :required="true"
        :error-messages="errors.assessment_date"
        @input="clearError('assessment_date')"
      />

      <!-- Assessment Type Toggle - Only show if user has more than one permission -->
      <div v-if="shouldShowToggle" class="mb-4">
        <label class="v-label theme--light" style="font-size: 14px; color: rgba(0, 0, 0, 0.6)">
          {{ $t("table.assessment_type") }} *
        </label>
        <v-btn-toggle
          v-model="assessmentType"
          mandatory
          class="mt-2"
          color="primary"
          @change="handleAssessmentTypeChange"
        >
          <v-btn v-if="hasProjectPermission" value="project" :disabled="editForm">
            <v-icon left>mdi-folder-outline</v-icon>
            {{ $t("form.project") }}
          </v-btn>
          <v-btn v-if="hasAssetPermission" value="asset" :disabled="editForm">
            <v-icon left>mdi-server</v-icon>
            {{ $t("table.asset") }}
          </v-btn>
        </v-btn-toggle>
        <div v-if="errors.project_id || errors.grc_assets_id" class="error--text text-caption mt-1">
          {{ errors.project_id?.[0] || errors.grc_assets_id?.[0] }}
        </div>
      </div>

      <!-- Hidden field label when only one option available -->
      <div v-else-if="availableTypes.length === 1" class="mb-4">
        <label class="v-label theme--light" style="font-size: 14px; color: rgba(0, 0, 0, 0.6)">
          {{ $t("table.assessment_type") }} *
        </label>
        <div class="mt-2 text-body-2">
          <v-chip color="primary" outlined>
            <v-icon left small>{{ assessmentType === "project" ? "mdi-folder-outline" : "mdi-server" }}</v-icon>
            {{ assessmentType === "project" ? $t("form.project") : $t("table.asset") }}
          </v-chip>
        </div>
        <div v-if="errors.project_id || errors.grc_assets_id" class="error--text text-caption mt-1">
          {{ errors.project_id?.[0] || errors.grc_assets_id?.[0] }}
        </div>
      </div>

      <!-- Project Dropdown -->
      <custom-dropdown
        v-if="assessmentType === 'project' && hasProjectPermission"
        v-model="fields.project_id"
        :items="projects"
        :label="$t('form.project')"
        :required="true"
        :errors="errors.project_id"
        :loading="loadingProjects"
        item-text="name"
        item-value="id"
        @clear-errors="clearError('project_id')"
      />

      <!-- Asset Dropdown -->
      <custom-dropdown
        v-if="assessmentType === 'asset' && hasAssetPermission"
        v-model="fields.grc_assets_id"
        :items="assets"
        :label="$t('table.asset')"
        :required="true"
        :errors="errors.grc_assets_id"
        :loading="loadingAssets"
        item-text="name"
        item-value="id"
        @clear-errors="clearError('grc_assets_id')"
      />

      <!-- No permission message -->
      <v-alert v-if="availableTypes.length === 0" type="warning" outlined class="mt-4">
        {{ $t("page.no_permission_message") }}
      </v-alert>
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "AssessmentForm",
  components: {
    QuillEditor
  },
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      assessmentType: null, // Will be set based on permissions
      fields: {
        code: "",
        name: "",
        note: "",
        assessment_date: null,
        project_id: null,
        grc_assets_id: null
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      assessments: "assessments/getAssessments",
      currentAssessment: "assessments/getCurrentAssessment",
      projects: "projectsList/getProjects",
      loadingProjects: "projectsList/loadingProjects",
      assets: "assets/assets",
      loadingAssets: "assets/loadingAssets"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.assessments")}`
    },
    hasProjectPermission() {
      return this.$hasPermission("access_projects")
    },
    hasAssetPermission() {
      return this.$hasPermission("access_assets")
    },
    availableTypes() {
      const types = []
      if (this.hasProjectPermission) types.push("project")
      if (this.hasAssetPermission) types.push("asset")
      return types
    },
    shouldShowToggle() {
      return !this.editForm && this.availableTypes.length > 1
    }
  },
  methods: {
    ...mapActions({
      addAssessment: "assessments/addAssessment",
      updateAssessment: "assessments/updateAssessment",
      fetchAssessmentById: "assessments/fetchAssessmentById",
      fetchProjects: "projectsList/fetchProjects",
      fetchAssets: "assets/fetchAssets"
    }),
    ...mapActions("drawer", ["closeDrawer"]),

    clearError(field) {
      if (this.errors[field]) {
        this.$set(this.errors, field, [])
      }
    },

    handleAssessmentTypeChange(type) {
      // Clear the IDs when switching types
      if (type === "project") {
        this.fields.grc_assets_id = null
        this.clearError("grc_assets_id")
      } else {
        this.fields.project_id = null
        this.clearError("project_id")
      }
    },

    setDefaultAssessmentType() {
      // If only one permission, auto-select it
      if (this.availableTypes.length === 1) {
        this.assessmentType = this.availableTypes[0]
      } else if (this.availableTypes.length > 1) {
        // Default to project if user has both permissions
        this.assessmentType = "project"
      }
    },

    async handleSubmit() {
      this.isSubmitting = true
      this.errors = {}
      try {
        const payload = {
          code: this.fields.code,
          name: this.fields.name,
          note: this.fields.note,
          assessment_date: this.fields.assessment_date
        }

        // Add the appropriate ID based on assessment type
        if (this.assessmentType === "project") {
          payload.project_id = this.fields.project_id
        } else {
          payload.grc_assets_id = this.fields.grc_assets_id
        }

        const result = this.editForm
          ? await this.updateAssessment({ ...payload, id: this.itemId })
          : await this.addAssessment(payload)

        if (result?.success === false && result?.errors) {
          this.errors = result.errors
          return
        }

        this.closeDrawer()
      } catch (error) {
        const apiErrors = error?.response?.data?.message
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
        }
        console.error("Error saving assessment:", error)
      } finally {
        this.isSubmitting = false
      }
    },

    async loadAssessment() {
      this.isLoading = true
      try {
        let assessment = this.assessments?.find((a) => a.id === this.itemId)
        if (!assessment) {
          assessment = await this.fetchAssessmentById(this.itemId)
        } else {
          await this.fetchAssessmentById(this.itemId)
        }

        const source = assessment || this.currentAssessment
        if (source) {
          // Determine assessment type based on which ID is present
          if (source.project_id) {
            this.assessmentType = "project"
          } else if (source.grc_assets_id) {
            this.assessmentType = "asset"
          }

          this.fields = {
            code: source.code || "",
            name: source.name || "",
            note: source.note || "",
            assessment_date: source.assessment_date || null,
            project_id: source.project_id || null,
            grc_assets_id: source.grc_assets_id || null
          }
        }
      } catch (error) {
        console.error("Error loading assessment:", error)
      } finally {
        this.isLoading = false
      }
    },

    async loadDropdownData() {
      try {
        // Only fetch data based on user permissions
        const promises = []

        if (this.hasProjectPermission) {
          promises.push(this.fetchProjects())
        }

        if (this.hasAssetPermission) {
          promises.push(this.fetchAssets())
        }

        if (promises.length > 0) {
          await Promise.all(promises)
        }
      } catch (error) {
        console.error("Error loading dropdown data:", error)
      }
    }
  },
  async mounted() {
    // Set default assessment type based on permissions
    if (!this.editForm) {
      this.setDefaultAssessmentType()
    }

    // Load dropdown data based on permissions
    await this.loadDropdownData()

    // Then load assessment data if in edit mode
    if (this.editForm && this.itemId) {
      await this.loadAssessment()
    }
  }
}
</script>

<style scoped>
.assessment-form {
  width: 100%;
}
</style>
