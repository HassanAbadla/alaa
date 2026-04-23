<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threatIncidentPlans"
    singlularEntityName="IncidentPlan"
    pluralEntityName="IncidentPlans"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <custom-dropdown
        :label="$t('table.plan')"
        v-model="formData.bcm_plan_id"
        :items="plans"
        item-value="id"
        item-text="name"
        :loading="loadingPlans"
        :disabled="loadingPlans"
        :errors="getFieldError('bcm_plan_id')"
      />
      <custom-dropdown
        :label="$t('table.owner')"
        v-model="formData.user_id"
        :items="users"
        item-value="id"
        item-text="full_name"
        :loading="loadingUsers"
        :disabled="loadingUsers"
        :errors="getFieldError('user_id')"
      />
      <custom-date-picker v-model="formData.date" :label="$t('table.date')" :errors="getFieldError('date')" required />
      <quill-editor v-model="formData.note" :errors="getFieldError('note')" required class="mb-4" />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "../QuillEditor.vue"
import FormTemplate from "./FormTemplate.vue"

export default {
  components: { FormTemplate, QuillEditor },
  name: "ThreatIncidentForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number }
  },
  data() {
    return {
      fields: {
        user_id: null,
        note: "",
        date: "",
        bcm_plan_id: null,
        bcm_incident_id: this.$route.params.incident_id
      }
    }
  },
  computed: {
    ...mapGetters({
      users: "users/users",
      loadingUsers: "users/loading",
      plans: "bcmPlans/getPlans",
      loadingPlans: "bcmPlans/isLoading"
    })
  },
  methods: {
    ...mapActions({ fetchPlans: "bcmPlans/fetchPlans", fetchUsers: "users/fetchUsers" })
  },
  async mounted() {
    Promise.all([this.fetchPlans({ bcm_threat_id: this.$route.params.id }), this.fetchUsers()])
  }
}
</script>
