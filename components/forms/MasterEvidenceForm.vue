<template>
  <v-container class="py-8">
    <v-file-input
      v-if="!editForm"
      v-model="formData.file"
      :label="$t('form.file')"
      outlined
      dense
      :rules="[(v) => !!v || 'File is required']"
      @change="handleFileChange"
    ></v-file-input>
    <v-card flat v-if="editForm" class="d-flex flex-column align-center justify-center mb-4">
      <file-preview :file="item" :size="180" isEvidence />
    </v-card>
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-dropdown
      v-model="formData.compliance_evidence_id"
      :items="complianceEvidencesList"
      :label="$t('table.compliance_evidence')"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingLookups"
    />
    <custom-dropdown
      v-model="formData.attachment_types_id"
      :items="types"
      :label="$t('form.type')"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingLookups"
    />
    <custom-input v-model="formData.version" :label="$t('table.version')" :required="true" />
    <custom-date-picker v-model="formData.issue_date" required :label="$t('table.issue_date')" class="w-100" />
    <custom-date-picker v-model="formData.expiry_date" required :label="$t('table.expiry_date')" />
    <custom-date-picker v-model="formData.date" required :label="$t('table.date')" :required="true" />
    <custom-checkbox v-model="formData.expired" :label="$t('page.expired')" class="mb-4" />
    <custom-checkbox v-model="formData.isMust" :label="$t('table.isMust')" class="mb-4" />
    <quill-editor v-model="formData.note" class="mb-4" />

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
  name: "MasterEvidenceForm",
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
      types: [],
      formData: {
        name: "",
        note: "",
        issue_date: "",
        expiry_date: "",
        expired: false,
        isMust: false,
        version: "",
        date: "",
        file: null,
        compliance_evidence_id: null,
        attachment_types_id: null
      },
      loading: false,
      loadingLookups: false
    }
  },
  methods: {
    ...mapActions("auditSettings", ["getCategories"]),
    ...mapActions("auditMasterEvidence", ["fetchEvidences", "createEvidence", "updateEvidence"]),
    ...mapActions("complianceEvidence", ["getComplianceEvidences"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      const formData = new FormData()
      formData.append("name", this.formData.name)
      formData.append("code", this.formData.code)
      formData.append("note", this.formData.note)
      formData.append("issue_date", this.formData.issue_date)
      formData.append("expiry_date", this.formData.expiry_date)
      formData.append("expired", this.formData.expired ? 1 : 0)
      formData.append("isMust", this.formData.isMust ? 1 : 0)
      formData.append("version", this.formData.version)
      formData.append("date", this.formData.date)
      formData.append("file", this.formData.file)
      formData.append("compliance_evidence_id", this.formData.compliance_evidence_id)
      formData.append("attachment_types_id", this.formData.attachment_types_id)
      if (this.editForm) {
        // remove the file if it doesn't has a file
        if (!this.formData.file) {
          formData.delete("file")
        }
        await this.updateEvidence({ id: this.itemId, payload: formData })
        await this.fetchEvidences()
        console.error("Invalid itemPath prop:", this.itemPath)
      } else {
        await this.createEvidence(formData)
        await this.fetchEvidences()
        console.error("Invalid itemPath prop:", this.itemPath)
      }
      this.closeDrawer()
    },
    async loadLookup() {
      this.loadingLookups = true
      this.getCategories()
      this.getComplianceEvidences()
      getReviewAttachmentTypes(this.$axios)
        .then((res) => {
          this.types = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching attachment types:", error)
        })
        .finally(() => {
          this.loadingLookups = false
        })
      if (this.editForm) {
        await this.fetchEvidences()
        this.formData.name = this.item.name || ""
        this.formData.code = this.item.code
        this.formData.note = this.item.note
        this.formData.issue_date = this.item.issue_date || ""
        this.formData.expiry_date = this.item.expiry_date || ""
        this.formData.expired = this.item.expired || false
        this.formData.isMust = this.item.isMust || false
        this.formData.version = this.item.version || ""
        this.formData.date = this.item.date || ""
        this.formData.file = this.item.path || null
        this.formData.compliance_evidence_id = this.item.compliance_evidence?.id || null
        this.formData.attachment_types_id = this.item.type.id || null
      }
    },
    handleFileChange(file) {
      this.file = file
    }
  },
  computed: {
    ...mapState("auditMasterEvidence", ["evidences"]),
    ...mapState("complianceEvidence", ["complianceEvidences"]),
    ...mapState("auditSettings", ["categories"]),
    item() {
      return this.evidences.find((item) => item.id === this.itemId)
    },
    complianceEvidencesList() {
      // map all compliance evidences to a list
      return this.complianceEvidences.map((item) => ({
        id: item.id,
        name: item.name
      }))
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>

<style scoped></style>
