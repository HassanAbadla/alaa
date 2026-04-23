<template>
  <div class="gantt-chart card">
    <div class="d-flex border-bottom">
      <!-- Left side fixed column -->
      <div class="status-column bg-light border-right ma-auto font-weight-bold">Code</div>
      <div class="order-details-column bg-light border-right px-1 ma-auto font-weight-bold">
        {{ $t("page.orders") }}
      </div>
      <div class="status-column bg-light border-right ma-auto px-1 font-weight-bold">Receiver</div>
      <div class="status-column bg-light border-right ma-auto px-1 font-weight-bold">Status</div>
      <div class="status-column bg-light ma-auto px-1 font-weight-bold">Priority</div>
      <!-- Timeline header -->
      <div v-if="timelineDates" class="timeline-container" ref="headerScroll">
        <div class="d-flex" :style="{ width: timelineWidth + 'px' }">
          <div
            v-for="(date, index) in timelineDates"
            :key="index"
            class="timeline-cell border-right border-bottom p-2 text-center small"
          >
            {{ formatDate(date) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Content area -->
    <div v-if="sortedOrders.length > 0" class="d-flex">
      <!-- Left side fixed column -->
      <div class="border-right">
        <div
          v-for="order in sortedOrders"
          :key="order.id"
          @click="openDetails(order)"
          class="d-flex border-bottom border"
        >
          <div
            class="status-column border-right ma-auto font-weight-bold small"
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
          >
            {{ order?.code || `Order #${order.id}` }}
          </div>
          <div class="order-details-column border-right px-1 font-weight-bold small">
            {{ order.name || `Order #${order.id}` }}
          </div>
          <div
            class="status-column border-right ma-auto px-2 d-flex no-wrap font-weight-bold small"
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
          >
            {{ order?.receiver?.name || `Order #${order.id}` }}
          </div>
          <div class="status-column border-right ma-auto px-2 font-weight-bold small">
            {{ order?.status?.name || `Order #${order.id}` }}
          </div>
          <div class="status-column ma-auto px-2 font-weight-bold small">
            {{ order?.priority?.name || `Order #${order.id}` }}
          </div>
        </div>
      </div>

      <!-- Timeline content -->
      <div class="timeline-container" ref="contentScroll">
        <div class="timeline-wrapper" :style="{ width: timelineWidth + 'px', minHeight: '100%' }">
          <!-- Background grid -->
          <div class="grid-container">
            <div v-for="(date, index) in timelineDates" :key="index" class="timeline-cell border-right h-100"></div>
          </div>

          <!-- Order bars -->
          <div class="bars-container">
            <div v-for="(order, index) in sortedOrders" :key="order.id" class="timeline-row">
              <div
                class="gantt-bar"
                :class="getBarClass(index)"
                :style="getOrderBarStyle(order)"
                @mouseenter="logOrderDates(order)"
              >
                <div class="bar-label">
                  {{ getDurationDays(order) }} {{ $t("page.days") }} - ({{ order.receiver.name }})
                </div>

                <!-- Date milestone markers -->
                <div
                  v-if="order.date_promised"
                  class="milestone promised"
                  :style="getMilestonePosition(order.date_promised, order)"
                  :title="`Promised: ${formatDateTime(order.date_promised)}`"
                ></div>
                <div
                  v-if="order.date_expected"
                  class="milestone expected"
                  :style="getMilestonePosition(order.date_expected, order)"
                  :title="`Expected: ${formatDateTime(order.date_expected)}`"
                ></div>

                <!-- <div
                  v-if="order.inprogress_date"
                  class="milestone inprogress"
                  :style="getMilestonePosition(order.inprogress_date, order)"
                  :title="`In Progress: ${formatDateTime(order.inprogress_date)}`"
                ></div>

                <div
                  v-if="order.closed_date"
                  class="milestone closed"
                  :style="getMilestonePosition(order.closed_date, order)"
                  :title="`Closed: ${formatDateTime(order.closed_date)}`"
                ></div> -->
              </div>
            </div>
          </div>

          <!-- Today marker -->
          <div class="today-marker" :style="{ left: getTodayPosition + 'px' }">
            <div class="today-label">{{ $t("page.today") }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <custom-dialog v-model="orderDetails" :title="$t('page.order_details')" width="880px">
      <OrderGanttDetails v-if="orderDetails" :selectedOrder="selectedOrder" />
    </custom-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex"
import OrderGanttDetails from "../oss/OrderGanttDetails.vue"
export default {
  name: "OTMGanttChart",
  components: { OrderGanttDetails },

  props: {
    orders: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data() {
    return {
      dayWidth: 30,
      today: new Date(),
      barColors: ["indigo", "blue", "deep-purple", "cyan"],
      selectedOrder: null,
      orderDetails: false
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.setupScrollSync()
    })
  },
  updated() {
    this.$nextTick(() => {
      this.setupScrollSync()
    })
  },
  beforeDestroy() {
    this.removeScrollSync()
  },
  watch: {
    // Watch for changes in timeline dates or orders
    timelineDates: {
      handler() {
        this.$nextTick(() => {
          this.setupScrollSync()
        })
      },
      deep: true
    },

    orders: {
      handler() {
        this.$nextTick(() => {
          this.setupScrollSync()
        })
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["isRTL"]),
    sortedOrders() {
      return [...this.orders].sort(
        (a, b) => this.parseDate(a.date_expected).getTime() - this.parseDate(b.date_expected).getTime()
      )
    },

    timelineDates() {
      if (!this.sortedOrders.length) return []

      const dates = []
      const start = this.startDate
      const end = this.endDate

      let current = new Date(start)
      while (current <= end) {
        dates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }

      // Add 3 days to the last date
      const lastDate = dates[dates.length - 1]
      for (let i = 1; i <= 4; i++) {
        const newDate = new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000)
        dates.push(newDate)
      }

      return dates
    },

    startDate() {
      if (!this.sortedOrders.length) return new Date()

      // Get the earliest date_expected date
      const dates = this.sortedOrders.map((order) => this.parseDate(order.date_expected))
      const earliestDate = new Date(Math.min(...dates.map((date) => date.getTime())))

      // Subtract 1 day
      earliestDate.setDate(earliestDate.getDate() - 1)
      // Set to start of day
      earliestDate.setHours(0, 0, 0, 0)
      return earliestDate
    },

    endDate() {
      if (!this.sortedOrders.length) return new Date()

      // Get the latest expected date
      const dates = this.sortedOrders.map((order) => this.parseDate(order.date_promised))
      const lastDate = new Date(Math.max(...dates.map((date) => date.getTime())))

      // Add one day to include the full last day
      lastDate.setDate(lastDate.getDate() + 1)
      lastDate.setHours(0, 0, 0, 0)
      return lastDate
    },

    timelineWidth() {
      return this.timelineDates.length * this.dayWidth
    },
    getTodayPosition() {
      const diffDays = this.getDaysBetween(this.startDate, this.today)
      const position = diffDays * this.dayWidth

      // If RTL, calculate position from right edge
      if (this.isRTL) {
        return this.timelineWidth - position
      }
      return position
    }
  },

  methods: {
    openDetails(order) {
      this.selectedOrder = order
      this.orderDetails = true
    },
    parseDate(dateStr) {
      if (!dateStr) return new Date()

      try {
        if (dateStr.includes("T")) {
          // Handle ISO datetime string (created_at)
          return new Date(dateStr)
        } else if (dateStr.includes(" ")) {
          // Handle "YYYY-MM-DD HH:mm:ss" format (inprogress_date)
          const [datePart, timePart] = dateStr.split(" ")
          const [year, month, day] = datePart.split("-")
          const [hours, minutes, seconds] = timePart.split(":")
          return new Date(year, parseInt(month) - 1, day, hours, minutes, seconds)
        } else {
          // Handle YYYY-MM-DD format (date_expected)
          const [year, month, day] = dateStr.split("-")
          return new Date(year, parseInt(month) - 1, day)
        }
      } catch (e) {
        console.error("Error parsing date:", dateStr, e)
        return new Date()
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    },

    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      })
    },

    getDaysBetween(start, end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Set both dates to start of day for accurate day calculation
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)

      const oneDay = 24 * 60 * 60 * 1000
      return Math.max(0, Math.round((endDate - startDate) / oneDay))
    },

    // getDurationDays(order) {
    //   const start = this.parseDate(order.created_at)
    //   const end = this.parseDate(order.date_expected)
    //   return this.getDaysBetween(start, end)
    // },

    // getOrderBarStyle(order) {
    //   const orderStart = this.parseDate(order.created_at)
    //   orderStart.setHours(0, 0, 0, 0)

    //   const startDays = this.getDaysBetween(this.startDate, orderStart)
    //   const duration = this.getDurationDays(order)
    //   console.log("left:", `${startDays * this.dayWidth}px`)

    //   if (this.$store.state.isRTL) {
    //     return {
    //       right: `${startDays * this.dayWidth}px`,
    //       width: `${Math.max(1, duration) * this.dayWidth}px`,
    //       height: "24px",
    //       top: "20px"
    //     }
    //   } else {
    //     return {
    //       left: `${startDays * this.dayWidth}px`,
    //       width: `${Math.max(1, duration) * this.dayWidth}px`,
    //       height: "24px",
    //       top: "20px"
    //     }
    //   }
    // },
    getDurationDays(order) {
      // Use date_expected as start, date_promised as end
      const start = this.parseDate(order.date_expected)
      const end = this.parseDate(order.date_promised)
      return this.getDaysBetween(start, end)
    },

    getOrderBarStyle(order) {
      // Use date_expected as start
      const orderStart = this.parseDate(order.date_expected)
      orderStart.setHours(0, 0, 0, 0)

      const startDays = this.getDaysBetween(this.startDate, orderStart)
      const duration = this.getDurationDays(order)
      console.log("left:", `${startDays * this.dayWidth}px`)

      if (this.$store.state.isRTL) {
        return {
          right: `${startDays * this.dayWidth}px`,
          width: `${Math.max(1, duration) * this.dayWidth}px`,
          height: "24px",
          top: "20px"
        }
      } else {
        return {
          left: `${startDays * this.dayWidth}px`,
          width: `${Math.max(1, duration) * this.dayWidth}px`,
          height: "24px",
          top: "20px"
        }
      }
    },

    getBarClass(index) {
      return this.barColors[index % this.barColors.length]
    },

    // Debug helper
    logOrderDates(order) {
      const start = this.parseDate(order.date_expected)
      const chartStart = this.startDate
      const days = this.getDaysBetween(chartStart, start)
      console.log("Order:", order.id, {
        date_expected: order.date_expected,
        parsed_start: start,
        chart_start: chartStart,
        days_from_start: days,
        position: `${days * this.dayWidth}px`
      })
    },

    // getMilestonePosition(dateStr, order) {
    //   if (!dateStr) return null

    //   const date = this.parseDate(dateStr)
    //   const orderStart = this.parseDate(order.created_at)
    //   const daysSinceStart = this.getDaysBetween(orderStart, date)

    //   return {
    //     left: `${daysSinceStart * this.dayWidth}px`
    //   }
    // }
    getMilestonePosition(dateStr, order) {
      if (!dateStr) return null

      const date = this.parseDate(dateStr)
      const orderStart = this.parseDate(order.date_expected)

      // Set hours to midnight for consistent day calculation
      const startDate = new Date(orderStart)
      startDate.setHours(0, 0, 0, 0)

      const days = this.getDaysBetween(startDate, date)

      // Add fractional day based on time of day
      const fractionalDay = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / (24 * 3600)

      if (this.$store.state.isRTL) {
        return {
          right: `${(days + fractionalDay) * this.dayWidth}px`
        }
      } else {
        return {
          left: `${(days + fractionalDay) * this.dayWidth}px`
        }
      }
    },

    setupScrollSync() {
      // Remove existing listeners first to prevent duplicates
      this.removeScrollSync()

      const headerScroll = this.$refs.headerScroll
      const contentScroll = this.$refs.contentScroll

      if (headerScroll && contentScroll) {
        // Handler for header scroll
        this.handleHeaderScroll = () => {
          if (contentScroll.scrollLeft !== headerScroll.scrollLeft) {
            contentScroll.scrollLeft = headerScroll.scrollLeft
          }
        }

        // Handler for content scroll
        this.handleContentScroll = () => {
          if (headerScroll.scrollLeft !== contentScroll.scrollLeft) {
            headerScroll.scrollLeft = contentScroll.scrollLeft
          }
        }

        // Add event listeners
        headerScroll.addEventListener("scroll", this.handleHeaderScroll, { passive: true })
        contentScroll.addEventListener("scroll", this.handleContentScroll, { passive: true })

        // Store references to elements for cleanup
        this.scrollElements = { headerScroll, contentScroll }
      }
    },

    removeScrollSync() {
      // Only remove if we have previous elements and handlers
      if (this.scrollElements && this.handleHeaderScroll && this.handleContentScroll) {
        const { headerScroll, contentScroll } = this.scrollElements

        headerScroll.removeEventListener("scroll", this.handleHeaderScroll)
        contentScroll.removeEventListener("scroll", this.handleContentScroll)

        // Clean up references
        this.scrollElements = null
      }
    },

    // Ensure scroll sync is maintained after any data updates
    resetScrollSync() {
      this.$nextTick(() => {
        this.removeScrollSync()
        this.setupScrollSync()
      })
    }
  }
}
</script>
<style scoped>
.gantt-chart {
  background: #fff;
  overflow: hidden;
}
.small {
  font-size: 0.75rem !important;
}
.small-list {
  font-size: 0.75rem !important;
  line-height: 12px;
}
.order-details-column {
  width: 250px;
  flex-shrink: 0;
  z-index: 2;
  background: #fff;
}
.status-column {
  width: 70px;
  flex-shrink: 0;
  z-index: 2;
  background: #fff;
}

.timeline-container {
  flex-grow: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.timeline-wrapper {
  position: relative;
  min-height: 100%;
}

.grid-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.timeline-cell {
  width: 30px;
  flex-shrink: 0;
  flex-grow: 0;
}

.bars-container {
  position: relative;
  width: 100%;
}

.timeline-row {
  height: 44px;
  width: 100%;
  position: relative;
  border-bottom: 1px solid #dee2e6;
}

.gantt-bar {
  position: absolute;
  border-radius: 4px;
  opacity: 0.9;
  z-index: 1;
  transition: opacity 0.2s ease;
}

.gantt-bar:hover {
  opacity: 1;
  cursor: pointer;
}

.bar-label {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.today-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #dc3545;
  z-index: 3;
}
.card {
  border: #ebeef1 solid 1px;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 4px 5px 0 rgba(0, 0, 0, 0.06), 0 1px 10px 0 rgba(0, 0, 0, 0.08);
}

.today-label {
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #dc3545;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  cursor: default;
  z-index: 5;
}

/* Color classes for bars */
.indigo {
  background-color: #3f51b5;
}

.blue {
  background-color: #2196f3;
}

.deep-purple {
  background-color: #673ab7;
}

.cyan {
  background-color: #00bcd4;
}

.border-right {
  border-right: 1px solid #dee2e6;
}
.border-bottom {
  border-bottom: 2px solid #dee2e6;
  height: 44px;
  cursor: pointer;
}

.border-bottom:hover {
  background-color: #f8f9fa;
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

.smaller {
  font-size: 11px;
}

.milestone {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: -16px;
  transform: translateX(-50%);
  border: 2px solid white;
  z-index: 2;
}

.milestone.promised {
  background-color: #9c27b0; /* amber */
}
.milestone.expected {
  background-color: #2789b0; /* amber */
}

.milestone.inprogress {
  background-color: #fb9514; /* green */
}

.milestone.closed {
  background-color: #ff6060; /* purple */
}

/* Make the bar slightly taller to accommodate the markers */
/* .gantt-bar {
  height: 30px !important;
} */

/* Adjust the bar label position */
.bar-label {
  font-size: 0.75rem;
}

/* Add hover effect for milestones */
.milestone:hover {
  transform: translateX(-50%) scale(1.2);
  transition: transform 0.2s ease;
  cursor: pointer;
}
</style>
