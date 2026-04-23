# UsersWithAccess.vue
<template>
  <div class="users-list-container">
    <div class="users-scroll-container" ref="scrollContainer" @wheel.prevent="handleWheel">
      <v-tooltip v-for="user in users" :key="user.id" bottom>
        <template v-slot:activator="{ on, attrs }">
          <div class="avatar-wrapper" v-bind="attrs" v-on="on">
            <custom-avatar :bgColor="getUserColor(user)" :name="user.user" :image="user.avatar" :size="32" />
          </div>
        </template>
        <span>{{ user.user }} ({{ user.full_access ? "Full" : "Partial" }} Access)</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import CustomAvatar from "../profile/CustomAvatar.vue"

export default {
  components: { CustomAvatar },
  name: "UsersWithAccess",

  props: {
    users: {
      type: Array,
      required: true
    }
  },

  methods: {
    getUserColor(user) {
      return user.full_access ? "green" : "orange"
    },

    handleWheel(event) {
      const container = this.$refs.scrollContainer
      container.scrollLeft += event.deltaY
    }
  }
}
</script>

<style scoped>
.users-list-container {
  position: relative;
  max-width: 150px;
  overflow: hidden;
}

.users-scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* padding: 4px 0; */
  /* gap: 4px; Add space between avatars */
}

.users-scroll-container::-webkit-scrollbar {
  display: none;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
