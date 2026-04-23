<template>
  <div class="d-flex flex-column" style="height: 100%">
    <!-- Top part of the sidebar -->
    <div>
      <tenant-user-side-bar-display />
      <v-divider></v-divider>
      <sidebar-panel-btn
        :text="$t('page.dashboard')"
        @click="routeTo('/education/dashboard')"
        :permission="'edu_dashboard'"
      />
      <sidebar-panel-btn
        :text="$t('page.systems')"
        @click="routeTo('/education/systems')"
        :permission="'edu_dashboard'"
      />
      <sidebar-panel-btn :text="$t('page.years')" :permission="'edu_dashboard'" @click="routeTo('/education/years')" />
      <sidebar-panel-btn
        :text="$t('page.levels')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/levels')"
      />
      <sidebar-panel-btn
        :text="$t('page.grades')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/grades')"
      />
      <sidebar-panel-btn
        :text="$t('page.classes')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/classes')"
      />
      <sidebar-panel-btn
        :text="$t('page.students')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/students')"
      />
      <sidebar-panel-btn
        :text="$t('page.student_year')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/studentYear')"
      />
      <sidebar-panel-btn
        :text="$t('page.assigned_to_classes')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/AssignedToClasses')"
      />
      <sidebar-panel-btn
        :text="$t('page.assigned_to_student')"
        :permission="'edu_dashboard'"
        @click="routeTo('/education/assignedToStudent')"
      />
      <sidebar-panel-btn
        :text="$t('page.my_class')"
        :permission="'student_stories'"
        @click="routeTo('/education/student/myClass')"
      />
      <sidebar-panel-btn
        :text="$t('page.my_stories')"
        :permission="'student_stories'"
        @click="routeTo('/education/student/myStories')"
      />
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
// import PolicyTree from "@/components/policy/PolicyTree.vue"
import SideBarExpansionPanel from "./sidebar/SideBarExpansionPanel.vue"
import SystemMenu from "./sidebar/SystemMenu.vue"
// import ContractPackagesForm from "./forms/ContractPackagesForm.vue"
import SidebarPanelBtn from "./sidebar/SidebarPanelBtn.vue"
import SidebarExpansionPanelWrapper from "./sidebar/SidebarExpansionPanelWrapper.vue"

export default {
  components: {
    TenantUserSideBarDisplay,
    // PolicyTree,
    SideBarExpansionPanel,
    SystemMenu,
    // ContractPackagesForm,
    SidebarPanelBtn,
    SidebarExpansionPanelWrapper
  },
  name: "EduSideBar",
  middleware: "auth",
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
      return [
        { to: "/users", title: "sidebar.users", permission: "access_oss_system_menu" },
        { to: "/setting/education", title: "page.settings", permission: "access_oss_system_menu" }
      ]
    }
  }
}
</script>

<style scoped></style>
