<template>
  <CustomTableWrapper>
    <title-banner :title="$t('page.units')">
      <template #right>
        <v-btn class="" color="" small @click="CreateDrawer">
          <v-icon>mdi-plus</v-icon>
          {{ $t("table.create") }}
        </v-btn>
      </template>
    </title-banner>

    <!-- Tree Container -->

    <custom-treeview
      :items="units"
      display-key="title"
      :expand-all="false"
      :allow-drag-and-drop="true"
      :edge-size="3"
      :show-branches="false"
      :drop-config="{ dropEndpoint: '/update-parent-id', itemIdKey: 'unit_id' }"
      @node-selected="onNodeSelected"
      @nodes-dropped="nodeDropped"
      @before-drop="onBeforeDrop"
      @node-clicked="onNodeClicked"
      @node-double-clicked="onNodeDoubleClicked"
      @node-context-menu="onNodeContextMenu"
      @node-toggled="onNodeToggled"
    >
      <!-- Actions slot - shown only when a node is selected -->
      <template #actions="{ item }">
        <v-btn icon x-small class="edit-button" @click.stop="handleEdit(item)">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon x-small class="edit-button" @click.stop="handleDelete(item)">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
        <v-divider vertical class="mx-4"></v-divider>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon x-small class="edit-button" v-bind="attrs" v-on="on" @click.stop="unitNavigate(item)">
              <v-icon>mdi-network-pos</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Go to positions for this unit") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon x-small class="edit-button" v-bind="attrs" v-on="on" @click.stop="usersNavigate(item)">
              <v-icon>mdi-account-group</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Go to users for this unit") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon x-small class="edit-button" v-bind="attrs" v-on="on" @click.stop="objectivesNavigate(item)">
              <v-icon>mdi-strategy</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Go to Strategic Objectives for this unit") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon x-small class="edit-button" v-bind="attrs" v-on="on" @click.stop="missionsNavigate(item)">
              <v-icon>mdi-arrow-collapse-all</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Go to Missions for this unit") }}</span>
        </v-tooltip>
      </template>
    </custom-treeview>

    <!-- Delete confirmation dialog -->
    <confirm-dialog
      v-model="deleteConfirmationDialog"
      :title="$t('delete')"
      :message="
        $t('page.confirm_delete_message', {
          itemName: this.itemToDelete.title
        })
      "
      :confirm-button-color="'red'"
      @confirm="deleteItem"
    ></confirm-dialog>
  </CustomTableWrapper>
</template>

<script>
import { mapActions, mapState } from "vuex"
import CustomTreeview from "@/components/custom-tree/CustomTreeview.vue"
import { layoutPicker } from "../../../helpers/auth"
import TitleBanner from "../../../components/page-layout/TitleBanner.vue"

export default {
  name: "units",
  components: { CustomTreeview, TitleBanner },
  middleware: ["auth"],
  layout: "dashboard-layout",
  data() {
    return {
      isEdit: false,
      deleteConfirmationDialog: false,
      itemToDelete: {}
    }
  },
  mounted() {
    // Fetch data from API
    this.fetchNodes()
  },
  watch: {
    units: {
      handler(newUnits) {
        // Units data is now handled by CustomTreeview directly
        // No need to manually manage nodes array
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("positions", ["fetchUnits", "removeUnit"]),
    ...mapActions("drawer", ["openDrawer"]),

    async fetchNodes() {
      await this.fetchUnits()
    },

    CreateDrawer() {
      this.openDrawer({
        component: "forms/UnitsForm",
        props: {},
        title: this.isEdit ? this.$t("page.edit") : this.$t("page.create"),
        width: 600
      })
    },

    // Navigation methods
    unitNavigate(item) {
      this.$router.push({
        path: "/positions/manage-positions",
        query: { unit_id: item.id }
      })
    },

    usersNavigate(item) {
      this.$router.push({
        path: "/positions/users-positions",
        query: { unit_id: item.id }
      })
    },

    objectivesNavigate(item) {
      this.$router.push({
        path: "/bsc-strategic-objectives",
        query: { unit_id: item.id }
      })
    },

    missionsNavigate(item) {
      this.$router.push({
        path: "/str-missions",
        query: { unit_id: item.id }
      })
    },

    // Edit and delete handlers
    handleEdit(item) {
      this.isEdit = true
      this.openDrawer({
        component: "forms/UnitsForm",
        props: {
          itemId: item.id,
          editForm: true
        },
        title: this.$t("page.edit"),
        width: 600
      })
    },

    handleDelete(item) {
      this.itemToDelete = item
      this.deleteConfirmationDialog = true
    },

    async deleteItem() {
      await this.removeUnit(this.itemToDelete.id)
      this.deleteConfirmationDialog = false
    },

    // Tree event handlers
    onNodeSelected(originalItems, selectedNode, event) {
      // CustomTreeview now handles selection state internally
      // This is just for any additional logic you might need
    },

    nodeDropped({ draggedItems, targetItem, placement }) {
      // Handle drag and drop
    },

    onBeforeDrop({ draggedItems, targetItem, placement, callback }) {
      // Add any validation logic here
      // Call callback() to cancel the drop if needed

      // Example: Prevent dropping item on itself
      if (draggedItems.some((item) => item.id === targetItem.id)) {
        callback() // Cancel the drop
        return
      }
    },

    onNodeClicked(originalItem, node, event) {
      // Handle node click if needed
    },

    onNodeDoubleClicked(originalItem, node, event) {
      // Handle double click if needed
    },

    onNodeContextMenu(originalItem, node, event) {
      // Handle right-click context menu if needed
    },

    onNodeToggled(originalItem, node, event) {
      // Handle node expand/collapse if needed
    }
  },
  computed: {
    ...mapState("positions", ["units"])
  }
}
</script>

<style scoped>
.edit-button {
  opacity: 1;
  margin-inline: 5px;
}
</style>
