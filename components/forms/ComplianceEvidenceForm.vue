<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-input v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <custom-dropdown
      v-model="formData.audit_evidence_category_id"
      :items="categories"
      :label="$t('table.category')"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingLookups"
    />

    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "ComplianceEvidenceForm",
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
        code: "",
        note: "",
        audit_evidence_category_id: null
      },
      loading: false,
      loadingLookups: false
    }
  },
  methods: {
    ...mapActions("auditSettings", ["getCategories"]),
    ...mapActions("complianceEvidence", ["addComplianceEvidence", "updateComplianceEvidence"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async loadData() {
      await this.getCategories()
      if (this.editForm && this.itemId) {
        this.loading = true
        const item = this.item
        if (item) {
          this.formData = {
            name: item.name,
            code: item.code,
            note: item.note,
            audit_evidence_category_id: item.category.id
          }
        }
        this.loading = false
      }
    },
    async handleSubmit() {
      // Logic to submit the form
      this.loading = true
      if (this.editForm) {
        await this.updateComplianceEvidence({ id: this.itemId, data: this.formData })
      } else {
        await this.addComplianceEvidence(this.formData)
      }
      this.loading = false
      this.closeDrawer()
    }
  },
  computed: {
    ...mapState("auditSettings", ["categories"]),
    ...mapState("complianceEvidence", ["complianceEvidences"]),
    item() {
      return this.complianceEvidences.find((item) => item.id === this.itemId)
    }
  },
  async mounted() {
    // Fetch existing data for editing
    await this.loadData()
  }
}
</script>
