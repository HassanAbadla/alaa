<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="compliance_package_id"
      :items="packages"
      :label="$t('form.packages')"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingLookups"
      @input="fetchComplianceItems"
    />
    <custom-dropdown
      v-model="formData.compliance_items_id"
      :items="complianceItems"
      :label="$t('form.compliance_item')"
      item-text="code"
      item-value="id"
      :required="true"
      :loading="loadingLookups"
    />
    <custom-dropdown
      v-model="formData.compliance_evidence_id"
      :items="complianceEvidencesList"
      :label="$t('form.evidence')"
      item-text="code"
      item-value="id"
      :required="true"
      :loading="loadingLookups"
    />
    <custom-checkbox v-model="formData.isOptional" :label="$t('table.isOptional')" class="mb-4" />

    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { getReviewAttachmentTypes } from "@/api/audit-api"
import QuillEditor from "../QuillEditor.vue"

export default {
  name: "CompMasterEvidenceForm",
  components: { QuillEditor },
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
      packages: [],
      complianceItems: [],
      compliance_package_id: null,
      formData: {
        compliance_items_id: null,
        compliance_evidence_id: null,
        isOptional: false
      },
      loading: false,
      loadingLookups: false
    }
  },
  methods: {
    ...mapActions("auditSettings", ["getCategories"]),
    ...mapActions("auditMasterEvidence", ["fetchEvidences"]),
    ...mapActions("complianceMasterEvidence", ["createEvidence", "updateEvidence"]),
    ...mapActions("complianceEvidence", ["getComplianceEvidences"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      if (this.editForm) {
        await this.updateEvidence({ id: this.itemId, payload: this.formData })
        // await this.$axios.put(`compliance-evidence/${this.itemId}`, {
        //   ...this.formData
        // })
        // await this.$store.dispatch("complianceMasterEvidence/createEvidence")
      } else {
        await this.createEvidence(this.formData)
        // await this.$axios.post(`compliance-evidence`, {
        //   ...this.formData
        // })
        // await this.$store.dispatch("complianceMasterEvidence/createEvidence")
      }
      this.closeDrawer()
    },
    async loadLookup() {
      this.loadingLookups = true
      this.getComplianceEvidences()
      const response = await this.$axios.get("regulators", { params: { domain_ids: this.domain_ids } })
      this.packages = response.data.data.flatMap((regulator) => regulator.packages)
      await this.fetchEvidences()

      if (this.editForm) {
        this.compliance_package_id = this.item.compliance_item.package_id || null
        await this.fetchComplianceItems()
        this.formData.compliance_items_id = this.item.compliance_items_id || null
        this.formData.compliance_evidence_id = this.item.compliance_evidence.id || null
        this.formData.isOptional = this.item.isOptional || false
      }
      this.loadingLookups = false
    },
    async fetchComplianceItems() {
      this.loading = true
      try {
        const response = await this.$axios.get("compliance_items", {
          params: {
            compliance_package_id: this.compliance_package_id
          }
        })
        this.complianceItems = response.data.data
      } catch (error) {
        console.error("Error fetching compliance items:", error)
      } finally {
        this.loading = false
      }
    }
  },
  computed: {
    ...mapState("auditMasterEvidence", ["evidences"]),
    ...mapState("complianceEvidence", ["complianceEvidences"]),
    complianceEvidencesList() {
      // map all compliance evidences to a list
      return this.complianceEvidences.map((item) => ({
        id: item.id,
        code: item.code
      }))
    },

    compEvidences() {
      return this.$store.state.complianceMasterEvidence.evidences
    },
    item() {
      return this.compEvidences.find((item) => item.id === this.itemId)
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>

<style scoped></style>
