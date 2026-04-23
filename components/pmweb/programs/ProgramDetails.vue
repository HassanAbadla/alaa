<template>
  <p-m-web-details-template
    store-module="pmwebPrograms"
    :record-id="programId"
    :initial-fields="defaultFields"
    :required-fields="['ProgramName', 'ProgramNumber']"
    create-success-path="/pm-web/programs/:id"
    delete-redirect-path="/pm-web/programs"
  >
    <template #default="{ fields, isCreateForm, updateField }">
      <section-wrapper :title="$t('page.information')">
        <custom-input v-model="fields.ProgramNumber" :label="$t('table.program_#')" required />
        <custom-input v-model="fields.ProgramName" :label="$t('table.name')" required />

        <custom-input v-model="fields.Description" :label="$t('table.description')" />
        <custom-text-area v-model="fields.Notes" :label="$t('table.notes')" />

        <custom-input v-model="fields.ProgramDirector" :label="$t('table.program_director')" />
        <custom-input v-model="fields.ProgramManager" :label="$t('table.program_manager')" />

        <custom-input v-model="fields.ProgramType" :label="$t('table.program_type')" />
        <custom-input v-model="fields.ProgramStatus" :label="$t('table.program_status')" />
        <custom-input v-model="fields.ProgramEstimatedDuration" :label="$t('table.estimated_duration')" />
        <custom-input v-model="fields.ProgramEstimatedCost" :label="$t('table.estimated_cost')" type="number" />
      </section-wrapper>
      <section-wrapper :title="$t('page.project_defaults')">
        <custom-input v-model="fields.ProjectClientCode" :label="$t('table.client')" />
        <custom-input v-model="fields.ProjectManager" :label="$t('table.manager')" />
        <custom-input v-model="fields.ProjectCurrency" :label="$t('table.currency')" />
        <custom-input v-model="fields.ProjectCountry" :label="$t('table.country')" />
        <custom-input v-model="fields.ProjectType" :label="$t('table.project_type')" />
        <custom-input v-model="fields.ProjectStatus" :label="$t('table.project_status')" />
        <custom-input v-model="fields.ProjectTargetBudget" :label="$t('table.target_budget')" type="number" />
        <custom-input v-model="fields.ProjectTargetRevenue" :label="$t('table.target_revenue')" type="number" />
      </section-wrapper>
    </template>
  </p-m-web-details-template>
</template>
<script>
import PMWebDetailsTemplate from "@/components/pmweb/PMWebDetailsTemplate.vue"
import SectionWrapper from "@/components/page-layout/SectionWrapper.vue"
import RowWrapper from "@/components/page-layout/RowWrapper.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "ProgramDetails",
  components: {
    SectionWrapper,
    RowWrapper,
    PMWebDetailsTemplate
  },
  props: {
    programId: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    defaultFields() {
      return {
        ProgramName: "Sample Program",
        ProgramNumber: "PROG-001",
        ProgramManager: "John Doe",
        Description: "Basic program description",
        Notes: "",
        ProgramDirector: "",
        ProgramType: "",
        ProgramStatus: "",
        ProgramEstimatedDuration: "",
        ProgramEstimatedCost: 0,
        ProjectClientCode: "",
        ProjectManager: "",
        ProjectCurrency: "",
        ProjectCountry: "",
        ProjectType: "",
        ProjectStatus: "",
        ProjectTargetBudget: 0,
        ProjectTargetRevenue: 0
      }
    }
  },

  methods: {},
  async mounted() {}
}
</script>
<style scoped>
.row-wrapper {
  display: flex;
  width: 100%;
  gap: 8px;
  margin-bottom: 8px;
}

.row-wrapper > * {
  flex: 1;
}
</style>
