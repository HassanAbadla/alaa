<template>
  <form-wrapper :submit-text="$t('page.save')" @submit="submit" :loading="submitting">
    <v-card-text>
      <custom-input v-model="title" :label="$t('form.title')" :required="true" />
      <quill-editor v-model="note" />

      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

      <v-alert v-if="error" type="error" dismissible>
        {{ error }}
      </v-alert>

      <div class="pt-3">
        <template v-if="!loading">
          <v-row>
            <v-col cols="6">
              <custom-dropdown
                :items="[requestFrom]"
                item-value="id"
                item-text="name"
                :label="$t('page.sender')"
                v-model="requestFrom"
                :required="true"
                :disabled="true"
              />

              <custom-dropdown
                :items="priorities"
                item-value="id"
                item-text="name"
                :label="$t('page.priority.title')"
                v-model="priority"
                :required="true"
              />

              <custom-dropdown
                :items="categories"
                item-value="id"
                item-text="name"
                :label="$t('page.category')"
                v-model="category"
                :required="true"
              />

              <custom-dropdown
                :items="types"
                item-value="id"
                item-text="name"
                :label="$t('page.type')"
                v-model="type"
                :required="true"
              />

              <custom-dropdown
                :items="allProjects"
                item-value="id"
                item-text="name"
                :label="$t('project_name')"
                v-model="project"
              />
              <custom-input
                v-if="$auth.user.type && $auth.user.type.code === 'tasks'"
                v-model="persons_names"
                :label="$t('client_requesting')"
                :required="true"
              />
            </v-col>
            <v-col cols="6">
              <custom-input
                v-model="unit_id"
                :label="$t('table.unit')"
                :required="false"
                :disabled="'true'"
                :errors="errors"
              />
              <custom-dropdown
                :items="filteredUsers"
                item-value="id"
                item-text="name"
                :label="$t('page.receiver')"
                v-model="receiver"
                :required="true"
              />
              <custom-input
                v-model="code"
                :label="$t('form.code')"
                :required="true"
                :disabled="$auth.user.type && $auth.user.type.code !== 'tasks'"
                @input="validateCode"
                :errors="errors"
              />

              <custom-input v-model="period" type="number" :label="$t('periiod_days')" :required="true" />

              <custom-input
                v-model="date_expected"
                type="date"
                :label="$t('expected_date')"
                :required="true"
                @input="validateDate"
                :errors="DateValidationError"
              />
              <custom-input
                v-if="$auth.user.type && $auth.user.type.code === 'tasks'"
                v-model="time_expected"
                type="time"
                :label="$t('expected_time')"
                :required="true"
              />

              <v-textarea
                v-if="$auth.user.type && $auth.user.type.code !== 'tasks'"
                v-model="persons_names"
                :label="$t('persone_names')"
                dense
                outlined
                required
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Attachments Section -->
          <v-row>
            <v-col cols="12">
              <v-divider class="my-4"></v-divider>
              <h3 class="mb-3">{{ $t("form.attachments") }}</h3>

              <!-- Add new attachment form -->
              <v-card outlined class="pa-4">
                <v-card-title class="text-h6 pa-0 mb-3">{{ $t("form.add_attachment") }}</v-card-title>

                <v-select
                  v-model="currentAttachment.selectedType"
                  :items="attachmentTypes"
                  item-text="name"
                  item-value="id"
                  :label="$t('table.type')"
                  dense
                  outlined
                ></v-select>

                <v-file-input
                  v-model="currentAttachment.file"
                  :label="$t('form.file')"
                  outlined
                  dense
                  @change="handleFileChange"
                ></v-file-input>

                <quill-editor v-model="currentAttachment.note" class="mb-4" />

                <v-checkbox v-model="currentAttachment.isValid" :label="$t('form.valid')" dense></v-checkbox>

                <v-menu
                  v-model="attachmentMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="currentAttachment.validUntil"
                      :label="$t('form.valid_until')"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="currentAttachment.validUntil" @input="attachmentMenu = false"></v-date-picker>
                </v-menu>

                <v-btn color="primary" @click="addAttachment" :disabled="!canAddAttachment" block>
                  <v-icon left>mdi-plus</v-icon>
                  {{ $t("form.add_attachment") }}
                </v-btn>

                <v-alert v-if="attachmentError" type="error" dense class="mt-3">
                  {{ attachmentError }}
                </v-alert>
              </v-card>

              <!-- Display added attachments -->
              <v-card v-for="(attachment, index) in attachments" :key="index" class="mb-3" outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="3">
                      <strong>{{ $t("table.type") }}:</strong>
                      {{ getAttachmentTypeName(attachment.attachment_type_id) }}
                    </v-col>
                    <v-col cols="3">
                      <strong>{{ $t("form.file") }}:</strong>
                      {{ attachment.file ? attachment.file.name : "" }}
                    </v-col>
                    <v-col cols="3">
                      <strong>{{ $t("form.valid") }}:</strong>
                      {{ attachment.isValid ? $t("form.yes") : $t("form.no") }}
                    </v-col>
                    <v-col cols="3" class="text-right">
                      <v-btn icon small color="error" @click="removeAttachment(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </div>
    </v-card-text>
  </form-wrapper>
</template>

<script>
import { AddOrder, getAllCategories, getAllusers, getPriorities, getTypes, getbuildings } from "../../api/oss-api"
import { getAllProjects } from "../../api/projects-api"
import { mapActions, mapState } from "vuex"
import { getUsers } from "@/api/tenent-api"

export default {
  name: "NewOrder",
  props: {
    tssColumnId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      unit_id: this.$auth.user.UserUnitPosition[0]?.position?.unit?.name ?? null,
      users: [],
      building: "",
      period: null,
      title: "",
      note: "",
      requestFrom: this.$auth.user.full_name,
      receiver: "",
      priority: "",
      category: "",
      type: "",
      project: "",
      code: "",
      date_expected: null,
      time_expected: null,
      persons_names: "",
      selectedPackages: {},
      selectedIds: [],
      loading: false,
      submitting: false,
      error: null,
      errors: [],
      DateValidationError: [],

      // Attachment related data
      attachments: [],
      currentAttachment: {
        selectedType: null,
        file: null,
        note: "",
        isValid: false,
        validUntil: null
      },
      attachmentMenu: false,
      attachmentError: null
    }
  },

  mounted() {
    this.fetchFormData()
  },

  methods: {
    ...mapActions("oss", [
      "allOrders",
      "createOrder",
      "getProjects",
      "getBuildings",
      "getCategories",
      "getPriorities",
      "getTypes",
      "getStatuses",
      "getAttachmentTypes",
      "createOrderAttachment"
    ]),
    ...mapActions("tasks", ["fetchLists", "addList", "getListsSelection"]),
    ...mapActions("drawer", ["closeDrawer"]),

    async fetchFormData() {
      try {
        const ordersUsers = await getUsers(this.$axios)
        this.users = ordersUsers.data.data
        await this.getProjects()
        await this.allOrders(this.filters)
        await this.getCategories()
        await this.getPriorities()
        await this.getTypes()
        await this.getStatuses()
        await this.getAttachmentTypes()
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    },

    handleFileChange(file) {
      this.currentAttachment.file = file
    },

    addAttachment() {
      this.attachmentError = null

      if (!this.currentAttachment.selectedType || !this.currentAttachment.file) {
        this.attachmentError = this.$t("validation.attachment_required")
        return
      }

      this.attachments.push({
        attachment_type_id: this.currentAttachment.selectedType,
        file: this.currentAttachment.file,
        note: this.currentAttachment.note,
        isValid: this.currentAttachment.isValid,
        validUntil: this.currentAttachment.validUntil
      })

      // Reset current attachment form
      this.currentAttachment = {
        selectedType: null,
        file: null,
        note: "",
        isValid: false,
        validUntil: null
      }
    },

    removeAttachment(index) {
      this.attachments.splice(index, 1)
    },

    getAttachmentTypeName(typeId) {
      const type = this.attachmentTypes.find((t) => t.id === typeId)
      return type ? type.name : ""
    },

    updateSelectedIds() {
      this.selectedIds = Object.keys(this.selectedPackages)
        .filter((id) => this.selectedPackages[id])
        .map((id) => parseInt(id))
    },

    getNextNumber(prefix) {
      const existingCodes = this.$store.state.oss.orders
        .map((order) => order.code)
        .filter((code) => code.startsWith(prefix))

      let maxNumber = 0

      existingCodes.forEach((code) => {
        const numberPart = code.substring(prefix.length)
        const number = parseInt(numberPart, 10)
        if (!isNaN(number)) {
          maxNumber = Math.max(maxNumber, number)
        }
      })

      const nextNumber = (maxNumber + 1).toString().padStart(3, "0")
      return nextNumber
    },

    validateCode(value) {
      this.errors = []
      if (this.$store.state.oss.orders.some((order) => order.code === value)) {
        this.errors.push(this.$t("validation.code_exists"))
      }
    },

    validateDate() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const selectedDate = new Date(this.date_expected)
      this.DateValidationError = []
      if (selectedDate <= today) {
        this.DateValidationError.push(this.$t("validation.future_date"))
      } else {
        return
      }
    },

    async submit() {
      try {
        this.submitting = true
        let data = {
          order_id: null,
          name: this.title,
          note: this.note,
          sender_id: this.$auth.user.id,
          receiver_id: this.receiver,
          unit_id: this.$auth.user.UserUnitPosition[0]?.position?.unit?.id ?? null,
          orders_priority_id: this.priority,
          orders_category_id: this.category,
          orders_type_id: this.type,
          orders_module_id: this.project,
          building_id: this.building,
          period: this.period,
          code: this.code,
          orders_status_id: 2,
          date_expected: this.date_expected,
          time_expected: this.time_expected,
          persons_names: this.persons_names,
          orders_list_id: this.tssColumnId ?? null
        }

        if (this.$auth.user.type.code === "tasks") {
          data.orders_status_id = 2
        }

        const createdOrder = await this.createOrder(data)

        // Upload attachments after order is created
        if (this.attachments.length > 0 && createdOrder && createdOrder.id) {
          await this.uploadAttachments(createdOrder.id)
        }

        await this.fetchLists()
        this.closeDrawer()
        this.$emit("order-submitted")
      } catch (error) {
        console.error("Error submitting order:", error)
        this.error = error.message || this.$t("error.general")
      } finally {
        this.submitting = false
      }
    },

    async uploadAttachments(orderId) {
      for (const attachment of this.attachments) {
        const formData = new FormData()
        formData.append("order_id", orderId)
        formData.append("user_id", this.$auth.user.id)
        formData.append("file", attachment.file)
        formData.append("note", attachment.note)
        formData.append("attachment_type_id", attachment.attachment_type_id)
        formData.append("valid", attachment.isValid ? 1 : 0)
        if (attachment.validUntil) {
          formData.append("valid_until", attachment.validUntil)
        }

        await this.createOrderAttachment(formData, this.$axios)
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
      "attachmentTypes"
    ]),
    ...mapState("tasks", ["listsSelection"]),

    filteredUsers() {
      if (this.$auth.user.type?.code === "owner") {
        return (
          this.users
            .filter((u) => u.type?.code === "sm")
            .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
        )
      } else if (this.$auth.user.type?.code === "sm") {
        return (
          this.users
            .filter((u) => u.type?.code.startsWith("eng"))
            .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
        )
      } else if (this.$auth.user.type?.code === "b-owner") {
        return (
          this.users
            .filter((u) => u.type?.code === "expro")
            .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
        )
      } else if (this.$auth.user.type?.code === "tasks") {
        return this.users.map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
      }
    },

    allProjects() {
      return this.projects.map((project) => ({ id: project.id, name: project.name } ?? null))
    },

    canAddAttachment() {
      return this.currentAttachment.selectedType && this.currentAttachment.file
    }
  },

  watch: {
    category: {
      handler(newCategory) {
        if (newCategory) {
          const selectedCategory = this.categories.find((cat) => cat.id === newCategory)
          if (selectedCategory) {
            const prefix = selectedCategory.code
            const nextNumber = this.getNextNumber(prefix)
            this.code = `${prefix}${nextNumber}`
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem auto;
  display: block;
}
</style>
