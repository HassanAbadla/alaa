<template>
  <div class="">
    <v-row class="pa-8 small-list">
      <v-col cols="9">
        <p class="">
          {{ $t("table.code") }}:
          <span class="font-weight-bold">{{ selectedOrder?.code }}</span>
        </p>
        <p>
          {{ $t("table.title") }}:
          <span class="font-weight-bold">{{ selectedOrder?.name }}</span>
        </p>
        <p>
          {{ $t("table.sender") }}:
          <span class="font-weight-bold">{{ selectedOrder?.sender.full_name }}</span>
        </p>
        <p>
          {{ $t("table.receiver") }}:
          <span class="font-weight-bold">{{ selectedOrder?.receiver.full_name }}</span>
        </p>
      </v-col>
      <v-col cols="3" class="px-2 borders">
        <p>
          {{ $t("table.created_at") }}:
          <span class="font-weight-bold">
            {{ selectedOrder?.created_at ? new Date(selectedOrder.created_at).toISOString().split("T")[0] : "" }}
          </span>
        </p>
        <p>
          {{ $t("table.expected_date") }}:
          <span class="font-weight-bold">{{ selectedOrder?.date_expected }}</span>
        </p>
        <p>
          {{ $t("table.promised_date") }}:
          <span class="font-weight-bold">{{ selectedOrder?.date_promised ?? NaN }}</span>
        </p>
        <p>
          {{ $t("page.status.inprogress") }}:
          <span class="font-weight-bold">
            {{
              selectedOrder?.inprogress_date ? new Date(selectedOrder.inprogress_date).toISOString().split("T")[0] : NaN
            }}
          </span>
        </p>
        <p>
          {{ $t("page.status.Closed") }}:
          <span class="font-weight-bold">
            {{ selectedOrder?.closed_date ? new Date(selectedOrder.closed_date).toISOString().split("T")[0] : "NaN" }}
          </span>
        </p>
      </v-col>
    </v-row>
    <div class="timeline-container">
      <!-- Date labels with absolute positioning -->
      <div class="date-labels-container">
        <div
          v-for="(label, index) in dateLabels"
          :key="index"
          class="date-label px-6"
          :style="{
            left: getDatePosition(label.date) + '%'
          }"
        >
          <div class="d-flex flex-column align-center text-center">
            <p>{{ $t(`${label.name}`) }}</p>
            <span>{{ formatDate(label.date) }}</span>
          </div>
        </div>
      </div>
      <!-- Timeline with accurate positioning -->
      <div class="timeline-bars" v-if="hasValidDates">
        <!-- Base timeline line -->
        <!-- <div class="timeline-base"></div> -->
        <!-- WIP to Expected -->
        <div class="period-bar">
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.inprogress_date) + '%' }"></div>
          <div
            class="bar yellow"
            :style="{
              left: getDatePosition(selectedOrder.inprogress_date) + '%',
              width: getBarWidth(selectedOrder.inprogress_date, selectedOrder.date_expected) + '%'
            }"
          >
            <p class="duration">{{ getDuration("inprogress_date", "date_expected") }} {{ $t("days") }}</p>
          </div>
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.date_expected) + '%' }"></div>
        </div>
        <!-- Expected to Promised -->
        <div class="period-bar" v-if="selectedOrder.date_expected">
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.date_expected) + '%' }"></div>
          <div
            class="bar purple"
            :style="{
              left: getDatePosition(selectedOrder.date_expected) + '%',
              width: getBarWidth(selectedOrder.date_expected, selectedOrder.date_promised) + '%'
            }"
          >
            <p class="duration">{{ getDuration("date_expected", "date_promised") }} {{ $t("days") }}</p>
          </div>
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.date_promised) + '%' }"></div>
        </div>
        <!-- WIP to Promised -->
        <div class="period-bar" v-if="selectedOrder.inprogress_date">
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.inprogress_date) + '%' }"></div>
          <div
            class="bar blue"
            :style="{
              left: getDatePosition(selectedOrder.inprogress_date) + '%',
              width: getBarWidth(selectedOrder.inprogress_date, selectedOrder.date_promised) + '%'
            }"
          >
            <p class="duration">{{ getDuration("inprogress_date", "date_promised") }} {{ $t("days") }}</p>
          </div>
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.date_promised) + '%' }"></div>
        </div>
        <!-- Promised to Closed (if closed date exists) -->
        <div class="period-bar" v-if="selectedOrder.closed_date">
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.date_promised) + '%' }"></div>
          <div
            class="bar orange"
            :style="{
              left: getDatePosition(selectedOrder.date_promised) + '%',
              width: getBarWidth(selectedOrder.date_promised, selectedOrder.closed_date) + '%'
            }"
          >
            <p class="duration">{{ getDuration("date_promised", "closed_date") }} {{ $t("days") }}</p>
          </div>
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.closed_date) + '%' }"></div>
        </div>
        <!-- Total Duration (if closed date exists) -->
        <div class="period-bar" v-if="selectedOrder.closed_date">
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.inprogress_date) + '%' }"></div>
          <div
            class="bar red"
            :style="{
              left: getDatePosition(selectedOrder.inprogress_date) + '%',
              width: getBarWidth(selectedOrder.inprogress_date, selectedOrder.closed_date) + '%'
            }"
          >
            <p class="duration">{{ getDuration("inprogress_date", "closed_date") }} {{ $t("days") }}</p>
          </div>
          <div class="dot" :style="{ left: getDatePosition(selectedOrder.closed_date) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderGanttDetails",

  props: {
    selectedOrder: {
      type: Object,
      required: true
    }
  },

  computed: {
    hasValidDates() {
      return (
        this.selectedOrder?.inprogress_date && this.selectedOrder?.date_expected && this.selectedOrder?.date_promised
      )
    },

    dateLabels() {
      return [
        { name: "wip_date", date: this.selectedOrder?.inprogress_date },
        { name: "expected", date: this.selectedOrder?.date_expected },
        { name: "promised", date: this.selectedOrder?.date_promised },
        { name: "closed_date", date: this.selectedOrder?.closed_date }
      ].filter((label) => label.date) // Filter out empty dates
    },

    timelineStartDate() {
      return this.parseDate(this.selectedOrder?.inprogress_date)
    },

    timelineEndDate() {
      return this.parseDate(this.selectedOrder?.closed_date) || this.parseDate(this.selectedOrder?.date_promised)
    },

    totalDuration() {
      if (!this.timelineStartDate || !this.timelineEndDate) return 0
      return Math.ceil((this.timelineEndDate - this.timelineStartDate) / (1000 * 60 * 60 * 24)) + 1
    }
  },

  methods: {
    parseDate(dateStr) {
      if (!dateStr) return null

      try {
        let date
        if (dateStr.includes(".")) {
          date = new Date(dateStr)
        } else if (dateStr.includes(" ")) {
          const [datePart, timePart] = dateStr.split(" ")
          date = new Date(`${datePart}T${timePart}`)
        } else {
          date = new Date(`${dateStr}T00:00:00`)
        }

        return isNaN(date.getTime()) ? null : date
      } catch (error) {
        console.error(`Error parsing date: ${dateStr}`, error)
        return null
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "N/A"
      const date = this.parseDate(dateStr)
      if (!date) return "Invalid Date"

      try {
        return date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
          .replace(/\//g, "-")
      } catch (error) {
        console.error(`Error formatting date: ${dateStr}`, error)
        return "Error"
      }
    },

    getDatePosition(dateStr) {
      if (!dateStr || !this.timelineStartDate || !this.timelineEndDate) return 0

      const date = this.parseDate(dateStr)
      if (!date) return 0

      const totalDuration = this.timelineEndDate - this.timelineStartDate
      const position = ((date - this.timelineStartDate) / totalDuration) * 100
      return Math.max(0, Math.min(100, position))
    },

    getBarWidth(startDateStr, endDateStr) {
      const startPos = this.getDatePosition(startDateStr)
      const endPos = this.getDatePosition(endDateStr)
      return Math.max(0, endPos - startPos)
    },

    getDuration(startDateKey, endDateKey) {
      if (!this.selectedOrder?.[startDateKey] || !this.selectedOrder?.[endDateKey]) {
        return 0
      }

      const start = this.parseDate(this.selectedOrder[startDateKey])
      const end = this.parseDate(this.selectedOrder[endDateKey])

      if (!start || !end) return 0

      const startDay = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()))
      const endDay = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()))

      return Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1
    }
  }
}
</script>

<style scoped>
.small-list {
  font-size: 0.75rem !important;
  line-height: 12px;
}
.timeline-container {
  width: 100%;
  min-width: 600px;
  padding: 20px 50px;
  overflow-x: auto;
  border: 1px solid #ececec;
  border-radius: 10px;
}

.date-labels-container {
  width: 100%;
  position: relative;
  height: 40px;
  margin-bottom: 40px;
}

.date-label {
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  font-weight: bold;
  font-size: 0.77rem;
  color: #5c5c5c;
}
.date-label p {
  margin-bottom: 2px;
}

.timeline-bars {
  width: 100%;
  position: relative;
  padding: 0 20px;
}

.timeline-base {
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  top: 50%;
  transform: translateY(-50%);
}

.period-bar {
  position: relative;
  height: 18px;
  margin-bottom: 20px;
  width: 100%;
}

.dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #4caf50;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  z-index: 2;
}

.bar {
  position: absolute;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
}

.duration {
  position: absolute;
  top: -20px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
}

/* Bar colors */
.yellow {
  background-color: #ffd700;
  height: 5px;
}
.purple {
  background-color: #e040fb;
  height: 5px;
}
.blue {
  background-color: #2196f3;
  height: 5px;
}
.orange {
  background-color: #ff9800;
  height: 5px;
}
.red {
  background-color: #ff5252;
  height: 5px;
}
.timeline-container::-webkit-scrollbar {
  height: 8px;
}

.timeline-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.timeline-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

.timeline-container::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
