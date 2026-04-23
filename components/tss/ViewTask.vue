<template>
  <v-container>
    <!-- Edit/Save/Cancel buttons -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="labels-section">
        <button-dropdown-picker
          :value="task.status?.id ?? null"
          :options="statuses"
          :selectedText="task.status?.name || $t('page.select_status')"
          :btnColor="task.status?.color"
          :btn-disabled="!canEdit"
          @change="(option) => updateStatus(task, option)"
        />
        <button-dropdown-picker
          :value="task.type?.id ?? null"
          :options="types"
          :selectedText="task.type?.name || $t('page.select_type')"
          :btnColor="task.type?.color"
          :btn-disabled="!canEdit"
          @change="(option) => updateType(task, option)"
        />
        <button-dropdown-picker
          :value="task.category?.id ?? null"
          :options="categories"
          :selectedText="task.category?.name || $t('page.select_category')"
          :btnColor="task.category?.color"
          :btn-disabled="!canEdit"
          @change="(option) => updateCategory(task, option)"
        />
        <button-dropdown-picker
          :value="task.priority?.id ?? null"
          :options="priorities"
          :selectedText="task.priority?.name || $t('page.select_priority')"
          :btnColor="task.priority?.color"
          :btn-disabled="!canEdit"
          @change="(option) => updatePriority(task, option)"
        />
      </div>
      <div>
        <v-btn v-if="!editMode" small color="primary" @click="toggleEditMode" :disabled="!canEdit">
          <v-icon small left>mdi-pencil</v-icon>
          Edit
        </v-btn>
        <div v-else>
          <v-btn small color="success" @click="saveChanges" class="mr-2" :loading="saving">
            <v-icon small left>mdi-check</v-icon>
            Save
          </v-btn>
          <v-btn small color="grey" @click="cancelEdit">
            <v-icon small left>mdi-close</v-icon>
            Cancel
          </v-btn>
        </div>
      </div>
    </div>
    <!-- Task Title -->
    <div v-if="editMode" class="mb-3">
      <strong>Task Title:</strong>
      <!-- <div v-if="!editMode">{{ task.name }}</div> -->
      <v-text-field v-model="editData.title" outlined dense hide-details class="mt-1"></v-text-field>
    </div>

    <v-divider class="ma-4"></v-divider>

    <div class="labels-section">
      <!-- <h4>Task Details</h4> -->
      <v-row>
        <!-- Assigned By -->
        <v-col cols="3" class="mb-3">
          <strong>Assigned By:</strong>
          <div v-if="!editMode">{{ task.sender.full_name }}</div>
          <div v-else-if="editMode && this.$auth.user.email !== 'haneen@tss.com'">{{ task.sender.full_name }}</div>
          <v-select
            v-if="editMode && this.$auth.user.email === 'haneen@tss.com'"
            v-model="editData.sender"
            :items="users"
            item-text="full_name"
            item-value="id"
            outlined
            dense
            hide-details
            class="mt-1"
          ></v-select>
        </v-col>

        <!-- Assigned To -->
        <v-col cols="3" class="mb-3">
          <strong>Assigned To:</strong>
          <div v-if="!editMode">{{ task.receiver.full_name }}</div>
          <v-select
            v-else
            v-model="editData.receiver"
            :items="users"
            item-text="full_name"
            item-value="id"
            outlined
            dense
            hide-details
            class="mt-1"
          ></v-select>
        </v-col>

        <!-- Project (if applicable) -->
        <v-col cols="3" v-if="task.project || editMode" class="mb-3">
          <strong>Project:</strong>
          <div v-if="!editMode">{{ task.project?.name || "No project assigned" }}</div>
          <v-select
            v-else
            v-model="editData.project"
            :items="allProjects"
            item-text="name"
            item-value="id"
            outlined
            dense
            hide-details
            clearable
            class="mt-1"
          ></v-select>
        </v-col>

        <!-- Task Code -->
        <v-col col="3" class="mb-3">
          <strong>Code:</strong>
          <div v-if="!editMode">{{ task.code }}</div>
          <v-text-field v-else v-model="editData.code" outlined dense hide-details class="mt-1"></v-text-field>
        </v-col>

        <!-- Persons Names (if applicable) -->
        <!-- <v-col cols="3" v-if="task.persons_names || editMode" class="mb-3">
          <strong>Persons Names:</strong>
          <div v-if="!editMode">{{ task.persons_names || "None specified" }}</div>
          <v-textarea v-else v-model="editData.persons_names" outlined dense hide-details class="mt-1"></v-textarea>
        </v-col> -->
      </v-row>
    </div>

    <div class="labels-section">
      <!-- Expected Date -->
      <div class="mb-2">
        <v-chip v-if="!editMode" :color="error">
          <strong class="mx-2">Expected Date:</strong>
          {{ task.date_expected }}
        </v-chip>
        <div v-else class="pa-4 mx-4">
          <strong>Expected Date:</strong>
          <v-date-picker v-model="editData.date_expected" class="mt-2"></v-date-picker>
        </div>
      </div>

      <!-- Expected Time -->
      <div v-if="task.time_expected || editMode" class="mb-2">
        <div v-if="!editMode && task.time_expected">
          <v-chip color="info">
            <strong class="mx-2">Expected Time:</strong>
            {{ task.time_expected }}
          </v-chip>
        </div>
        <div v-else-if="editMode" class="pa-4 mx-4">
          <strong>Expected Time:</strong>
          <v-time-picker v-model="editData.time_expected" class="mt-2"></v-time-picker>
        </div>
      </div>

      <!-- Start Date -->
      <v-chip v-if="!editMode" :color="orange">
        <strong class="mx-2">Start Date:</strong>
        {{ task.inprogress_date ?? "Not Started" }}
      </v-chip>
    </div>

    <v-divider class="ma-4"></v-divider>

    <div>
      <h4>Details</h4>
      <div v-if="!editMode" v-html="task.note"></div>
      <quill-editor v-else v-model="editData.note" class="mb-4" />
      <!-- <v-textarea v-else v-model="editData.note" outlined rows="6" label="Task Notes" class="mt-2"></v-textarea> -->
    </div>

    <div>
      <v-divider class="ma-4"></v-divider>
      <div class="d-flex flex-row justify-start align-center mb-2 my-4">
        <h4>Attachments</h4>
        <v-btn small icon @click="uploadAttachment" class="mx-2">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <v-row class="d-flex flex-row justify-start align-start mb-2 my-4">
        <div class="m-2 border" v-for="attachment in task.orderAttachements" :key="attachment.id">
          <v-card class="d-flex flex-column align-center justify-center mx-2">
            <file-preview :file="attachment" :size="180" />
            <v-divider class="ma-2"></v-divider>
            <v-btn icon small class="ma-2" @click="openDeleteConfirmationDialog(attachment)" color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <small class="font-weight-bold text-center">{{ attachment.name }} KB</small>
          </v-card>
          <v-divider vertical class="mx-2"></v-divider>
        </div>
      </v-row>
    </div>

    <!-- CANS - Messages -->
    <div>
      <v-divider class="ma-4"></v-divider>
      <h4>Comments</h4>
      <CollaborationAlertsNotificationSystem
        :key="task.id"
        :postable-type="'order'"
        :postable-id="task.id"
        :users-api="() => this.getUsers(this.$axios)"
        @task-updated="onUpdateTask"
      />
    </div>

    <!-- Upload Attachments Dialog -->
    <v-dialog v-model="uploadAttachmentDialog" max-width="600px">
      <template v-slot:default>
        <v-card>
          <v-card-title>Upload Attachment</v-card-title>
          <v-card-text>
            <OrdersAttachment :itemId="task.id" @upload-complete="closeAttachmentDialog" isTSS />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="uploadAttachmentDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <!-- delete confirmation dialog -->
    <confirm-dialog
      v-model="deleteConfirmationDialog"
      :title="$t('delete')"
      :message="
        $t('page.confirm_delete_message', {
          itemName: this.itemToDelete.name || 'attachment'
        })
      "
      :confirm-button-color="'red'"
      @confirm="deleteAttachment"
    ></confirm-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import OrdersAttachment from "@/components/forms/OrdersAttachment.vue"
import ButtonDropdownPicker from "@/components/custom-table/ButtonDropdownPicker.vue"
import { getUsers } from "@/api/tenent-api"
import CollaborationAlertsNotificationSystem from "../CANS/CollaborationAlertsNotificationSystem.vue"

export default {
  name: "ViewTask",
  components: {
    OrdersAttachment,
    ButtonDropdownPicker,
    CollaborationAlertsNotificationSystem
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    onUpdateTask: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      users: [],
      uploadAttachmentDialog: false,
      deleteConfirmationDialog: false,
      itemToDelete: {},
      editMode: false,
      saving: false,

      // Edit data object to hold temporary values
      editData: {
        title: "",
        note: "",
        sender: null,
        receiver: null,
        priority: null,
        category: null,
        type: null,
        project: null,
        code: "",
        date_expected: "",
        time_expected: null,
        persons_names: ""
      },

      // Original data for restoration
      building: this.task.building_id ?? null,
      period: this.task.period,
      title: this.task.name,
      note: this.task.note,
      requestFrom: this.task.sender.full_name,
      sender: this.task.sender_id,
      receiver: this.task.receiver_id,
      priority: this.task.priority.id,
      category: this.task.category.id,
      type: this.task.type.id,
      project: this.task.project?.id ?? null,
      code: this.task.code.replace(/D\d+-/, ""),
      date_expected: this.task.date_expected,
      time_expected: this.task.time_expected ?? null,
      persons_names: this.task.persons_names
    }
  },
  methods: {
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    ...mapActions("tasks", ["fetchLists"]),
    ...mapActions("oss", [
      "allOrders",
      "removeAttachment",
      "getProjects",
      "getCategories",
      "getPriorities",
      "getTypes",
      "getStatuses",
      "updateOrderStatus"
    ]),
    getUsers,

    toggleEditMode() {
      this.editMode = true
      // Copy current task data to edit data
      this.editData = {
        title: this.task.name,
        note: this.task.note,
        sender: this.task.sender_id,
        receiver: this.task.receiver_id,
        priority: this.task.priority?.id,
        category: this.task.category?.id,
        type: this.task.type?.id,
        project: this.task.project?.id ?? null,
        code: this.task.code.replace(/D\d+-/, ""),
        date_expected: this.task.date_expected,
        time_expected: this.task.time_expected ?? null,
        persons_names: this.task.persons_names
      }
    },

    cancelEdit() {
      this.editMode = false
      // Reset edit data
      this.editData = {}
    },

    async saveChanges() {
      this.saving = true
      try {
        // Prepare payload with only changed fields
        const payload = {}

        if (this.editData.title !== this.task.name) {
          payload.name = this.editData.title
        }

        if (this.editData.note !== this.task.note) {
          payload.note = this.editData.note
        }

        if (this.editData.sender !== this.task.sender_id) {
          payload.sender_id = this.editData.sender
        }
        if (this.editData.receiver !== this.task.receiver_id) {
          payload.receiver_id = this.editData.receiver
        }

        if (this.editData.code !== this.task.code.replace(/D\d+-/, "")) {
          payload.code = this.editData.code
        }

        if (this.editData.date_expected !== this.task.date_expected) {
          payload.date_expected = this.editData.date_expected
        }

        if (this.editData.time_expected !== this.task.time_expected) {
          payload.time_expected = this.editData.time_expected
        }

        if (this.editData.persons_names !== this.task.persons_names) {
          payload.persons_names = this.editData.persons_names
        }

        if (this.editData.project !== (this.task.project?.id ?? null)) {
          payload.orders_module_id = this.editData.project
        }

        // Only make API call if there are changes
        if (Object.keys(payload).length > 0) {
          const response = await this.updateOrderStatus({ id: this.task.id, payload })
          console.log("before commit")

          this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)
          console.log("after commit")
          // await this.fetchLists()
          await this.onUpdateTask(this.task.id)
        }

        this.editMode = false
        this.$emit("task-updated", "Task updated successfully")
      } catch (error) {
        console.error("Error updating task:", error)
        this.$emit("task-error", "Error updating task")
      } finally {
        this.saving = false
      }
    },

    statusColor(status) {
      switch (status) {
        case "Draft":
          return "#6c8794"
        case "Sent":
          return "info"
        case "WIP":
          return "orange"
        case "closed":
          return "error"
        case "Replied":
          return "#94c858"
        default:
          return "grey"
      }
    },
    typeColor(type) {
      switch (type) {
        case "Bug":
          return "#error"
        case "New Feature":
          return "info"
        default:
          return "grey"
      }
    },
    priorityColor(priority) {
      switch (priority) {
        case "Urgent":
          return "error"
        case "High":
          return "#ff0000"
        case "Medium":
          return "#ff9900"
        case "Low":
          return "#00ff00"
        default:
          return "grey"
      }
    },
    uploadAttachment() {
      this.uploadAttachmentDialog = true
    },
    async closeAttachmentDialog() {
      this.uploadAttachmentDialog = false
      // await this.fetchLists()
      this.onUpdateTask(this.task.id)
    },
    openDeleteConfirmationDialog(item) {
      this.itemToDelete = item
      this.deleteConfirmationDialog = true
    },
    async deleteAttachment() {
      await this.removeAttachment(this.itemToDelete.id)
      this.task.orderAttachements = this.task.orderAttachements.filter((att) => att.id !== this.itemToDelete.id)
      this.deleteConfirmationDialog = false
    },
    async updateStatus(item, newStatus) {
      // if (!this.editMode) return
      try {
        const payload = {
          orders_status_id: newStatus.id
        }
        const response = await this.updateOrderStatus({ id: item.id, payload })
        // await this.fetchLists()
        this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
    async updateType(item, newStatus) {
      // if (!this.editMode) return
      try {
        const payload = {
          orders_type_id: newStatus.id
        }
        const response = await this.updateOrderStatus({ id: item.id, payload })
        this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)
        // await this.fetchLists()
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
    async updateCategory(item, newStatus) {
      // if (!this.editMode) return
      try {
        const payload = {
          orders_category_id: newStatus.id
        }
        const response = await this.updateOrderStatus({ id: item.id, payload })
        this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)
        // await this.fetchLists()
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
    async updatePriority(item, newStatus) {
      // if (!this.editMode) return
      try {
        const payload = {
          orders_priority_id: newStatus.id
        }
        const response = await this.updateOrderStatus({ id: item.id, payload })
        console.log("Response from updatePriority:", response)

        // this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)
        this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)
        // await this.fetchLists()
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    }
  },
  computed: {
    ...mapState("oss", [
      "orders",
      "projects",
      "buildings",
      "categories",
      "priorities",
      "types",
      "statuses",
      "orderAttachements",
      "mainOrderAttachments",
      "users"
    ]),
    allProjects() {
      return this.projects.map((project) => ({ id: project.id, name: project.name } ?? null))
    },
    allusers() {
      return this.users.map((user) => ({
        id: user.id,
        name: user.full_name
      }))
    },
    canEdit() {
      if (
        this.$auth.user.id === this.task.receiver_id ||
        this.$auth.user.id === this.task.sender_id ||
        this.$auth.user.email === "haneen@tss.com"
      ) {
        return true
      } else {
        return false
      }
    }
  },

  beforeUnmount() {
    this.editMode = false
    this.task = {}
  },
  async mounted() {
    const ordersUsers = await getUsers(this.$axios)
    this.users = ordersUsers.data.data
    // await this.fetchAllPosts({ postableType: "order", postableId: this.task.id })
    await this.getProjects()
  }
}
</script>

<style scoped>
.labels-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
