<template>
  <div>
    <!-- Dropdown Menu for Level Selection -->
    <v-menu
      v-model="showDropdown"
      :position-x="dropdownPosition ? dropdownPosition.x : 0"
      :position-y="dropdownPosition ? dropdownPosition.y : 0"
      absolute
      offset-y
      close-on-click
      close-on-content-click
    >
      <v-list dense>
        <v-can :permission="getRequiredPermissionForCell()" :disable-only="true">
          <template #default="{ disabled }">
            <v-list-item
              v-for="level in levelItems"
              :key="level.id"
              @click="!disabled ? selectLevel(level) : null"
              class="px-3"
              :class="{ 'disabled-item': disabled }"
            >
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center">
                  <!-- Color indicator -->
                  <v-chip
                    small
                    :color="level.color"
                    :text-color="getTextColorForBackground(level.color)"
                    class=""
                    :class="{ 'disabled-chip': disabled }"
                  >
                    {{ level.name }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>

              <!-- Tooltip for disabled items -->
              <v-tooltip v-if="disabled" activator="parent" top>
                <span>{{ getPermissionTooltip() }}</span>
              </v-tooltip>
            </v-list-item>

            <!-- No Level / Clear option -->
            <v-divider></v-divider>
            <v-list-item
              @click="!disabled ? selectLevel(null) : null"
              class="px-3"
              :class="{ 'disabled-item': disabled }"
            >
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center grey--text">
                  <v-chip
                    small
                    color="grey lighten-2"
                    text-color="grey darken-2"
                    class=""
                    :class="{ 'disabled-chip': disabled }"
                  >
                    {{ $t("page.remove") }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>

              <!-- Tooltip for disabled remove option -->
              <v-tooltip v-if="disabled" activator="parent" top>
                <span>{{ getPermissionTooltip() }}</span>
              </v-tooltip>
            </v-list-item>
          </template>
        </v-can>
      </v-list>
    </v-menu>

    <!-- Loading State -->
    <div v-if="isAnyLoading">
      <circular-loading :show="isAnyLoading" />
    </div>

    <!-- Error State -->
    <div v-else-if="hasAnyError">
      <v-alert type="error" prominent border="left" class="mb-4">
        <v-row align="center">
          <v-col class="grow">
            <div class="title">Failed to load data</div>
            <div class="body-1">The following errors occurred while loading data:</div>
          </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>
        <div v-for="(error, index) in errorMessages" :key="index" class="body-2 mb-1">• {{ error }}</div>
      </v-alert>

      <!-- Retry Button -->
      <v-btn color="primary" @click="retryFetchData" :loading="isAnyLoading">
        <v-icon left>mdi-refresh</v-icon>
        {{ $t("page.retry") }}
      </v-btn>
    </div>

    <!-- Success State with Table -->
    <div v-else-if="isAllDataLoaded">
      <!-- Impact Analysis Table -->
      <v-simple-table fixed-header class="impact-table bordered-table" dense>
        <template v-slot:default>
          <thead>
            <tr>
              <!-- Main Item Headers with CSS classes -->
              <th
                v-for="(column, index) in tableStores.main.columns"
                :key="column.key"
                class="text-center primary font-weight-bold"
                :class="index === 0 ? 'threat-column' : 'data-column'"
                :style="{
                  color: getTextColorForBackground('primary')
                }"
              >
                {{ $t(column.header) }}
              </th>
              <th
                class="text-center primary font-weight-bold category-column"
                :style="{
                  color: getTextColorForBackground('primary')
                }"
              >
                {{ $t(tableStores.categories.name) }}
              </th>
              <th
                v-for="timeItem in timeItems"
                :key="timeItem.id"
                class="text-center primary font-weight-bold time-column"
                :style="{
                  color: getTextColorForBackground('primary')
                }"
              >
                {{ timeItem[tableStores.times.displayKey] }}
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(mainItem, mainIndex) in mainItems">
              <tr v-for="(category, categoryIndex) in categoriesItems" :key="`${mainItem.id}-${category.id}`">
                <!-- Multiple Main Item Cells with CSS classes -->
                <td
                  v-for="(column, index) in tableStores.main.columns"
                  :key="`${mainItem.id}-${column.key}`"
                  v-if="categoryIndex === 0"
                  :rowspan="categoriesItems.length"
                  class="text-center font-weight-medium pa-3"
                  :class="index === 0 ? 'threat-column' : 'data-column'"
                >
                  {{ mainItem[column.key] }}
                </td>

                <!-- Category Cell -->
                <td class="text-center pa-3 category-column">
                  {{ category[tableStores.categories.displayKey] }}
                </td>

                <!-- Time/Strength Cells -->
                <td
                  v-for="timeItem in timeItems"
                  :key="`${mainItem.id}-${category.id}-${timeItem.id}`"
                  class="text-center pa-2 strength-cell time-column"
                  :class="[getStrengthCellClass(mainItem, category, timeItem)]"
                >
                  <v-can
                    :permission="getRequiredPermissionForSpecificCell(mainItem, category, timeItem)"
                    :disable-only="true"
                  >
                    <template #default="{ disabled }">
                      <div
                        :class="{
                          'selected-cell': isSelectedCell(mainItem, category, timeItem),
                          'loading-cell': isCellLoading(mainItem, category, timeItem),
                          'no-permission-cell': disabled
                        }"
                        :style="getStrengthCellStyle(mainItem, category, timeItem, disabled)"
                        @click="!disabled ? onStrengthCellClick(mainItem, category, timeItem, $event) : null"
                        @mouseover="onCellHover($event, true, disabled)"
                        @mouseleave="onCellHover($event, false, disabled)"
                        class="cell-content"
                      >
                        <!-- Show loading spinner if this cell is loading -->
                        <template v-if="isCellLoading(mainItem, category, timeItem)">
                          <v-progress-circular indeterminate size="16" width="2" color="primary"></v-progress-circular>
                        </template>

                        <!-- Display strength name if exists, otherwise show hover icon -->
                        <template v-else-if="getStrengthForCell(mainItem, category, timeItem)">
                          <span class="strength-text">
                            {{ getStrengthForCell(mainItem, category, timeItem).name }}
                          </span>
                        </template>
                        <template v-else>
                          <v-icon small color="grey" class="hover-icon" style="display: none" v-if="!disabled">
                            mdi-plus-circle-outline
                          </v-icon>
                        </template>

                        <!-- Tooltip for cells without permission -->
                        <v-tooltip v-if="disabled" activator="parent" top>
                          <span>{{ getCellPermissionTooltip(mainItem, category, timeItem) }}</span>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-can>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { colorUtils } from "../../mixins/colorUtils"
import CircularLoading from "../common/CircularLoading.vue"
export default {
  components: { CircularLoading },
  name: "ThreatsBusinessImpactAnalysis",
  mixins: [colorUtils],
  data() {
    return {
      showDropdown: false,
      dropdownPosition: null,
      selectedCellData: {
        mainItem: null,
        category: null,
        timeItem: null,
        currentStrength: null
      },
      // Track which cell is currently being processed
      loadingCellData: {
        mainItem: null,
        category: null,
        timeItem: null
      }
    }
  },
  props: {
    tableStores: {
      type: Object,
      default: () => ({
        main: {
          name: "page.threats",
          store: "threats",
          storeEntityName: "Threat",
          storeEntityNamePlural: "Threats",
          displayKey: "threat_name",
          columns: [
            { header: "table.threat", key: "threat_name" },
            { header: "table.rto_code", key: "rto_code" },
            { header: "table.rto_value", key: "rto_value" },
            { header: "table.rpo_code", key: "rpo_code" },
            { header: "table.rpo_value", key: "rpo_value" },
            { header: "table.mrpd_code", key: "mrpd_code" },
            { header: "table.mrpd_value", key: "mrpd_value" }
          ]
        },
        categories: {
          name: "page.impact_categories",
          store: "threatImpactCategories",
          storeEntityName: "Category",
          storeEntityNamePlural: "Categories",
          displayKey: "name"
        },
        times: {
          name: "page.distribution_times",
          store: "threatDistributionTimes",
          storeEntityName: "DistributionTime",
          storeEntityNamePlural: "DistributionTimes",
          displayKey: "bcm_code"
        },
        level: {
          name: "page.impact_strength",
          store: "threatImpactStrengths",
          storeEntityName: "Strength",
          storeEntityNamePlural: "Strengths",
          displayKey: "name"
        },
        tableData: { store: "threatImpacts", storeEntityName: "Impact", storeEntityNamePlural: "Impacts" }
      })
    },
    fields: {
      type: Object,
      default: () => ({
        main: "bcm_threat_id",
        categories: "bcm_impact_category_id",
        times: "bcm_distribution_time_id",
        level: "bcm_impact_strength_id"
      })
    },
    permissions: {
      type: Object,
      default: () => ({
        create: "create_threat_impact",
        edit: "update_threat_impact"
      })
    }
  },

  async mounted() {
    // Fetch data from all stores on component mount
    await Promise.all([
      this.fetchMainItems(),
      this.fetchCategories(),
      this.fetchTimes(),
      this.fetchLevels(),
      this.fetchTableData()
    ])
  },

  computed: {
    // Main items from the main store
    mainItems() {
      console.log(
        `Getting main items from store: ${
          this.$store.getters[`${this.tableStores.main.store}/get${this.tableStores.main.storeEntityNamePlural}`]
        }`
      )
      return this.$store.getters[`${this.tableStores.main.store}/get${this.tableStores.main.storeEntityNamePlural}`]
    },
    isLoadingMainItems() {
      return this.$store.getters[`${this.tableStores.main.store}/isLoading`]
    },
    mainItemsError() {
      return this.$store.getters[`${this.tableStores.main.store}/hasError`]
    },
    // Categories items from the categories store
    categoriesItems() {
      return this.$store.getters[
        `${this.tableStores.categories.store}/get${this.tableStores.categories.storeEntityNamePlural}`
      ]
    },
    isLoadingCategories() {
      return this.$store.getters[`${this.tableStores.categories.store}/isLoading`]
    },
    categoriesError() {
      return this.$store.getters[`${this.tableStores.categories.store}/hasError`]
    },
    // Times items from the times store
    timeItems() {
      return this.$store.getters[`${this.tableStores.times.store}/get${this.tableStores.times.storeEntityNamePlural}`]
    },
    isLoadingTimes() {
      return this.$store.getters[`${this.tableStores.times.store}/isLoading`]
    },
    timesErrors() {
      return this.$store.getters[`${this.tableStores.times.store}/hasError`]
    },
    levelItems() {
      return this.$store.getters[`${this.tableStores.level.store}/get${this.tableStores.level.storeEntityNamePlural}`]
    },
    isLoadingLevels() {
      return this.$store.getters[`${this.tableStores.level.store}/isLoading`]
    },
    levelsError() {
      return this.$store.getters[`${this.tableStores.level.store}/hasError`]
    },
    tableDataItems() {
      return this.$store.getters[
        `${this.tableStores.tableData.store}/get${this.tableStores.tableData.storeEntityNamePlural}`
      ]
    },
    isLoadingTableData() {
      return this.$store.getters[`${this.tableStores.tableData.store}/isLoading`]
    },
    isAddingTableData() {
      return this.$store.getters[
        `${this.tableStores.tableData.store}/isAdding${this.tableStores.tableData.storeEntityName}`
      ]
    },
    isUpdatingTableData() {
      return this.$store.getters[
        `${this.tableStores.tableData.store}/isUpdating${this.tableStores.tableData.storeEntityName}`
      ]
    },
    tableDataError() {
      return this.$store.getters[`${this.tableStores.tableData.store}/hasError`]
    },

    // Helper computed property to check if any store is loading
    isAnyLoading() {
      return (
        this.isLoadingMainItems ||
        this.isLoadingCategories ||
        this.isLoadingTimes ||
        this.isLoadingLevels ||
        this.isLoadingTableData
      )
    },

    // Helper computed property to check if any store has an error
    hasAnyError() {
      return this.mainItemsError || this.categoriesError || this.timesErrors || this.levelsError || this.tableDataError
    },

    // Helper computed property to get all error messages
    errorMessages() {
      const errors = []
      if (this.mainItemsError) {
        errors.push(` ${this.mainItemsError.message || this.mainItemsError}`)
      }
      if (this.categoriesError) {
        errors.push(` ${this.categoriesError.message || this.categoriesError}`)
      }
      if (this.timesErrors) {
        errors.push(` ${this.timesErrors.message || this.timesErrors}`)
      }
      if (this.levelsError) {
        errors.push(` ${this.levelsError.message || this.levelsError}`)
      }
      if (this.tableDataError) {
        errors.push(` ${this.tableDataError.message || this.tableDataError}`)
      }
      return errors
    },

    // Helper computed property to check if all data is loaded
    isAllDataLoaded() {
      return (
        !this.isAnyLoading && !this.hasAnyError
        //  &&
        // this.mainItems.length >= 0 &&
        // this.categoriesItems.length >= 0 &&
        // this.timeItems.length >= 0
      )
    },

    // Check if a specific cell is loading
    isCellLoading() {
      return (mainItem, category, timeItem) => {
        const isLoading = this.isAddingTableData || this.isUpdatingTableData

        if (!isLoading || !this.loadingCellData.mainItem) {
          return false
        }

        return (
          this.loadingCellData.mainItem.id === mainItem.id &&
          this.loadingCellData.category.id === category.id &&
          this.loadingCellData.timeItem.id === timeItem.id
        )
      }
    }
  },

  methods: {
    fetchMainItems() {
      return this.$store.dispatch(`${this.tableStores.main.store}/fetch${this.tableStores.main.storeEntityNamePlural}`)
    },
    fetchCategories() {
      return this.$store.dispatch(
        `${this.tableStores.categories.store}/fetch${this.tableStores.categories.storeEntityNamePlural}`
      )
    },
    fetchTimes() {
      return this.$store.dispatch(
        `${this.tableStores.times.store}/fetch${this.tableStores.times.storeEntityNamePlural}`
      )
    },
    fetchLevels() {
      return this.$store.dispatch(
        `${this.tableStores.level.store}/fetch${this.tableStores.level.storeEntityNamePlural}`
      )
    },
    fetchTableData() {
      return this.$store.dispatch(
        `${this.tableStores.tableData.store}/fetch${this.tableStores.tableData.storeEntityNamePlural}`
      )
    },

    // Permission checking methods - simplified to work with v-can
    getRequiredPermissionForCell() {
      if (!this.selectedCellData.mainItem) return ""

      const hasCurrentStrength = !!this.selectedCellData.currentStrength
      console.log("HAS_CURRENT_STRENGTH", hasCurrentStrength)

      if (hasCurrentStrength) {
        // Cell has a strength - need edit permission to modify/remove
        return this.permissions.edit
      } else {
        // Cell is empty - need create permission to add
        return this.permissions.create
      }
    },

    getRequiredPermissionForSpecificCell(mainItem, category, timeItem) {
      const currentStrength = this.getStrengthForCell(mainItem, category, timeItem)
      const hasCurrentStrength = !!currentStrength
      console.log("getRequiredPermissionForSpecificCell - hasCurrentStrength", hasCurrentStrength)
      if (hasCurrentStrength) {
        // Cell has a strength - need edit permission to modify/remove
        return this.permissions.edit
      } else {
        // Cell is empty - need create permission to add
        return this.permissions.create
      }
    },

    // Get tooltip text for dropdown permissions
    getPermissionTooltip() {
      const hasCurrentStrength = !!this.selectedCellData.currentStrength

      if (hasCurrentStrength) {
        return this.$t("page.no_permission_edit") || "You don't have permission to edit this item"
      } else {
        return this.$t("page.no_permission_create") || "You don't have permission to create new items"
      }
    },

    // Get tooltip text for cell permissions
    getCellPermissionTooltip(mainItem, category, timeItem) {
      const currentStrength = this.getStrengthForCell(mainItem, category, timeItem)
      const hasCurrentStrength = !!currentStrength

      if (hasCurrentStrength) {
        return this.$t("page.no_permission_edit") || "You don't have permission to edit this item"
      } else {
        return this.$t("page.no_permission_create") || "You don't have permission to create new items"
      }
    },

    // Set loading cell data
    setLoadingCell(mainItem, category, timeItem) {
      this.loadingCellData = {
        mainItem,
        category,
        timeItem
      }
    },

    addTableDataItem(mainId, categoryId, timeId, levelId) {
      // Add defensive check
      if (!this.fields) {
        console.error("Fields prop is not defined")
        return
      }

      const payload = {
        [this.fields.main]: mainId,
        [this.fields.categories]: categoryId,
        [this.fields.times]: timeId,
        [this.fields.level]: levelId
      }

      console.log("Adding table data item with payload:", payload)

      this.$store.dispatch(
        `${this.tableStores.tableData.store}/add${this.tableStores.tableData.storeEntityName}`,
        payload
      )
    },

    updateTableDataItem(id, mainId, categoryId, timeId, levelId) {
      // Add defensive check
      if (!this.fields) {
        console.error("Fields prop is not defined")
        return
      }

      const payload = {
        id,
        [this.fields.main]: mainId,
        [this.fields.categories]: categoryId,
        [this.fields.times]: timeId,
        [this.fields.level]: levelId
      }

      console.log("Updating table data item with payload:", payload)

      this.$store.dispatch(
        `${this.tableStores.tableData.store}/update${this.tableStores.tableData.storeEntityName}`,
        payload
      )
    },

    // Method to retry fetching all data
    async retryFetchData() {
      try {
        await Promise.all([
          this.fetchMainItems(),
          this.fetchCategories(),
          this.fetchTimes(),
          this.fetchLevels(),
          this.fetchTableData()
        ])
      } catch (error) {
        console.error("Error during retry:", error)
      }
    },

    // Get the strength data for a specific cell combination
    getStrengthForCell(mainItem, category, timeItem) {
      const tableDataItem = this.tableDataItems.find(
        (item) =>
          item.bcm_threat?.id === mainItem.id &&
          item.bcm_impact_category?.id === category.id &&
          item.bcm_distribution_time?.id === timeItem.id
      )

      return tableDataItem?.bcm_impact_strength || null
    },

    // Get CSS class for strength cell
    getStrengthCellClass(mainItem, category, timeItem) {
      const strength = this.getStrengthForCell(mainItem, category, timeItem)
      if (strength) {
        return "strength-cell-filled"
      }
      return "grey lighten-4 strength-cell-empty"
    },

    // Get inline styles for strength cell (background color)
    getStrengthCellStyle(mainItem, category, timeItem, disabled = false) {
      const strength = this.getStrengthForCell(mainItem, category, timeItem)

      const baseStyle = {
        minWidth: "50px",
        height: "10px",
        cursor: disabled ? "not-allowed" : "pointer"
      }

      if (strength && strength.color) {
        return {
          ...baseStyle,
          backgroundColor: strength.color,
          color: this.getTextColorForBackground(strength.color)
        }
      }

      return baseStyle
    },

    // Add this method to check if a cell is currently selected
    isSelectedCell(mainItem, category, timeItem) {
      if (!this.showDropdown || !this.selectedCellData.mainItem) {
        return false
      }

      return (
        this.selectedCellData.mainItem.id === mainItem.id &&
        this.selectedCellData.category.id === category.id &&
        this.selectedCellData.timeItem.id === timeItem.id
      )
    },

    // Handle cell hover events
    onCellHover(event, isHovering, disabled = false) {
      const hoverIcon = event.target.querySelector(".hover-icon")
      if (hoverIcon) {
        hoverIcon.style.display = isHovering && !disabled ? "inline-flex" : "none"
      }

      // Only add blue hover effect for empty cells with permission
      const hasStrength = event.target.classList.contains("strength-cell-filled")

      if (!hasStrength && !disabled) {
        if (isHovering) {
          event.target.classList.add("lighten-3")
        } else {
          event.target.classList.remove("lighten-3")
        }
      }
    },

    // Handle strength cell clicks - show dropdown with level options
    onStrengthCellClick(mainItem, category, timeItem, event) {
      // Store current cell data
      this.selectedCellData = {
        mainItem,
        category,
        timeItem,
        currentStrength: this.getStrengthForCell(mainItem, category, timeItem)
      }

      // Get click position for dropdown placement
      const rect = event.target.getBoundingClientRect()
      this.dropdownPosition = {
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY + 5
      }

      // Show dropdown
      this.showDropdown = true

      console.log("Strength cell clicked:", {
        mainItemId: mainItem.id,
        categoryId: category.id,
        timeItemId: timeItem.id,
        currentStrength: this.selectedCellData.currentStrength
      })
    },

    // Handle level selection from dropdown
    selectLevel(selectedLevel) {
      console.log("Level selected:", {
        selectedLevelId: selectedLevel?.id || selectedLevel,
        mainItemId: this.selectedCellData.mainItem.id,
        categoryId: this.selectedCellData.category.id,
        timeItemId: this.selectedCellData.timeItem.id,
        levelData: selectedLevel
      })

      // Set the loading cell before making the API call
      this.setLoadingCell(
        this.selectedCellData.mainItem,
        this.selectedCellData.category,
        this.selectedCellData.timeItem
      )

      // Find existing table data item for this cell combination
      const existingTableDataItem = this.tableDataItems.find(
        (item) =>
          item.bcm_threat?.id === this.selectedCellData.mainItem.id &&
          item.bcm_impact_category?.id === this.selectedCellData.category.id &&
          item.bcm_distribution_time?.id === this.selectedCellData.timeItem.id
      )

      const mainId = this.selectedCellData.mainItem.id
      const categoryId = this.selectedCellData.category.id
      const timeId = this.selectedCellData.timeItem.id
      const levelId = selectedLevel?.id || null // Handle "No Level" case

      if (existingTableDataItem) {
        // Update existing item
        console.log("Updating existing table data item:", existingTableDataItem.id)
        this.updateTableDataItem(existingTableDataItem.id, mainId, categoryId, timeId, levelId)
      } else {
        // Add new item (only if a level is selected, not for "No Level")
        if (selectedLevel !== null) {
          console.log("Adding new table data item")
          this.addTableDataItem(mainId, categoryId, timeId, levelId)
        }
      }

      // Close dropdown and clear selection
      this.closeDropdown()
    },

    // New method to handle dropdown closing and selection clearing
    closeDropdown() {
      this.showDropdown = false
      // Clear selection after a short delay to allow the visual effect to be seen
      setTimeout(() => {
        this.selectedCellData = {
          mainItem: null,
          category: null,
          timeItem: null,
          currentStrength: null
        }
      }, 150)
    }
  }
}
</script>

<style scoped>
/* Existing styles - keep these */
.strength-cell-empty:hover .hover-icon {
  display: inline-flex !important;
}

.strength-cell:hover {
  transition: background-color 0.2s ease;
}

.strength-cell-filled {
  font-weight: 500;
  transition: all 0.2s ease;
}

.strength-cell-filled:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.strength-text {
  font-size: 10px !important; /* Reduced from 12px for smaller cells */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px; /* Reduced letter spacing */
  line-height: 1.2;
}

/* Selected cell indication - keep existing */
.selected-cell {
  box-shadow: 0 0 0 3px rgb(var(--v-primary-base)) !important;
  position: relative;
  z-index: 1;
  border: 2px solid rgb(var(--v-primary-darken1)) !important;
  animation: pulse-border 1.5s infinite;
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 3px rgba(var(--v-primary-base), 0.8);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(var(--v-secondary-base), 0.4);
  }
  100% {
    box-shadow: 0 0 0 3px rgba(var(--v-primary-base), 0.8);
  }
}

/* Force borders on all table elements - keep existing */
.bordered-table ::v-deep .v-data-table__wrapper th,
.bordered-table ::v-deep .v-data-table__wrapper td {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

/* Ensure selected cell styling takes precedence - keep existing */
.selected-cell.strength-cell-filled {
  transform: scale(1.02);
}

.selected-cell.strength-cell-empty {
  background-color: rgba(33, 150, 243, 0.1) !important;
}

/*  Reduce cell height while preserving existing functionality */
.impact-table ::v-deep td,
.impact-table ::v-deep th {
  padding: 0px !important;
  height: auto !important;
  min-height: 32px !important;
}

/*  Specifically target strength cells for reduced height */
.impact-table ::v-deep .strength-cell {
  /* padding: 2px 4px !important; */
  min-height: 28px !important;
  height: 28px !important;
}
/* Adjust header height for dense table  */
.impact-table.v-data-table--dense ::v-deep .v-data-table__wrapper thead th {
  height: 32px !important;
  padding: 4px 8px !important;
}

/*  Adjust hover icon for smaller cells */
.impact-table ::v-deep .hover-icon {
  font-size: 14px !important;
}

/* Loading cell styles */
.loading-cell {
  background-color: rgba(var(--v-primary-base), 0.05) !important;
  position: relative;
}

.loading-cell:hover {
  transform: none !important;
  opacity: 1 !important;
}

/* Disable hover effects on loading cells */
.loading-cell .hover-icon {
  display: none !important;
}

/*  Permission-related styles */
.no-permission-cell {
  cursor: default !important;
  /* opacity: 0.6; */
}

.no-permission-cell:hover {
  transform: none !important;
  opacity: 0.9 !important;
}

.no-permission-cell .hover-icon {
  display: none !important;
}

/* Disabled dropdown items */
.disabled-item {
  opacity: 0.5;
  cursor: not-allowed !important;
  pointer-events: none;
}

.disabled-item:hover {
  background-color: transparent !important;
}

.disabled-chip {
  opacity: 0.7;
}

/* Cell content wrapper to handle v-can styling */
.cell-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
}

/* Use fixed table layout for controlled column sizing */
.impact-table {
  table-layout: fixed !important;
  width: 100% !important;
}

.impact-table ::v-deep table {
  table-layout: fixed !important;
  width: 100% !important;
}

/* Data columns - compact fixed widths */
.impact-table ::v-deep .data-column {
  width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Threat name column - wider */
.impact-table ::v-deep .threat-column {
  width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Category column - medium width */
.impact-table ::v-deep .category-column {
  width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Time/strength columns - flexible width */
.impact-table ::v-deep .time-column {
  width: auto; /* These will share remaining space */
}
</style>
