<template>
  <v-card flat class="checklist-tree">
    <v-card-title class="primary white--text py-4">
      {{ title }}
    </v-card-title>

    <v-card-text>
      <v-row v-if="maxDepth > 1" class="mb-4">
        <v-col cols="12">
          <v-btn-toggle v-model="activeLevel" mandatory>
            <v-btn
              v-for="level in maxDepth"
              :key="level"
              :value="level"
              :disabled="level > 1 && openNodes.length === 0"
              @click="toggleLevel(level)"
              text
            >
              {{ $t("page.level") }} {{ level }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-treeview :open="openNodes" color="primary" :items="filteredItems" hoverable activatable transition dense>
        <template #prepend="{ item }">
          <template v-if="'done' in item">
            <v-can disable-only :permission="'check_stage_progress'">
              <template #default="{ disabled }">
                <v-checkbox
                  :input-value="isDoneItem(item.id)"
                  @change="toggleItemDone(item, getParentIsStarted(item))"
                  dense
                  hide-details
                  class="mt-0 pt-0"
                  :disabled="isCheckboxDisabled(item) || disabled"
                />
              </template>
            </v-can>
          </template>
          <v-icon v-else :color="getIconColor(item)" small class="mr-2">
            {{ item.children && item.children.length > 0 ? "mdi-folder" : "mdi-folder-outline" }}
          </v-icon>
        </template>
        <template #label="{ item }">
          <span :class="{ 'font-weight-bold': item.children }">
            {{ item.title || item.description }}

            <!-- Progress display for items with children -->
            <v-chip v-if="getChildrenProgress(item)" x-small color="info" text-color="white" class="ml-2">
              {{
                $t("page.items_completed_with_slash", {
                  amount: `${getChildrenProgress(item).done} / ${getChildrenProgress(item).total}`
                })
              }}
            </v-chip>

            <!-- Your existing status chips -->
            <v-chip
              v-if="
                item.project_stage &&
                item.project_stage[0] &&
                (item.project_stage[0].is_completed || !item.project_stage[0].is_started)
              "
              x-small
              :color="item.project_stage[0].is_completed ? 'success' : 'warning'"
              text-color="white"
              class="ml-2"
            >
              {{ item.project_stage[0].is_completed ? $t("page.completed") : $t("page.not_started") }}
            </v-chip>

            <v-progress-circular
              v-if="changingItems.includes(item.id)"
              indeterminate
              color="primary"
              size="16"
              width="2"
              class="ml-2"
            ></v-progress-circular>
          </span>
        </template>
        <template #append="{ item }">
          <slot name="append" :item="item"></slot>
          <div class="d-flex justify-end">
            <span class="mx-2 font-weight-medium font-italic">{{ item?.five_case_model?.name }}</span>
            <v-can :permission="'access_stage_info'">
              <v-icon v-if="item.link === 'checklist'" @click="openDetailsDialog(item)" color="green" small>
                mdi-information-outline
              </v-icon>
            </v-can>
          </div>
        </template>
      </v-treeview>
      <!-- Details Dialog -->
      <custom-dialog
        v-model="detailsDialog"
        :title="selectedItem?.title || selectedItem?.description"
        @input="handleDialogChange"
      >
        <v-card flat v-if="selectedItem">
          <v-card-text>
            <checklist-schedule
              :checklistId="selectedItem.id"
              :initialStartDate="selectedItem.start_date"
              :initialEndDate="selectedItem.end_date"
              :initialDone="isDoneItem(selectedItem.id)"
              @item-updated="handleItemUpdate"
            />
          </v-card-text>
          <v-card-text>
            <assigned-user
              :checklistId="selectedItem.id"
              :currentAssinedUser="selectedItem.assigned"
              @update:assigned="updateAssignedUser"
            />
          </v-card-text>
          <v-card-text>
            <checklist-status
              :checklistId="selectedItem.id"
              :initialStatus="selectedItem.status"
              :initialDone="isDoneItem(selectedItem.id)"
              @item-updated="handleItemUpdate"
            />
          </v-card-text>
          <v-card-text>
            <attachments :projectChecklistId="selectedItem.id" />
          </v-card-text>
          <v-card-text>
            <logs :id="selectedItem.id" :dialogOpen="detailsDialog" />
          </v-card-text>
        </v-card>
      </custom-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex"
import AssignedUser from "@/components/checklist-tree/AssignedUser.vue"
import Attachments from "@/components/checklist-tree/attachments/Attachments.vue"
import ChecklistStatus from "@/components/checklist-tree/ChecklistStatus.vue"
import Logs from "@/components/checklist-tree/Logs.vue"
import VCan from "../VCan.vue"
import ChecklistSchedule from "./ChecklistSchedule.vue"

export default {
  name: "ChecklistTree",
  components: { Logs, AssignedUser, Attachments, ChecklistStatus, VCan, ChecklistSchedule },

  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    openNodes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeLevel: 1,
      changingItems: [],
      detailsDialog: false,
      selectedItem: {},
      filteredItems: []
    }
  },
  computed: {
    ...mapGetters("projectChecklist", ["isDoneItem"]),
    maxDepth() {
      return this.calculateMaxDepth(this.items) - 1 // Subtract 1 to exclude root level
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.processItems(newItems)
      }
    }
  },
  methods: {
    getChildrenProgress(item) {
      if (!item.children || item.children.length === 0) {
        return null
      }

      const totalChildren = item.children.length
      const doneChildren = item.children.filter((child) => this.isDoneItem(child.id)).length

      return {
        done: doneChildren,
        total: totalChildren
      }
    },
    processItems(items) {
      const processItem = (item, parentIsStarted = false, parentIsCompleted = false) => {
        const isStarted = item.is_started
        const isCompleted = item.is_completed

        const processedItem = {
          ...item,
          is_started: isStarted || parentIsStarted,
          is_completed: isCompleted || parentIsCompleted
        }

        if (item.children) {
          processedItem.children = item.children.map((child) =>
            processItem({ ...child }, processedItem.is_started, processedItem.is_completed)
          )
        }

        return processedItem
      }
      this.filteredItems = items.map((item) => processItem({ ...item }))
    },
    isCheckboxDisabled(item) {
      const isChanging = this.changingItems.includes(item.id)
      const isNotStarted = !item.is_started
      const isCompleted = item.is_completed
      return isChanging || isNotStarted || isCompleted
    },
    calculateMaxDepth(data) {
      if (!data || data.length === 0) {
        return 0
      }

      const getDepth = (item) => {
        if (!item) {
          return 0
        }
        if (!item.children || item.children.length === 0) {
          return 1
        }
        return 1 + Math.max(...item.children.map(getDepth))
      }

      const depths = data.map(getDepth)
      return Math.max(...depths)
    },
    toggleLevel(level) {
      const currentOpenIds = this.openNodes
      const allIds = this.extractAllNodeIds(this.items, level)

      let newOpenNodes = null
      if (currentOpenIds.length >= allIds.length) {
        newOpenNodes = level > 1 ? this.extractAllNodeIds(this.items, level - 1) : []
      } else {
        newOpenNodes = allIds
      }

      this.$emit("update:openNodes", newOpenNodes)
    },
    extractAllNodeIds(data, maxDepth) {
      if (!data || data.length === 0) return []

      const ids = []

      const extract = (item, currentDepth) => {
        if (currentDepth <= maxDepth) {
          ids.push(item.id)
          if (item.children) {
            item.children.forEach((child) => extract(child, currentDepth + 1))
          }
        }
      }

      data.forEach((item) => extract(item, 1))

      return ids
    },
    toggleItemDone(item, parentIsStarted) {
      if (!parentIsStarted || item.is_completed) return
      this.changingItems.push(item.id)
      this.$emit("item-toggle", { ...item, done: !this.isDoneItem(item.id) })
    },
    getParentIsStarted(item) {
      return item.is_started === true && !item.is_completed
    },
    getIconColor(item) {
      if (item.is_completed) return "success"
      return item.is_started ? "primary" : "grey"
    },
    itemUpdateComplete(itemId) {
      const index = this.changingItems.indexOf(itemId)
      if (index > -1) {
        this.changingItems.splice(index, 1)
      }
    },
    handleItemUpdate(updatedItem) {
      this.updateSelectedItemStatus(updatedItem.status)
      this.$emit("item-updated", updatedItem)
    },
    updateSelectedItemStatus(newStatus) {
      this.selectedItem = {
        ...this.selectedItem,
        status: newStatus
      }

      // Update the item in the filteredItems array
      this.updateItemInFilteredItems(this.selectedItem.id, { status: newStatus })
    },
    updateItemInFilteredItems(id, updates) {
      const updateRecursively = (items) => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, ...updates }
          }
          if (item.children) {
            return { ...item, children: updateRecursively(item.children) }
          }
          return item
        })
      }

      this.filteredItems = updateRecursively(this.filteredItems)
    },
    openDetailsDialog(item) {
      // Find the most up-to-date version of the item
      const updatedItem = this.findItemById(this.filteredItems, item.id)
      this.selectedItem = JSON.parse(JSON.stringify(updatedItem || item))
      this.detailsDialog = true
    },
    findItemById(items, id) {
      for (const item of items) {
        if (item.id === id) {
          return item
        }
        if (item.children) {
          const found = this.findItemById(item.children, id)
          if (found) {
            return found
          }
        }
      }
      return null
    },
    handleDialogChange(value) {
      if (!value) {
        // Dialog is closing
        if (this.$refs.logs) {
          this.$refs.logs.resetShowLogs()
        } else {
          // If $refs.logs doesn't exist, we can set selectedItem to null
          // This will cause the Logs component to unmount and reset its state
          this.selectedItem = null
        }
      }
    },
    updateAssignedUser(newAssignedUser) {
      if (this.selectedItem) {
        this.selectedItem.assigned = newAssignedUser
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checklist-tree {
  .v-treeview {
    &-node {
      &__root {
        min-height: 40px;
      }
      &__content {
        margin-left: 8px;
      }
      &__label {
        margin-left: 4px;
      }
    }
  }
  .v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
  }
  .v-btn-toggle {
    .v-btn {
      height: 36px;
    }
  }
  .v-treeview-node__label {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .v-chip {
    margin-top: 2px;
    margin-bottom: 2px;
  }
}
</style>
