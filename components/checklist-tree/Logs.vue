<template>
  <div>
    <v-can disable-only :permission="'view_stage_logs'">
      <template #default="{ disabled }">
        <v-btn :loading="fetchingLogs" :disabled="disabled" @click="toggleLogs" color="primary" small>
          {{ showLogs ? $t("page.hide_logs") : $t("page.logs") }}
        </v-btn>
      </template>
    </v-can>

    <v-expand-transition>
      <v-card v-if="showLogs" class="mt-4" flat>
        <v-card-text v-if="sortedLogs.length">
          <v-list dense>
            <v-list-item v-for="log in sortedLogs" :key="log.created_at">
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center">
                  <v-icon :color="getLogColor(log.content)" class="mr-2">mdi-circle-small</v-icon>
                  <span class="body-2">{{ log.content }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span class="caption">{{ log.user.full_name }} - {{ formatDate(log.created_at) }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-text v-else>
          <v-alert type="info" text>{{ $t("page.no_logs_available") }}</v-alert>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
import { getChecklistLogs } from "../../api/checklists-api"
import VCan from "../VCan.vue"

export default {
  components: { VCan },
  name: "Logs",
  props: {
    id: { type: Number, required: true },
    dialogOpen: { type: Boolean, default: false }
  },
  data() {
    return {
      showLogs: false,
      fetchingLogs: false,
      logs: []
    }
  },
  computed: {
    sortedLogs() {
      return [...this.logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },
  watch: {
    dialogOpen(newValue) {
      if (!newValue) {
        this.showLogs = false
      }
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    },
    toggleLogs() {
      if (!this.showLogs) {
        this.fetchingLogs = true
        getChecklistLogs(this.id, this.$axios)
          .then((res) => {
            this.logs = res.data.data
            this.showLogs = true
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.fetchingLogs = false
          })
      } else {
        this.showLogs = false
      }
    },
    resetShowLogs() {
      this.showLogs = false
    },
    getLogColor(content) {
      if (content.includes("deleted")) return "error"
      if (content.includes("assigned")) return "primary"
      if (content.includes("attached")) return "success"

      return "grey"
    }
  }
}
</script>
