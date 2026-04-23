# template section
<template>
  <v-container fluid>
    <back-btn path="/users" :tooltipText="$t('page.back_to_users_page')" />
    <v-layout v-if="!fetchUserError && !loading" column>
      <form-wrapper :title="title" @submit="submitRequest" :loading="isSubmitting || isLoadingRoles">
        <!-- Basic user information fields -->
        <custom-input
          v-for="field in formFields"
          :key="field.name"
          v-bind="field"
          v-model="field.value"
          :disabled="editForm"
          @clear-errors="clearError(field.name)"
          @input="clearError(field.name)"
        />

        <!-- User type dropdown (if applicable) -->
        <custom-dropdown
          v-if="this.$auth.user.type"
          :items="userTypesList"
          item-value="id"
          item-text="name"
          :label="$t('page.type')"
          v-model="userType"
          :required="false"
        />

        <!-- Role selection -->
        <v-radio-group v-model="selectedRoleId" @change="handleRoleChange" row>
          <custom-radio v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
        </v-radio-group>

        <!-- Global Select All Permissions -->
        <v-btn
          v-if="displayedPermissionGroups.length > 0"
          small
          outlined
          @click="toggleAllPermissions"
          :color="areAllPermissionsSelected ? 'error' : 'primary'"
          class="mb-4"
        >
          <v-icon left>
            {{ areAllPermissionsSelected ? "mdi-close-box-multiple" : "mdi-check-all" }}
          </v-icon>
          {{ $t(areAllPermissionsSelected ? "page.deselect_all" : "page.select_all") }}
        </v-btn>

        <!-- Grouped Permissions by Module -->
        <div v-for="group in displayedPermissionGroups" :key="group.moduleId || 'miscellaneous'" class="mb-4">
          <!-- Module Header -->
          <v-row align="center" class="mb-2">
            <v-col cols="auto">
              <h3 class="text-h6">{{ group.moduleName }}</h3>
            </v-col>
            <v-col cols="auto">
              <v-btn
                x-small
                outlined
                @click="toggleModulePermissions(group)"
                :color="group.allSelected ? 'error' : 'primary'"
              >
                <v-icon left small>
                  {{ group.allSelected ? "mdi-close-box-multiple" : "mdi-check-all" }}
                </v-icon>
                {{ $t(group.allSelected ? "page.deselect_all" : "page.select_all") }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- Module Permissions -->
          <div class="ml-4">
            <custom-checkbox
              v-for="permission in group.permissions"
              :key="permission.id"
              :label="permission.name"
              v-model="permission.selected"
              @input="handlePermissionToggle(permission)"
            />
          </div>
        </div>

        <v-alert v-if="permissionsError" type="error">
          {{ permissionsError }}
        </v-alert>
      </form-wrapper>
    </v-layout>

    <message-display
      v-if="fetchUserError"
      :messageTitle="fetchUserError.title"
      :messageText="fetchUserError.text"
      :code="fetchUserError.code"
    />
  </v-container>
</template>

# script section
<script>
import { getRoles } from "../../api/roles-api"
import { createUser, getUserById, changeUserRole } from "../../api/tenent-api"
import { generateErrorMessage } from "../../helpers/error-helpers"
import { objectFromFields } from "../../helpers/field-helper"
import MessageDisplay from "../MessageDisplay.vue"
import { getUserTypes } from "../../api/oss-api"
import BackBtn from "../custom-table/BackBtn.vue"

export default {
  name: "TenantUserForm",
  components: { MessageDisplay, BackBtn },
  layout: "dashboard-layout",

  props: {
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      isLoadingRoles: true,
      isSubmitting: false,
      formFields: [
        {
          name: "full_name",
          type: "text",
          icon: "",
          required: true,
          value: "",
          errors: [],
          label: this.$t("auth.full_name")
        },
        {
          name: "email",
          type: "email",
          icon: "",
          required: true,
          value: "",
          errors: [],
          label: this.$t("auth.email")
        },
        {
          name: "phone",
          type: "number",
          icon: "mdi-phone",
          required: false,
          value: "",
          errors: [],
          label: this.$t("auth.phone")
        }
      ],
      // Track permissions per role
      permissionsByRole: {},
      roles: [],
      userTypes: [],
      userType: null,
      selectedRoleId: null,
      displayedPermissionGroups: [],
      permissionsError: null,
      fetchUserError: null
    }
  },

  computed: {
    title() {
      return this.editForm
        ? `${this.$t("form.edit")} ${this.$t("form.user_permissions")}`
        : `${this.$t("form.create")} ${this.$t("form.user")}`
    },

    userTypesList() {
      return this.userTypes.map((userType) => ({
        id: userType.id,
        name: userType.title
      }))
    },

    areAllPermissionsSelected() {
      if (!this.selectedRoleId || !this.displayedPermissionGroups.length) return false
      const rolePermissions = this.permissionsByRole[this.selectedRoleId]
      return this.displayedPermissionGroups.every((group) =>
        group.permissions.every((permission) => rolePermissions.has(permission.id))
      )
    }
  },

  methods: {
    async submitRequest() {
      try {
        this.isSubmitting = true
        this.clearErrors()

        const payload = this.buildPayload()
        const userId = this.$route.params.id
        const apiCall = this.editForm ? changeUserRole : createUser

        await apiCall(payload, this.$axios, userId)
        this.$router.push(this.localePath("/users"))
      } catch (error) {
        this.handleSubmitError(error)
      } finally {
        this.isSubmitting = false
      }
    },

    buildPayload() {
      // Get permissions for the selected role only
      const selectedRolePermissions = this.permissionsByRole[this.selectedRoleId] || new Set()

      return {
        user_role_id: this.selectedRoleId,
        permissions: Array.from(selectedRolePermissions),
        orders_user_type_id: this.userType || null,
        ...objectFromFields(this.formFields)
      }
    },

    handleSubmitError(error) {
      if (error.response?.data) {
        const errorData = error.response.data.errors
        this.formFields.forEach((field) => {
          if (errorData[field.name]) {
            field.errors = errorData[field.name]
          }
        })
        if (errorData.permissions) {
          this.permissionsError = errorData.permissions[0]
        }
      } else {
        console.error(`Error ${this.editForm ? "editing" : "creating"} user:`, error)
      }
    },

    async fetchUser() {
      if (!this.editForm) return

      try {
        this.loading = true
        const userId = this.$route.params.id
        const {
          data: { data }
        } = await getUserById(userId, this.$axios)

        this.populateFormData(data)
      } catch (error) {
        console.error("Error fetching user:", error)
        this.fetchUserError = generateErrorMessage(error, this.$i18n)
      } finally {
        this.loading = false
      }
    },

    populateFormData(userData) {
      // Populate basic user information
      this.formFields = this.formFields.map((field) => ({
        ...field,
        value: userData[field.name] || ""
      }))

      // Set role and permissions only if user has a role
      if (userData.role) {
        this.selectedRoleId = userData.role.id

        // Initialize permissions for the user's role
        this.permissionsByRole[userData.role.id] = new Set(
          (userData.full_permissions || []).map((permission) => permission.id)
        )
      } else {
        // User has no role yet - leave role selection empty for admin to choose
        this.selectedRoleId = null
        console.info("User has no role assigned yet")
      }

      // Set user type if exists
      this.userType = userData.type?.id || null
    },

    async fetchRoles() {
      try {
        this.isLoadingRoles = true
        const {
          data: { data: roles }
        } = await getRoles(this.$axios)

        this.roles = roles

        // Initialize empty permission sets for all roles
        roles.forEach((role) => {
          if (!this.permissionsByRole[role.id]) {
            this.permissionsByRole[role.id] = new Set()
          }
        })

        this.updateDisplayedPermissions()
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        this.isLoadingRoles = false
      }
    },

    toggleAllPermissions() {
      if (!this.selectedRoleId) return

      const selectedRole = this.roles.find((role) => role.id === this.selectedRoleId)
      if (!selectedRole) return

      // Initialize the Set if it doesn't exist
      if (!this.permissionsByRole[this.selectedRoleId]) {
        this.permissionsByRole[this.selectedRoleId] = new Set()
      }

      // If all permissions are selected, clear them. Otherwise, select all
      if (this.areAllPermissionsSelected) {
        this.permissionsByRole[this.selectedRoleId].clear()
      } else {
        selectedRole.permissions.forEach((permission) => {
          this.permissionsByRole[this.selectedRoleId].add(permission.id)
        })
      }

      // Update the displayed permissions
      this.updateDisplayedPermissions()
    },

    toggleModulePermissions(group) {
      if (!this.selectedRoleId) return

      // Initialize the Set if it doesn't exist
      if (!this.permissionsByRole[this.selectedRoleId]) {
        this.permissionsByRole[this.selectedRoleId] = new Set()
      }

      const rolePermissions = this.permissionsByRole[this.selectedRoleId]

      if (group.allSelected) {
        // Deselect all permissions in this group
        group.permissions.forEach((permission) => {
          rolePermissions.delete(permission.id)
        })
      } else {
        // Select all permissions in this group
        group.permissions.forEach((permission) => {
          rolePermissions.add(permission.id)
        })
      }

      // Update the displayed permissions
      this.updateDisplayedPermissions()
    },

    handlePermissionToggle(permission) {
      console.log("Toggling permission:", permission)
      console.log("For role:", this.selectedRoleId)

      // Always ensure we have a valid Set for the current role
      if (!this.permissionsByRole[this.selectedRoleId]) {
        this.permissionsByRole[this.selectedRoleId] = new Set()
      }

      const rolePermissions = this.permissionsByRole[this.selectedRoleId]

      if (permission.selected) {
        rolePermissions.add(permission.id)
      } else {
        rolePermissions.delete(permission.id)
      }

      console.log("Updated permissions for role:", Array.from(rolePermissions))

      // Update the displayed permissions to refresh the module "select all" states
      this.updateDisplayedPermissions()
    },

    handleRoleChange(roleId) {
      this.selectedRoleId = roleId

      // Initialize set for new role if it doesn't exist
      if (!this.permissionsByRole[roleId]) {
        this.permissionsByRole[roleId] = new Set()
      }

      this.updateDisplayedPermissions()
      this.permissionsError = null
    },

    updateDisplayedPermissions() {
      const selectedRole = this.roles.find((role) => role.id === this.selectedRoleId)
      if (!selectedRole) return

      // Get the saved permissions for this role (if any)
      const rolePermissions = this.permissionsByRole[this.selectedRoleId] || new Set()

      // Group permissions by module
      const moduleGroups = {}
      const miscellaneousPermissions = []

      selectedRole.permissions.forEach((permission) => {
        const permissionWithSelection = {
          ...permission,
          selected: rolePermissions.has(permission.id)
        }

        if (permission.module && permission.module.id) {
          const moduleId = permission.module.id
          if (!moduleGroups[moduleId]) {
            moduleGroups[moduleId] = {
              moduleId,
              moduleName: permission.module.name,
              permissions: []
            }
          }
          moduleGroups[moduleId].permissions.push(permissionWithSelection)
        } else {
          miscellaneousPermissions.push(permissionWithSelection)
        }
      })

      // Convert to array and sort by module ID
      const sortedGroups = Object.values(moduleGroups).sort((a, b) => a.moduleId - b.moduleId)

      // Add miscellaneous group if there are any permissions without modules
      if (miscellaneousPermissions.length > 0) {
        sortedGroups.push({
          moduleId: null,
          moduleName: this.$t("page.miscellaneous"),
          permissions: miscellaneousPermissions
        })
      }

      // Add allSelected property to each group
      sortedGroups.forEach((group) => {
        group.allSelected = group.permissions.every((permission) => permission.selected)
      })

      this.displayedPermissionGroups = sortedGroups
    },

    clearErrors() {
      this.permissionsError = null
      this.formFields.forEach((field) => (field.errors = []))
    },

    clearError(field) {
      if (field === "permissions") {
        this.permissionsError = null
        return
      }

      const fieldData = this.formFields.find((attr) => attr.name === field)
      if (fieldData) {
        fieldData.errors = []
      }
    },

    async fetchUserTypes() {
      try {
        const {
          data: { data }
        } = await getUserTypes(this.$axios)
        this.userTypes = data
      } catch (error) {
        console.error("Error fetching user types:", error)
      }
    }
  },

  watch: {
    selectedRoleId: {
      immediate: true,
      handler(newRoleId) {
        if (newRoleId && this.roles.length > 0) {
          this.updateDisplayedPermissions()
        }
      }
    },
    "roles.length": {
      immediate: true,
      handler(newLength) {
        if (newLength > 0 && this.selectedRoleId) {
          this.updateDisplayedPermissions()
        }
      }
    }
  },

  async mounted() {
    await Promise.all([this.fetchUserTypes(), this.fetchRoles()])

    if (this.editForm) {
      await this.fetchUser()
    }
  }
}
</script>
