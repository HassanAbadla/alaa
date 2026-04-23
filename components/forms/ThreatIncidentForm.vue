<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="threatIncidents"
    singlularEntityName="Incident"
    pluralEntityName="Incidents"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <custom-input :label="$t('table.name')" v-model="formData.name" :errors="getFieldError('name')" required />
      <custom-input :label="$t('table.code')" v-model="formData.code" :errors="getFieldError('code')" required />
      <custom-dropdown
        :label="$t('table.owner')"
        v-model="formData.owner_id"
        :items="users"
        item-value="id"
        item-text="full_name"
        :loading="loadingUsers"
        :disabled="loadingUsers"
        :errors="getFieldError('owner_id')"
      />
      <custom-date-picker
        v-model="formData.bcm_date"
        :label="$t('table.date')"
        :errors="getFieldError('bcm_date')"
        required
      />
      <quill-editor
        v-model="formData.note"
        class="mb-4"
        :label="$t('table.note')"
        :errors="getFieldError('note')"
        required
      />
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
        name: "",
        code: "",
        note: "",
        bcm_date: "",
        owner_id: null,
        bcm_threat_id: this.$route.params.id
      }
    }
  },
  computed: {
    ...mapGetters({ users: "users/users", loadingUsers: "users/loading" })
  },
  methods: {
    ...mapActions({ fetchPlans: "bcmPlans/fetchPlans", fetchUsers: "users/fetchUsers" })
  },
  async mounted() {
    Promise.all([this.fetchUsers()])
  }
}
</script>
