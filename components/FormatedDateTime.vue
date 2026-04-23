<template>
  <div v-if="date" class="d-flex align-center">
    <span :class="{ 'expired-date': isExpired && showExpired }">
      {{ formatDate(date).date }}
      <span v-if="!hideTime">{{ formatDate(date).time }}</span>
    </span>
    <v-tooltip v-if="showExpired && isExpired" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon small color="error" class="ml-1" v-bind="attrs" v-on="on">mdi-calendar-alert</v-icon>
      </template>
      <span>{{ $t("page.expired") }}</span>
    </v-tooltip>
  </div>
  <div v-else class="text-center">---</div>
</template>

<script>
import { formatDate } from "../helpers/misc"

export default {
  name: "FormatedDateTime",
  props: {
    date: {
      type: [Date, String],
      required: true
    },
    hideTime: {
      type: Boolean,
      default: false
    },
    showExpired: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isExpired() {
      if (!this.date) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const validDate = new Date(this.date)
      validDate.setHours(0, 0, 0, 0)

      return validDate <= today
    }
  },
  methods: {
    formatDate
  }
}
</script>

<style scoped>
.expired-date {
  color: #ff5252; /* You can use Vuetify's error color: var(--v-error-base) if available */
}
</style>
