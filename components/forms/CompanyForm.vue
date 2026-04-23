<template>
  <div>
    <form-wrapper v-if="!fetchCompanyError && !loading" :title="title" @submit="submitCompany" :loading="isSubmitting">
      <custom-input
        :label="$t('form.name')"
        v-model="fields.name"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-dropdown
        :items="companyTypes"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.company_type')"
        v-model="fields.company_type_id"
        :errors="errors.company_type_id"
        @clear-errors="clearError('company_type_id')"
        :loading="loadingCompanyTypes"
      />
      <custom-dropdown
        :items="companyGrades"
        item-value="id"
        item-text="name"
        :required="true"
        :label="$t('form.company_grade')"
        v-model="fields.company_grade_id"
        :errors="errors.company_grade_id"
        @clear-errors="clearError('company_grade_id')"
        :loading="loadingCompanyGrades"
      />
    </form-wrapper>
    <message-display
      v-if="fetchCompanyError"
      :messageTitle="fetchCompanyError.title"
      :messageText="fetchCompanyError.text"
      :code="fetchCompanyError.code"
    />
  </div>
</template>

<script>
import {
  getCompanyTypes,
  getCompanyGrades,
  createCompany,
  getCompanyById,
  updateCompany
} from "../../api/companies-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  name: "CompnayForm",
  components: { MessageDisplay },
  props: {
    editForm: {
      type: Boolean,
      default: false
    }
  },
  layout: "dashboard-layout",
  data() {
    return {
      fields: {
        name: "",
        company_type_id: "",
        company_grade_id: ""
      },
      companyTypes: [],
      companyGrades: [],
      errors: {},
      fetchCompanyError: null,
      loading: false,
      isSubmitting: false,
      loadingCompanyTypes: false,
      loadingCompanyGrades: false
    }
  },
  computed: {
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.company")}`
    }
  },
  methods: {
    fetchCompanyTypes() {
      this.loadingCompanyTypes = true
      getCompanyTypes(this.$axios)
        .then((response) => {
          this.companyTypes = response.data.data
        })
        .catch((error) => {
          console.error("Error fetching company types:", error)
        })
        .finally(() => {
          this.loadingCompanyTypes = false
        })
    },
    fetchCompanyGrades() {
      this.loadingCompanyGrades = true
      getCompanyGrades(this.$axios)
        .then((response) => {
          this.companyGrades = response.data.data
        })
        .catch((error) => {
          console.error("Error fetching company grades:", error)
        })
        .finally(() => {
          this.loadingCompanyGrades = false
        })
    },
    submitCompany() {
      this.isSubmitting = true
      this.errors = {}
      const apiToCall = this.editForm ? updateCompany : createCompany
      const companyId = this.$route.params.id
      // NEXT updateCompany bug

      apiToCall(this.fields, this.$axios, companyId)
        .then(() => {
          this.$router.push(this.localePath("/companies"))
        })
        .catch((error) => {
          if (error?.response.data) {
            this.errors = error.response.data.errors || {}
          } else {
            console.error(`Error ${this.editForm ? "editing" : "creating"} company:`, error)
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    fetchCompany() {
      this.loading = true
      const companyId = this.$route.params.id
      getCompanyById(companyId, this.$axios)
        .then((response) => {
          const data = response.data.data
          this.fields = {
            name: data.name,
            company_type_id: data.type?.id,
            company_grade_id: data.grade?.id
          }
        })
        .catch((error) => {
          this.fetchCompanyError = generateErrorMessage(error, this.$i18n)
        })
        .finally(() => {
          this.loading = false
        })
    },
    clearError(field) {
      this.errors[field] = []
    }
  },
  mounted() {
    this.fetchCompanyTypes()
    this.fetchCompanyGrades()
    if (this.editForm) {
      this.fetchCompany()
    }
  }
}
</script>

<style scoped>
/*  */
</style>
