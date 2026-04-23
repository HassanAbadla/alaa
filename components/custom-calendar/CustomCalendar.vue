<template>
  <v-container>
    <v-sheet tile class="d-flex align-center pa-2">
      <v-btn small :color="showEndDatesOnly ? 'primary' : 'default'" outlined class="ma-2" @click="toggleEndDatesOnly">
        {{ showEndDatesOnly ? "Show Full Events" : "Show End Dates Only" }}
      </v-btn>
      <v-spacer></v-spacer>
    </v-sheet>
    <v-sheet class="fullcalendar-wrapper">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    </v-sheet>

    <!-- Event Popup Menu -->
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
      max-width="400"
    >
      <v-card color="grey lighten-4" min-width="300px" flat>
        <!-- Popup Header with event color -->
        <v-toolbar :color="selectedEventData.color || 'primary'" dark>
          <v-toolbar-title>{{ selectedEventData.name || "Event Details" }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- Close button -->
          <v-btn icon @click="selectedOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- Popup Content -->
        <v-card-text class="py-4">
          <!-- Event Name -->
          <div class="mb-3">
            <v-icon small class="mr-2">mdi-calendar</v-icon>
            <strong>Event:</strong>
            {{ selectedEventData.name || "No title" }}
          </div>

          <!-- Start Date -->
          <div class="mb-3" v-if="selectedEventData.originalStart">
            <v-icon small class="mr-2">mdi-clock-start</v-icon>
            <strong>Start:</strong>
            {{ formatDate(selectedEventData.originalStart) }}
          </div>

          <!-- End Date -->
          <div class="mb-3" v-if="selectedEventData.originalEnd">
            <v-icon small class="mr-2">mdi-clock-end</v-icon>
            <strong>End:</strong>
            {{ formatDate(selectedEventData.originalEnd) }}
          </div>

          <!-- Show if it's an end-date-only display -->
          <div class="mb-3" v-if="selectedEventData.isEndDateOnly">
            <v-chip small color="info" outlined>
              <v-icon small left>mdi-information</v-icon>
              Showing end date only
            </v-chip>
          </div>
        </v-card-text>

        <!-- Popup Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="secondary" @click="selectedOpen = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-container>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"
import multiMonthPlugin from "@fullcalendar/multimonth"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

export default {
  name: "CustomCalendar",
  components: {
    FullCalendar
  },
  props: {
    /**
     * Configuration object for the calendar component
     * @typedef {Object} CalendarConfig
     * @property {Array} events - Array of event objects to display on the calendar
     * @property {Object} keyConfig - Configuration for mapping event object properties
     * @property {string} keyConfig.name - Path to the event name property
     * @property {string} keyConfig.start - Path to the start date property
     * @property {string} keyConfig.end - Path to the end date property
     * @property {string} [keyConfig.color] - Path to the color property
     * @property {string} [keyConfig.children] - Path to nested/child events property
     * @property {boolean} [defaultTimed=true] - Whether events should be timed by default
     * @property {boolean} [defaultEndDateOnly=false] - Whether to show only end dates by default
     * @property {string} [eventNamePrefix] - i18n key for event name prefix
     * @property {string} [defaultColor="primary"] - Default color for events
     */
    config: {
      type: Object,
      required: true,
      validator(config) {
        return config.events && config.keyConfig && config.keyConfig.name
      }
    }
  },
  data() {
    return {
      showEndDatesOnly: false,
      // Event popup related data
      selectedOpen: false,
      selectedElement: null,
      selectedEventData: {},
      originalEventItem: null
    }
  },
  computed: {
    /**
     * Process config.events into FullCalendar event format
     */
    fcEvents() {
      const events = []

      if (!this.config.events) return events

      this.config.events.forEach((item) => {
        // Add main event
        const mainEvent = this.processEvent(item)
        if (mainEvent) {
          events.push(mainEvent)
        }

        // Add child events if configured
        if (this.config.keyConfig.children) {
          const children = this.getNestedValue(item, this.config.keyConfig.children)
          if (children && children.length > 0) {
            children.forEach((childItem) => {
              const childEvent = this.processEvent(childItem)
              if (childEvent) {
                events.push(childEvent)
              }
            })
          }
        }
      })

      return events
    },

    /**
     * FullCalendar options object
     */
    calendarOptions() {
      return {
        plugins: [multiMonthPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "multiMonthYear",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay"
        },
        events: this.fcEvents,
        eventClick: this.handleEventClick,
        height: "auto",
        editable: false,
        selectable: false,
        dayMaxEvents: true,
        multiMonthMaxColumns: 4
      }
    }
  },
  methods: {
    processEvent(item) {
      const name = this.getNestedValue(item, this.config.keyConfig.name)
      const startDate = this.getNestedValue(item, this.config.keyConfig.start)
      const endDate = this.getNestedValue(item, this.config.keyConfig.end)

      // Handle missing name
      const eventName = name || this.$t("calendar.missing_title")

      // Handle missing dates
      let start, end
      if (!startDate && !endDate) {
        return null
      } else if (!startDate && endDate) {
        start = endDate
        end = endDate
      } else if (startDate && !endDate) {
        start = startDate
        end = startDate
      } else {
        start = startDate
        end = endDate
      }

      // Get color
      const color = this.config.keyConfig.color
        ? this.getNestedValue(item, this.config.keyConfig.color) || this.config.defaultColor || "#1976D2"
        : this.config.defaultColor || "#1976D2"

      // Determine if showing end dates only
      const isEndDateOnly = this.showEndDatesOnly || this.config.defaultEndDateOnly

      if (isEndDateOnly) {
        const displayName = this.config.eventNamePrefix
          ? this.$t(this.config.eventNamePrefix, { name: eventName })
          : this.$t("calendar.due", { name: eventName })

        return {
          title: displayName,
          start: end,
          end: end,
          backgroundColor: color,
          borderColor: color,
          allDay: true,
          extendedProps: {
            _originalItem: this.deepClone(item),
            _originalName: eventName,
            _originalStart: startDate,
            _originalEnd: endDate,
            _isEndDateOnly: true
          }
        }
      } else {
        return {
          title: eventName,
          start: start,
          end: end,
          backgroundColor: color,
          borderColor: color,
          allDay: !(this.config.defaultTimed !== undefined ? this.config.defaultTimed : true),
          extendedProps: {
            _originalItem: this.deepClone(item),
            _originalName: eventName,
            _originalStart: startDate,
            _originalEnd: endDate,
            _isEndDateOnly: false
          }
        }
      }
    },

    getNestedValue(obj, path) {
      if (!path || !obj) return null

      return path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null
      }, obj)
    },

    toggleEndDatesOnly() {
      this.showEndDatesOnly = !this.showEndDatesOnly
    },

    /**
     * Handle FullCalendar eventClick
     */
    handleEventClick(info) {
      const event = info.event
      const ep = event.extendedProps

      // Prepare data for popup display
      this.selectedEventData = {
        name: ep._originalName || event.title,
        originalStart: ep._originalStart,
        originalEnd: ep._originalEnd,
        color: event.backgroundColor,
        isEndDateOnly: ep._isEndDateOnly
      }

      // Store reference to original item for emitting
      this.originalEventItem = ep._originalItem

      // Set popup activator element and show popup
      this.selectedElement = info.el

      // Handle popup opening
      const openPopup = () => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            this.selectedOpen = true
          })
        )
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => openPopup()))
      } else {
        openPopup()
      }

      // Prevent default browser navigation
      info.jsEvent.preventDefault()

      // Emit event to parent component with original item data
      this.$emit("event-clicked", {
        originalItem: ep._originalItem,
        eventData: {
          name: ep._originalName,
          start: ep._originalStart,
          end: ep._originalEnd,
          color: event.backgroundColor,
          isEndDateOnly: ep._isEndDateOnly
        },
        calendarEvent: event,
        nativeEvent: info.jsEvent
      })
    },

    /**
     * Format date for display in popup
     */
    formatDate(date) {
      if (!date) return "Not specified"

      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) return "Invalid date"

        return dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0 ? "2-digit" : undefined,
          minute: dateObj.getHours() !== 0 || dateObj.getMinutes() !== 0 ? "2-digit" : undefined
        })
      } catch (error) {
        console.warn("Error formatting date:", date, error)
        return "Invalid date"
      }
    },

    /**
     * Deep clone object to prevent mutations
     */
    deepClone(obj) {
      if (obj === null || typeof obj !== "object") return obj
      if (obj instanceof Date) return new Date(obj.getTime())
      if (obj instanceof Array) return obj.map((item) => this.deepClone(item))

      const cloned = {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key])
        }
      }
      return cloned
    }
  },
  mounted() {
    console.log("FullCalendar mounted")
    // Set initial showEndDatesOnly from config
    if (this.config.defaultEndDateOnly !== undefined) {
      this.showEndDatesOnly = this.config.defaultEndDateOnly
    }
  }
}
</script>

<style>
/* FullCalendar wrapper styling */
.fullcalendar-wrapper {
  padding: 8px;
}

.fullcalendar-wrapper .fc {
  font-family: inherit;
}

/* Event styling */
.fullcalendar-wrapper .fc-event {
  cursor: pointer;
  transition: opacity 0.2s ease;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.85em;
}

.fullcalendar-wrapper .fc-event:hover {
  opacity: 0.8;
}

/* Header toolbar styling */
.fullcalendar-wrapper .fc .fc-toolbar-title {
  font-size: 1.3em;
  font-weight: 500;
}

.fullcalendar-wrapper .fc .fc-button {
  text-transform: capitalize;
  font-size: 0.85em;
}

.fullcalendar-wrapper .fc .fc-button-primary {
  background-color: #061E37 !important;
  border-color: #061E37 !important;
  color: #fff !important;
}

.fullcalendar-wrapper .fc .fc-button-primary:hover {
  background-color: #0a2d4d !important;
  border-color: #0a2d4d !important;
  opacity: 0.9;
}

.fullcalendar-wrapper .fc .fc-button-primary:not(:disabled).fc-button-active,
.fullcalendar-wrapper .fc .fc-button-primary:not(:disabled):active {
  background-color: #0a2d4d !important;
  border-color: #0a2d4d !important;
}

/* Multi-month grid styling */
.fullcalendar-wrapper .fc-multimonth {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.fullcalendar-wrapper .fc .fc-multimonth-month {
  padding: 4px;
}

/* Day cell styling */
.fullcalendar-wrapper .fc .fc-daygrid-day:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

/* Today highlight */
.fullcalendar-wrapper .fc .fc-day-today {
  background-color: rgba(25, 118, 210, 0.08) !important;
}
</style>
