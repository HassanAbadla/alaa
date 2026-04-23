<template>
  <div class="">
    <div v-if="!isLoading">
      <module-boxes :modules="modules" :selectedModule="selectedModule" @select-module="setSelectedModule" />
    </div>
    <div v-else>
      <div class="d-flex flex-wrap align-center">
        <v-btn v-for="n in 6" :key="`module-skeleton-${n}`" class="mr-1 mb-1" dense small disabled>
          <v-skeleton-loader type="avatar" class="mr-1" width="16" height="16"></v-skeleton-loader>
          <v-skeleton-loader type="text" width="60"></v-skeleton-loader>
        </v-btn>
      </div>
    </div>

    <!-- Your existing dialogs -->
    <custom-dialog v-model="dialog['user-charts']" :title="$t('page.user_master_dashboard')" width="700px">
      <user-master-dashboard />
    </custom-dialog>
    <!-- <custom-dialog v-model="dialog['risks-reports']" :title="$t('page.risks_reports')" width="700px">
      <risk-register-print-dialog />
    </custom-dialog> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import ModuleBoxes from "@/components/moduels/ModuleBoxes.vue"
import CustomDialog from "../CustomDialog.vue"
import UserMasterDashboard from "../sidebar/UserMasterDashboard.vue"
// import RiskRegisterPrintDialog from "@/components/RiskRegisterPrintDialog.vue"

export default {
  components: { ModuleBoxes, CustomDialog, UserMasterDashboard },
  name: "ModulesMenuInline",
  data() {
    return {
      dialog: {
        "user-charts": false,
        "risks-reports": false
      }
    }
  },
  computed: {
    ...mapGetters("modules", ["getModules", "isLoading", "hasError", "getSelectedModule", "getGroupedSubModules"]),
    modules() {
      return this.getModules || []
    },
    selectedModule() {
      return this.getSelectedModule
    },
    groupedSubModules() {
      return this.getGroupedSubModules
    }
  },
  methods: {
    ...mapActions("drawer", ["openDrawer"]),
    ...mapActions("controlReviews", ["deleteReviewAttachment"]),
    ...mapActions("risk", ["deleteRiskAttachment"]),
    ...mapActions("modules", ["setSelectedModule", "clearSelectedModule", "setShowModules"]),

    // Your existing methods from ModulesMenu...
    openSubModule(subModule) {
      // Same logic as your original ModulesMenu
      if (!subModule || !subModule.link) return
      const link = subModule.link

      if (link.startsWith("/")) {
        this.$router.push(subModule.link)
      } else if (link === "AddContractFramework") {
        this.openContractForm()
      } else if (link === "ComplianceDocumentManagement") {
        this.openComplianceAttachmentsDrawer()
      } else if (link === "RiskDocumentsManagement") {
        this.openRiskAttachmentsDrawer()
      } else if (link === "CreateRisk") {
        this.openRiskRegisterForm()
      } else if (link === "OpenOSSTimeLine") {
        this.openTimeLine()
      } else if (link === "OpenUserMasterDashboard") {
        this.openDialog("user-charts")
      } else if (link === "risksReports") {
        this.openDialog("risks-reports")
      }
      // ... rest of your existing openSubModule logic

      this.setShowModules(false) // Hide modules after selection
    },

    openComplianceAttachmentsDrawer() {
      this.openDrawer({
        component: "attachments/ComplianceAttachments",
        props: { deleteConfig: { deleteFunc: this.deleteReviewAttachment, parentKey: "audit_item_review" } },
        title: this.$t("page.document_management_system"),
        width: "100vw"
      })
    },
    openRiskAttachmentsDrawer() {
      this.openDrawer({
        component: "attachments/RiskAttachments",
        props: { deleteConfig: { deleteFunc: this.deleteRiskAttachment, parentKey: "risk" } },
        title: this.$t("page.document_management_system"),
        width: "100vw"
      })
    },
    openContractForm() {
      this.openDrawer({
        component: "forms/ContractPackagesForm",
        props: { deleteConfig: { deleteFunc: this.deleteRiskAttachment, parentKey: "risk" } },
        title: this.$t("page.contracts_and_frameworks"),
        width: "100vw"
      })
    },
    openRiskRegisterForm() {
      this.openDrawer({
        component: "forms/RiskRegisterForm",
        props: {},
        title: `${this.$t("form.create")} ${this.$t("form.risk_register")}`,
        width: 700
      })
    },
    openTimeLine() {
      this.openDrawer({
        component: "tss/OTMGanttChart",
        props: { orders: this.$store.state.tasks.filteredTasks },
        title: this.$t("page.time_line"),
        width: "100vw"
      })
    },

    // ... rest of your existing methods
    openDialog(name) {
      this.dialog[name] = true
    },
    closeDialog(name) {
      this.dialog[name] = false
    }
  }
}
</script>

<style scoped>
.modules-menu-inline {
  width: 100%;
  overflow: hidden;
}
</style>
