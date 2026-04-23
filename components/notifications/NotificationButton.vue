<template>
  <div>
    <v-menu :close-on-content-click="false" :nudge-width="500" offset-y transition="scale-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-badge :content="notificationCount" :value="notificationCount" color="red" overlap>
          <v-btn icon small v-bind="attrs" v-on="on">
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <div class="d-flex align-center justify-space-between">
                <v-list-item-title class="font-weight-medium">
                  {{ $t("page.notifications") }}
                </v-list-item-title>
                <v-btn text x-small color="primary" @click="toggleFilter">
                  {{ showAll ? $t("action.show_unread") : $t("action.show_all") }}
                </v-btn>
              </div>
              <v-list-item-subtitle class="text-caption" :class="showAll ? 'grey--text' : 'red--text text--darken-2'">
                {{ showAll ? $t("page.viewing_all") : $t("page.viewing_unread") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>

        <v-list class="notification-list" style="max-height: 500px; overflow-y: auto">
          <!-- Show loading spinner while data is loading -->
          <v-list-item v-if="isLoading">
            <v-list-item-content>
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-list-item-content>
          </v-list-item>

          <!-- Display notifications -->
          <v-list-item
            v-for="(notification, i) in filteredNotifications"
            :key="notification.id"
            class="notification-item"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex align-center">
                <span class="text-caption text-grey">{{ formatTime(notification.created_at) }}</span>
                <!-- Link Button -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="navigateTo(notification.url)"
                      icon
                      x-small
                      color="primary"
                      class="action-btn ml-1"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small>mdi-link</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("action.view") }}</span>
                </v-tooltip>

                <!-- Unread Indicator Text -->
                <span v-if="!notification.seen" class="ml-2 text-caption red--text text--darken-2">
                  {{ $t("page.unread") }}
                </span>

                <v-spacer></v-spacer>

                <!-- Read/Unread Toggle Button -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      x-small
                      class="action-btn"
                      @click.stop="toggleSeen(notification)"
                      :loading="notification.updating"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small :color="notification.seen ? 'grey' : 'primary'">
                        {{ notification.seen ? "mdi-eye-off" : "mdi-eye" }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ notification.seen ? $t("action.mark_unread") : $t("action.mark_read") }}</span>
                </v-tooltip>
              </v-list-item-title>

              <v-list-item-subtitle class="text-caption text-grey">
                {{ getDateTime(notification.created_at) }}
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                {{ notification.content }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Show a message if no notifications are available -->
          <v-list-item v-if="!isLoading && filteredNotifications.length === 0">
            <v-list-item-content>
              <v-list-item-title>{{ $t("page.no_notifications_message") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { formatNotificationTime, formatDateForDisplay } from "@/helpers/date-helpers"
import { formatDate } from "@/helpers/misc"

export default {
  name: "NotificationButton",
  data() {
    return {
      showAll: true
    }
  },
  computed: {
    ...mapState("notifications", ["notifications", "loading"]),
    reversedNotifications() {
      // Display most recent first without mutating store state
      return [...this.notifications].reverse()
    },
    filteredNotifications() {
      if (this.showAll) {
        return this.reversedNotifications
      }
      return this.reversedNotifications.filter((n) => !n.seen)
    },
    notificationCount() {
      const unread = this.notifications.filter((n) => !n.seen).length
      return unread > 9 ? "9+" : unread
    },
    isLoading() {
      return this.loading
    }
  },
  methods: {
    formatDate,
    ...mapActions("notifications", ["fetchNotifications", "markNotificationRead"]),
    navigateTo(path) {
      this.$router.push(path)
    },
    toggleFilter() {
      this.showAll = !this.showAll
    },
    async toggleSeen(notification) {
      if (!notification || !notification.id) return
      await this.markNotificationRead(notification.id)
    },
    formatTime(timestamp) {
      return formatNotificationTime(timestamp, (key, params) => {
        if (params && "count" in params) {
          return this.$tc(key, params.count, params)
        }
        return this.$t(key, params)
      })
    },
    getDateTime(timestamp) {
      if (!timestamp) return ""
      const formatedDate = this.formatDate(timestamp)
      return `${formatedDate.date} ${formatedDate.time}`
    }
  },
  mounted() {
    this.fetchNotifications()
  }
}
</script>

<style scoped>
.notification-list {
  max-height: 500px;
  overflow-y: auto;
}

/* Hide action buttons by default on desktop, show on hover */
/* @media (hover: hover) and (pointer: fine) {
  .notification-item .action-btn {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .notification-item:hover .action-btn {
    opacity: 1;
  }
} */

/* Always show action buttons on mobile/touch devices */
/* @media (hover: none) or (pointer: coarse) {
  .notification-item .action-btn {
    opacity: 1;
  }
} */
</style>
