<template>
  <v-can show-message :permission="'view_tps'">
    <div class="table-page-wrapper">
      <div class="px-4">
        <custom-table-wrapper>
          <custom-table
            :title="$t('table.my_tasks')"
            :headers="headers"
            :tableConfig="tableConfig"
            :calendarConfig="calendarConfig"
            showCalendar
            :propItems="displayedTasks"
            :propLoading="loadingTasks"
            hideFooter
            hideView
            :filters.sync="filters"
            @clear-filters="fetchTasks"
            :sortOnLoad="true"
            hideHeaders
            hideCreate
            hideDelete
            showFilter
            disable-pagination
            class="table-fill"
          >
            <template v-slot:progress-bars></template>
            <template v-slot:header="{ props: { headers } }">
              <thead>
                <tr>
                  <th v-for="(header, i) in headers" :key="i">
                    <v-tooltip v-if="header.tooltip" top>
                      <template v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                          <v-icon small v-if="header.icon">{{ header.icon }}</v-icon>
                          <span v-if="header.text">
                            {{ header.text }}
                          </span>
                        </div>
                      </template>
                      <span>{{ header.tooltip }}</span>
                    </v-tooltip>
                    <span v-else>{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
            </template>
            <!-- Top toolbar with expand/collapse buttons -->
            <template v-slot:title-end>
              <div class="d-flex align-center">
                <v-btn small @click="expandAll" class="mx-1" :disabled="!hasExpandableRows">
                  <v-icon small left>mdi-arrow-expand-vertical</v-icon>
                  {{ $t("buttons.expand_all") }}
                </v-btn>
                <v-btn small @click="collapseAll" class="mx-1" :disabled="expandedRows.length === 0">
                  <v-icon small left>mdi-arrow-collapse-vertical</v-icon>
                  {{ $t("buttons.collapse_all") }}
                </v-btn>
                <!-- <v-btn small @click="openCalendarDrawer" class="mx-1">
              <v-icon small left>mdi-calendar</v-icon>
              Calendar
            </v-btn> -->
              </div>
            </template>

            <template v-slot:level-filters>
              <custom-dropdown
                :items="getStatuses"
                item-value="id"
                item-text="name"
                :label="$t('table.status')"
                v-model="filters.status_id"
                @input="applyFilters"
                :loading="loading"
              />
              <custom-dropdown
                :items="usersList"
                item-value="id"
                item-text="name"
                :label="$t('table.sender')"
                v-model="filters.sender_id"
                @input="applyFilters"
                :loading="loadingOrders"
              />
              <custom-dropdown
                :items="usersList"
                item-value="id"
                item-text="name"
                :label="$t('table.receiver')"
                v-model="filters.receiver_id"
                @input="applyFilters"
                :loading="loadingOrders"
              />
              <custom-dropdown
                :items="taskTypes"
                item-value="value"
                item-text="name"
                :label="$t('table.task_type')"
                v-model="filters.taskable_type"
                @input="applyFilters"
                :loading="loadingOrders"
              />
              <custom-dropdown
                :items="doneFilterData"
                item-value="id"
                item-text="name"
                :label="$t('done')"
                v-model="filters.done"
                @input="applyFilters"
                :loading="loadingOrders"
              />
              <v-switch
                v-model="filters.due_date"
                :label="$t('table.overdue_date')"
                color="primary"
                @change="applyFilters"
              ></v-switch>
            </template>

            <!-- Expand/Collapse column -->
            <template v-slot:item.expand="{ item }">
              <div style="width: 50px">
                <v-btn
                  v-if="!item.isChildTask && item.child_tasks && item.child_tasks.length > 0"
                  icon
                  small
                  @click="toggleExpand(item.id)"
                >
                  <v-icon small>
                    {{ expandedRows.includes(item.id) ? "mdi-chevron-up" : "mdi-chevron-down" }}
                  </v-icon>
                </v-btn>
                <v-icon v-else-if="item.isChildTask" small color="grey lighten-1" style="margin-left: 20px">
                  mdi-subdirectory-arrow-right
                </v-icon>
              </div>
            </template>

            <!-- Task Title -->
            <template v-slot:item.title="{ item }">
              <div :class="{ 'sub-task-text': item.isChildTask }">
                {{ item.title }}
                <v-chip
                  v-if="item.task_details && item.task_details.type"
                  small
                  outlined
                  class="ml-2"
                  :class="{ 'sub-task-chip': item.isChildTask }"
                  :color="getTaskTypeColor(item.task_details.type)"
                >
                  {{ item.task_details.type }}
                </v-chip>
              </div>
            </template>

            <!-- Task Description -->
            <template v-slot:item.body="{ item }">
              <editable-note-form
                :note="item.body"
                :title="item?.name"
                :item-id="item.id"
                :loading="loading"
                :disable-edit="$auth.state.user.id !== item.sender.id"
                :disable-icon="false"
                iconSize="large"
                @update-item="updateDetails(...arguments, 'note')"
                :entity-name="$t('entity.team')"
              />
            </template>

            <!-- task Dates -->
            <template v-slot:item.start_date="{ item }">
              <ClickableDateCell
                :date="item.start_date"
                :itemId="item.id"
                :field="'start_date'"
                @date-updated="handleDateUpdate"
                disabled
              />
            </template>
            <template v-slot:item.end_date="{ item }">
              <ClickableDateCell
                :date="item.end_date"
                :itemId="item.id"
                :field="'end_date'"
                @date-updated="handleDateUpdate"
                showOverdue
                disabled
              />
            </template>
            <template v-slot:item.actual_start_date="{ item }">
              <ClickableDateCell
                :date="item.actual_start_date"
                :itemId="item.id"
                :field="'actual_start_date'"
                @date-updated="handleDateUpdate"
                :disabled="$auth.state?.user?.id !== item.receiver?.id || item.actual_start_date"
              />
            </template>
            <template v-slot:item.actual_end_date="{ item }">
              <ClickableDateCell
                :date="item.actual_end_date"
                :itemId="item.id"
                :field="'actual_end_date'"
                @date-updated="handleDateUpdate"
                :disabled="$auth.state?.user?.id !== item.receiver?.id || item.actual_end_date"
              />
            </template>

            <template v-slot:item.description="{ item }">
              <div :class="{ 'sub-task-text': item.isChildTask }">
                {{ item.description || "-" }}
              </div>
            </template>

            <!-- Task Details (Audit/AuditItem name) -->
            <template v-slot:item.task_details="{ item }">
              <div :class="{ 'sub-task-text': item.isChildTask }">
                <div v-if="item.task_details">
                  <strong>{{ item.task_details.name }}</strong>
                  <!-- <small class="text--secondary d-block">ID: {{ item.task_details.id }}</small> -->
                </div>
                <span v-else class="text--secondary">-</span>
              </div>
            </template>

            <!-- Sender (only for main tasks) -->
            <template v-slot:item.sender="{ item }">
              <div v-if="item.sender">
                <v-avatar size="24" class="mr-2">
                  <v-img v-if="item.sender.avatar" :src="getAvatarUrl(item.sender.avatar)"></v-img>
                  <!-- <v-icon v-else small>mdi-account</v-icon> -->
                </v-avatar>
                {{ item.sender.full_name || item.sender.name }}
              </div>
            </template>

            <!-- Receiver (only for main tasks) -->
            <template v-slot:item.receiver="{ item }">
              <div v-if="item.receiver">
                <v-avatar size="24" class="mr-2">
                  <v-img v-if="item.receiver.avatar" :src="getAvatarUrl(item.receiver.avatar)"></v-img>
                  <!-- <v-icon v-else small>mdi-account</v-icon> -->
                </v-avatar>
                {{ item.receiver.full_name || item.receiver.name }}
              </div>
            </template>

            <!-- Child Tasks Count -->
            <template v-slot:item.child_count="{ item }">
              <div v-if="!item.isChildTask">
                <v-chip small v-if="item.child_tasks && item.child_tasks.length > 0" color="primary" outlined>
                  {{ item.child_tasks.length }} {{ $t("table.subtasks") }}
                </v-chip>
              </div>
            </template>

            <!-- Created At -->
            <template v-slot:item.created_at="{ item }">
              <div :class="{ 'sub-task-text': item.isChildTask }">
                {{ formatDate(item.created_at) }}
              </div>
            </template>
            <template v-slot:status_slot="{ item }">
              <button-dropdown-picker
                :value="item.status?.id ?? null"
                :options="getStatuses"
                :selectedText="item.status?.name || $t('page.select_status')"
                :btnColor="item.status?.color"
                :btn-disabled="$auth.state?.user?.id !== item.receiver?.id || item.done"
                @change="(option) => updateStatus(item, option)"
              />
            </template>

            <template v-slot:item.done="{ item }">
              <div class="d-flex align-center justify-center">
                <v-switch
                  :input-value="item.done"
                  :disabled="item.done || item.sender.id !== $auth.state.user.id"
                  @change="(value) => toggleDoneConfirmation(item, value)"
                  color="primary"
                  hide-details
                  small
                  dense
                ></v-switch>
                <div class="mt-4">
                  <BooleanIndicator :value="item.done" :true-text="$t('done')" :false-text="$t('no')" />
                </div>
              </div>
            </template>
          </custom-table>
        </custom-table-wrapper>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <confirm-dialog
      v-model="showConfirmDialog"
      :title="$t('page.confirm_set_done')"
      :message="$t('page.are_you_sure_set_done')"
      :confirm-button-text="$t('page.confirm')"
      :confirm-button-color="confirmButtonColor"
      :cancel-button-text="$t('page.cancel')"
      :show-cancel-button="true"
      @confirm="confirmToggleDone"
      @cancel="cancelToggleDone"
    />
  </v-can>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import ClickableDateCell from "../../components/custom-table/ClickableDateCell.vue"
import ButtonDropdownPicker from "@/components/custom-table/ButtonDropdownPicker.vue"
import { getUsers } from "@/api/tenent-api"
import BooleanIndicator from "@/components/custom-table/BooleanIndicator.vue"
import CustomTableWrapper from "@/components/custom-table/CustomTableWrapper.vue"

export default {
  name: "myTasks",
  components: { EditableNoteForm, ClickableDateCell, ButtonDropdownPicker, BooleanIndicator, CustomTableWrapper },
  middleware: ["auth"],
  layout: "dashboard-layout",
  data() {
    return {
      tableConfig: {
        delete: this.deleteTask,
        itemPath: "/tps-tasks",
        createForm: {
          componentPath: "forms/TPSStatuseForm",
          props: { itemPath: "types", width: 500 }
        },
        editForm: {
          componentPath: "forms/TPSStatuseForm",
          props: { itemPath: "types", editForm: true, width: 500 }
        },
        permissions: {
          create: "create_tps_statusxxx",
          edit: "edit_tps_statusxxx",
          delete: "delete_tps_statusxxx"
        },
        CANS: {
          props: {
            postableType: "tps_task",
            CANSTitle: "has_tps_task",
            usersApi: () => this.getUsers(this.$axios),
            updateCount: (controlId) => {
              this.updateMessageCount(controlId)
            }
          }
        }
      },

      headers: [
        { text: "", value: "expand", sortable: false, width: "50px" },
        { text: this.$t("table.title"), value: "title", sortable: true, uncenterBody: true, cellClass: "no-wrap" },
        { text: this.$t("table.note"), value: "body", sortable: true },
        { text: this.$t("table.task_details"), value: "task_details", sortable: false, cellClass: "no-wrap" },
        { text: this.$t("table.status"), value: "status", sortable: false },
        { text: this.$t("table.sender"), value: "sender", sortable: false, cellClass: "no-wrap" },
        { text: this.$t("table.receiver"), value: "receiver", sortable: false, cellClass: "no-wrap" },
        { text: "table.start_date", value: "start_date", sortable: false },
        { text: "table.end_date", value: "end_date", sortable: false },
        { text: "table.actual_start_date", value: "actual_start_date", sortable: false },
        { text: "table.actual_end_date", value: "actual_end_date", sortable: false },
        // { text: this.$t("table.subtasks"), value: "child_count", sortable: false },
        { text: this.$t("table.created_at"), value: "created_at", sortable: true },
        {
          text: this.$t("page.done"),
          value: "done",
          sortable: false,
          tooltip: this.$t("page.done"), // optional
          icon: "mdi-check-circle" // optional
        }
        // { text: "table.actions", value: "actions", tooltip: "table.actions" }
      ],
      expandedRows: [],
      taskTypes: [],
      filters: {
        sender_id: null,
        receiver_id: this.$route.query.receiver_id || null,
        status_id: this.$route.query.status_id || null,
        taskable_type: "",
        done: 0,
        due_date: null
      },
      showConfirmDialog: false,
      selectedItem: null,
      pendingDoneValue: false,
      originalDoneValue: false,
      updatingDoneStatus: false,
      confirmMessage: "",
      confirmButtonColor: "primary"
    }
  },
  methods: {
    ...mapActions({
      fetchTasks: "tpsTasks/fetchTasks",
      deleteTask: "tpsTasks/deleteTask",
      fetchStatuses: "tpsStatuses/fetchStatuses",
      updateTask: "tpsTasks/updateTask",
      deleteTask: "tpsTasks/deleteTask",
      fetchStatuses: "tpsStatuses/fetchStatuses"
    }),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    ...mapActions("users", ["fetchUsers"]),
    getUsers,

    async fetchData() {
      await this.fetchTasks(this.filters)
      this.fetchUsers()
      await this.fetchStatuses(this.filters)
      this.taskTypes = this.getTasks
        .map((task) => task.task_details?.type)
        .filter((type) => !!type)
        .map((type) => ({
          name: type.toLowerCase(),
          value: type.toLowerCase()
        }))
    },
    async applyFilters() {
      if (!this.filters.due_date) {
        delete this.filters.due_date
      }
      await this.fetchTasks(this.filters)
    },
    toggleExpand(taskId) {
      const index = this.expandedRows.indexOf(taskId)
      if (index > -1) {
        this.expandedRows.splice(index, 1)
      } else {
        this.expandedRows.push(taskId)
      }
    },

    expandAll() {
      this.expandedRows = this.getTasks
        .filter((task) => task.child_tasks && task.child_tasks.length > 0)
        .map((task) => task.id)
    },

    collapseAll() {
      this.expandedRows = []
    },

    getStatusName(status) {
      // Handle multilingual status names
      if (typeof status.name === "object") {
        return status.name[this.$i18n.locale] || status.name.en || status.name
      }
      return status.name
    },

    getTaskTypeColor(type) {
      const colors = {
        Audit: "primary",
        AuditItem: "success",
        Policy: "warning",
        default: "grey"
      }
      return colors[type] || colors.default
    },

    getAvatarUrl(avatar) {
      // Adjust this based on your asset URL structure
      return `/storage/avatars/${avatar}`
    },

    formatDate(date) {
      if (!date) return "-"
      return new Date(date).toLocaleDateString(this.$i18n.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    },
    async updateStatus(item, option) {
      console.log("Updating task status", item, option)
      const payload = {
        ...item,
        status_id: option.id
      }
      await this.updateTask(payload)
    },
    async handleDateUpdate({ itemId, field, value }) {
      try {
        console.log("handleDateUpdate", itemId, field, value)

        // find the task by itemId in getTasks[] or getTasks[].child_tasks[]
        // if not found, return
        // if found, update the task
        const item =
          this.getTasks.find((r) => r.id === itemId) ||
          this.getTasks.flatMap((t) => t.child_tasks || []).find((r) => r.id === itemId)
        console.log("item to update", item)

        // const item = this.getTasks.find((r) => r.id === itemId)
        // console.log("item to update", item)

        if (!item) return

        const payload = {
          ...item,
          [field]: value
        }

        await this.updateTask(payload)
      } catch (error) {
        console.error(`Error updating ${field}:`, error)
        this.$toast.showMessage({
          message: error?.message || this.$t("error.update_failed"),
          status: "error"
        })
      }
    },
    async confirmToggleDone() {
      this.updatingDoneStatus = true

      try {
        // Update the item with the new done value
        const updatedItem = {
          ...this.selectedItem,
          done: this.pendingDoneValue
        }

        await this.updateTask(updatedItem)

        // Update the item locally only after successful API call
        this.selectedItem.done = this.pendingDoneValue
      } catch (error) {
        console.error("Error updating done status:", error)

        this.$toast.showMessage({
          message: error?.message || this.$t("error.update_failed"),
          status: "error"
        })
      } finally {
        this.updatingDoneStatus = false
        this.showConfirmDialog = false
        this.selectedItem = null
        this.pendingDoneValue = false
        this.originalDoneValue = false
      }
    },
    cancelToggleDone() {
      // Rollback the switch to its original position
      if (this.selectedItem) {
        this.selectedItem.done = this.originalDoneValue
      }
      this.showConfirmDialog = false
      this.selectedItem = null
      this.pendingDoneValue = false
      this.originalDoneValue = false
    },
    toggleDoneConfirmation(item, newValue) {
      this.selectedItem = item
      this.pendingDoneValue = newValue
      this.originalDoneValue = !newValue
      this.showConfirmDialog = true
    },
    updateMessageCount(controlId) {
      const control = this.displayedTasks.find((control) => control.id === controlId)
      if (control) {
        control.posts_count = control.posts_count + 1
      }
    }
  },

  computed: {
    ...mapGetters({
      getTasks: "tpsTasks/getTasks",
      loadingTasks: "tpsTasks/isLoading",
      getStatuses: "tpsStatuses/getStatuses"
    }),
    ...mapState("users", ["users"]),
    usersList() {
      return this.users.map((user) => ({ id: user.id, name: user.full_name }))
    },
    // taskTypes() {
    //   // return unique task types all small caps
    //   return Array.from(new Set(this.getTasks.map((task) => task.task_details.type))).map((type) => type.toLowerCase())
    // },
    calendarConfig() {
      return {
        events: this.getTasks,
        keyConfig: {
          name: "task_details.name",
          start: "start_date",
          end: "end_date",
          color: "status.color",
          children: "child_tasks"
        },
        defaultTimed: true,
        defaultEndDateOnly: false,
        eventNamePrefix: "calendar.due", // This will use $t("calendar.due", {name: itemName})
        defaultColor: "primary"
      }
    },
    displayedTasks() {
      let result = []

      this.getTasks.forEach((task) => {
        // Add main task
        result.push({
          ...task,
          isChildTask: false
        })

        // Add child tasks if parent is expanded
        if (this.expandedRows.includes(task.id) && task.child_tasks) {
          task.child_tasks.forEach((childTask) => {
            result.push({
              ...childTask,
              isChildTask: true,
              parentId: task.id
            })
          })
        }
      })

      return result
    },

    hasExpandableRows() {
      return this.getTasks.some((task) => task.child_tasks && task.child_tasks.length > 0)
    },
    ...mapGetters({
      getStatuses: "tpsStatuses/getStatuses"
    }),
    doneFilterData() {
      return [
        { id: 1, name: this.$t("done") },
        { id: 0, name: this.$t("active") }
      ]
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.table-fill {
  border-radius: 16px;
  overflow: hidden;
}

::v-deep(.table-fill .v-data-table) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: none !important;
  border: 1px solid #eaeaea;
}

::v-deep(.table-fill .v-data-table-header th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}

::v-deep(.table-fill thead tr th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}

::v-deep(.table-fill .v-data-table__wrapper tr) {
  height: 48px !important;
}

::v-deep(.table-fill .v-data-table__wrapper tr:hover) {
  background-color: #fafafa !important;
}

::v-deep(.table-fill td) {
  font-size: 13px;
}
</style>
