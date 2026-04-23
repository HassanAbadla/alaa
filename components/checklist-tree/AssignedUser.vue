<template>
  <div class="d-flex align-center">
    <v-menu v-model="showDropdown" :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-can disable-only :permission="'assign_user_to_stage'">
          <template #default="{ disabled }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="handleButtonClick"
              :loading="fetchingUsers || isSubmitting"
              :disabled="disabled"
              small
            >
              {{ alreadyAssigned() ? $t("page.change_assigned_user") : $t("page.assign_user") }}
            </v-btn>
          </template>
        </v-can>
      </template>
      <v-list>
        <v-list-item v-for="user in users" :key="user.id" @click="handleUserSelect(user.id)">
          <v-list-item-title>{{ user.full_name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <span v-if="assignedUser" class="ml-3 body-2">{{ $t("page.completed_by") }}: {{ assignedUser }}</span>
  </div>
</template>

<script>
import { assignUser } from "../../api/checklists-api"
import { getUsers } from "../../api/tenent-api"
import VCan from "../VCan.vue"

export default {
  components: { VCan },
  name: "AssignedUser",
  props: {
    checklistId: { type: Number, required: true },
    currentAssinedUser: { type: Object, default: null }
  },
  data() {
    return {
      fetchingUsers: false,
      isSubmitting: false,
      users: null,
      showDropdown: false,
      updatedAssignedUser: null
    }
  },
  computed: {
    assignedUser() {
      const user = this.alreadyAssigned()
      return user?.full_name
    }
  },
  methods: {
    alreadyAssigned() {
      console.log(this.updatedAssignedUser, this.currentAssinedUser)
      return this.updatedAssignedUser || this.currentAssinedUser
    },
    handleButtonClick() {
      this.fetchUsers()
    },
    fetchUsers() {
      this.fetchingUsers = true
      getUsers(this.$axios)
        .then((res) => {
          this.users = res.data.data
          console.log(this.users)
        })
        .catch((error) => {
          console.error("Error fetching users:", error)
        })
        .finally(() => {
          this.fetchingUsers = false
        })
    },
    handleUserSelect(userId) {
      this.submitUser(userId)
      this.showDropdown = false
    },
    submitUser(userId) {
      this.isSubmitting = true
      const payload = { user_id: userId }
      assignUser(this.checklistId, payload, this.$axios)
        .then((response) => {
          this.updatedAssignedUser = response.data.data.assigned
          this.$emit("update:assigned", this.updatedAssignedUser)
        })
        .catch((error) => {
          console.error("Error assigning user:", error)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>
