<template>
  <v-menu v-model="menuState" :close-on-content-click="false" transition="scroll-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on"></div>
    </template>
    <v-list v-if="!loading">
      <user-menu-item v-for="user in users" :key="user.id" :user="user" :access="access" />
    </v-list>
    <v-list v-if="loading">
      <v-list-item>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { getUsers } from "../../api/tenent-api"
import UserMenuItem from "./UserMenuItem.vue"
export default {
  name: "UserMenu",
  components: { UserMenuItem },
  props: {
    isMenuOpen: {
      type: Boolean,
      default: false
    },
    access: { type: Object, required: true }
  },
  data() {
    return {
      loading: false,
      users: [],
      menuState: this.isMenuOpen
    }
  },
  watch: {
    isMenuOpen(val) {
      this.menuState = val
    },
    menuState(val) {
      this.$emit("update:isMenuOpen", val)
      if (val) {
        this.fetchUsers()
      }
    }
  },
  methods: {
    fetchUsers() {
      this.loading = true
      getUsers(this.$axios)
        .then((res) => {
          this.users = res.data.data
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.v-list {
  min-width: 200px;
  min-height: 300px;
}
.list-progress {
  align-content: center;
}
</style>
