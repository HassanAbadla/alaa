<template>
  <div>
    <form-wrapper
      v-if="!fetchDepartmentError && !loading"
      :title="title"
      @submit="submitDepartment"
      :loading="isSubmitting"
    >
      <custom-input
        :label="$t('form.name')"
        v-model="fields.name"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
    </form-wrapper>
    <message-display
      v-if="fetchDepartmentError"
      :messageTitle="fetchDepartmentError.title"
      :messageText="fetchDepartmentError.text"
      :code="fetchDepartmentError.code"
    />
  </div>
</template>

<script>
import { createDepartment, getDepartmentById, updateDepartment } from "../../api/departments-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"

export default {
  name: "DepartmentForm",
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
      breadcrumbs: [
        {
          text: "Dashboard",
          disabled: false,
          to: this.localePath("/dashboard")
        },
        {
          text: "Departments",
          disabled: false,
          to: this.localePath("/departments")
        },
        {
          text: this.editForm ? "Edit" : "Create",
          disabled: true
        }
      ],
      fields: {
        name: ""
      },
      errors: {},
      fetchDepartmentError: null,
      loading: false,
      isSubmitting: false
    }
  },
  computed: {
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.department")}`
    }
  },
  methods: {
    submitDepartment() {
      this.isSubmitting = true
      this.errors = {}
      const apiToCall = this.editForm ? updateDepartment : createDepartment
      const departmentId = this.$route.params.id
      apiToCall(this.fields, this.$axios, departmentId)
        .then(() => {
          this.$router.push(this.localePath("/departments"))
        })
        .catch((error) => {
          if (error?.response.data) {
            this.errors = error.response.data.errors || {}
          } else {
            console.error(`Error ${this.editForm ? "editing" : "creating"} department:`, error)
          }
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    fetchDepartment() {
      this.loading = true
      const departmentId = this.$route.params.id
      getDepartmentById(departmentId, this.$axios)
        .then((response) => {
          const data = response.data.data
          this.fields = { name: data.name }
        })
        .catch((error) => {
          this.fetchDepartmentError = generateErrorMessage(error, this.$i18n)
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
    if (this.editForm) {
      this.fetchDepartment()
    }
  }
}
</script>

<style scoped>
/*  */
</style>
