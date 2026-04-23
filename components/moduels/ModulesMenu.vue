<template>
  <div>
    <v-container fluid class="pa-2 grey lighten-3">
      <div v-if="!isLoading" class="d-flex flex-column">
        <module-boxes :modules="modules" :selectedModule="selectedModule" @select-module="setSelectedModule" />
        <v-expand-transition>
          <!-- <sub-modules-display
            v-if="selectedModule"
            :selectedModule="selectedModule"
            :groupedSubModules="groupedSubModules"
            @open-sub-module="openSubModule"
          /> -->
        </v-expand-transition>
      </div>
      <div v-else>
        <v-row dense class="">
          <v-col v-for="n in 6" :key="`module-skeleton-${n}`" cols="auto">
            <v-card class="pa-2 d-flex align-center" elevation="1">
              <v-skeleton-loader type="avatar" class="mr-2" width="32" height="32"></v-skeleton-loader>
              <v-skeleton-loader type="text" width="80"></v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>
        <!-- <v-row dense>
          <v-col v-for="n in 6" :key="`group-skeleton-${n}`" cols="12" sm="6" md="3" lg="2" xl="2">
            <v-skeleton-loader type="heading" class="mb-2"></v-skeleton-loader>
            <v-skeleton-loader
              v-for="i in 3"
              :key="`sub-skeleton-${n}-${i}`"
              type="list-item"
              class="mb-1"
            ></v-skeleton-loader>
          </v-col>
        </v-row> -->
      </div>
    </v-container>
    <v-divider />
    <custom-dialog v-model="dialog['user-charts']" :title="$t('page.user_master_dashboard')" width="700px">
      <user-master-dashboard />
    </custom-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import ModuleBoxes from "@/components/moduels/ModuleBoxes.vue"
import SubModulesDisplay from "@/components/moduels/SubModulesDisplay.vue"
import CustomDialog from "../CustomDialog.vue"
import UserMasterDashboard from "../sidebar/UserMasterDashboard.vue"

export default {
  components: { ModuleBoxes, SubModulesDisplay, CustomDialog, UserMasterDashboard },
  name: "ModuleMenu",
  data() {
    return {
      dialog: {
        "user-charts": false
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

  async mounted() {},

  methods: {
    ...mapActions("drawer", ["openDrawer"]),
    ...mapActions("controlReviews", ["deleteReviewAttachment"]),
    ...mapActions("risk", ["deleteRiskAttachment"]),
    ...mapActions("modules", ["setSelectedModule", "clearSelectedModule", "setShowModules"]),

    openSubModule(subModule) {
      if (!subModule || !subModule.link) return
      const link = subModule.link

      if (link.startsWith("/")) {
        // If sub-module has a link, navigate to it
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
      }

      this.setShowModules(false)
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
.v-card {
  cursor: pointer;
}

.theme--dark .grey.lighten-3 {
  background-color: #3a3a3a !important;
}
</style>
