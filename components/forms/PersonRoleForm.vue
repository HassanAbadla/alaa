<template>
  <form-template
    :editForm="editForm"
    :itemId="itemId"
    :fields="fields"
    store="bcmPersonRoles"
    singlularEntityName="Role"
    pluralEntityName="Roles"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <custom-input :label="$t('table.name')" v-model="formData.name" :errors="getFieldError('name')" required />
      <custom-input :label="$t('table.code')" v-model="formData.code" :errors="getFieldError('code')" required />
      <custom-input :label="$t('table.role')" v-model="formData.role" :errors="getFieldError('role')" required />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "../QuillEditor.vue"
import FormTemplate from "./FormTemplate.vue"

export default {
  components: { FormTemplate, QuillEditor },
  name: "PersonRoleForm",
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
        role: ""
      }
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({})
  },
  async mounted() {
    Promise.all([])
  }
}
</script>
