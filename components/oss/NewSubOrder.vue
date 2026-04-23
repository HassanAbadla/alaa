<template>
  <form-wrapper :submit-text="$t('page.save')" @submit="submit" :loading="submitting">
    <v-card-text>
      <div class="d-flex flex-row items-center justify-space-between">
        <p class="">{{ $t("table.id") }}: {{ order.id }}</p>
        <p>{{ $t("page.order") }}: {{ order.name }}</p>
        <p class="">{{ $t("form.code") }}: {{ order.code }}</p>
      </div>
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
                :items="projects"
                item-value="id"
                item-text="name"
                :label="$t('project_name')"
                v-model="project"
              />

              <custom-dropdown
                :items="buildings"
                item-value="id"
                item-text="name"
                :label="$t('building_name')"
                v-model="building"
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
                :prefix="order.code + '-'"
                @input="validateCode"
                :disabled="'true'"
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
            </v-col>
          </v-row>
        </template>
      </div>
    </v-card-text>
  </form-wrapper>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { getUsers } from "@/api/tenent-api"

export default {
  name: "NewSubOrder",

  props: {
    order: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      unit_id: this.$auth.user.UserUnitPosition[0]?.position?.unit?.name ?? null,
      users: [],
      building: this.order.building_id ?? null,
      period: this.order.period,
      title: this.order.name,
      note: this.order.note,
      requestFrom: this.$auth.user.full_name,
      receiver: "",
      priority: this.order?.priority?.id,
      category: this.order.category.id,
      type: this.order.type.id,
      project: this.order.project?.id ?? null,
      building: this.order.building_id ?? null,
      code: "",
      date_expected: this.order.date_expected,
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
    this.getNextNumber()
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
    ...mapActions("drawer", ["closeDrawer"]),

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
    validateCode(value) {
      this.errors = []
      if (this.order.children.some((child) => child.code === value)) {
        this.errors.push(this.$t("validation.code_exists"))
      }
    },
    getNextNumber() {
      // Get all existing codes
      const existingCodes = this.order.children.map((order) => order.code)

      let maxNumber = 0

      // Extract numbers from existing codes and find the maximum
      existingCodes.forEach((code) => {
        const numberPart = code.match(/\d+$/)
        if (numberPart) {
          const number = parseInt(numberPart[0], 10)
          maxNumber = Math.max(maxNumber, number)
        }
      })

      // Generate next number with padding
      const nextNumber = (maxNumber + 1).toString().padStart(3, "0")
      this.code = nextNumber
      return nextNumber
    },

    async fetchFormData() {
      try {
        const ordersUsers = await getUsers(this.$axios)
        this.users = ordersUsers.data.data
        await this.getProjects()
        await this.getBuildings()
        await this.allOrders(this.filters)
        await this.getCategories()
        await this.getPriorities()
        await this.getTypes()
        await this.getStatuses()
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    },

    updateSelectedIds() {
      this.selectedIds = Object.keys(this.selectedPackages)
        .filter((id) => this.selectedPackages[id])
        .map((id) => parseInt(id))
    },

    async submit() {
      try {
        this.submitting = true
        let data = {
          order_id: this.order.id,
          name: this.title,
          note: this.note,
          sender_id: this.$auth.user.id,
          receiver_id: this.receiver,
          unit_id: this.$auth.user.UserUnitPosition[0]?.position?.unit?.id ?? null,
          orders_priority_id: this.priority,
          orders_category_id: this.category,
          orders_type_id: this.type,
          project_id: this.project,
          building_id: this.building,
          period: this.period,
          date_expected: this.date_expected,
          code: this.code,
          orders_status_id: 2 // To Save it as a Sent
        }
        await this.createOrder(data)
        this.closeDrawer()
        this.$emit("suborder-submitted")
      } catch (error) {
        console.error("Error submitting order:", error)
      } finally {
        this.submitting = false
      }
    }
  },

  computed: {
    ...mapState("oss", ["orders", "projects", "buildings", "categories", "priorities", "types", "statuses"]),
    filteredUsers() {
      if (this.$auth.user.type.code !== "sm") {
        return (
          this.users
            .filter((u) => u.type?.code === "sm")
            .map((user) => ({ id: user.id, name: `${user.full_name} - ${user?.type?.title}` })) ?? null
        )
      } else if (this.$auth.user.type.code === "sm") {
        return (
          this.users
            .filter((u) => u.type?.code.startsWith("eng"))
            .map((user) => ({ id: user.id, name: `${user.full_name} - ${user?.type?.title}` })) ?? null
        )
      }
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
