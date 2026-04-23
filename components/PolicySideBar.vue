<template>
  <div class="d-flex flex-column" style="height: 100%">
    <!-- Top part of the sidebar -->
    <div>
      <tenant-user-side-bar-display />
      <v-divider></v-divider>
      <sidebar-panel-btn :text="$t('page.policy')" @click="routeTo('/policy')" :permission="'access_oss_orders'" />
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
import TenantUserSideBarDisplay from "./TenantUserSideBarDisplay.vue"
import AuditTree from "@/components/audit/AuditTree.vue"
import SideBarExpansionPanel from "./sidebar/SideBarExpansionPanel.vue"
import SystemMenu from "./sidebar/SystemMenu.vue"
import ContractPackagesForm from "./forms/ContractPackagesForm.vue"
import SidebarPanelBtn from "./sidebar/SidebarPanelBtn.vue"
import SidebarExpansionPanelWrapper from "./sidebar/SidebarExpansionPanelWrapper.vue"

export default {
  components: {
    TenantUserSideBarDisplay,
    AuditTree,
    SideBarExpansionPanel,
    SystemMenu,
    ContractPackagesForm,
    SidebarPanelBtn,
    SidebarExpansionPanelWrapper
  },
  name: "PolicySideBar",
  data() {
    return {
      systemMenuItems: [{ to: "/users", title: "sidebar.users" }],
      dialogOpen: false
    }
  },
  methods: {
    openDialog() {
      this.dialogOpen = true
    },
    closeDialog() {
      this.dialogOpen = false
    },
    routeTo(path) {
      this.$router.push(this.localePath(path))
    }
  },

  computed: {
    systemMenu() {
      const userType = this.$auth.user.type.code
      console.log(userType)

      if (userType === "b-owner" || userType === "c-owner" || userType.startsWith("eng")) {
        return
      }
      return [
        { to: "/users", title: "sidebar.users", permission: "access_oss_system_menu" },
        { to: "/policy", title: "sidebar.policies", permission: "access_oss_system_menu" }
      ]
    }
  }
}
</script>

<style scoped></style>
