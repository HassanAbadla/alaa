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

              <v-textarea v-model="persons_names" :label="$t('persone_names')" dense outlined required></v-textarea>
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
      // projects: [],
      // buildings: [],
      // categories: [],
      // priorities: [],
      // types: [],
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
      DateValidationError: []
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
      "getStatuses"
    ]),
    ...mapActions("tasks", ["fetchLists", "addList", "getListsSelection"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async fetchFormData() {
      try {
        const ordersUsers = await getUsers(this.$axios)
        this.users = ordersUsers.data.data
        await this.getProjects()
        // if user type is not tasks, fetch buildings
        // if (this.$auth.user.type.code !== "tasks") {
        //   await this.getBuildings()
        // }
        await this.allOrders(this.filters)
        await this.getCategories()
        await this.getPriorities()
        await this.getTypes()
        await this.getStatuses()
        // this.tssColumnId ? await this.getListsSelection() : null
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    },

    updateSelectedIds() {
      this.selectedIds = Object.keys(this.selectedPackages)
        .filter((id) => this.selectedPackages[id])
        .map((id) => parseInt(id))
    },
    getNextNumber(prefix) {
      // Get all existing codes that start with this prefix
      const existingCodes = this.$store.state.oss.orders
        .map((order) => order.code)
        .filter((code) => code.startsWith(prefix))

      let maxNumber = 0

      // Extract numbers from existing codes and find the maximum
      existingCodes.forEach((code) => {
        // Remove the prefix and get only the remaining digits
        const numberPart = code.substring(prefix.length)
        const number = parseInt(numberPart, 10)
        if (!isNaN(number)) {
          maxNumber = Math.max(maxNumber, number)
        }
      })

      // Generate next number with padding
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
      today.setHours(0, 0, 0, 0) // Set time to midnight for accurate date comparison

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
        await this.createOrder(data)
        await this.fetchLists()
        // if (this.$auth.user.type.code === "tasks") {
        // }
        this.closeDrawer()
        this.$emit("order-submitted")
      } catch (error) {
        console.error("Error submitting order:", error)
      } finally {
        this.submitting = false
      }
    }
  },

  computed: {
    ...mapState("oss", ["orders", "projects", "buildings", "categories", "priorities", "types", "statuses"]),
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
    }
  },
  // watch: {
  //   category: {
  //     handler(newCategory) {
  //       if (newCategory) {
  //         const selectedCategory = this.categories.find((cat) => cat.id === newCategory)
  //         if (selectedCategory) {
  //           const prefix = selectedCategory.code
  //           const nextNumber = this.getNextNumber()
  //           this.code = `${prefix}${nextNumber}`
  //         }
  //       }
  //     },
  //     immediate: true
  //   }
  // }
  watch: {
    category: {
      handler(newCategory) {
        if (newCategory) {
          const selectedCategory = this.categories.find((cat) => cat.id === newCategory)
          if (selectedCategory) {
            const prefix = selectedCategory.code
            const nextNumber = this.getNextNumber(prefix) // Pass prefix here
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
