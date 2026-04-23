<template>
  <form-wrapper :submit-text="$t('form.save')" @submit="submit" :loading="submitting">
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
                v-if="$auth.user.type && $auth.user.type.code !== 'tasks'"
                :items="[requestFrom]"
                item-value="id"
                item-text="name"
                :label="$t('page.sender')"
                v-model="requestFrom"
                :required="true"
              />
              <custom-dropdown
                v-if="$auth.user.type && $auth.user.type.code === 'tasks'"
                :items="filteredUsers"
                item-value="id"
                item-text="name"
                :label="$t('page.sender')"
                v-model="requestFrom"
                :required="true"
                :disabled="this.$auth.user.email !== 'haneen@tss.com'"
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
                :required="false"
              />

              <custom-dropdown
                v-if="$auth.user.type && $auth.user.type.code !== 'tasks'"
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
                :disabled="$auth.user.type && $auth.user.type.code !== 'tasks'"
                :prefix="item.order_id !== null ? `${mainOrderCode + '-'}` : ''"
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
                v-if="$auth.user.type.code === 'tasks'"
                v-model="time_expected"
                type="time"
                :label="$t('expected_time')"
                :required="true"
              />
              <!-- <v-textarea v-model="persons_names" :label="$t('persone_names')" dense outlined required></v-textarea> -->
            </v-col>
          </v-row>
        </template>
      </div>

      <!-- <v-alert v-if="!loading && subscriptionPackages.length === 0" type="info">
        {{ $t("error.no_packages_available") }}
      </v-alert> -->
    </v-card-text>
  </form-wrapper>
</template>

<script>
import { getAllCategories, getAllusers, getPriorities, getTypes, getbuildings } from "../../api/oss-api"
import { getAllProjects } from "../../api/projects-api"
import { mapActions, mapState } from "vuex"
import { getUsers } from "@/api/tenent-api"

export default {
  name: "EditOrder",
  props: {
    itemId: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    mainOrderCode: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      unit_id: this.item?.unit?.name ?? null,
      users: [],
      // subscriptionPackages: [ 1, 2, 3 ],
      // projects: [],
      // buildings: [],
      // categories: [],
      // priorities: [],
      // types: [],
      building: this.item.building_id ?? null,
      period: this.item.period,
      title: this.item.name,
      note: this.item.note,
      // requestFrom: this.item.sender.full_name,
      requestFrom: this.item.sender_id,
      receiver: this.item.receiver_id,
      priority: this.item.priority.id,
      category: this.item.category.id,
      type: this.item.type.id,
      project: this.item.project?.id ?? null,
      code: this.item.code.replace(/D\d+-/, ""),
      date_expected: this.item.date_expected,
      time_expected: this.item.time_expected ?? null,
      persons_names: this.item.persons_names ?? "",
      selectedIds: [],
      loading: false,
      submitting: false,
      error: null,
      codePrefix: this.item.code,
      DateValidationError: []
    }
  },

  mounted() {
    this.fetchFormData()
  },

  methods: {
    ...mapActions("oss", [
      "updateOrder",
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
    async fetchFormData() {
      try {
        const ordersUsers = await getUsers(this.$axios)
        this.users = ordersUsers.data.data
        // await this.getBuildings()
        await this.getProjects()
        await this.getCategories()
        await this.getPriorities()
        await this.getTypes()
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
          order_id: null,
          name: this.title,
          note: this.note,
          sender_id: this.requestFrom,
          receiver_id: this.receiver,
          orders_priority_id: this.priority,
          orders_category_id: this.category,
          orders_type_id: this.type,
          orders_module_id: this.project,
          building_id: this.building,
          code: this.code,
          date_expected: this.date_expected,
          time_expected: this.time_expected,
          period: this.period,
          persons_names: this.persons_names
        }
        const response = await this.updateOrder({ id: this.item.id, payload: data })
        console.log("Order updated successfully:", response)
        this.$store.commit("tasks/UPDATE_TASK", response)
        this.$store.commit("tasks/UPDATE_FILTERED_TASK", response)

        this.closeDrawer()
        this.$emit("update-submitted")
      } catch (error) {
        console.error("Error submitting order:", error)
      } finally {
        this.submitting = false
        this.$emit("submission-success")
      }
    }
  },

  computed: {
    ...mapState("oss", ["orders", "projects", "buildings", "categories", "priorities", "types", "statuses"]),
    filteredUsers() {
      if (this.$auth.user.type?.code === "owner") {
        return (
          this.users
            .filter((u) => u.type?.code === "sm")
            .map((user) => ({ id: user.id, name: user.full_name } ?? null)) || null
        )
      } else if (this.$auth.user.type?.code === "sm") {
        return (
          this.users
            .filter((u) => u.type?.code.startsWith("eng"))
            .map((user) => ({ id: user.id, name: user.full_name } ?? null)) || null
        )
      } else if (this.$auth.user.type?.code === "b-owner") {
        return (
          this.users
            .filter((u) => u.type?.code === "owner")
            .map((user) => ({ id: user.id, name: user.full_name } ?? null)) || null
        )
      } else if (this.$auth.user.type?.code === "tasks") {
        return this.users.map((user) => ({ id: user.id, name: user.full_name } ?? null))
      } else if (this.$auth.user.type?.code === "expro") {
        return (
          this.users
            .filter((u) => u.type?.code === "owner" || u.type?.code === "finance")
            .map((user) => ({ id: user.id, name: user.full_name } ?? null)) || null
        )
      }
    },

    allProjects() {
      return this.projects.map((project) => ({ id: project.id, name: project.name } ?? null))
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
