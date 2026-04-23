<template>
  <v-container>
    <v-card-text class="pt-8">
      <custom-table
        :title="$t('table.compliance_percentage')"
        :headers="headers"
        :tableConfig="tableConfig"
        :propItems="performances"
        :propLoading="loading"
        hideView
        hideCreate
        :filters.sync="filters"
        @clear-filters="fetchLookupData"
        :sortOnLoad="false"
        hideHeaders
      >
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <tr>
              <th v-for="(header, i) in headers" :key="i">
                <v-tooltip v-if="header.tooltip" top>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-icon small v-if="header.icon">{{ header.icon }}</v-icon>
                      <span v-if="header.text">
                        {{ header.text }}
                      </span>
                    </div>
                  </template>
                  <span>{{ header.tooltip }}</span>
                </v-tooltip>
                <span v-else>{{ header.text }}</span>
              </th>
            </tr>
          </thead>
        </template>
        <!-- <template v-slot:btns>
          <v-btn small color="primary" class="mx-1" @click="recalculatePerformance" :loading="calculatingPerformance">
            {{ $t("page.recalculate_performance") }}
          </v-btn>
        </template> -->
        <template v-slot:item.compliancePackage="{ item }">
          <div class="d-flex align-center">
            <v-img
              :src="item.compliancePackage.package_image"
              max-width="48"
              :alt="item.compliancePackage.name"
              contain
            ></v-img>
            <div class="ml-2">
              <div class="font-weight-bold">{{ item.compliancePackage.name }}</div>
            </div>
          </div>
        </template>
        <template v-slot:item.compliance_percentage="{ item }">
          <v-progress-linear
            height="25"
            :color="getComplianceColor(item.compliance_percentage)"
            :value="item.compliance_percentage"
            disabled
          >
            <strong>{{ item.compliance_percentage }}%</strong>
          </v-progress-linear>
        </template>
        <template v-slot:item.missing_evidences="{ item }">
          <v-btn icon small @click="openMissingEvidencesDialog(item)">
            <v-icon small>mdi-eye-outline</v-icon>
          </v-btn>
        </template>
      </custom-table>
    </v-card-text>

    <!-- Missing Evidences Dialog -->
    <custom-dialog
      v-model="missingEvidencesDialog"
      :title="$t('table.missing_evidences')"
      width="800px"
      @close-dialog="closeMissingEvidencesDialog"
    >
      <v-row v-if="checkingEvidences" class="my-2">
        <v-col cols="12">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </v-col>
      </v-row>
      <v-card-text>
        <div class="my-4">
          <!-- Loop through each compliance item -->
          <div v-for="(complianceItem, itemIndex) in missingEvidences" :key="`item-${itemIndex}`" class="mb-6">
            <!-- Compliance Item Title -->
            <div class="mb-3">
              <h3 class="primary--text font-weight-medium">
                {{ complianceItem.compliance_item?.title }}
              </h3>
              <div
                v-if="complianceItem.compliance_item?.description"
                v-html="complianceItem.compliance_item.description"
                class="body-2 grey--text mt-1"
              ></div>
            </div>

            <!-- Evidence Expansion Panels -->
            <v-expansion-panels class="mb-4">
              <v-expansion-panel
                v-for="evidence in complianceItem.evidences"
                :key="`evidence-${evidence.complianceEvidence.id}`"
              >
                <v-expansion-panel-header>
                  <div>
                    <div class="d-flex align-center">
                      <span class="font-weight-medium">{{ evidence.complianceEvidence?.name }}</span>
                      <v-spacer></v-spacer>
                      <v-chip small :color="evidence.hasAuditEvidence ? 'success' : 'error'" :text-color="'white'">
                        {{ evidence.hasAuditEvidence ? $t("page.has_evidence") : $t("table.missing_evidence") }}
                      </v-chip>
                    </div>
                    <div
                      v-if="evidence.complianceEvidence?.note"
                      v-html="evidence.complianceEvidence.note"
                      class="m-0 p-0 body-2 grey--text mt-1"
                    ></div>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-if="evidence.hasAuditEvidence">
                    <h4 class="mb-3">{{ $t("page.available_evidences") }}:</h4>
                    <v-card
                      v-for="(auditEvidence, evidenceIndex) in evidence.auditMasterEvidence"
                      :key="`audit-${evidenceIndex}`"
                      class="mb-2"
                      outlined
                    >
                      <v-card-text>
                        <div class="d-flex justify-space-between align-center mb-2">
                          <h4 class="font-weight-medium">{{ auditEvidence.name }}</h4>
                          <file-preview :file="getEvidencePath(auditEvidence)" :size="80" isEvidence />
                        </div>
                        <div
                          v-if="auditEvidence.note"
                          v-html="auditEvidence.note"
                          class="m-0 p-0 body-2 grey--text mb-2"
                        ></div>
                        <!-- Evidence Details Chips -->
                        <div class="d-flex flex-wrap">
                          <v-chip v-if="auditEvidence.version" small class="mr-2 mb-1">
                            {{ $t("table.version") }}: {{ auditEvidence.version }}
                          </v-chip>
                          <v-chip v-if="auditEvidence.issue_date" small label class="mr-2 mb-1">
                            {{ $t("page.issue_date") }}: {{ auditEvidence.issue_date }}
                          </v-chip>
                          <v-chip v-if="auditEvidence.expiry_date" small label class="mr-2 mb-1">
                            {{ $t("page.expiry_date") }}: {{ auditEvidence.expiry_date }}
                          </v-chip>
                          <v-chip v-if="auditEvidence.code" small outlined class="mr-2 mb-1">
                            {{ $t("table.code") }}: {{ auditEvidence.code }}
                          </v-chip>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                  <div v-else>
                    <v-alert type="error" outlined class="mb-0">
                      {{ $t("page.no_master_evidences_found") }}
                    </v-alert>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Summary Section -->
          <!-- <v-divider class="my-4"></v-divider>
          <div class="text-center">
            <v-chip color="info" text-color="white" class="mr-2">
              {{ $t("page.compliance_items_required") }}: {{ missingEvidences?.length || 0 }}
            </v-chip>
            <v-chip color="info" text-color="white" class="mr-2">
              {{ $t("page.required_evidences") }}: {{ totalMissingEvidence + totalWithEvidence || 0 }}
            </v-chip>
            <v-chip color="success" text-color="white" class="mr-2">
              {{ $t("page.with_evidence") }}: {{ totalWithEvidence }}
            </v-chip>
            <v-chip color="error" text-color="white">
              {{ $t("page.missing_evidence") }}: {{ totalMissingEvidence }}
            </v-chip>
          </div> -->
        </div>
      </v-card-text>
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "CompliancePerformaceTableView",
  layout: "dashboard-layout",
  data() {
    return {
      tableConfig: {
        delete: this.deleteEvidence,
        itemPath: "/comp-master-evidence",
        createForm: {
          componentPath: "forms/CompMasterEvidenceForm",
          props: { width: 600 }
        },
        editForm: {
          componentPath: "forms/CompMasterEvidenceForm",
          props: { editForm: true, width: 600 }
        },
        permissions: {
          create: "create_policy",
          edit: "edit_policy",
          delete: "delete_policy"
        }
      },
      headers: [
        { text: "table.package", value: "compliancePackage", tooltip: "table.package" },
        { text: "table.controls_count", value: "compliancePackage.controls_count", tooltip: "table.controls_count" },
        { text: "table.compliance_evidences", value: "package_items_count", tooltip: "table.total_items" },
        { text: "table.complied_items", value: "package_comply_count", tooltip: "table.evidence_required" },
        {
          text: "table.parially_complied_items",
          value: "package_pcomply_count",
          tooltip: "table.parially_complied_items"
        },
        { text: "table.missing_evidences", value: "missing_evidences", tooltip: "table.missing_evidences" },
        { text: "table.comply_percetage", value: "compliance_percentage", tooltip: "table.percetage" }
        // { text: "table.attachments", value: "audit_master_evidence", tooltip: "table.attachments" },
        // { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      filters: {},
      loading: false,
      calculatingPerformance: false,
      missingEvidencesDialog: false,
      missingEvidences: []
    }
  },
  methods: {
    ...mapActions("auditMasterEvidence", [
      "getPerformance",
      "setPerformance",
      "calculatePerformance",
      "fetchMissingEvidences"
    ]),
    getComplianceColor(percentage) {
      if (percentage >= 85) return "green"
      if (percentage >= 65) return "amber"
      if (percentage >= 35) return "orange"
      return "red"
    },
    async recalculatePerformance() {
      this.calculatingPerformance = true
      await this.calculatePerformance()
      this.calculatingPerformance = false
    },
    async openMissingEvidencesDialog(item) {
      let package_id = item.compliancePackage.id
      this.checkingEvidences = true // Add loading state
      try {
        const res = await this.fetchMissingEvidences({ package_id })
        this.missingEvidences = res // Make sure to get the data property
        this.missingEvidencesDialog = true
        console.log("missing evidences:", res)
      } catch (error) {
        console.error("Error fetching missing evidences:", error)
        // Handle error appropriately
      } finally {
        this.checkingEvidences = false
      }
    },
    closeMissingEvidencesDialog() {
      this.missingEvidencesDialog = false
      this.missingEvidences = []
    },
    getEvidencePath(evidence) {
      if (evidence.audit_master_evidence) {
        return evidence.audit_master_evidence
      }
      return evidence
    }
  },
  async mounted() {
    await this.calculatePerformance()
    // await this.getPerformance()
    // this.missingEvidences()
  },
  computed: {
    ...mapState("auditMasterEvidence", ["performances"]),
    totalWithEvidence() {
      if (!this.missingEvidences) return 0
      return this.missingEvidences.reduce((total, item) => {
        return total + item.evidences.filter((evidence) => evidence.hasAuditEvidence).length
      }, 0)
    },

    totalMissingEvidence() {
      if (!this.missingEvidences) return 0
      return this.missingEvidences.reduce((total, item) => {
        return total + item.evidences.filter((evidence) => !evidence.hasAuditEvidence).length
      }, 0)
    }
  }
}
</script>
