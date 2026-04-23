<template>
  <div class="d-flex flex-column" style="height: 100%">
    <!-- Top part of the sidebar -->
    <div>
      <tenant-user-side-bar-display />
      <v-divider></v-divider>
      <!-- Tss users -->
      <!-- <div class="d-flex w-100 align-center justify-center">
        <sidebar-panel-btn
          :text="$t('page.card_view')"
          :permission="'tasks_page'"
          @click="routeTo('/tss/tasks')"
          :icon="'mdi-view-grid'"
        />
        <sidebar-panel-btn
          :text="$t('page.list_view')"
          :permission="'tasks_page'"
          @click="routeTo('/tss/tasks/listView')"
          :icon="'mdi-format-list-bulleted'"
        />
      </div> -->
      <sidebar-panel-btn :text="$t('page.orders')" @click="routeTo('/oss/orders')" :permission="'access_oss_orders'" />
      <sidebar-panel-btn
        :text="$t('page.time_line')"
        @click="routeTo('/oss/orders/TimeLine')"
        :permission="'access_oss_timeline'"
      />
      <sidebar-panel-btn :text="$t('page.policy')" :permission="'policy_page'" @click="routeTo('/policy')" />
      <sidebar-panel-btn :text="$t('page.assets')" :permission="'policy_page'" @click="routeTo('/assets')" />

      <!-- Policy -->
      <!-- <sidebar-expansion-panel-wrapper>
        <side-bar-expansion-panel :title="$t('page.policies')" :permission="'policy_page'">
          <v-can :permission="'access_compliance_audit_contracts'">
          </v-can> 
          <sidebar-panel-btn :text="$t('page.policy')" :permission="'policy_page'" @click="routeTo('/policy')" />

          <PolicyTree /> 
        </side-bar-expansion-panel>
      </sidebar-expansion-panel-wrapper> -->
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
  name: "OSSSideBar",
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
      const userType = this.$auth.user.type?.code ?? null
      console.log(userType)

      if (userType === "b-owner" || userType === "c-owner" || userType === "eng") {
        return
      }
      return [
        { to: "/users", title: "sidebar.users", permission: "access_oss_system_menu" },
        { to: "/setting/assets", title: "sidebar.assets_settings", permission: "access_oss_system_menu" },
        { to: "/policy", title: "sidebar.policies", permission: "access_oss_system_menu" },
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
