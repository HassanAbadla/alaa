<!-- 1. RoomTestPointsDialog.vue - Separate Dialog Component -->
<template>
  <v-dialog v-model="dialog" max-width="1200px" persistent scrollable>
    <v-card>
      <v-card-title class="primary white--text">
        <span class="text-h5">Room Test Points Readings</span>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-container fluid>
          <!-- Loading State -->
          <v-row v-if="loadingReadings">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="mt-4">Loading readings...</p>
            </v-col>
          </v-row>

          <!-- Error State -->
          <v-row v-else-if="readingsError">
            <v-col cols="12">
              <v-alert type="error" dismissible @input="readingsError = null">
                {{ readingsError }}
              </v-alert>
            </v-col>
          </v-row>

          <!-- Content -->
          <template v-else-if="testPoints.length > 0">
            <!-- Chart Section -->
            <v-row>
              <v-col cols="12">
                <v-card outlined>
                  <v-card-title class="subtitle-1">
                    Particle Count Over Time
                    <v-spacer></v-spacer>
                    <v-chip-group v-model="selectedSizes" multiple column active-class="primary--text">
                      <v-chip small filter outlined value="size_d">0.5 micron</v-chip>
                      <v-chip small filter outlined value="size_e">1.0 micron</v-chip>
                      <v-chip small filter outlined value="size_f">5.0 micron</v-chip>
                    </v-chip-group>
                  </v-card-title>
                  <v-card-text>
                    <canvas ref="chartCanvas" height="100"></canvas>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Data Table Section -->
            <v-row class="mt-4">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-title>
                    <span class="subtitle-1">Readings Data</span>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                      dense
                      outlined
                      style="max-width: 300px"
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    :headers="tableHeaders"
                    :items="testPoints"
                    :search="search"
                    :items-per-page="10"
                    :footer-props="{
                      'items-per-page-options': [5, 10, 25, 50, -1]
                    }"
                    class="elevation-0"
                  >
                    <template v-slot:item.dateandtime="{ item }">
                      {{ formatDateTime(item.dateandtime) }}
                    </template>

                    <template v-slot:item.size_d="{ item }">
                      <v-chip small color="blue lighten-4">
                        {{ formatNumber(item.size_d) }}
                      </v-chip>
                    </template>

                    <template v-slot:item.size_e="{ item }">
                      <v-chip small color="green lighten-4">
                        {{ formatNumber(item.size_e) }}
                      </v-chip>
                    </template>

                    <template v-slot:item.size_f="{ item }">
                      <v-chip small color="orange lighten-4">
                        {{ formatNumber(item.size_f) }}
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </template>

          <!-- Empty State -->
          <v-row v-else>
            <v-col cols="12" class="text-center">
              <v-icon size="64" color="grey lighten-1">mdi-database-off</v-icon>
              <p class="mt-4 grey--text">No readings found for this room</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="close">Close</v-btn>
        <v-btn color="primary" text @click="exportData" :disabled="testPoints.length === 0">
          <v-icon left>mdi-download</v-icon>
          Export
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios"
import Chart from "chart.js/auto"

export default {
  name: "RoomTestPointsDialog",

  props: {
    value: {
      type: Boolean,
      default: false
    },
    roomResultId: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    return {
      testPoints: [],
      loadingReadings: false,
      readingsError: null,
      search: "",
      chart: null,
      selectedSizes: ["size_d", "size_e", "size_f"],

      tableHeaders: [
        { text: "Reading No.", value: "reading_no", align: "center" },
        { text: "Date & Time", value: "dateandtime", align: "start" },
        { text: "0.5 micron (p/m³)", value: "size_d", align: "end" },
        { text: "1.0 micron (p/m³)", value: "size_e", align: "end" },
        { text: "5.0 micron (p/m³)", value: "size_f", align: "end" }
      ]
    }
  },

  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      }
    }
  },

  watch: {
    dialog(newVal) {
      if (newVal && this.roomResultId) {
        this.fetchTestPoints()
      } else if (!newVal) {
        this.resetDialog()
      }
    },

    selectedSizes: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },

  methods: {
    async fetchTestPoints() {
      if (!this.roomResultId) {
        this.readingsError = "Room result ID is required"
        return
      }

      this.loadingReadings = true
      this.readingsError = null

      try {
        const response = await this.$axios.get(`/room-test-points/${this.roomResultId}`)

        if (response.data.success) {
          this.testPoints = response.data.data

          // Wait for DOM update before creating chart
          this.$nextTick(() => {
            this.createChart()
          })
        } else {
          this.readingsError = response.data.message || "Failed to load readings"
        }
      } catch (error) {
        console.error("Error fetching test points:", error)
        this.readingsError = error.response?.data?.message || "Failed to load readings"
      } finally {
        this.loadingReadings = false
      }
    },

    createChart() {
      if (this.chart) {
        this.destroyChart()
      }

      const ctx = this.$refs.chartCanvas
      if (!ctx) return

      const labels = this.testPoints.map((point) => this.formatDateTime(point.dateandtime))

      const datasets = []

      if (this.selectedSizes.includes("size_d")) {
        datasets.push({
          label: "0.5 micron (p/m³)",
          data: this.testPoints.map((point) => point.size_d),
          borderColor: "#2196F3",
          backgroundColor: "rgba(33, 150, 243, 0.1)",
          tension: 0.4,
          fill: true
        })
      }

      if (this.selectedSizes.includes("size_e")) {
        datasets.push({
          label: "1.0 micron (p/m³)",
          data: this.testPoints.map((point) => point.size_e),
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true
        })
      }

      if (this.selectedSizes.includes("size_f")) {
        datasets.push({
          label: "5.0 micron (p/m³)",
          data: this.testPoints.map((point) => point.size_f),
          borderColor: "#FF9800",
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          tension: 0.4,
          fill: true
        })
      }

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              display: true,
              position: "top"
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": " +
                    context.parsed.y.toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1
                    })
                  )
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Particle Count (p/m³)"
              },
              ticks: {
                callback: function (value) {
                  return value.toLocaleString("en-US")
                }
              }
            },
            x: {
              title: {
                display: true,
                text: "Date & Time"
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      })
    },

    updateChart() {
      if (this.testPoints.length > 0) {
        this.createChart()
      }
    },

    destroyChart() {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    },

    formatDateTime(datetime) {
      if (!datetime) return ""
      const date = new Date(datetime)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
    },

    formatNumber(value) {
      if (value === null || value === undefined) return "0.0"
      return parseFloat(value).toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      })
    },

    exportData() {
      if (this.testPoints.length === 0) return

      const headers = ["Reading No.", "Date & Time", "0.5 micron (p/m³)", "1.0 micron (p/m³)", "5.0 micron (p/m³)"]

      const rows = this.testPoints.map((point) => [
        point.reading_no,
        this.formatDateTime(point.dateandtime),
        point.size_d,
        point.size_e,
        point.size_f
      ])

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `room_test_points_${Date.now()}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    close() {
      this.dialog = false
    },

    resetDialog() {
      this.testPoints = []
      this.search = ""
      this.readingsError = null
      this.selectedSizes = ["size_d", "size_e", "size_f"]
      this.destroyChart()
    }
  },

  beforeDestroy() {
    this.destroyChart()
  }
}
</script>

<style scoped>
.v-dialog .v-card {
  overflow: visible;
}

canvas {
  max-height: 400px;
}
</style>
