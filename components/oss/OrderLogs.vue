<template>
  <v-card flat>
    <!-- <v-card-title class="primary white--text">
      <v-icon left color="white">mdi-history</v-icon>
      Order Activity Log
    </v-card-title> -->

    <v-card-text class="pa-0">
      <!-- Loading State -->
      <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

      <!-- Empty State -->
      <v-alert v-if="!loading && logs.length === 0" type="info" text class="ma-4">
        {{ $t("page.no_order_logs") }}
      </v-alert>

      <!-- Timeline -->
      <v-timeline v-if="!loading && logs.length > 0" dense class="pa-1">
        <v-timeline-item v-for="(log, index) in logs" :key="log.id" :color="getActionColor(log.action)" small fill-dot>
          <template v-slot:icon>
            <v-icon small color="white">{{ getActionIcon(log.action) }}</v-icon>
          </template>

          <v-card elevation="1">
            <v-card-title class="text-subtitle-1 pa-1">
              <v-chip :color="getActionColor(log.action)" text-color="white" small class="mr-2">
                {{ log.action }}
              </v-chip>
              <v-spacer></v-spacer>
              <span class="text-caption grey--text">
                {{ formatDate(log.created_at) }}
              </span>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-1">
              <v-row dense>
                <!-- User who made the change -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2">mdi-account</v-icon>
                    <div>
                      <div class="text-caption grey--text">Changed By</div>
                      <div class="text-body-2 font-weight-medium">
                        {{ log.user ? log.user.full_name : "N/A" }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Sender -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2">mdi-account-arrow-right</v-icon>
                    <div>
                      <div class="text-caption grey--text">{{ $t("table.sender") }}</div>
                      <div class="text-body-2 font-weight-medium">
                        {{ log.sender ? log.sender.full_name : "N/A" }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Receiver -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2">mdi-account-arrow-left</v-icon>
                    <div>
                      <div class="text-caption grey--text">{{ $t("table.receiver") }}</div>
                      <div class="text-body-2 font-weight-medium">
                        {{ log.receiver ? log.receiver.full_name : "N/A" }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Status -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2">mdi-flag</v-icon>
                    <div>
                      <div class="text-caption grey--text">{{ $t("table.status") }}</div>
                      <div class="text-body-2 font-weight-medium">
                        <v-chip x-small :color="log.status.color" text-color="white">
                          {{ log.status ? log.status.name : "N/A" }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Priority -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <v-icon small class="mr-2">mdi-alert-circle</v-icon>
                    <div>
                      <div class="text-caption grey--text">{{ $t("table.priority") }}</div>
                      <div class="text-body-2 font-weight-medium">
                        <v-chip x-small :color="log.priority.color" text-color="white">
                          {{ log.priority ? log.priority.name : "N/A" }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <!-- Snackbar for errors -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">{{ $t("close") }}</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapActions } from "vuex"
export default {
  name: "OrderLogsComponent",

  props: {
    orderId: {
      type: [Number, String],
      required: true
    }
  },

  data() {
    return {
      logs: [],
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "error"
    }
  },

  mounted() {
    this.fetchLogs()
  },

  watch: {
    orderId(newVal) {
      if (newVal) {
        this.fetchLogs()
      }
    }
  },

  methods: {
    ...mapActions("oss", ["fetchOrderLogs"]),
    async fetchLogs() {
      this.loading = true
      try {
        const response = await this.fetchOrderLogs(this.orderId)
        console.log("orderLogs:", response)

        if (response.data.status === "success") {
          this.logs = response.data.data
        } else {
          this.showSnackbar("Failed to load order logs", "error")
        }
      } catch (error) {
        console.error("Error fetching order logs:", error)
        this.showSnackbar("Error loading order logs", "error")
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return "N/A"

      const date = new Date(dateString)

      // Format: Jan 15, 2024 - 03:30 PM
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const month = months[date.getMonth()]
      const day = date.getDate()
      const year = date.getFullYear()

      let hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, "0")
      const ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'

      return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`
    },

    getActionColor(action) {
      if (!action) return "grey"

      const actionLower = action.toLowerCase()

      if (actionLower.includes("sender")) return "blue"
      if (actionLower.includes("receiver")) return "teal"
      if (actionLower.includes("status")) return "orange"
      if (actionLower.includes("priority")) return "red"

      return "grey"
    },

    getActionIcon(action) {
      if (!action) return "mdi-information"

      const actionLower = action.toLowerCase()

      if (actionLower.includes("sender")) return "mdi-account-arrow-right"
      if (actionLower.includes("receiver")) return "mdi-account-arrow-left"
      if (actionLower.includes("status")) return "mdi-flag"
      if (actionLower.includes("priority")) return "mdi-alert-circle"

      return "mdi-pencil"
    },

    getStatusColor(status) {
      if (!status) return "grey"

      const statusName = status.name ? status.name.toLowerCase() : ""

      if (statusName.includes("progress")) return "blue"
      if (statusName.includes("replied") || statusName.includes("done")) return "green"
      if (statusName.includes("closed")) return "grey"
      if (statusName.includes("pending")) return "orange"
      if (statusName.includes("cancelled")) return "red"

      return "grey"
    },

    getPriorityColor(priority) {
      if (!priority) return "grey"

      const priorityName = priority.name ? priority.name.toLowerCase() : ""

      if (priorityName.includes("high") || priorityName.includes("urgent")) return "red"
      if (priorityName.includes("medium") || priorityName.includes("normal")) return "orange"
      if (priorityName.includes("low")) return "green"

      return "grey"
    },

    showSnackbar(text, color = "error") {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
.v-timeline-item {
  padding-bottom: 16px;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}
</style>
