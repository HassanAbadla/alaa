<template>
  <v-container>
    <div class="labels-section">
      <button-dropdown-picker
        :value="task.status?.id ?? null"
        :options="statuses"
        :selectedText="task.status?.name || $t('page.select_status')"
        :btnColor="task.status?.color"
        :btn-disabled="disabled"
        @change="(option) => updateStatus(task, option)"
      />
      <button-dropdown-picker
        :value="task.type?.id ?? null"
        :options="types"
        :selectedText="task.type?.name || $t('page.select_type')"
        :btnColor="task.type?.color"
        :btn-disabled="disabled"
        @change="(option) => updateType(task, option)"
      />
      <button-dropdown-picker
        :value="task.category?.id ?? null"
        :options="categories"
        :selectedText="task.category?.name || $t('page.select_category')"
        :btnColor="task.category?.color"
        :btn-disabled="disabled"
        @change="(option) => updateCategory(task, option)"
      />
      <button-dropdown-picker
        :value="task.priority?.id ?? null"
        :options="priorities"
        :selectedText="task.priority?.name || $t('page.select_priority')"
        :btnColor="task.priority?.color"
        :btn-disabled="disabled"
        @change="(option) => updatePriority(task, option)"
      />
      <!-- <v-chip :color="statusColor(task.status.name)">{{ task.status.name }}</v-chip>
      <v-chip :color="typeColor(task.type.name)">{{ task.type.name }}</v-chip>
      <v-chip :color="priorityColor(task.priority.name)">{{ task.priority.name }}</v-chip> -->

      <!-- <p>
        <strong>Task Due Date:</strong>
        {{ task.date_expected }}
      </p> -->
    </div>
    <v-divider class="ma-4"></v-divider>
    <div class="labels-section">
      <h4>Task Details</h4>
      <p>
        <strong>Assigned To:</strong>
        {{ task.receiver.full_name }}
      </p>
      <p>
        <strong>Assigned By:</strong>
        {{ task.sender.full_name }}
      </p>
    </div>
    <div class="labels-section">
      <v-chip :color="error">
        <strong class="mx-2">Expected Date:</strong>
        {{ task.date_expected }}
      </v-chip>
      <v-chip :color="orange">
        <strong class="mx-2">Start Date:</strong>
        {{ task.inprogress_date ?? "Not Started" }}
      </v-chip>
    </div>

    <v-divider class="ma-4"></v-divider>

    <div>
      <h4>Task Details</h4>
      <div v-html="task.note"></div>
    </div>
    <div>
      <v-divider class="ma-4"></v-divider>
      <v-row class="d-flex flex-row justify-start align-start mb-2 my-4">
        <h4>Attachments</h4>
        <v-btn small icon @click="uploadAttachment" class="mx-2">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
      <v-row class="d-flex flex-row justify-start align-start mb-2 my-4">
        <div class="m-2 border" v-for="attachment in task.orderAttachements" :key="attachment.id">
          <v-card class="d-flex flex-column align-center justify-center mx-2">
            <file-preview :file="attachment" :size="180" />
            <v-divider class="ma-2"></v-divider>
            <v-btn icon small class="ma-2" @click="openDeleteConfirmationDialog(attachment)" color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <small class="font-weight-bold text-center">{{ attachment.name }} KB</small>
            <!-- <small class="font-weight-bold text-center">{{ (attachment.size * 1024).toFixed(2) }} KB</small> -->
          </v-card>
          <v-divider vertical class="mx-2"></v-divider>
        </div>
      </v-row>
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
    <!-- <custom-dialog v-model="uploadAttachmentDialog" :title="$t('form.add_attachment')" @close-dialog="resetFormData">
      <OrdersAttachment :itemId="task.id" />
    </custom-dialog> -->
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import OrdersAttachment from "@/components/forms/OrdersAttachment.vue"
import ButtonDropdownPicker from "@/components/custom-table/ButtonDropdownPicker.vue"
export default {
  name: "ViewTask",
  components: {
    OrdersAttachment,
    ButtonDropdownPicker
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
      uploadAttachmentDialog: false,
      deleteConfirmationDialog: false,
      itemToDelete: {},

      building: this.task.building_id ?? null,
      period: this.task.period,
      title: this.task.name,
      note: this.task.note,
      requestFrom: this.task.sender.full_name,
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
      "getUsers",
      "removeAttachment",
      "getProjects",
      "getCategories",
      "getPriorities",
      "getTypes",
      "getStatuses",
      "updateOrderStatus"
    ]),
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
      await this.fetchLists()
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
      try {
        const payload = {
          orders_status_id: newStatus.id
        }
        await this.updateOrderStatus({ id: item.id, payload })
        await this.fetchLists()
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
    async updateType(item, newStatus) {
      try {
        const payload = {
          orders_type_id: newStatus.id
        }
        await this.updateOrderStatus({ id: item.id, payload })
        await this.fetchLists()
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
    async updateCategory(item, newStatus) {
      try {
        const payload = {
          orders_category_id: newStatus.id
        }
        await this.updateOrderStatus({ id: item.id, payload })
        await this.fetchLists()
        await this.onUpdateTask(this.task.id)
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },
    async updatePriority(item, newStatus) {
      try {
        const payload = {
          orders_priority_id: newStatus.id
        }
        await this.updateOrderStatus({ id: item.id, payload })
        await this.fetchLists()
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
      "mainOrderAttachments"
    ])
  },
  mounted() {}
}
</script>

<style scoped>
.labels-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
