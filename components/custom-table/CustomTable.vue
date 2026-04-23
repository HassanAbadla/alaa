<template>
  <div class="custom-table-wrapper">
    <v-card flat :class="`pa-0 ${bgColor}`">
      <back-btn v-if="showBackBtn" :tooltipText="backBtnTooltip" :path="backBtnPath" />
      <div>
        <div :class="`sticky-top-slot ${bgColor}`" ref="stickyHeader">
          <div class="d-flex flex-column">
            <!-- Title section -->
            <div
              :class="[
                'd-flex align-center justify-space-between',
                styledTitle ? 'primary white--text rounded-lg pa-3 mb-3' : 'pa-2 mb-2'
              ]"
            >
              <div>
                <div :class="styledTitle ? 'title white--text' : 'title'">{{ title }}</div>
                <p v-if="description" :class="styledTitle ? 'white--text mb-0' : ''">{{ description }}</p>
              </div>

              <div class="ml-4 d-flex align-center">
                <slot name="title-end"></slot>

                <!-- View Mode Toggle -->
                <v-btn-toggle v-if="showTree" v-model="viewMode" mandatory class="ml-2">
                  <v-btn value="table" small>
                    <v-icon small>mdi-table</v-icon>
                    {{ $t("page.table_view") }}
                  </v-btn>
                  <v-btn value="tree" small>
                    <v-icon small>mdi-file-tree</v-icon>
                    {{ $t("page.tree_view") }}
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>

            <!-- Buttons and search section - centered when styled -->
            <div
              :class="[
                'd-flex align-center mb-2',
                centerButtonsLayout ? 'btns-container-grid' : 'btns-container-default'
              ]"
            >
              <!-- LEFT: Toggle -->
              <div class="btns-left">
                <slot name="btns"></slot>
              </div>

              <!-- CENTER: Other buttons -->
              <div class="btns-center d-flex align-center">
                <v-can :permission="tableConfig.permissions?.export">
                  <v-btn v-if="showExport" small class="mx-1" color="primary" @click="handleExport">
                    <v-icon left small>mdi-download</v-icon>
                    {{ $t("page.export") }}
                  </v-btn>
                </v-can>

                <v-btn v-if="showImport" small color="primary" class="mx-1" @click="showImportDialog = true">
                  <v-icon left>mdi-file-import</v-icon>
                  {{ $t("page.import") }}
                </v-btn>
                <v-can disable-only :permission="tableConfig.permissions?.delete">
                  <template #default="{ disabled }">
                    <v-btn
                      v-if="!hideDelete"
                      color="error"
                      outlined
                      small
                      class="mx-1"
                      @click="openDeleteModal(selected)"
                      :disabled="!selected.length || disabled"
                    >
                      <v-icon left small>mdi-delete</v-icon>
                      {{ $t("table.delete_selected") }}
                    </v-btn>
                  </template>
                </v-can>
                <v-can :permission="tableConfig.permissions?.create">
                  <v-btn
                    v-if="!hideCreate && !isOrders"
                    class="mx-1"
                    color="primary"
                    small
                    @click="useCreateDrawer ? openDrawerForm() : routeTo(`${tableConfig.itemPath}/create`)"
                  >
                    <v-icon left small>mdi-plus</v-icon>
                    {{ $t("table.create") }}
                  </v-btn>
                </v-can>
                <v-btn v-if="isOrders" class="mx-1" color="primary" small @click="$emit('openDialog')">
                  <v-icon left small>mdi-plus</v-icon>
                  {{ $t("table.create") }}
                </v-btn>
                <v-btn v-if="showCalendar" small @click="openCalendarDrawer" color="primary" class="mx-1">
                  <v-icon small left>mdi-calendar</v-icon>
                  {{ $t("page.calendar") }}
                </v-btn>
                <filter-btn v-if="showFilter" :filterApplied="hasActiveFilters" @click="showDialog('filter')" />
                <v-can :permission="tableConfig?.permissions?.documentManagement">
                  <v-btn
                    v-if="tableConfig?.attachments"
                    small
                    class="mx-1"
                    color="primary"
                    @click="openAttachmentDrawer"
                    :disabled="disabled"
                  >
                    <v-icon left small>mdi-paperclip</v-icon>
                    {{ $t("page.attachments") }}
                  </v-btn>
                </v-can>
                <column-visibility-control
                  v-if="showColumnControl"
                  :headers="headers"
                  @update:columns="updateVisibleColumns"
                />

                <!-- Search field on the right of buttons -->
                <v-text-field
                  v-if="!hideSearch"
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="$t('table.search')"
                  single-line
                  hide-details
                  dense
                  outlined
                  rounded
                  flat
                  color="primary darken-1"
                  class="mx-1 compact-search"
                  style="width: 140px"
                ></v-text-field>
              </div>
              <div class="btns-right"></div>
            </div>

            <slot name="progress-bars"></slot>
          </div>
        </div>
      </div>
      <!-- Table View -->
      <!-- @TODO change height to dynamic one -->
      <v-data-table
        :height="CalculateTableHeight()"
        fixed-header
        v-if="!showTree || viewMode === 'table'"
        v-model="selected"
        :headers="allHeaders"
        :items="computedItems"
        :search="search"
        :custom-filter="customSearch"
        :sort-by="defaultSortKey"
        :loading="computedLoading"
        :loading-text="$t('table.loading')"
        :show-select="!hideDelete"
        :item-key="idKey"
        :hide-default-header="hideHeaders"
        :hide-default-footer="hideFooter"
        :items-per-page="hideFooter ? -1 : computedPerPage"
        :footer-props="{
          'items-per-page-options': [20, 30, 40, 50]
        }"
        :header-props="{
          class: 'grey lighten-4'
        }"
        :disable-pagination="disablePagination"
        dense
        :class="isRTL ? 'custom-rtl-table' : ''"
      >
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="slotData">
          <slot :name="slotName" v-bind="slotData"></slot>
        </template>
        <template v-slot:item.status="{ item }">
          <slot name="status_slot" :item="item"></slot>
        </template>
        <template v-slot:item.created_at="{ item }">
          <formated-date-time :date="item?.created_at" />
        </template>
        <template v-slot:item.updated_at="{ item }">
          <formated-date-time :date="item?.updated_at" />
        </template>

        <template v-slot:item.contracts="{ item }">
          <v-chip small>{{ item.contractCount }}</v-chip>
          <v-btn v-if="!hideEdit" icon small :to="localePath(`${tableConfig.itemPath}/${itemId(item)}/contracts`)">
            <v-icon small>mdi-file-sign</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.access="{ item }">
          <manage-access :tableConfig="tableConfig" :accessibleId="item.id" :usersWithAccess="item.master_access" />
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex flex-row justify-center">
            <v-can disable-only :permission="tableConfig.permissions?.view">
              <template #default="{ disabled }">
                <v-btn
                  v-if="!hideView"
                  :disabled="disabled || !tableConfig.itemPath"
                  icon
                  small
                  @click="routeTo(`${tableConfig.itemPath}/${itemId(item)}`)"
                >
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-can>
            <v-can disable-only :permission="tableConfig.permissions?.edit">
              <template #default="{ disabled }">
                <v-btn
                  v-if="!hideEdit"
                  icon
                  small
                  :disabled="disabled"
                  @click="
                    useEditDrawer ? openDrawerForm(true, item) : routeTo(`${tableConfig.itemPath}/${itemId(item)}/edit`)
                  "
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-can>
            <v-can disable-only :permission="tableConfig.permissions?.delete">
              <template #default="{ disabled }">
                <v-btn v-if="!hideDelete" icon small @click.stop="openDeleteModal([item])" :disabled="disabled">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-can>

            <v-can disable-only :permission="tableConfig.permissions?.manageStage">
              <template #default="{ disabled }">
                <v-btn v-if="showStageEdit" :disabled="disabled" icon small @click="openStageForm(item)">
                  <v-icon small>mdi-circle-edit-outline</v-icon>
                </v-btn>
              </template>
            </v-can>
          </div>
        </template>
        <template v-slot:no-data>
          <v-btn v-if="!hideRefresh" color="primary" small @click="initialize">{{ $t("table.refresh") }}</v-btn>
        </template>
        <template v-slot:item.CANS="{ item }">
          <v-btn v-if="tableConfig?.CANS" text small @click="openCANSDrawer(item)">
            <v-icon small>{{ item.posts_count > 0 ? "mdi-forum" : "mdi-forum-outline" }}</v-icon>
            <clickable-chip :value="item.posts_count" class="mx-1" />
          </v-btn>
        </template>
      </v-data-table>

      <!-- Tree View -->
      <div v-if="showTree && viewMode === 'tree'" class="tree-view-container">
        <div :class="`sticky-top-slot ${bgColor}`">
          <div class="d-flex flex-column">
            <!-- Title section -->
            <div
              :class="[
                'd-flex align-center justify-space-between',
                styledTitle ? 'primary white--text rounded-lg pa-3 mb-3' : 'pa-2 mb-2'
              ]"
            >
              <div>
                <div :class="styledTitle ? 'title white--text' : 'title'">{{ title }}</div>
                <p v-if="description" :class="styledTitle ? 'white--text mb-0' : ''">{{ description }}</p>
              </div>

              <div class="ml-4 d-flex align-center">
                <slot name="title-end"></slot>

                <!-- View Mode Toggle -->
                <v-btn-toggle v-model="viewMode" mandatory class="ml-2">
                  <v-btn value="table" small>
                    <v-icon small>mdi-table</v-icon>
                    {{ $t("page.table_view") }}
                  </v-btn>
                  <v-btn value="tree" small>
                    <v-icon small>mdi-file-tree</v-icon>
                    {{ $t("page.tree_view") }}
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Tree View -->
        <v-card :class="`tree-container ${bgColor}`" flat>
          <!-- Updated CustomTreeview with drag and drop props -->
          <custom-treeview
            :items="treeConfig.items"
            :display-key="treeConfig.displayKey"
            :expand-all="treeConfig.expandAll"
            :allow-drag-and-drop="allowDragAndDrop"
            :allow-multiselect="allowMultiselect"
            :edge-size="edgeSize"
            :show-branches="showBranches"
            :allow-only-inside-drop="allowOnlyInsideDrop"
            :drop-config="dropConfig"
            @node-selected="onTreeNodeSelected"
            @nodes-dropped="onTreeNodeDropped"
            @before-drop="onTreeBeforeDrop"
            @node-clicked="onTreeNodeClicked"
            @node-double-clicked="onTreeNodeDoubleClicked"
            @node-context-menu="onTreeNodeContextMenu"
            @node-toggled="onTreeNodeToggled"
          >
            <template v-slot:actions="{ item }">
              <tree-c-r-u-d
                :item="item"
                :permissions="tableConfig.permissions"
                :form-config="treeFormConfig"
                @create="handleTreeCreate"
                @edit="handleTreeEdit"
                @delete="handleTreeDelete"
                @item-deleted="handleTreeItemDeleted"
              />
            </template>
          </custom-treeview>
        </v-card>
      </div>

      <custom-dialog v-model="stage.isFormOpen" :title="stage?.selectedStage?.title">
        <stage-form :stage="stage?.selectedStage" @saved="handleStageSaved" />
      </custom-dialog>
      <custom-dialog v-model="showDeleteModal" :title="$t('table.delete')">
        <delete-items-modal
          :id-key="idKey"
          :items="itemsToDelete"
          :config="tableConfig"
          @items-deleted="handleItemsDeleted"
        />
      </custom-dialog>
      <custom-dialog v-model="dialog.filter" :title="$t('page.filter')">
        <div class="py-4">
          <slot name="level-filters"></slot>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <clear-filter-btn v-if="hasActiveFilters" @clear="resetFilters" />
        </v-card-actions>
      </custom-dialog>
      <custom-dialog v-model="showImportDialog" :title="$t('page.import')" width="580px">
        <v-card flat class="d-flex align-center justify-between my-4 border rounded pa-4">
          <p>{{ $t("page.import_assets") }}</p>
          <v-btn text color="info" @click="downloadTemplate">
            <v-icon left>mdi-file-download</v-icon>
            {{ $t("form.download_template") }}
          </v-btn>
        </v-card>
        <asset-import @close="showImportDialog = false" @refresh="resetFilters" :headers="allHeaders" />
      </custom-dialog>
    </v-card>
  </div>
</template>

<script>
import * as XLSX from "xlsx"
import _ from "lodash"
import { mapActions, mapGetters, mapState } from "vuex"
import CustomDialog from "../CustomDialog.vue"
import StageForm from "../forms/StageForm.vue"
import BackBtn from "./BackBtn.vue"
import BooleanIndicator from "./BooleanIndicator.vue"
import ClearFilterBtn from "./ClearFilterBtn.vue"
import ClickableChip from "./ClickableChip.vue"
import DeleteItemsModal from "./DeleteItemsModal.vue"
import FilterBtn from "./FilterBtn.vue"
import ManageAccess from "./ManageAccess.vue"
import { formatDate } from "../../helpers/misc"
import FormatedDateTime from "../FormatedDateTime.vue"
import VCan from "../VCan.vue"
import ColumnVisibilityControl from "@/components/ColumnVisibilityControl.vue"
import AssetImport from "@/components/assets/AssetImport.vue"
import TreeCRUD from "@/components/custom-tree/TreeCRUD.vue"

export default {
  name: "CustomTable",
  components: {
    ManageAccess,
    DeleteItemsModal,
    StageForm,
    BooleanIndicator,
    CustomDialog,
    FilterBtn,
    ClearFilterBtn,
    BackBtn,
    ClickableChip,
    FormatedDateTime,
    VCan,
    ColumnVisibilityControl,
    AssetImport,
    TreeCRUD
  },

  props: {
    bgColor: {
      type: String,
      default: "globalBg"
    },
    fullPageTable: {
      type: Boolean,
      default: true
    },
    tableHeight: { type: Number, default: null },
    pmwebTable: { type: Boolean, default: false },
    defaultIdKey: { type: String },
    propItems: { type: Array, default: null },
    propLoading: { type: Boolean, default: false },
    headers: { type: Array, required: true, default: [] },
    title: { type: String, required: true },
    styledTitle: {
      type: Boolean,
      default: true
    },
    tableConfig: { type: Object, required: true, default: {} },

    hideOutline: { type: Boolean, default: false },
    hideEdit: { type: Boolean, default: false },
    hideView: { type: Boolean, default: false },
    hideDelete: { type: Boolean, default: false },
    hideCreate: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    hideHeaders: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false },
    hideRefresh: { type: Boolean, default: false },
    sortOnLoad: { type: Boolean, default: true },
    disablePagination: { type: Boolean, default: false },

    showFilter: { type: Boolean, default: false },
    filters: {
      type: Object,
      default: () => ({})
    },
    filterIsActive: { default: null },
    resetFiltersFunction: { type: Function },

    showBackBtn: { type: Boolean, default: false },
    backBtnTooltip: { type: String },
    backBtnPath: { type: String, default: "" },

    showStageEdit: { type: Boolean, default: false },

    isOrders: { type: Boolean, default: false },
    description: { type: String, default: "" },
    showColumnControl: { type: Boolean, default: false },
    showExport: {
      type: Boolean,
      default: false
    },
    showImport: {
      type: Boolean,
      default: false
    },
    showImportDialog: false,
    showCalendar: { type: Boolean, default: false },
    calendarConfig: {
      type: Object,
      default: () => ({})
    },

    // Tree-related props
    showTree: {
      type: Boolean,
      default: false
    },
    treeConfig: {
      type: Object,
      default: () => ({
        items: [],
        displayKey: "name",
        expandAll: true
      })
    },
    treeFormConfig: {
      type: Object,
      default: () => ({
        component: "",
        parentField: null,
        staticFields: {},
        createTitle: "Create Item",
        editTitle: "Edit Item",
        deleteTitle: "Delete Item",
        itemNameKey: "name",
        store: "",
        entityName: ""
      })
    },

    // NEW: Drag and drop props for tree view
    allowDragAndDrop: {
      type: Boolean,
      default: false
    },
    allowMultiselect: {
      type: Boolean,
      default: false
    },
    edgeSize: {
      type: Number,
      default: 3
    },
    showBranches: {
      type: Boolean,
      default: false
    },
    allowOnlyInsideDrop: {
      type: Boolean,
      default: false
    },
    dropConfig: {
      type: Object,
      default: () => ({
        dropEndpoint: "",
        itemIdKey: ""
      })
    },

    centerButtonsLayout: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      showDeleteModal: false,
      items: [],
      selected: [],
      itemsToDelete: [],
      stage: { selectedStage: null, isFormOpen: false },
      defaultSortKey: "",
      search: "",
      dialog: { filter: false },
      initialized: false,
      visibleColumns: [],
      navbarHeight: 0,
      sortDesc: false,
      viewMode: "table", // Default to table view
      openNodes: [] // For tree view
    }
  },
  created() {
    this.initialize()
  },
  computed: {
    ...mapState(["isRTL"]),
    sortedItems() {
      if (!this.sortBy) return this.computedItems
      return [...this.computedItems].sort((a, b) => {
        const aVal = a[this.sortBy]
        const bVal = b[this.sortBy]
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (aVal === bVal) return 0
        if (this.sortDesc) {
          return aVal < bVal ? 1 : -1
        } else {
          return aVal > bVal ? 1 : -1
        }
      })
    },
    idKey() {
      if (this.defaultIdKey) {
        return this.defaultIdKey
      }
      return this.pmwebTable ? "Id" : "id"
    },
    useCreateDrawer() {
      return Boolean(this.tableConfig?.createForm)
    },
    useEditDrawer() {
      return Boolean(this.tableConfig?.editForm)
    },
    computedLoading() {
      return this.propItems ? this.propLoading : this.loading
    },
    computedItems() {
      const items = this.propItems || this.items
      return items.map((item) => ({
        ...item,
        contractCount: item.contracts ? item.contracts.length : 0
      }))
    },
    computedPerPage() {
      if (this.propItems && this.propItems.length > 0 && this.propItems.length <= 20) {
        return parseInt(this.propItems.length)
      } else {
        return 25
      }
    },
    allHeaders() {
      let baseHeaders = [...this.headers]

      if (!this.hideDelete) {
        baseHeaders.unshift({
          text: this.$t("table.select"),
          value: "data-table-select",
          sortable: false
        })
      }

      if (this.tableConfig?.CANS) {
        baseHeaders.push({
          text: this.$t("table.messages"),
          value: "CANS",
          sortable: false
        })
      }

      if (this.showColumnControl) {
        baseHeaders = this.headers.filter(
          (header) => this.visibleColumns.includes(header.value) || header.value === "actions"
        )
        baseHeaders.push({
          text: this.$t("table.messages"),
          value: "CANS",
          sortable: false
        })
      }

      return baseHeaders.map((header) => ({
        ...header,
        text: this.translateText(header.text),
        tooltip: this.translateText(header.tooltip),
        align: header.uncenterBody ? (this.isRTL ? "end" : "start") : "center"
      }))
    },
    hasActiveFilters() {
      if (this.filterIsActive !== null) {
        return this.filterIsActive
      }

      return Object.values(this.filters).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0
        }
        if (typeof value === "string") {
          return value.trim() !== ""
        }
        return value !== null
      })
    },
    filteredHeaders() {
      const visibleHeaders = this.headers.filter(
        (header) => this.visibleColumns.includes(header.value) || header.value === "actions"
      )

      return visibleHeaders.map((header) => ({
        ...header,
        text: this.translateText(header.text),
        tooltip: this.translateText(header.tooltip),
        align: header.uncenterBody ? (this.isRTL ? "end" : "start") : "center"
      }))
    },
    // Tree-related computed properties
    treeItems() {
      const items = this.treeConfig.items || this.computedItems
      return this.processTreeItems(items)
    }
  },

  methods: {
    formatDate,
    ...mapActions("drawer", ["openDrawer"]),

    // Tree-related methods
    processTreeItems(items) {
      return items.map((item) => ({
        ...item,
        displayName: item[this.treeConfig.displayKey] || "No Name",
        children: item.children ? this.processTreeItems(item.children) : []
      }))
    },
    getAllNodeIds(items) {
      let ids = []
      items.forEach((item) => {
        ids.push(item.id)
        if (item.children && item.children.length > 0) {
          ids = [...ids, ...this.getAllNodeIds(item.children)]
        }
      })
      return ids
    },
    expandAllNodes() {
      if (this.treeConfig.expandAll && this.treeItems.length > 0) {
        this.openNodes = this.getAllNodeIds(this.treeItems)
      }
    },
    handleTreeCreate(item) {
      this.$emit("tree-create", item)
    },
    handleTreeEdit(item) {
      this.$emit("tree-edit", item)
    },
    handleTreeDelete(item) {
      this.$emit("tree-delete", item)
    },
    handleTreeItemDeleted(deletedIds) {
      this.$emit("tree-item-deleted", deletedIds)
    },

    // NEW: Tree drag and drop event handlers
    onTreeNodeSelected(originalItems, selectedNode, event) {
      this.$emit("tree-node-selected", originalItems, selectedNode, event)
    },
    onTreeNodeDropped(dropData) {
      this.$emit("tree-nodes-dropped", dropData)
    },
    onTreeBeforeDrop(dropData) {
      this.$emit("tree-before-drop", dropData)
    },
    onTreeNodeClicked(originalItem, node, event) {
      this.$emit("tree-node-clicked", originalItem, node, event)
    },
    onTreeNodeDoubleClicked(originalItem, node, event) {
      this.$emit("tree-node-double-clicked", originalItem, node, event)
    },
    onTreeNodeContextMenu(originalItem, node, event) {
      this.$emit("tree-node-context-menu", originalItem, node, event)
    },
    onTreeNodeToggled(originalItem, node, event) {
      this.$emit("tree-node-toggled", originalItem, node, event)
    },

    updateNavbarHeight() {
      if (!this.fullPageTable) {
        return
      }
      // Find navbar element - adjust selectors based on your actual navbar component structure
      const navbar = document.querySelector(".v-app-bar")

      if (navbar) {
        this.navbarHeight = this.isInsideDrawer() ? 0 : navbar.offsetHeight

        // Apply the navbar height to the sticky-top-slot's top position
        const stickyHeader = this.$refs.stickyHeader
        if (stickyHeader) {
          stickyHeader.style.top = `${this.navbarHeight}px`
        }
      }
    },
    CalculateTableHeight() {
      if (this.tableHeight) {
        return this.tableHeight
      }

      let navbar = document.querySelector(".v-app-bar")
      let navbarHeight = navbar ? navbar.offsetHeight : 0
      let stickyHeader = this.$refs.stickyHeader
      let stickyHeaderHeight = stickyHeader ? stickyHeader.offsetHeight : 0

      return window.innerHeight - navbarHeight - stickyHeaderHeight - 120
    },
    isInsideDrawer() {
      // Check if any parent element has a drawer-related class
      let parent = this.$el.parentElement
      while (parent) {
        if (parent.classList.contains("v-navigation-drawer")) {
          return true
        }
        parent = parent.parentElement
      }
      return false
    },
    handleExport() {
      // Helper function to clean HTML and Excel-specific characters
      const cleanHtml = (html) => {
        if (!html || typeof html !== "string") return html

        // Replace Excel's encoded carriage returns
        let text = html.replace(/_x000d_/g, "")

        // Replace <br> tags with newlines
        text = text.replace(/<br\s*\/?>/gi, "\n")

        // Remove all other HTML tags while preserving their content
        text = text.replace(/<[^>]+>/g, "")

        // Decode HTML entities
        const textarea = document.createElement("textarea")
        textarea.innerHTML = text
        return textarea.value
      }

      // Get visible columns from headers
      const visibleColumns = this.allHeaders
        .filter((header) => header.export)
        .map((header) => ({
          key: header.export.key,
          title: header.text,
          type: header.export.type,
          subKey: header.export.subKey
        }))

      // Recursively flatten items and their children
      const getAllItems = (items) => {
        let result = []

        items.forEach((item) => {
          // Add the main item
          result.push(item)

          // Add children if available
          if (Array.isArray(item.children) && item.children.length > 0) {
            result = result.concat(getAllItems(item.children))
          }
        })

        return result
      }

      // Get all items including children
      const allItems = getAllItems(this.computedItems)

      // Format data for export
      const exportData = allItems.map((item) => {
        const rowData = {}
        visibleColumns.forEach((column) => {
          let value = _.get(item, column.key, "")

          // Handle different export types
          if (column.type === "bool") {
            value = value ? this.$t("page.yes") : this.$t("page.no")
          } else if (column.type === "array") {
            if (Array.isArray(value)) {
              const subKey = column.subKey || "name"
              value = value
                .map((user) => _.get(user, subKey, ""))
                .filter((name) => name)
                .join(", ")
            } else {
              value = ""
            }
          }

          // Clean HTML from the value
          value = cleanHtml(value)

          rowData[column.title] = value
        })
        return rowData
      })

      // Create worksheet with explicit alignment options
      const worksheet = XLSX.utils.json_to_sheet(exportData, {
        cellStyles: true,
        cellDates: true
      })

      // Get all columns' width and store maximum length for each column
      const colWidths = {}
      const headerKeys = Object.keys(exportData[0] || {})

      // Check header width
      headerKeys.forEach((header) => {
        colWidths[header] = Math.max(15, header.length)
      })

      // Check data width
      exportData.forEach((row) => {
        headerKeys.forEach((header) => {
          const cellValue = String(row[header] || "")
          const maxLineLength = cellValue.split("\n").reduce((max, line) => Math.max(max, line.length), 0)
          colWidths[header] = Math.max(colWidths[header], maxLineLength)
        })
      })

      // Apply column widths
      worksheet["!cols"] = headerKeys.map((header) => ({
        wch: Math.min(colWidths[header], 50)
      }))

      // Set default row height
      worksheet["!rows"] = Array(exportData.length + 1).fill({ hpt: 15 }) // +1 for header row

      // More strict cell formatting
      const range = XLSX.utils.decode_range(worksheet["!ref"])
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_ref = XLSX.utils.encode_cell({ r: R, c: C })
          if (!worksheet[cell_ref]) {
            worksheet[cell_ref] = { v: "", t: "s" } // Create empty cells with explicit type
          }

          // Apply strict styling to each cell
          worksheet[cell_ref].s = {
            alignment: {
              vertical: "top",
              horizontal: "left",
              wrapText: true,
              indent: 0
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          }
        }
      }

      // Create and download the Excel file
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
      XLSX.writeFile(workbook, `${this.title}-export.xlsx`)
    },
    updateVisibleColumns(columns) {
      this.visibleColumns = columns
    },

    customSearch(value, search, computedItems) {
      const searchInObject = (obj) => {
        if (typeof obj !== "object" || obj === null) {
          return String(obj).toLowerCase().includes(search.toLowerCase())
        }

        return Object.values(obj).some((v) => {
          if (Array.isArray(v)) {
            return v.some((item) => searchInObject(item))
          }
          if (typeof v === "object" && v !== null) {
            return searchInObject(v)
          }
          return String(v).toLowerCase().includes(search.toLowerCase())
        })
      }

      return searchInObject(computedItems)
    },
    openCalendarDrawer() {
      this.openDrawer({
        component: "custom-calendar/CustomCalendar",
        props: { config: this.calendarConfig },
        title: this.$t("page.calendar"),
        width: "100%"
      })
    },
    openAttachmentDrawer() {
      if (this.tableConfig?.attachments) {
        const { componentPath, props } = this.tableConfig.attachments
        this.openDrawer({
          component: componentPath,
          props: props || {},
          title: this.$t("page.document_management_system"),
          width: "100vw"
        })
      }
    },
    openDrawerForm(isEdit = false, item = null) {
      const formConfig = isEdit ? this.tableConfig.editForm : this.tableConfig.createForm

      if (item) {
        formConfig.props = { ...formConfig.props, itemId: item[this.idKey] }
      }

      this.openDrawer({
        component: formConfig.componentPath,
        props: formConfig?.props || {},
        title: isEdit ? this.$t("page.edit") : this.$t("page.create"),
        width: formConfig.props?.width || 700
      })
    },
    openCANSDrawer(item) {
      this.openDrawer({
        component: "CANS/CollaborationAlertsNotificationSystem",
        props: { ...this.tableConfig?.CANS.props, postableId: item.id } || {},
        title: `${this.$t("page.messages")} - ${item.CANSTitle}` || this.$t("page.messages"),
        width: this.tableConfig?.CANS?.drawerWidth || 700
      })
    },
    routeTo(path) {
      this.$router.push(path)
    },
    resetFilters() {
      const resetFilters = Object.keys(this.filters).reduce((acc, key) => {
        if (Array.isArray(this.filters[key])) {
          acc[key] = []
        } else {
          acc[key] = null
        }
        return acc
      }, {})

      // Emit the reset filters to the parent component
      this.$emit("update:filters", resetFilters)
      this.$emit("clear-filters")
    },

    showDialog(name) {
      this.dialog[name] = true
    },
    translateText(text) {
      if (!text) return text

      return text.startsWith("table.") ? this.$t(text) : text
    },
    ...mapGetters("projectStages", ["projectStages"]),
    initialize() {
      if (this.propItems) return

      this.loading = true
      if (this.tableConfig?.fetch) {
        this.tableConfig
          .fetch()
          .then((res) => {
            this.items = res?.data?.data || res?.data || []
            console.log("CustomeTableItems", this.items)
          })
          .catch((error) => {
            console.log("ERRORS->", error)
          })
          .finally(() => {
            this.loading = false
          })
      }

      if (this.sortOnLoad && this.headers.length > 0) {
        this.defaultSortKey = this.headers[0].value
      }
    },
    openDeleteModal(items) {
      console.log("openDeleteModal")
      this.itemsToDelete = Array.isArray(items) ? items : [items]
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.itemsToDelete = []
      this.$nextTick(() => {
        this.selected = []
      })
    },
    handleItemsDeleted(deletedIds) {
      const isArray = Array.isArray(deletedIds)
      const ids = isArray ? deletedIds : [deletedIds]

      this.updateItems(ids)
      this.updateSelected(ids)
      this.closeDeleteModal()
    },

    updateItems(ids) {
      const filterFn = (item) => !ids.includes(item[this.idKey])
      if (this.propItems) {
        this.propItems = this.propItems.filter(filterFn)
      } else {
        this.items = this.items.filter(filterFn)
      }
    },

    updateSelected(ids) {
      this.selected = this.selected.filter((item) => !ids.includes(item[this.idKey]))
    },
    openStageForm(stage) {
      this.stage.selectedStage = { ...stage }
      this.stage.isFormOpen = true
    },
    closeStageDialog() {
      this.stage.isFormOpen = false
      this.stage.selectedStage = null
    },
    handleStageSaved() {
      this.closeStageDialog()
      // this.items = this.projectStages()
      // this.$emit("stage-saved")
    },
    itemId(item) {
      return item[this.idKey]
      return item.stage ? item.stage.id : item.id
    },
    downloadTemplate() {
      // Create workbook with headers
      const workbook = XLSX.utils.book_new()

      const headers = this.allHeaders.map((item) => this.$t(item.text))
      // remove the last 2 column as it is not needed for the template
      headers.pop()
      headers.pop()

      // Create worksheet with headers
      const worksheet = XLSX.utils.aoa_to_sheet([headers])

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Assets")

      // Generate XLSX file
      XLSX.writeFile(workbook, "assets_import_template.xlsx")
    }
  },

  watch: {
    treeItems: {
      handler() {
        this.$nextTick(() => {
          this.expandAllNodes()
        })
      },
      immediate: true
    }
  },

  mounted() {
    this.updateNavbarHeight()
    window.addEventListener("resize", this.updateNavbarHeight)

    // If your navbar height can change due to content changes or other factors,
    // consider using a MutationObserver or periodically checking height
    this.navbarObserver = new MutationObserver(this.updateNavbarHeight)
    const navbar = document.querySelector(".v-app-bar") || document.querySelector(".logged-in-nav-bar")
    if (navbar) {
      this.navbarObserver.observe(navbar, {
        attributes: true,
        childList: true,
        subtree: true
      })
    }
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateNavbarHeight)
    if (this.navbarObserver) {
      this.navbarObserver.disconnect()
    }
  }
}
</script>

<style scoped>
.compact-search ::v-deep .v-input__control {
  min-height: 32px !important;
}

.compact-search ::v-deep .v-input__slot {
  min-height: 32px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.compact-search ::v-deep .v-text-field__slot {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Add this to fix the placeholder/label positioning */
.compact-search ::v-deep .v-label {
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.compact-search ::v-deep .v-label--active {
  transform: translateY(-18px) scale(0.75) !important;
}

.compact-search ::v-deep .v-input__append-inner {
  align-self: center !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.compact-search ::v-deep .v-input__icon {
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
}

.custom-table-wrapper {
  position: relative;
}

/* This is the key CSS for making the top slot sticky */
.sticky-top-slot {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;
  padding-bottom: 8px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
}

.custom-rtl-table ::v-deep .v-data-table-header th {
  text-align: right !important;
}
::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  text-align: center !important;
}

.v-data-table ::v-deep .no-wrap {
  white-space: nowrap !important;
}

.v-data-table ::v-deep .domain-cell {
  min-width: 200px !important;
}
.v-data-table ::v-deep .subdomain-cell {
  min-width: 200px !important;
}

.v-data-table ::v-deep .principle-cell {
  min-width: 200px !important;
}

/* remove padding in cells */
.v-data-table >>> td {
  padding: 10px 8px !important; /* Default is 0 16px */
}

.v-data-table >>> th {
  padding: 0 8px !important; /* Default is 0 16px */
  background-color: #ffffff !important; /* Light grey background */
}

/* Tree view styles */
.tree-view-container {
  width: 100%;
}

.tree-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.tree-item {
  min-height: 48px;
  padding: 0 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.tree-item:hover {
  background-color: rgba(88, 177, 237, 0.05);
}

.tree-item:hover .tree-actions {
  opacity: 1;
  visibility: visible;
}

.tree-label {
  font-weight: 500;
  color: #061e37;
  font-size: 14px;
}

/* Level-based styling */
.custom-tree ::v-deep .v-treeview-node--leaf .tree-item {
  background-color: rgba(245, 245, 245, 0.3);
  border-left-color: rgba(88, 177, 237, 0.3);
}

.custom-tree ::v-deep .v-treeview-node:not(.v-treeview-node--leaf) .tree-item {
  background-color: rgba(47, 85, 151, 0.03);
  border-left-color: #2f5597;
  font-weight: 600;
}

.custom-tree ::v-deep .v-treeview-node:not(.v-treeview-node--leaf) .tree-label {
  color: #2f5597;
  font-weight: 600;
}

/* Root level emphasis */
.custom-tree ::v-deep .v-treeview-node--level-0:not(.v-treeview-node--leaf) .tree-item {
  background-color: rgba(6, 30, 55, 0.05);
  border-left-color: #061e37;
  border-left-width: 4px;
}

.custom-tree ::v-deep .v-treeview-node--level-0:not(.v-treeview-node--leaf) .tree-label {
  color: #061e37;
  font-weight: 700;
  font-size: 15px;
}

/* Subtle dividers between different parent groups */
.custom-tree ::v-deep .v-treeview-node--level-0 + .v-treeview-node--level-0 {
  border-top: 1px solid rgba(47, 85, 151, 0.1);
  margin-top: 8px;
  padding-top: 8px;
}

.tree-actions {
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

/* Override default v-treeview styles */
.custom-tree ::v-deep .v-treeview-node__root {
  min-height: unset;
}

.custom-tree ::v-deep .v-treeview-node__content {
  margin-left: 0;
}

.custom-tree ::v-deep .v-treeview-node__label {
  width: 100%;
}

.custom-tree ::v-deep .v-treeview-node {
  margin-bottom: 2px;
}

.custom-tree ::v-deep .v-treeview-node__toggle {
  color: #2f5597;
}

.custom-tree ::v-deep .v-treeview-node__prepend {
  margin-right: 8px;
}
.btns-container-default {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* RIGHT (empty but important for balance) */
.btns-right {
  justify-self: end;
}
.btns-container-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
}

.btns-container-grid .btns-left {
  justify-self: start;
  display: flex;
  align-items: center;
}

.btns-container-grid .btns-center {
  justify-self: center;
  display: flex;
  align-items: center;
}

.btns-container-grid .btns-right {
  justify-self: end;
}
.btns-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
}

/* LEFT */
.btns-left {
  justify-self: start;
  display: flex;
  align-items: center;
}

/* CENTER */
.btns-center {
  justify-self: center;
  display: flex;
  align-items: center;
}

/* RIGHT (empty but important for balance) */
.btns-right {
  justify-self: end;
}
</style>
