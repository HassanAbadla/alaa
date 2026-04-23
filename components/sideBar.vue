<template>
  <div class="d-flex flex-column" style="height: 100%">
    <!-- Top part of the sidebar -->
    <div>
      <tenant-user-side-bar-display />
      <v-divider></v-divider>
      <sidebar-expansion-panel-wrapper>
        <side-bar-expansion-panel :title="$t('page.dashboard')" :permission="'access_pmis_dashboards'">
          <sidebar-panel-btn
            :text="$t('sidebar.manage_portfolios')"
            @click="routeTo('/dashboard')"
            :permission="'access_pmis_main_dashboard'"
          />
          <sidebar-panel-btn
            :text="$t('sidebar.see_all_stages')"
            @click="routeTo('/stages')"
            :permission="'access_pmis_all_stages'"
          />
        </side-bar-expansion-panel>
        <side-bar-expansion-panel :title="$t('sidebar.pm-web')" :permission="'access_pmweb'">
          <sidebar-panel-btn
            v-for="item in pmwebMenuItems"
            :key="item.title"
            :text="$t(item.title)"
            @click="routeTo(`/pm-web${item.to}`)"
            :permission="item.permission"
          />
        </side-bar-expansion-panel>
        <side-bar-expansion-panel :title="$t('sidebar.my_list')" :permission="'access_pmis_my_list'">
          <sidebar-tree :items="constructedTree" :permission="'access_pmis_my_list_tree'" />
        </side-bar-expansion-panel>
      </sidebar-expansion-panel-wrapper>

      <v-divider></v-divider>

      <!-- <v-divider class="mt-4"></v-divider> -->
    </div>

    <!-- Spacer to push the system menu to the bottom -->
    <v-spacer></v-spacer>

    <!-- System menu at the bottom -->
    <system-menu :menu-items="systemMenuItems" :permission="'access_pmis_system_menu'" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { constructTreeView } from "@/helpers/tree-helper"
import SidebarTree from "@/components/sidebar-tree/SidebarTree.vue"
import SystemMenu from "./sidebar/SystemMenu.vue"
import SidebarExpansionPanelWrapper from "./sidebar/SidebarExpansionPanelWrapper.vue"
import SideBarExpansionPanel from "./sidebar/SideBarExpansionPanel.vue"
import SidebarPanelBtn from "./sidebar/SidebarPanelBtn.vue"

export default {
  components: { SidebarTree, SystemMenu, SidebarExpansionPanelWrapper, SideBarExpansionPanel, SidebarPanelBtn },
  name: "SideBar",
  data: () => ({
    activeNode: null,
    localPortfolios: [],
    tree: [],
    constructedTree: [],
    systemMenuItems: [
      { to: "/users", title: "sidebar.users", permission: "access_users" },
      { to: "/companies", title: "sidebar.companies", permission: "access_companies" },
      { to: "/departments", title: "sidebar.departments", permission: "access_departments" }
    ],
    pmwebMenuItems: [
      { to: "/programs", title: "page.programs", permission: "access_pmweb_programs" },
      { to: "/projects", title: "page.projects", permission: "access_pmweb_projects" },
      { to: "/commitments", title: "page.commitments", permission: "access_pmweb_commitments" },
      { to: "/initiative-budgets", title: "page.initiative_budgets", permission: "access_pmweb_initiative_budgets" },
      { to: "/budget-requests", title: "page.budget_requests", permission: "access_pmweb_budget_requests" },
      { to: "/companies", title: "page.companies", permission: "access_pmweb_companies" },
      { to: "/correspondences", title: "page.correspondences", permission: "access_pmweb_correspondences" },
      { to: "/daily-reports", title: "page.daily_reports", permission: "access_pmweb_daily_reports" },
      { to: "/meeting-minutes", title: "page.meeting_minutes", permission: "access_pmweb_meeting_minutes" },
      { to: "/planning-items", title: "page.planning_items", permission: "access_pmweb_planning_items" },
      { to: "/safety-forms", title: "page.safety_forms", permission: "access_pmweb_safety_forms" },
      { to: "/submittal-items", title: "page.submittal_items", permission: "access_pmweb_submittal_items" },
      //
      { to: "/drawing-lists", title: "page.drawing_lists", permission: "access_pmweb_drawing_lists" },
      { to: "/drawing-sets", title: "page.drawing_sets", permission: "access_pmweb_drawing_sets" },
      { to: "/rfi", title: "page.rfi", permission: "access_pmweb_rfis" },
      { to: "/online-submittals", title: "page.online_submittals", permission: "access_pmweb_online_submittals" },
      { to: "/submittal-sets", title: "page.submittal_sets", permission: "access_pmweb_submittal_sets" },
      { to: "/punch-lists", title: "page.punch_lists", permission: "access_pmweb_punch_lists" },
      { to: "/transmittals", title: "page.transmittals", permission: "access_pmweb_transmittals" },
      { to: "/action-items", title: "page.action_items", permission: "access_pmweb_action_items" },
      { to: "/commitments-co", title: "page.commitments_co", permission: "access_pmweb_commitments_co" },
      { to: "/progress-invoices", title: "page.progress_invoices", permission: "access_pmweb_progress_invoices" },
      { to: "/ap-payments", title: "page.ap_payments", permission: "access_pmweb_ap_payments" }
    ]
  }),
  computed: {
    ...mapGetters("portfolios", ["getPortfolios", "getLoading"]),
    renamedPortfolios() {
      return this.renameProperties(this.localPortfolios)
    }
  },
  methods: {
    ...mapActions("portfolios", ["fetchPortfolios"]),
    fetchTree() {
      this.$axios
        .get("/tree_menu")
        .then((res) => {
          this.tree = res.data.data
        })
        .catch((error) => {
          console.log(error.response)
        })
        .finally()
    },
    setActiveNode(nodeName) {
      this.activeNode = nodeName
    },
    getLink(item) {
      if (item.link == "contract") return "/" + "contracts" + "/" + item.id
      return "/" + this.addSToEnd(item.link) + "/" + item.id
    },
    addSToEnd(inputString) {
      if (typeof inputString === "string") {
        return inputString + "s"
      } else {
        return "Input is not a valid string."
      }
    },
    renameProperties(obj) {
      if (obj instanceof Array) {
        return obj.map((item) => this.renameProperties(item))
      } else if (obj instanceof Object) {
        let newObj = {}
        for (let prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (prop === "description" && obj.title) {
              newObj.name = obj.title
            } else if (prop === "description") {
              newObj.name = obj.description
            } else if (prop === "programs") {
              newObj.children = this.renameProperties(obj.programs)
            } else if (prop === "projects" || prop === "contracts") {
              newObj.children = this.renameProperties(obj[prop])
            } else {
              newObj[prop] = this.renameProperties(obj[prop])
            }
          }
        }
        return newObj
      }
      return obj
    },
    routeTo(path) {
      this.$router.push(this.localePath(path))
    }
  },
  watch: {
    getPortfolios(newPortfolios) {
      this.localPortfolios = JSON.parse(JSON.stringify(newPortfolios))
    },
    tree(newVal) {
      this.constructedTree = constructTreeView(newVal)
    }
  },
  mounted() {
    this.fetchTree()
    this.fetchPortfolios().then(() => {
      this.localPortfolios = JSON.parse(JSON.stringify(this.getPortfolios))
    })
  }
}
</script>

<style scoped>
.active-node {
  background-color: #cbaee4; /* Change the background color as needed */
}
.v-application a {
  color: inherit;
}
.v-treeview-node__root {
  min-height: 20px;
}
.v-treeview-node__content {
  min-height: 20px;
}
.treeview {
  width: 300px;
}
.v-treeview-node__label {
  font-size: 13px;
}
</style>
