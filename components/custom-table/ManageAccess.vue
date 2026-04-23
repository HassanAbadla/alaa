<template>
  <!-- <user-menu :isMenuOpen="isMenuOpen" :access="access" /> -->
  <v-menu max-height="400px" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex align-center">
        <v-can disable-only :permission="tableConfig.permissions.dataAccess">
          <template #default="{ disabled }">
            <v-btn x-small icon :disabled="disabled" class="mx-2" v-bind="attrs" v-on="on" @click="fetchUsers">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-can>
        <users-with-access :users="usersWithAccess" />
      </div>
    </template>
    <v-list dense v-if="users">
      <v-list-item v-for="user in computedUsers" :key="user.id">
        <v-list-item-avatar>
          <custom-avatar
            :name="user.full_name"
            :image="user.avatar"
            :borderColor="user.access_icon.color"
            :bgColor="user.access_icon.color"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-capitalize">
            {{ user.full_name }}
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" x-small :color="user.access_icon.color">
                  {{ user.access_icon.icon }}
                </v-icon>
              </template>
              <span>{{ user.access_icon.text }}</span>
            </v-tooltip>
          </v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <template v-if="user.has_access">
          <div>
            <access-icon v-if="!user.full_access" access-type="full" @click="access.give(user.id, true)" />
            <access-icon v-if="user.full_access" access-type="partial" @click="access.give(user.id, false)" />
            <access-icon @click="access.remove(user.id)" />
          </div>
        </template>
        <template v-else>
          <access-icon access-type="full" @click="access.give(user.id, true)" />
          <access-icon access-type="partial" @click="access.give(user.id, false)" />
        </template>
      </v-list-item>
    </v-list>
    <v-progress-linear v-else indeterminate color="primary"></v-progress-linear>
  </v-menu>
</template>

<script>
import { getUsers, giveDataAccess, removeDataAccess } from "../../api/tenent-api"
import VCan from "../VCan.vue"
import CustomAvatar from "../profile/CustomAvatar.vue"
import AccessIcon from "./AccessIcon.vue"
import UserMenu from "./UserMenu.vue"
import UsersWithAccess from "./UsersWithAccess.vue"

export default {
  name: "ManageAccess",
  components: { UserMenu, UsersWithAccess, AccessIcon, VCan, CustomAvatar },
  props: {
    tableConfig: { type: Object, required: true },
    accessibleId: { type: Number, required: true },
    usersWithAccess: { type: Array, required: true }
  },
  data() {
    return {
      users: null,
      fetchingUsers: false,
      access: {
        give: this.giveAccess,
        remove: this.removeAccess,
        users: this.usersWithAccess
      }
    }
  },
  computed: {
    computedUsers() {
      const icon = {
        no: { icon: "mdi-close-circle", color: "red", text: this.$t("page.no_access") },
        full: { icon: "mdi-circle-slice-8", color: "green", text: this.$t("page.full_access") },
        partial: { icon: "mdi-circle-slice-3", color: "orange", text: this.$t("page.partial_access") }
      }

      const updatedUsers = this.users.map((user) => {
        const foundUser = this.usersWithAccess.find((userWithAccess) => {
          return userWithAccess.user_id === user.id
        })
        const accessIcon = !Boolean(foundUser) ? icon.no : foundUser.full_access ? icon.full : icon.partial
        return {
          ...user,
          has_access: Boolean(foundUser),
          full_access: foundUser ? foundUser.full_access : null,
          access_icon: accessIcon
        }
      })
      return updatedUsers
    }
  },
  methods: {
    fetchUsers() {
      if (this.users) return
      this.fetchingUsers = true
      getUsers(this.$axios)
        .then((res) => {
          this.users = res.data.data
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.fetchingUsers = false
        })
    },

    giveAccess(userId, fullAccess) {
      const payload = {
        accessible_id: this.accessibleId,
        accessible_type: this.tableConfig.dataAccess.accessibleType,
        user_id: userId,
        full_access: fullAccess
      }
      giveDataAccess(payload, this.$axios)
        .then((res) => {
          const updatedUser = res.data.data
          this.tableConfig.dataAccess.update({ itemId: this.accessibleId, updatedUser })
          // const userIndex = this.usersWithAccess.findIndex((user) => user.user_id === updatedUser.user_id)

          // if (userIndex !== -1) {
          //   this.$set(this.usersWithAccess, userIndex, updatedUser)
          // } else {
          //   this.usersWithAccess.push(updatedUser)
          // }
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    removeAccess(userId) {
      const payload = {
        accessible_id: this.accessibleId,
        accessible_type: this.tableConfig.dataAccess.accessibleType,
        user_id: userId
      }
      removeDataAccess(payload, this.$axios)
        .then(() => {
          this.tableConfig.dataAccess.remove({ itemId: this.accessibleId, userId })
          // const userIndex = this.usersWithAccess.findIndex((user) => user.user_id === userId)
          // if (userIndex !== -1) {
          //   // skipcq: JS-0611
          //   this.usersWithAccess.splice(userIndex, 1)
          // }
        })
        .catch((error) => {
          console.log(error.response)
        })
    }
  }
}
</script>
