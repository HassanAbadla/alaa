<template>
  <v-list-item>
    <v-list-item-content>
      <nuxt-link :to="localePath(`/users/${user.id}`)">
        <v-list-item-title :class="userClass">
          {{ user.full_name }}
        </v-list-item-title>
      </nuxt-link>
    </v-list-item-content>
    <v-list-item-icon class="cursor-pointer">
      <template v-if="userAccess">
        <v-btn v-if="!userAccess.full_access" @click="access.give(user.id, true)">Give Full</v-btn>
        <v-btn v-if="userAccess.full_access" @click="access.give(user.id, false)">Give Partial</v-btn>
        <v-btn @click="access.remove(user.id)">Deny</v-btn>
      </template>
      <template v-else>
        <v-btn @click="access.give(user.id, true)">Give Full</v-btn>
        <v-btn @click="access.give(user.id, false)">Give Partial</v-btn>
      </template>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  name: "UserMenuItem",
  props: {
    user: { type: Object, required: true },
    access: { type: Object, required: true }
  },
  computed: {
    userAccess() {
      return this.access.users.find((u) => u.user_id === this.user.id)
    },
    userClass() {
      if (this.userAccess) {
        return this.userAccess.full_access ? "full-access" : "partial-access"
      }
      return ""
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.full-access {
  color: green;
}
.partial-access {
  color: yellow;
}
</style>
