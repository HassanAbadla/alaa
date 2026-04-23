<template>
  <div class="d-flex flex-column" style="height: 100%">
    <!-- Top part of the sidebar -->
    <div>
      <tenant-user-side-bar-display />
      <v-divider></v-divider>
      <!-- Tss users -->
      <div class="d-flex w-100 align-center justify-center">
        <sidebar-panel-btn
          :text="$t('page.card_view')"
          :permission="'tasks_page'"
          @click="routeTo('/otm/tasks')"
          :icon="'mdi-view-grid'"
        />
        <sidebar-panel-btn
          :text="$t('page.list_view')"
          :permission="'tasks_page'"
          @click="routeTo('/otm/tasks/listView')"
          :icon="'mdi-format-list-bulleted'"
        />
      </div>
      <sidebar-panel-btn :text="$t('page.time_line')" @click="openTimeLine" :permission="'access_oss_timeline'" />
    </div>

    <!-- Spacer to push the system menu to the bottom -->
    <v-spacer></v-spacer>

    <!-- System menu at the bottom -->
    <system-menu :menu-items="systemMenu" :permission="'access_oss_system_menu'" />

    <custom-dialog v-model="dialogOpen" :title="$t('page.contract_and_packages')" width="700px">
      <contract-packages-form v-if="dialogOpen" @submission-success="closeDialog" />
    </custom-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import TenantUserSideBarDisplay from "./TenantUserSideBarDisplay.vue"
import PolicyTree from "@/components/policy/PolicyTree.vue"
import SideBarExpansionPanel from "./sidebar/SideBarExpansionPanel.vue"
import SystemMenu from "./sidebar/SystemMenu.vue"
import ContractPackagesForm from "./forms/ContractPackagesForm.vue"
import SidebarPanelBtn from "./sidebar/SidebarPanelBtn.vue"
import SidebarExpansionPanelWrapper from "./sidebar/SidebarExpansionPanelWrapper.vue"

export default {
  components: {
    TenantUserSideBarDisplay,
    PolicyTree,
    SideBarExpansionPanel,
    SystemMenu,
    ContractPackagesForm,
    SidebarPanelBtn,
    SidebarExpansionPanelWrapper
  },
  name: "OTMSideBar",
  data() {
    return {
      systemMenuItems: [{ to: "/users", title: "sidebar.users" }],
      dialogOpen: false
    }
  },
  methods: {
    ...mapActions("drawer", ["openDrawer"]),
    openDialog() {
      this.dialogOpen = true
    },
    closeDialog() {
      this.dialogOpen = false
    },
    routeTo(path) {
      this.$router.push(this.localePath(path))
    },
    openTimeLine() {
      this.openDrawer({
        component: "tss/OTMGanttChart",
        props: { orders: this.$store.state.tasks.filteredTasks },
        title: this.$t("page.time_line"),
        width: "100vw"
      })
    }
  },

  computed: {
    systemMenu() {
      return [
        { to: "/users", title: "sidebar.users", permission: "access_oss_system_menu" },
        { to: "/positions/manage-positions", title: "sidebar.manage_positions", permission: "access_oss_system_menu" },
        { to: "/positions/users-positions", title: "sidebar.users_positions", permission: "manage_positions" },
        { to: "/setting/units", title: "sidebar.units", permission: "access_units" },
        { to: "/oss/settings", title: "page.settings", permission: "access_oss_settings" }
      ]
    }
  }
}
</script>

<style scoped></style>
