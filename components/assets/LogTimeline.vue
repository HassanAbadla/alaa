<template>
  <v-card flat dense>
    <v-card-title>
      <span class="text-h6">{{ $t("page.activity_logs") }}</span>
    </v-card-title>
    <v-card-text>
      <v-timeline v-if="logs.length > 0" dense align-top>
        <v-timeline-item v-for="log in logs" :key="log.id" small color="primary">
          <template v-slot:opposite>
            <span class="text-caption grey--text">
              {{ formatDate(log.created_at).date }}
            </span>
          </template>
          <v-card class="elevation-2">
            <v-card-text>
              <div class="text-body-2">{{ log.content }}</div>
              <div class="text-caption grey--text mt-1">
                {{ formatDate(log.created_at).date }} - {{ formatDate(log.created_at).time }}
              </div>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <div v-else class="text-center py-4 grey--text">{{ $t("page.no_logs") }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { formatDate } from "../../helpers/misc"
export default {
  name: "LogTimeline",
  props: {
    logs: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    formatDate
  }
}
</script>

<style scoped>
.v-timeline-item {
  padding-bottom: 24px;
}
</style>
