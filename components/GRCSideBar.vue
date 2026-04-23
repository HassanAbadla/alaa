<template>
  <div class="d-flex flex-column primary-sidebar-bg" style="height: 100%">
    <!-- Top part of the sidebar -->
    <div>
      <tenant-user-side-bar-display>
        <!-- <template v-slot:right>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="openDialog('user-charts')" icon class="mx-3" v-bind="attrs" v-on="on">
                <v-icon>mdi-chart-bar-stacked</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("page.user_master_dashboard") }}</span>
          </v-tooltip>
        </template> -->
      </tenant-user-side-bar-display>
      <v-divider></v-divider>
      <sidebar-module-display v-if="selectedModule" :module="selectedModule" fullWidth />

      <sidebar-expansion-panel-wrapper>
        <side-bar-expansion-panel
          v-for="group in moduleGroups"
          :key="group.groupId"
          :title="group.groupName"
          :icon="group?.icon"
        >
          <sidebar-panel-btn
            v-for="subModule in group.subModules"
            :key="subModule.id"
            :text="subModule.name"
            :link="subModule.link"
            :icon="subModule.icon"
            :is-active="isSubModuleActive(subModule)"
            @click="onSubModuleClick(subModule)"
            :permission="subModule.permission.short_name"
          >
            <audit-tree v-if="showAuditTree && subModule.link === 'ActiveContracts'" />
            <sidebar-tree
              v-if="showPMISMyList && subModule.link === 'PMISMyList'"
              :items="constructedTree"
              :permission="subModule.permission.short_name"
            />
          </sidebar-panel-btn>
        </side-bar-expansion-panel>
      </sidebar-expansion-panel-wrapper>
    </div>

    <!-- Spacer to push the system menu to the bottom -->
    <v-spacer></v-spacer>
    <!-- risks report -->
    <custom-dialog v-model="dialog['user-charts']" :title="$t('page.user_master_dashboard')" width="700px">
      <user-master-dashboard />
    </custom-dialog>
    <custom-dialog v-model="dialog['risks-reports']" :title="$t('page.risks_reports')" width="830px">
      <risks-printable-table-dialog
        :title="$t('page.print_risk_register')"
        :report-title="$t('page.risk_register')"
        @close="closeDialog"
      ></risks-printable-table-dialog>
    </custom-dialog>
    <!-- Sensitive assets reports -->
    <custom-dialog v-model="dialog['sensitive-report']" :title="$t('page.sensitive_assets_reports')" width="830px">
      <sensitive-assets-printable-dialog
        :title="$t('page.sensitive_assets_reports')"
        :report-title="$t('page.sensitive_assets_reports')"
        @close="closeDialog('sensitive-report')"
      ></sensitive-assets-printable-dialog>
    </custom-dialog>
    <!-- assets reports -->
    <custom-dialog v-model="dialog['assets-report']" :title="$t('page.assets_reports')" width="830px">
      <AssetsPrintableTableDialog
        :title="$t('page.assets_reports')"
        :report-title="$t('page.assets_reports')"
        @close="closeDialog('assets-report')"
      ></AssetsPrintableTableDialog>
    </custom-dialog>
    <!-- Assets Risks Reports -->
    <custom-dialog v-model="dialog['assets-risks-report']" :title="$t('page.assets_risks_reports')" width="830px">
      <AssetsRisksPrintableDialog
        :title="$t('page.assets_risks_reports')"
        :report-title="$t('page.assets_risks_reports')"
        @close="closeDialog('assets-risks-report')"
      ></AssetsRisksPrintableDialog>
    </custom-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import TenantUserSideBarDisplay from "./TenantUserSideBarDisplay.vue"
import AuditTree from "@/components/audit/AuditTree.vue"
import SideBarExpansionPanel from "./sidebar/SideBarExpansionPanel.vue"
import SystemMenu from "./sidebar/SystemMenu.vue"
import SidebarPanelBtn from "./sidebar/SidebarPanelBtn.vue"
import SidebarExpansionPanelWrapper from "./sidebar/SidebarExpansionPanelWrapper.vue"
import CustomDialog from "./CustomDialog.vue"
import UserMasterDashboard from "./sidebar/UserMasterDashboard.vue"
import VCan from "./VCan.vue"

import SidebarTree from "@/components/sidebar-tree/SidebarTree.vue"

export default {
  components: {
    TenantUserSideBarDisplay,
    AuditTree,
    SideBarExpansionPanel,
    SystemMenu,
    SidebarPanelBtn,
    SidebarExpansionPanelWrapper,
    CustomDialog,
    UserMasterDashboard,
    VCan,
    SidebarTree
  },
  name: "GRCSideBar",
  data() {
    return {
      dialog: {
        contracts: false,
        "user-charts": false,
        "risks-reports": false,
        "sensitive-report": false,
        "assets-report": false,
        "assets-risks-report": false
      },
      showAuditTree: false,
      showPMISMyList: false,
      // Track active states for non-route actions
      activeActions: new Set()
    }
  },
  computed: {
    ...mapGetters("modules", { moduleGroups: "getGroupedSubModules", selectedModule: "getSelectedModule" }),
    ...mapGetters("pmisTree", {
      constructedTree: "getTreeData",
      isTreeLoading: "isLoading",
      hasTreeError: "hasError"
    }),
    isRTL() {
      return this.getTenant?.is_rtl || false
    },
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary
    }
  },
  methods: {
    ...mapActions("modules", ["setShowModules"]),
    ...mapActions("drawer", ["openDrawer"]),
    ...mapActions("risk", ["deleteRiskAttachment"]),
    ...mapActions("controlReviews", ["deleteReviewAttachment"]),
    ...mapActions("pmisTree", ["fetchTreeData"]),

    isSubModuleActive(subModule) {
      if (!subModule || !subModule.link) return false

      const link = subModule.link

      // Only route-based matching for navigation links (links that start with "/")
      if (link.startsWith("/")) {
        return this.$route.path.startsWith(link)
      }

      // No active state for drawer/dialog actions for now
      return false
    },

    setActiveAction(actionKey) {
      this.activeActions.clear() // Clear previous active actions
      this.activeActions.add(actionKey)
    },

    clearActiveActions() {
      this.activeActions.clear()
    },

    async onSubModuleClick(subModule) {
      if (!subModule || !subModule.link) return
      const link = subModule.link

      if (link.startsWith("/")) {
        // If sub-module has a route link, navigate to it
        this.$router.push(subModule.link)
      } else if (link === "ActiveContracts") {
        this.toggleAuditTree()
      } else if (link === "PMISMyList") {
        await this.togglePMISMyList()
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
      } else if (link === "sensitiveAssetsReports") {
        this.openDialog("sensitive-report")
      } else if (link === "assetsReports") {
        this.openDialog("assets-report")
      } else if (link === "assetsRisksReports") {
        this.openDialog("assets-risks-report")
      }

      // this.setShowModules(false)
    },

    toggleAuditTree() {
      this.showAuditTree = !this.showAuditTree
    },

    async togglePMISMyList() {
      this.showPMISMyList = !this.showPMISMyList

      // Only fetch tree data when showing the tree and if we don't have data yet
      if (this.showPMISMyList && (!this.constructedTree || this.constructedTree.length === 0)) {
        try {
          await this.fetchTreeData()
        } catch (error) {
          console.error("Error fetching PMIS tree:", error)
          // You might want to show a toast notification here
        }
      }
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
        title: `${this.$t("form.create")} ${this.$t("page.risk")}`,
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
    openDialog(name) {
      this.dialog[name] = true
    },
    closeDialog(name) {
      this.dialog[name] = false
    },
    routeTo(path) {
      this.$router.push(this.localePath(path))
    }
  },
  // async mounted() {
  //   await this.fetchRisks()
  // },
  watch: {
    // No watchers needed for simplified version
  }
}
</script>
<style lang="scss">
.primary-sidebar-bg {
  background-color: v-bind(primaryColor) !important;
}
</style>
