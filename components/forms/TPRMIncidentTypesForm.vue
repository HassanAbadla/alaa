<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <CustomDatePicker v-model="formData.date" :label="$t('form.date')" :required="true" />
    <CustomCheckbox v-model="formData.active" :label="$t('form.active')" />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMIncidentTypesForm",
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
        name: "",
        note: "",
        code: "",
        date: null,
        active: true
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getIncidentTypes: "tprmIncidentTypes/getIncidentTypes",
      getCurrentIncidentType: "tprmIncidentTypes/getCurrentIncidentType",
      loadingIncidentTypes: "tprmIncidentTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addIncidentType: "tprmIncidentTypes/addIncidentType",
      updateIncidentType: "tprmIncidentTypes/updateIncidentType",
      fetchIncidentTypeById: "tprmIncidentTypes/fetchIncidentTypeById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingIncidentTypes = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateIncidentType(this.formData)
      } else {
        await this.addIncidentType(this.formData)
      }
      this.loadingIncidentTypes = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchIncidentTypeById(this.itemId)
      this.formData.name = this.getCurrentIncidentType.name
      this.formData.note = this.getCurrentIncidentType.note
      this.formData.code = this.getCurrentIncidentType.code
      this.formData.date = this.getCurrentIncidentType.date
      this.formData.active = this.getCurrentIncidentType.active
    }
  }
}
</script>

<style scoped></style>
