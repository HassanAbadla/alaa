<template>
  <div>
    <form-wrapper v-if="!error" :title="title" @submit="submitContract" :loading="isSubmitting">
      <custom-dropdown
        v-if="!projectId"
        :items="portfolios"
        item-value="id"
        item-text="name"
        :label="$t('portfolio_name')"
        v-model="portfolioId"
        @input="onPortfolioChange"
        :disabled="loadingPortfolios"
        :loading="loadingPortfolios"
      />

      <custom-dropdown
        v-if="!projectId"
        :items="programs"
        item-value="id"
        item-text="name"
        :label="$t('program_name')"
        v-model="programId"
        @input="onProgramChange"
        :disabled="loadingPrograms || !portfolioId"
        :loading="loadingPrograms"
      />
      <custom-dropdown
        :items="projects"
        item-value="id"
        item-text="name"
        :label="$t('project_name')"
        v-model="fields.project_id"
        :errors="formErrors.project_id"
        :disabled="projectId || loadingProjects || !programId"
        @clear-errors="clearError('project_id')"
        :loading="loadingProjects"
        required
      />
      <custom-dropdown
        :items="companies"
        item-value="id"
        item-text="name"
        :label="$t('auth.company_name')"
        v-model="fields.company_id"
        :errors="formErrors.company_id"
        @clear-errors="clearError('company_id')"
        :disabled="loadingCompanies"
        :loading="loadingCompanies"
        required
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
        :items="contract_disiplines"
        item-value="id"
        item-text="name"
        :label="$t('contract_desiplines')"
        v-model="fields.contract_disipline_id"
        :errors="formErrors.contract_disipline_id"
        @clear-errors="clearError('contract_disipline_id')"
        :disable="loadingDisiplines"
        :loading="loadingDisiplines"
        required
      />
      <custom-dropdown
        :items="contract_status"
        item-value="id"
        item-text="name"
        :label="$t('contract_status')"
        v-model="fields.contract_status_id"
        :errors="formErrors.contract_status_id"
        @clear-errors="clearError('contract_status_id')"
        :disable="loadingContractStatus"
        :loading="loadingContractStatus"
        required
      />
      <custom-dropdown
        :items="contract_types"
        item-value="id"
        item-text="name"
        :label="$t('contract_type')"
        v-model="fields.contract_type_id"
        :errors="formErrors.contract_type_id"
        @clear-errors="clearError('contract_type_id')"
        :disable="loadingContractTypes"
        :loading="loadingContractTypes"
        required
      />

      <!--------------- DATE PICKER ----------------------->
      <custom-date-picker
        v-model="fields.start_date"
        :label="$t('start_date')"
        :errors="formErrors.start_date"
        @clear-errors="clearError('start_date')"
        required
      />

      <custom-date-picker
        v-model="fields.end_date"
        :label="$t('end_date')"
        :errors="formErrors.end_date"
        :start-date="fields.start_date"
        :is-end-date="true"
        @clear-errors="clearError('end_date')"
        required
      />
      <custom-text-area
        v-model="fields.description"
        :label="$t('description')"
        :errors="formErrors.description"
        @clear-errors="clearError('description')"
        required
      />
    </form-wrapper>
    <message-display v-if="error" :messageTitle="error.title" :messageText="error.text" :code="error.code" />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex"
import { getAllCompanies } from "../../api/companies-api"
import { getContractDisciplines, getContractStatus, getContractTypes } from "../../api/contract-api"
import { getAllPortfolios } from "../../api/portfolios-api"
import { getAllPrograms } from "../../api/programs-api"
import { getProjectById, getContractByIdAndProjectId, getAllProjects } from "../../api/projects-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  components: { MessageDisplay },
  name: "ContractForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number }
  },
  layout: "dashboard-layout",

  data() {
    return {
      valid: false,
      loading: false,
      error: null,
      fields: {
        estimated_cost: "",
        name: "",
        company_id: "",
        project_id: "",
        contract_disipline_id: "",
        contract_status_id: "",
        contract_type_id: "",
        start_date: "",
        end_date: "",
        description: ""
      },
      companies: [],
      contract_disiplines: [],
      contract_types: [],
      contract_status: [],
      projects: [],
      portfolioId: null,
      programId: null,
      portfolios: [],
      programs: [],
      loadingPortfolios: false,
      loadingPrograms: false,
      loadingCompanies: false,
      loadingProjects: false,
      loadingDisiplines: false,
      loadingContractStatus: false,
      loadingContractTypes: false
    }
  },
  computed: {
    ...mapState("contracts", ["formErrors", "contract"]),
    ...mapGetters("contracts", ["isSubmitting"]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.contract")}`
    },
    projectId() {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions("contracts", ["createContract", "updateContract", "getContractById"]),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapMutations("contracts", ["CLEAR_FIELD_ERROR"]),

    async submitContract() {
      const payload = { ...this.fields }
      try {
        if (this.editForm) {
          await this.updateContract({ id: this.itemId, payload })
        } else {
          await this.createContract(payload)
        }
        this.closeDrawer()
      } catch (error) {
        // Error handling is now in the store
      }
    },

    async fetchContract() {
      if (this.editForm) {
        try {
          await this.getContractById(this.itemId)
          if (this.contract) {
            this.fields = {
              estimated_cost: this.contract?.estimated_cost,
              name: this.contract.name,
              company_id: this.contract.company.id,
              project_id: this.contract.project_id,
              contract_disipline_id: this.contract.disipline.id,
              contract_status_id: this.contract.status.id,
              contract_type_id: this.contract.type.id,
              start_date: this.contract.start_date,
              end_date: this.contract.end_date,
              description: this.contract.description
            }
            this.programId = contract?.project?.program?.id
            this.portfolioId = contract?.project?.program?.portfolio?.id
            if (this.portfolioId && this.programId) {
              this.fetchPortfolios()
              this.fetchPrograms()
              this.fetchProjects()
            }
          }
        } catch (error) {}
      }
    },

    fetchCompanies() {
      this.loadingCompanies = true
      getAllCompanies(this.$axios)
        .then((res) => {
          this.companies = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching companies:", error)
        })
        .finally(() => {
          this.loadingCompanies = false
        })
    },

    fetchProject() {
      if (this.projectId) {
        this.loadingProjects = true
        getProjectById(this.projectId, this.$axios)
          .then((res) => {
            this.projects = [res.data.data]
            this.fields.project_id = this.projects[0].id
          })
          .catch((error) => {
            console.error("Error fetching projects:", error)
          })
          .finally(() => {
            this.loadingProjects = false
          })
      }
    },

    fetchPortfolios() {
      this.loadingPortfolios = true
      getAllPortfolios(this.$axios)
        .then((res) => {
          this.portfolios = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching portfolios:", error)
        })
        .finally(() => {
          this.loadingPortfolios = false
        })
    },

    onPortfolioChange() {
      this.clearProgramDropdown()
      this.clearProjectDropdown()
      this.fetchPrograms()
    },

    onProgramChange() {
      this.clearProjectDropdown()
      this.fetchProjects()
    },

    clearProgramDropdown() {
      this.programId = null
      this.programs = []
    },

    clearProjectDropdown() {
      this.fields.project_id = null
      this.projects = []
    },

    fetchPrograms() {
      this.loadingPrograms = true
      getAllPrograms(this.$axios, this.portfolioId)
        .then((res) => {
          this.programs = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching programs:", error)
        })
        .finally(() => {
          this.loadingPrograms = false
        })
    },

    fetchProjects() {
      if (this.programId) {
        this.loadingProjects = true
        getAllProjects(this.$axios, this.programId)
          .then((res) => {
            this.projects = res.data.data
          })
          .catch((error) => {
            console.error("Error fetching projects:", error)
          })
          .finally(() => {
            this.loadingProjects = false
          })
      }
    },

    fetchDisiplines() {
      this.loadingDisiplines = true
      getContractDisciplines(this.$axios)
        .then((res) => {
          this.contract_disiplines = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching contract_disiplines:", error)
        })
        .finally(() => {
          this.loadingDisiplines = false
        })
    },

    fetchContractStatus() {
      this.loadingContractStatus = true
      getContractStatus(this.$axios)
        .then((res) => {
          this.contract_status = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching contract_status:", error)
        })
        .finally(() => {
          this.loadingContractStatus = false
        })
    },

    fetchContractTypes() {
      this.loadingContractTypes = true
      getContractTypes(this.$axios)
        .then((res) => {
          this.contract_types = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching contract_types:", error)
        })
        .finally(() => {
          this.loadingContractTypes = false
        })
    },

    clearError(field) {
      this.CLEAR_FIELD_ERROR(field)
    }
  },

  mounted() {
    this.fetchPortfolios()
    this.fetchCompanies()
    this.fetchProject()
    this.fetchDisiplines()
    this.fetchContractStatus()
    this.fetchContractTypes()
    if (this.editForm) {
      this.fetchContract()
    }
  }
}
</script>
