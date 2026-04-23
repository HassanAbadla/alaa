<template>
  <div v-if="users?.length > 0">
    <v-chip v-for="user in displayedUsers" :key="user.id" color="secondary" text-color="white" class="mr-1 mb-1">
      <v-avatar left size="24">
        <v-img v-if="user.avatar" :src="user.avatar" alt="User Avatar"></v-img>
        <v-avatar v-else color="secondary darken-2" size="24">
          <span class="white--text caption">{{ getInitials(user.full_name) }}</span>
        </v-avatar>
      </v-avatar>
      {{ user.full_name }}
    </v-chip>
    <v-chip
      v-if="users.length > maxDisplayed"
      @click="toggleShowAll"
      outlined
      color="secondary darken-2"
      text-color="secondary"
      class="mr-1 mb-1"
    >
      <span class="font-weight-medium">{{ showAll ? $t("page.show_less") : `+${users.length - maxDisplayed}` }}</span>
    </v-chip>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: "TaggedUsers",
  props: {
    users: {
      type: Array,
      default: () => []
    },
    maxDisplayed: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      showAll: false
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    displayedUsers() {
      return this.showAll ? this.users : this.users.slice(0, this.maxDisplayed)
    }
  },
  methods: {
    getInitials(name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    },
    toggleShowAll() {
      this.showAll = !this.showAll
    }
  }
}
</script>

<style scoped></style>
