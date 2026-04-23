<template>
  <v-container class="py-8">
    <custom-input v-model="formData.label" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.type" :label="$t('form.type')" :required="true" />
    <custom-input v-model="formData.step_no" :label="$t('table.step_no')" :required="true" :type="'number'" />
    <custom-dropdown
      v-model="formData.usertypeable_id"
      :items="getUserTypes"
      item-value="id"
      item-text="title"
      :label="$t('table.user_type')"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "StepForm",
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
        label: "",
        description: "",
        type: "",
        step_no: null,
        position: "{ x: 21, y: 91.5 }",
        master_flow_id: this.$route.params.id,
        source_position: "{ x: 21, y: 91.5 }",
        usertypeable_type: "userType",
        usertypeable_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getUserTypes: "flowSteps/getUserTypes",
      getSteps: "flowSteps/getSteps",
      getCurrentStep: "flowSteps/getCurrentStep",
      loadingStep: "flowSteps/isLoading"
    })
  },

  methods: {
    ...mapActions({
      fetchUserTypes: "flowSteps/fetchUserTypes",
      addStep: "flowSteps/addStep",
      updateStep: "flowSteps/updateStep",
      fetchStepById: "flowSteps/fetchStepById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingStep = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateStep(this.formData)
      } else {
        await this.addStep(this.formData)
      }
      this.loadingStep = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchUserTypes()
    if (this.editForm) {
      // await this.fetchStepById(this.itemId)
      const step = this.getSteps.find((step) => step.id === this.itemId)
      this.formData.label = step.label
      this.formData.type = step.type
      this.formData.step_no = step.step_no
      this.formData.usertypeable_id = step.usertypeable_id
    }
  }
}
</script>

<style scoped></style>
