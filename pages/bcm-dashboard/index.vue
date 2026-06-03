<template>
  <div>
    <v-progress-linear
      v-if="loading"
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="primary"
    ></v-progress-linear>

    <v-container v-if="!loading" fluid style="background-color: #f2f4f8; min-height: 100vh; padding: 20px">
      <!-- HEADER -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="pa-4 d-flex align-center"
            color="primary"
            dark
            elevation="3"
            style="border-radius: 14px; height: 72px"
          >
            <div class="text-h5 font-weight-bold flex-grow-1">{{ $t("page.bcm_dashboard") }}</div>
            <v-img :src="logo" max-width="110" max-height="60" contain />
          </v-card>
        </v-col>
      </v-row>

      <!-- MAIN CONTENT -->
      <v-row dense style="align-items: stretch">
        <!-- LEFT COLUMN (4 stat cards) -->
        <v-col cols="12" md="2" class="pr-md-3" style="display: flex; flex-direction: column">
          <div style="display: flex; flex-direction: column; gap: 8px; flex: 1">
            <v-card
              v-for="(item, index) in statCards"
              :key="index"
              outlined
              class="pa-3 d-flex flex-column"
              style="flex: 1; border-radius: 14px; position: relative; min-height: 0"
            >
              <!-- Card Title -->
              <div class="text-h6 text-center mb-2" style="font-size: 12px; color: #232757; line-height: 1.3">
                {{ item.title }}
              </div>

              <!-- Card Number -->
              <div class="d-flex align-center justify-center" style="flex: 1">
                <div class="text-h3 font-weight-bold" style="color: #54689d">
                  {{ item.value }}
                </div>
              </div>

              <!-- Note (e.g. Lower is better) -->
              <div
                v-if="item.note"
                class="d-flex align-center text-caption"
                style="
                  font-size: 12px;
                  position: absolute;
                  bottom: 0px;
                  left: 50%;
                  transform: translateX(-50%);
                  white-space: nowrap;
                "
              >
                <span style="color: #e74c3c; margin-right: 4px">▼</span>
                <span class="font-weight-bold" style="color: #232757">{{ item.note }}</span>
              </div>
            </v-card>
          </div>
        </v-col>

        <!-- RIGHT COLUMN (Charts) -->
        <v-col cols="12" md="10">
          <!-- ROW 1: 3 charts top -->
          <v-row dense class="g-3">
            <!-- Threats by Category (PIE) -->
            <v-col cols="12" md="4">
              <v-card
                class="pa-4 d-flex flex-column"
                outlined
                style="height: 350px; border-radius: 12px; position: relative"
              >
                <div class="text-h6 text-center mb-2" style="color: #232757; font-weight: bold">
                  {{ $t("page.threats_by_category") }}
                </div>
                <div class="d-flex flex-grow-1 justify-center" style="align-items: center; padding-bottom: 25px">
                  <!-- Pie Chart -->
                  <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 250px; height: 220px">
                    <Chart
                      :type="'pie'"
                      :chart-data="threatsByCategoryChartData"
                      :chart-options="threatsByCategoryChartOptions"
                      :chart-height="220"
                      :chart-width="190"
                    />
                  </div>

                  <!-- Custom Legend -->
                  <div class="flex-grow-1" style="margin-left: 18px; overflow-y: auto; max-height: 190px">
                    <ul style="list-style: none; padding: 0; margin: 0">
                      <li
                        v-for="(label, index) in threatsByCategoryChartData.labels"
                        :key="index"
                        class="d-flex align-center mb-2"
                      >
                        <span
                          :style="{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            marginRight: '6px',
                            flexShrink: 0,
                            backgroundColor: threatsByCategoryChartData.datasets[0].backgroundColor[index]
                          }"
                        ></span>
                        <span style="font-size: 12px; color: #666">
                          {{ label }}: {{ threatsByCategoryChartData.datasets[0].data[index] }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Disruption Tolerance by Recovery Time -->
            <v-col cols="12" md="4">
              <v-card class="pa-4 d-flex flex-column" outlined style="height: 350px; border-radius: 12px">
                <div class="text-h6 text-center mb-3" style="color: #232757; font-weight: bold">
                  {{ $t("page.disruption_tolerance_by_recovery_time") }}
                </div>

                <Chart
                  :type="'bar'"
                  :chart-data="distributionTimesChartData"
                  :chart-options="distributionTimesChartOptions"
                  :chart-height="400"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>

            <!-- Impacts by Severity Level (DOUGHNUT) -->
            <v-col cols="12" md="4">
              <v-card
                class="pa-4 d-flex flex-column"
                outlined
                style="height: 350px; border-radius: 12px; position: relative"
              >
                <div class="text-h6 text-center mb-2" style="color: #232757; font-weight: bold">
                  {{ $t("page.impacts_by_severity_level") }}
                </div>

                <div class="d-flex flex-grow-1 justify-center" style="align-items: center; padding-bottom: 25px">
                  <!-- Doughnut Chart -->
                  <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 250px; height: 220px">
                    <Chart
                      :type="'doughnut'"
                      :chart-data="impactsBySeverityChartData"
                      :chart-options="impactsBySeverityChartOptions"
                      :chart-height="220"
                      :chart-width="190"
                    />
                  </div>

                  <!-- Custom Legend -->
                  <div class="flex-grow-1" style="margin-left: 18px; overflow-y: auto; max-height: 190px">
                    <ul style="list-style: none; padding: 0; margin: 0">
                      <li
                        v-for="(label, index) in impactsBySeverityChartData.labels"
                        :key="index"
                        class="d-flex align-center mb-2"
                      >
                        <span
                          :style="{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            marginRight: '6px',
                            flexShrink: 0,
                            backgroundColor: impactsBySeverityChartData.datasets[0].backgroundColor[index]
                          }"
                        ></span>
                        <span style="font-size: 12px; color: #666">
                          {{ label }}: {{ impactsBySeverityChartData.datasets[0].data[index] }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- ROW 2: CHART 4 + CHART 5 -->
          <v-row dense class="g-3 mt-2">
            <!-- RTO vs MTPD -->
            <v-col cols="12" md="5">
              <v-card
                class="pa-4 d-flex flex-column"
                outlined
                style="height: 350px; border-radius: 12px; position: relative; overflow: hidden"
              >
                <div class="text-h6 text-center mb-3" style="color: #232757; font-weight: bold">
                  {{ $t("page.recovery_time_downtime_thresholds_per_asset") }}
                </div>

                <v-row justify="center" class="mt-0 mb-2">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 6px">
                    <div
                      style="
                        font-size: 11px;
                        font-weight: 700;
                        color: #d4a017;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                      "
                    >
                      ▼ {{ $t("page.click_to_show_hide") }}
                    </div>
                    <div class="grc-legend">
                      <div
                        class="legend-item"
                        title="Recovery Time Objective"
                        @click="toggleRTO"
                        :style="{ opacity: showRTO ? 1 : 0.4, cursor: 'pointer' }"
                      >
                        <span class="dot rto-dot"></span>
                        RTO
                      </div>
                      <div
                        class="legend-item"
                        title="Maximum Tolerable Period of Disruption"
                        @click="toggleRPO"
                        :style="{ opacity: showRPO ? 1 : 0.4, cursor: 'pointer' }"
                      >
                        <span class="dot rpo-dot"></span>
                        MTPD
                      </div>
                    </div>
                  </div>
                </v-row>

                <div style="height: calc(100% - 110px); width: 100%; position: relative">
                  <Chart
                    :type="'bar'"
                    :chart-data="rtoVsMtpdChartData"
                    :chart-options="rtoVsMtpdChartOptions"
                    :chart-height="'100%'"
                    :chart-width="'100%'"
                  />
                </div>
              </v-card>
            </v-col>
            <!-- Impacts by Category -->
            <v-col cols="12" md="4">
              <v-card
                class="pa-4 d-flex flex-column"
                outlined
                style="height: 350px; border-radius: 12px; position: relative"
              >
                <div class="text-h6 text-center mb-2" style="color: #232757; font-weight: bold">
                  {{ $t("page.impacts_by_category") }}
                </div>

                <div class="d-flex flex-grow-1 justify-center" style="align-items: center; padding-bottom: 25px">
                  <!-- Pie Chart — same size as Threats by Category -->
                  <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 250px; height: 220px">
                    <Chart
                      :type="'pie'"
                      :chart-data="impactsByCategoryChartData"
                      :chart-options="impactsByCategoryChartOptions"
                      :chart-height="220"
                      :chart-width="190"
                    />
                  </div>

                  <!-- Custom Legend — same as Threats by Category -->
                  <div class="flex-grow-1" style="margin-left: 18px; overflow-y: auto; max-height: 190px">
                    <ul style="list-style: none; padding: 0; margin: 0">
                      <li
                        v-for="(label, index) in impactsByCategoryChartData.labels"
                        :key="index"
                        class="d-flex align-center mb-2"
                      >
                        <span
                          :style="{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            marginRight: '6px',
                            flexShrink: 0,
                            backgroundColor: impactsByCategoryChartData.datasets[0].backgroundColor[index]
                          }"
                        ></span>
                        <span style="font-size: 12px; color: #666">
                          {{ label }}: {{ impactsByCategoryChartData.datasets[0].data[index] }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </v-card>
            </v-col>
            <!-- (HORIZONTAL BAR) -->
            <v-col cols="12" md="3">
              <v-card class="pa-4 d-flex flex-column" outlined style="height: 350px; border-radius: 12px">
                <!-- <div class="text-h6 text-center mb-3" style="color: #232757; font-weight: bold">
                  Maximum Tolerable Period of Disruption (MTPD) by Asset
                </div>
                <div style="flex: 1; overflow-y: auto; overflow-x: hidden">
                  <Chart
                    :type="'bar'"
                    :chart-data="mtpdByAssetChartData"
                    :chart-options="mtpdByAssetChartOptions"
                    :chart-height="400"
                    :chart-width="'100%'"
                  />
                </div> -->

                <!-- <div class="text-h6 text-center mb-3" style="color: #232757; font-weight: bold">
                  Threats by Recovery Code
                </div>
                <div style="flex: 1; overflow-y: auto; overflow-x: hidden">
                  <Chart
                    :type="'bar'"
                    :chart-data="threatsByRecoveryCodeChartData"
                    :chart-options="threatsByRecoveryCodeChartOptions"
                    :chart-height="400"
                    :chart-width="'100%'"
                  />
                </div> -->
                <div class="text-h6 text-center mb-2" style="color: #232757; font-weight: bold">
                  {{ $t("page.threats_by_location") }}
                </div>
                <div style="flex: 1">
                  <Chart
                    :type="'bar'"
                    :chart-data="threatsByLocationChartData"
                    :chart-options="threatsByLocationChartOptions"
                    :chart-height="280"
                    :chart-width="'100%'"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Dashboard Version -->
      <div class="text-caption text-right mt-4" style="color: #666">v1.5.1</div>
    </v-container>
  </div>
</template>

<script>
import Chart from "@/components/charts/Chart.vue"
import axios from "axios"

export default {
  name: "BCMDashboard",
  components: { Chart },
  layout: "dashboard-layout",

  data() {
    return {
      loading: true,
      logo: require("@/assets/img/logo-sw1.svg"),
      showRTO: true,
      showRPO: true,
      dashboardStats: {
        total_threats: 0,
        average_rto_hours: 0,
        average_rpo_hours: 0,
        threats_during_peak_time: 0,
        distribution_times: [],
        impacts_by_category: [],
        impacts_by_severity: [],
        threats_by_category: [],
        threats_by_location: [],
        threats_by_recovery_code: [],
        threats_by_type: []
      }
    }
  },

  async mounted() {
    try {
      const http = this.$axios || axios
      const { data } = await http.get("/bcm-threats/dashboard")
      if (data.status === "success") {
        this.dashboardStats = data.data
      }
    } catch (error) {
      console.error("Failed to load BCM dashboard stats:", error)
    } finally {
      this.loading = false
    }
  },

  computed: {
    statCards() {
      const stats = this.dashboardStats || {}
      return [
        {
          title: this.$t("page.total_threats"),
          value: stats.total_threats || 0
        },
        {
          title: this.$t("page.average_rto_hours"),
          value: stats.average_rto_hours != null ? Math.round(stats.average_rto_hours) : 0,
          note: this.$t("page.lower_is_better")
        },
        {
          title: this.$t("page.total_impacts"),
          value: stats.total_impacts || 0
        },
        {
          title: this.$t("page.threats_during_peak_time"),
          value: stats.threats_during_peak_time || 0
        }
      ]
    },

    // ── Threats by Category (Pie) ──────────────────────────────────────────
    threatsByCategoryChartData() {
      const data = (this.dashboardStats || {}).threats_by_category || []
      return {
        labels: data.map((i) => i.category_name || "Unknown"),
        datasets: [
          {
            data: data.map((i) => i.count),
            backgroundColor: data.map((i) => i.color || "#54689d")
          }
        ]
      }
    },

    threatsByCategoryChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        layout: { padding: 10 },
        clip: false,
        plugins: {
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${context.label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Category: ${tooltipItems[0].label}`
              }
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff" }
        }
      }
    },

    // ── Threats by Location (Bar) ──────────────────────────────────────────
    threatsByLocationChartData() {
      const data = (this.dashboardStats || {}).threats_by_location || []

      const COLORS = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

      return {
        labels: data.map((i) => i.location),

        datasets: [
          {
            label: "Threats",
            data: data.map((i) => i.count),

            backgroundColor: data.map((_, idx) => COLORS[idx % COLORS.length]),

            borderColor: "transparent",
            borderWidth: 0,

            borderRadius: 4,

            maxBarThickness: 30
          }
        ]
      }
    },
    threatsByLocationChartOptions() {
      return {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0

                const total = context.dataset.data.reduce((a, b) => a + b, 0)

                const perc = total ? ((value / total) * 100).toFixed(1) : 0

                return `${label}: ${value} (${perc}%)`
              },

              title: (tooltipItems) => {
                return `Location: ${tooltipItems[0].label}`
              }
            },

            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          },

          datalabels: {
            display: false
          }
        },

        scales: {
          x: {
            ticks: {
              autoSkip: false,

              font: {
                size: 12
              },

              color: "#333",

              maxRotation: 0,
              minRotation: 0,

              callback: function (value) {
                const label = this.getLabelForValue(value)

                return label.length > 10 ? label.substring(0, 10) + "…" : label
              }
            },

            grid: {
              display: false,
              color: "rgba(0, 0, 0, 0.1)"
            }
          },

          y: {
            beginAtZero: true,

            ticks: {
              stepSize: 1,

              font: {
                size: 12
              },

              color: "#333"
            },

            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
              drawBorder: false
            }
          }
        },

        animation: {
          duration: 1000,
          easing: "easeOutQuart"
        },

        layout: {
          padding: {
            left: 5,
            right: 5,
            top: 10,
            bottom: 10
          }
        },

        elements: {
          bar: {
            borderRadius: 4
          }
        },

        datasets: {
          bar: {
            barPercentage: 0.6,
            categoryPercentage: 0.8
          }
        }
      }
    },

    // ── Impacts by Severity Level (Doughnut) ──────────────────────────────
    impactsBySeverityChartData() {
      const data = (this.dashboardStats || {}).impacts_by_severity || []
      return {
        labels: data.map((i) => i.strength_name),
        datasets: [
          {
            data: data.map((i) => i.count),
            backgroundColor: data.map((i) => i.color || "#54689d")
          }
        ]
      }
    },

    impactsBySeverityChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        layout: { padding: 10 },
        clip: false,
        plugins: {
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${context.label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Severity: ${tooltipItems[0].label}`
              }
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff" }
        }
      }
    },

    // ── MTPD by Asset (Horizontal Bar) ────────────────────────────────────

    // mtpdByAssetChartData() {
    //   const data = ((this.dashboardStats || {}).mrpd_by_asset || []).slice().sort((a, b) => b.mrpd_hours - a.mrpd_hours)
    //   const labels = data.map((i) => i.asset_name)
    //   const values = data.map((i) => i.mrpd_hours)
    //   const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

    //   const totalAssets = values.length
    //   const colors = []

    //   const colorsPerBase = Math.ceil(totalAssets / baseColors.length)

    //   baseColors.forEach((baseColor) => {
    //     const hex = baseColor.replace("#", "")
    //     const num = parseInt(hex, 16)

    //     const r = (num >> 16) & 255
    //     const g = (num >> 8) & 255
    //     const b = num & 255

    //     for (let i = 0; i < colorsPerBase; i++) {
    //       if (colors.length >= totalAssets) break

    //       const factor = i * 0.15

    //       const newR = Math.min(255, Math.round(r + (255 - r) * factor))
    //       const newG = Math.min(255, Math.round(g + (255 - g) * factor))
    //       const newB = Math.min(255, Math.round(b + (255 - b) * factor))

    //       colors.push(`rgb(${newR}, ${newG}, ${newB})`)
    //     }
    //   })

    //   return {
    //     labels,
    //     datasets: [
    //       {
    //         label: "Hours",
    //         data: values,
    //         backgroundColor: colors,
    //         borderWidth: 0,
    //         maxBarThickness: 32
    //       }
    //     ]
    //   }
    // },
    // mtpdByAssetChartOptions() {
    //   const self = this

    //   const dataValues = self.mtpdByAssetChartData.datasets[0].data
    //   const maxValue = Math.max(...dataValues)

    //   const integerTicks = Array.from({ length: Math.ceil(maxValue) + 1 }, (_, i) => i)

    //   return {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     indexAxis: "y",

    //     plugins: {
    //       legend: { display: false },

    //       datalabels: { display: false },

    //       tooltip: {
    //         callbacks: {
    //           label: (context) => {
    //             const label = context.label || ""
    //             const value = context.raw || 0

    //             const total = context.dataset.data.reduce((a, b) => a + b, 0)

    //             const perc = total ? ((value / total) * 100).toFixed(1) : 0

    //             return `${label}: ${value} hrs (${perc}%)`
    //           },

    //           title: (tooltipItems) => {
    //             return `MTPD Asset: ${tooltipItems[0].label}`
    //           }
    //         }
    //       }
    //     },

    //     scales: {
    //       x: {
    //         beginAtZero: true,

    //         ticks: {
    //           stepSize: 1,

    //           callback: function (value) {
    //             return integerTicks.includes(value) ? value : null
    //           },

    //           font: {
    //             size: 11
    //           }
    //         },

    //         grid: {
    //           color: "#e0e0e0"
    //         }
    //       },

    //       y: {
    //         ticks: {
    //           font: {
    //             size: 11
    //           }
    //         },

    //         grid: {
    //           display: false
    //         }
    //       }
    //     },

    //     elements: {
    //       bar: {
    //         borderRadius: {
    //           topLeft: 0,
    //           topRight: 4,
    //           bottomLeft: 0,
    //           bottomRight: 4
    //         },

    //         borderSkipped: false
    //       }
    //     },
    //     datasets: {
    //       bar: {
    //         barPercentage: 0.6,
    //         categoryPercentage: 0.8,
    //         maxBarThickness: 30
    //       }
    //     }
    //   }
    // },
    // ── Threats by Recovery Code (Horizontal Bar) ─────────────────
    // threatsByRecoveryCodeChartData() {
    //   const data = ((this.dashboardStats || {}).threats_by_recovery_code || [])
    //     .slice()
    //     .sort((a, b) => b.count - a.count)

    //   // Combine code + type to avoid duplicate labels
    //   const labels = data.map((i) => `${i.code} (${i.type})`)
    //   const values = data.map((i) => i.count)

    //   const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
    //   const totalItems = values.length
    //   const colors = []
    //   const colorsPerBase = Math.ceil(totalItems / baseColors.length)

    //   baseColors.forEach((baseColor) => {
    //     const hex = baseColor.replace("#", "")
    //     const num = parseInt(hex, 16)
    //     const r = (num >> 16) & 255
    //     const g = (num >> 8) & 255
    //     const b = num & 255

    //     for (let i = 0; i < colorsPerBase; i++) {
    //       if (colors.length >= totalItems) break
    //       const factor = i * 0.15
    //       const newR = Math.min(255, Math.round(r + (255 - r) * factor))
    //       const newG = Math.min(255, Math.round(g + (255 - g) * factor))
    //       const newB = Math.min(255, Math.round(b + (255 - b) * factor))
    //       colors.push(`rgb(${newR}, ${newG}, ${newB})`)
    //     }
    //   })

    //   return {
    //     labels,
    //     datasets: [
    //       {
    //         label: "Threats",
    //         data: values,
    //         backgroundColor: colors,
    //         borderWidth: 0,
    //         maxBarThickness: 32
    //       }
    //     ]
    //   }
    // },
    // threatsByRecoveryCodeChartOptions() {
    //   const dataValues = this.threatsByRecoveryCodeChartData.datasets[0].data
    //   const maxValue = Math.max(...dataValues)
    //   const integerTicks = Array.from({ length: Math.ceil(maxValue) + 1 }, (_, i) => i)

    //   return {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     indexAxis: "y",
    //     plugins: {
    //       legend: { display: false },
    //       datalabels: { display: false },
    //       tooltip: {
    //         callbacks: {
    //           title: (tooltipItems) => `Code: ${tooltipItems[0].label}`,
    //           label: (context) => {
    //             const value = context.raw || 0
    //             const total = context.dataset.data.reduce((a, b) => a + b, 0)
    //             const perc = total ? ((value / total) * 100).toFixed(1) : 0
    //             return `${context.label}: ${value} threats (${perc}%)`
    //           }
    //         },
    //         backgroundColor: "rgba(0, 0, 0, 0.8)",
    //         titleColor: "#fff",
    //         bodyColor: "#fff",
    //         borderColor: "#232757",
    //         borderWidth: 1
    //       }
    //     },
    //     scales: {
    //       x: {
    //         beginAtZero: true,
    //         ticks: {
    //           stepSize: 1,
    //           callback: function (value) {
    //             return integerTicks.includes(value) ? value : null
    //           },
    //           font: { size: 11 }
    //         },
    //         grid: { color: "#e0e0e0" }
    //       },
    //       y: {
    //         ticks: { font: { size: 11 } },
    //         grid: { display: false }
    //       }
    //     },
    //     elements: {
    //       bar: {
    //         borderRadius: {
    //           topLeft: 0,
    //           topRight: 4,
    //           bottomLeft: 0,
    //           bottomRight: 4
    //         },
    //         borderSkipped: false
    //       }
    //     },
    //     datasets: {
    //       bar: {
    //         barPercentage: 0.6,
    //         categoryPercentage: 0.8,
    //         maxBarThickness: 30
    //       }
    //     }
    //   }
    // },

    // ── Disruption Tolerance Window by Recovery Code (Floating Bar) ─────────────────
    distributionTimesChartData() {
      const data = ((this.dashboardStats || {}).distribution_times || [])
        .slice()
        // Sort by to_hours descending — biggest range on top
        .sort((a, b) => b.to_hours - b.from_hours - (a.to_hours - a.from_hours))

      return {
        labels: data.map((i) => i.code),
        datasets: [
          {
            label: "Disruption Tolerance Window",
            data: data.map((i) => [i.from_hours, i.to_hours]), //floating bar
            backgroundColor: data.map((i) => i.color || "#54689d"),
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            maxBarThickness: 80
          }
        ]
      }
    },
    distributionTimesChartOptions() {
      const allData = (this.dashboardStats || {}).distribution_times || []
      const maxValue = allData.length ? Math.max(...allData.map((i) => i.to_hours)) : 60

      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y", // Back to horizontal

        plugins: {
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => `${tooltipItems[0].label}`,
              label: (context) => {
                const [from, to] = context.raw
                return `Window: ${from}h → ${to}h`
              }
            },
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          }
        },

        scales: {
          x: {
            min: 0,
            max: maxValue + 5,

            title: {
              display: true,
              text: "Tolerance Level",
              font: { size: 12 },
              color: "#666"
            },

            ticks: {
              stepSize: 10,
              font: { size: 11 },
              color: "#555"
            },

            grid: { color: "#e0e0e0" }
          },

          y: {
            title: {
              display: true,
              text: "Recovery Time",
              font: { size: 12 },
              color: "#666"
            },

            ticks: {
              font: { size: 11 },
              color: "#333"
            },

            grid: { display: false }
          }
        },

        elements: {
          bar: {
            borderRadius: 4,
            borderSkipped: false // Critical for floating bars
          }
        },

        datasets: {
          bar: {
            barPercentage: 0.5,
            categoryPercentage: 0.7,
            maxBarThickness: 80
          }
        }
      }
    },
    impactsByCategoryChartData() {
      const data = (this.dashboardStats || {}).impacts_by_category || []
      return {
        labels: data.map((i) => i.category_name),
        datasets: [
          {
            data: data.map((i) => i.count),
            backgroundColor: data.map((i) => i.color || "#54689d")
          }
        ]
      }
    },
    impactsByCategoryChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        layout: { padding: 10 },
        clip: false,
        plugins: {
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${context.label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Category: ${tooltipItems[0].label}`
              }
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff" }
        }
      }
    },

    // ── RTO vs MTPD per Asset (Side by side Bar) ───────────────────────────────

    rtoVsMtpdChartData() {
      const data = (this.dashboardStats || {}).rto_vs_mrpd_by_asset || []

      // Truncate long names for display
      const labels = data.map((i) => {
        const name = i.asset_name || ""
        return name.length > 12 ? name.substring(0, 12) + "…" : name
      })

      const fullLabels = data.map((i) => i.asset_name || "") // keep full for tooltip
      const rtoData = data.map((i) => i.rto_hours)
      const rpoData = data.map((i) => i.mrpd_hours)

      const datasets = []

      if (this.showRTO) {
        datasets.push({
          label: "RTO",
          data: rtoData,
          backgroundColor: "#232757",
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: "bottom"
        })
      }

      if (this.showRPO) {
        datasets.push({
          label: "MTPD",
          data: rpoData,
          backgroundColor: "#54689d",
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: "bottom"
        })
      }

      return { labels, datasets, fullLabels }
    },
    rtoVsMtpdChartOptions() {
      const data = (this.dashboardStats || {}).rto_vs_mrpd_by_asset || []
      const fullLabels = data.map((i) => i.asset_name || "")

      return {
        responsive: true,
        maintainAspectRatio: false,
        // No indexAxis — vertical bars (default)
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 11 },
              color: "#333"
            },
            grid: {
              color: "#e0e0e0",
              drawBorder: false
            }
          },
          x: {
            ticks: {
              font: { size: 10 },
              color: "#333",
              maxRotation: 0, // keep labels horizontal
              minRotation: 0,
              autoSkip: false
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              // Show full asset name in tooltip title
              title: (tooltipItems) => {
                const idx = tooltipItems[0].dataIndex
                return fullLabels[idx] || tooltipItems[0].label
              },
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} hrs`
            },
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          }
        },
        elements: {
          bar: {
            borderRadius: { topLeft: 4, topRight: 4 },
            borderSkipped: "bottom"
          }
        },
        datasets: {
          bar: {
            barPercentage: 0.9,
            categoryPercentage: 0.5
          }
        }
      }
    }
  },

  methods: {
    toggleRTO() {
      if (this.showRTO && !this.showRPO) {
        this.showRTO = true
        this.showRPO = true
      } else {
        this.showRTO = true
        this.showRPO = false
      }
    },
    toggleRPO() {
      if (!this.showRTO && this.showRPO) {
        this.showRTO = true
        this.showRPO = true
      } else {
        this.showRTO = false
        this.showRPO = true
      }
    }
  }
}
</script>

<style scoped>
.legend-item {
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.legend-item:hover {
  opacity: 0.7;
}
.grc-legend {
  display: flex;
  gap: 20px;
  font-size: 13px;
  align-items: center;
  justify-content: center;
}
.dot {
  width: 20px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}
.rto-dot {
  background-color: #232757;
}
.rpo-dot {
  background-color: #54689d;
}
</style>
