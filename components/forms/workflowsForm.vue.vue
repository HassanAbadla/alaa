<template>
  <form-wrapper :submitText="$t('form.save')" :loading="loading" @submit="handleSubmit">
    <custom-dropdown
      v-model="formData.module_id"
      :items="projects"
      item-text="name"
      item-value="id"
      :label="$t('form.module')"
      :required="true"
      :loading="loadingLookups"
    />
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-TextArea v-model="formData.description" :label="$t('form.notes')" :required="true" />
    <!-- <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn> -->
  </form-wrapper>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"
export default {
  name: "workflowsForm",
  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        module_id: null,
        name: "",
        description: "",
        code: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentWorkflow: "workflows/getCurrentWorkflow",
      loadingWorkflows: "workflows/isLoading"
    }),
    ...mapState("oss", ["projects"])
  },

  methods: {
    ...mapActions({
      addWorkflow: "workflows/addWorkflow",
      updateWorkflow: "workflows/updateWorkflow",
      fetchWorkflowById: "workflows/fetchWorkflowById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapActions("oss", ["getProjects"]), // modules named projects in OSS and OTM
    async handleSubmit() {
      this.loadingWorkflows = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateWorkflow(this.formData)
      } else {
        await this.addWorkflow(this.formData)
      }
      this.loadingWorkflows = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.getProjects()
    if (this.editForm) {
      await this.fetchWorkflowById(this.itemId)
      this.formData.name = this.getCurrentWorkflow.name
      this.formData.description = this.getCurrentWorkflow.description
      this.formData.code = this.getCurrentWorkflow.code
      this.formData.module_id = this.getCurrentWorkflow.module_id
    }
  }
}
</script>

<style scoped></style>
