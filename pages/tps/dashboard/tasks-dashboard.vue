<template>
  <v-can show-message :permission="'view_tasks_dashboard'">
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
            <div class="text-h5 font-weight-bold flex-grow-1">{{ $t("page.tasks_dashboard") }}</div>
            <v-img :src="logo" max-width="110" max-height="60" contain />
          </v-card>
        </v-col>
      </v-row>

      <!-- MAIN CONTENT -->
      <v-row dense>
        <!-- LEFT COLUMN (Filters + Stats) -->
        <v-col cols="12" md="2" class="pr-md-3">
          <custom-dropdown
            :items="doneFilterData"
            item-value="id"
            item-text="name"
            :label="$t('Filter')"
            v-model="filters.done"
            @input="applyFilters"
          />

          <v-row dense class="g-3">
            <v-col cols="12" v-for="(item, index) in statCards" :key="index">
              <v-card
                outlined
                class="pa-3 d-flex flex-column"
                style="height: 157px; border-radius: 14px; position: relative"
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

                <!-- Target Note -->
                <div
                  v-if="item.title === $t('page.open_tasks') || item.title === $t('page.overdue_tasks')"
                  class="d-flex align-center text-caption"
                  style="font-size: 12px; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)"
                >
                  <span style="color: #e74c3c; margin-right: 4px">▼</span>
                  <span class="font-weight-bold" style="color: #232757">
                    {{ $t("page.target_must_be_0") }}
                  </span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- RIGHT COLUMN (Charts) -->
        <v-col cols="12" md="10">
          <!-- ROW 1: Tasks by Users + Task Age Distribution -->
          <v-row dense class="g-3">
            <!-- Tasks by Users -->
            <v-col cols="12" md="5">
              <v-card class="pa-4 d-flex flex-column" outlined style="height: 350px; border-radius: 12px">
                <div class="text-h6 text-center mb-2" style="color: #232757">
                  {{ $t("page.tasks_by_users") }}
                </div>
                <div style="flex: 1; overflow-y: auto">
                  <Chart
                    :type="'bar'"
                    :chart-data="tasksUsersChartData"
                    :chart-options="tasksUsersChartOptions"
                    :chart-height="400"
                    :chart-width="'95%'"
                  />
                </div>
                <!-- <div style="flex: 1; overflow-y: auto">
                <progress-box
                  chart
                  horizontal
                  :type="'bar'"
                  :chart-width="'400px'"
                  :chart-height="'500px'"
                  :stats="tasksUsersChartDataForProgressBox"
                  filter-type="srv_contract_status_id"
                  :selected-filter-id="receiver_id"
                  @filter-change="navegateToUsersTasks"
                  hideTemplateLegend="true"
                />
              </div>-->
                <div class="d-flex align-center mt-1 text-caption" style="font-size: 12px; color: #666">
                  <span style="color: #d4a017; margin-right: 4px">▼</span>
                  <span class="font-weight-bold" style="color: #232757">
                    {{ $t("page.click_to_drill_down") }}
                  </span>
                </div>
              </v-card>
            </v-col>

            <!-- Task Age Distribution -->
            <v-col cols="12" md="7">
              <v-card class="pa-4 d-flex flex-column align-center" outlined style="height: 350px; border-radius: 12px">
                <div class="text-h6 text-center mb-2" style="color: #232757">
                  {{ $t("page.task_age_distribution") }}
                </div>
                <Chart
                  :type="'line'"
                  :chart-data="taskAgeChartData"
                  :chart-options="taskAgeChartOptions"
                  :chart-height="300"
                  :chart-width="'95%'"
                />
              </v-card>
            </v-col>
          </v-row>

          <!-- ROW 2: Tasks by GRC Domain + Tasks by Status -->
          <v-row dense class="g-3 mt-2">
            <!-- Tasks by GRC Domain -->
            <v-col cols="12" md="8">
              <v-card class="pa-4 d-flex flex-column align-center" outlined style="height: 340px; border-radius: 12px">
                <div class="text-h6 text-center mb-2" style="color: #232757">{{ $t("page.tasks_by_grc_domain") }}</div>
                <Chart
                  :type="'bar'"
                  :chart-data="tasksDomainChartData"
                  :chart-options="tasksDomainChartOptions"
                  :chart-height="300"
                  :chart-width="'95%'"
                />
              </v-card>
            </v-col>

            <!-- Tasks by Status -->
            <v-col cols="12" md="4">
              <v-card
                class="pa-4 d-flex flex-column"
                outlined
                style="height: 340px; border-radius: 12px; position: relative"
              >
                <!-- Title -->
                <div class="text-h6 text-center mb-3" style="color: #232757">
                  {{ $t("page.tasks_by_status") }}
                </div>

                <!-- Chart + Legend -->
                <div class="d-flex flex-grow-1" style="align-items: center; padding-bottom: 25px">
                  <!-- Pie Chart -->
                  <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 250px; height: 250px">
                    <Chart
                      :type="'doughnut'"
                      :chart-data="tasksStatusChartData"
                      :chart-options="tasksStatusChartOptions"
                      :chart-height="250"
                      :chart-width="250"
                    />
                  </div>

                  <!-- Custom Legend -->
                  <div class="flex-grow-1" style="margin-left: 18px; overflow-y: auto; max-height: 190px">
                    <ul style="list-style: none; padding: 0; margin: 0">
                      <li
                        v-for="(label, index) in tasksStatusChartData.labels"
                        :key="index"
                        class="d-flex align-center mb-2 legend-item"
                        @click="goToTaskStatus(tasksStatusChartData.ids[index])"
                      >
                        <span
                          :style="{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            marginRight: '6px',
                            flexShrink: 0,
                            backgroundColor: tasksStatusChartData.datasets[0].backgroundColor[index]
                          }"
                        ></span>
                        <span style="font-size: 12px; color: #666; cursor: pointer">
                          {{ label }}: {{ tasksStatusChartData.datasets[0].data[index] }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Annotation -->
                <div
                  class="d-flex align-center"
                  style="font-size: 12px; color: #666; position: absolute; bottom: 8px; left: 12px"
                >
                  <span style="color: #d4a017; margin-right: 4px">▼</span>
                  <span class="font-weight-bold" style="color: #232757">
                    {{ $t("page.click_to_drill_down") }}
                  </span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- Dashboard Version -->
      <div class="text-caption text-right mt-4" style="color: #666">v1.5.1</div>
    </v-container>
  </v-can>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"
import Chart from "@/components/charts/Chart.vue"
const DEFAULT_COLORS = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
import ProgressBox from "@/components/custom-table/ProgressBox.vue"

export default {
  name: "TasksDashboard",
  components: { Chart, ProgressBox },
  middleware: ["auth"],
  layout: "dashboard-layout",

  data() {
    return {
      loading: true,
      logo: require("@/assets/img/logo-sw1.svg"),
      filters: {
        done: null
      },
      receiver_id: null
    }
  },

  async mounted() {
    try {
      await Promise.all([this.fetchDashboardStats(this.filters), this.fetchTasks()])

      console.log("Dashboard stats from store:", this.dashboardStats)
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    } finally {
      this.loading = false
    }
  },

  computed: {
    ...mapState("tpsTasks", ["dashboardStats"]),
    ...mapGetters({
      getTasks: "tpsTasks/getTasks",
      loadingTasks: "tpsTasks/isLoading"
    }),
    statCards() {
      const stats = this.dashboardStats || {}
      return [
        {
          title: this.$t("page.total_tasks"),
          value: stats.total_tasks || 0
        },
        {
          title: this.$t("page.open_tasks"),
          value: stats.open_tasks || 0
        },
        {
          title: this.$t("page.overdue_tasks"),
          value: stats.overdue_tasks || 0
        },
        {
          title: this.$t("page.completed_tasks"),
          value: stats.completed_tasks || 0
        }
      ]
    },
    tasksStatusChartData() {
      const data = this.dashboardStats.tasks_by_status || []

      return {
        labels: data.map((i) => i.name),
        datasets: [
          {
            data: data.map((i) => i.count),
            backgroundColor: data.map((i, idx) => i.color)
            //hoverOffset: 10
          }
        ],
        ids: data.map((i) => i.id)
      }
    },
    tasksStatusChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        //radius: "80%",
        hoverOffset: 10,
        layout: { padding: 30 },
        clip: false,
        onClick: (evt, activeElements) => {
          if (!activeElements.length) return

          const index = activeElements[0].index
          const statusId = this.tasksStatusChartData.ids[index]

          this.goToTaskStatus(statusId)
        },
        onHover: (evt, activeElements) => {
          evt.native.target.style.cursor = activeElements.length ? "pointer" : "default"
        },

        plugins: {
          centerPercentage: false,
          legend: {
            display: false,
            position: "right",
            labels: {
              //color: "#232757",
              generateLabels: function (chart) {
                const data = chart.data
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  return {
                    text: `${label}: ${value}`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].borderColor
                      ? data.datasets[0].borderColor[i]
                      : data.datasets[0].backgroundColor[i],
                    lineWidth: data.datasets[0].borderWidth || 0,
                    hidden: false,
                    index: i,
                    pointStyle: "circle",
                    radius: 5
                  }
                })
              },
              boxWidth: 12,
              padding: 10,
              usePointStyle: true
            }
          },
          title: {
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
                return `Task Status: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: { display: false }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
        }
      }
    },
    tasksDomainChartData() {
      const data = this.dashboardStats.tasks_by_domain || []

      const generateGradient = (color1, color2, count) => {
        const hexToRgb = (hex) => {
          const hexColor = hex.replace("#", "")
          const r = parseInt(hexColor.substr(0, 2), 16)
          const g = parseInt(hexColor.substr(2, 2), 16)
          const b = parseInt(hexColor.substr(4, 2), 16)
          return { r, g, b }
        }

        const rgbToHex = (r, g, b) => {
          return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
            .toString(16)
            .padStart(2, "0")}`
        }

        const startColor = hexToRgb(color1)
        const endColor = hexToRgb(color2)

        const colors = []

        if (count === 1) {
          return [color1]
        }

        for (let i = 0; i < count; i++) {
          const ratio = i / (count - 1)

          const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio)
          const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio)
          const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio)

          colors.push(rgbToHex(r, g, b))
        }

        return colors
      }

      const gradientColors = generateGradient("#232757", "#54689d", data.length)

      return {
        labels: data.map((i) => i.name || "Unknown"),
        datasets: [
          {
            label: "Total Tasks",
            data: data.map((i) => i.count || 0),
            backgroundColor: gradientColors,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          }
        ]
      }
    },
    tasksDomainChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              // color: "#232757",
              font: {
                size: 12
              }
            },
            grid: {
              color: "#e0e0e0",
              drawBorder: false
            }
          },
          x: {
            display: true,
            ticks: {
              // color: "#232757",
              font: {
                size: 12
              }
              //maxRotation: 45,
              // minRotation: 45
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
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
                return `Task Domain: ${tooltipItems[0].label}`
              }
            }
          }
        },
        elements: {
          bar: {
            borderWidth: 0,
            borderRadius: {
              topLeft: 4,
              topRight: 4
            },
            borderSkipped: "bottom"
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

    taskAgeChartData() {
      const data = this.dashboardStats.task_age_distribution || []

      return {
        labels: data.map((i) => i.age_range),
        datasets: [
          {
            label: "Tasks",
            data: data.map((i) => i.count),
            borderColor: "#232757",
            backgroundColor: "rgba(35, 39, 87, 0.15)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#232757",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      }
    },

    taskAgeChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          x: {
            type: "number",
            easing: "linear",
            duration: 1000,
            from: NaN,
            delay(context) {
              return context.dataIndex * 80
            }
          },
          y: {
            type: "number",
            easing: "easeOutQuart",
            duration: 800,
            from(context) {
              return context.chart.scales.y.min
            }
          }
        },

        plugins: {
          legend: {
            display: false,
            position: "bottom"
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Task Age: ${tooltipItems[0].label}`
              }
            }
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
              //color: "#232757"
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              // color: "#232757"
            }
          }
        },

        elements: {
          line: {
            borderWidth: 3
          },
          point: {
            radius: 4,
            backgroundColor: "#232757",
            borderColor: "#ffffff"
          }
        }
      }
    },
    tasksUsersChartData() {
      const tasks = this.getTasks || []

      const usersMap = {}

      tasks.forEach((task) => {
        if (!task.receiver) return

        const id = task.receiver.id
        const name = task.receiver.full_name

        if (!usersMap[id]) {
          usersMap[id] = { id, name, count: 0 }
        }

        usersMap[id].count++
      })

      const usersArray = Object.values(usersMap).sort((a, b) => b.count - a.count)

      const labels = usersArray.map((u) => u.name)
      const values = usersArray.map((u) => u.count)
      const ids = usersArray.map((u) => u.id)

      const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
      const totalUsers = values.length
      const colors = []

      const colorsPerBase = Math.ceil(totalUsers / baseColors.length)

      baseColors.forEach((baseColor) => {
        const hex = baseColor.replace("#", "")
        const num = parseInt(hex, 16)

        const r = (num >> 16) & 255
        const g = (num >> 8) & 255
        const b = num & 255

        for (let i = 0; i < colorsPerBase; i++) {
          if (colors.length >= totalUsers) break

          const factor = i * 0.15
          const newR = Math.min(255, Math.round(r + (255 - r) * factor))
          const newG = Math.min(255, Math.round(g + (255 - g) * factor))
          const newB = Math.min(255, Math.round(b + (255 - b) * factor))

          colors.push(`rgb(${newR}, ${newG}, ${newB})`)
        }
      })

      return {
        labels,
        ids,
        datasets: [
          {
            data: values,
            backgroundColor: colors
          }
        ]
      }
    },
    tasksUsersChartOptions() {
      const self = this
      const dataValues = self.tasksUsersChartData.datasets[0].data
      const maxValue = Math.max(...dataValues)

      const integerTicks = Array.from({ length: maxValue + 1 }, (_, i) => i)

      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",

        plugins: {
          legend: { display: false },
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
                return ` User Tasks: ${tooltipItems[0].label}`
              }
            }
          }
        },

        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              //color: "#232757",
              callback: function (value) {
                return integerTicks.includes(value) ? value : null
              }
            },
            grid: {
              color: "#e0e0e0"
            }
          },
          y: {
            ticks: {
              //color: "#232757"
            },
            grid: { display: false }
          }
        },

        elements: {
          bar: {
            borderRadius: {
              topLeft: 0,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 4
            },
            borderSkipped: false
          }
        },

        onHover: function (event, activeElements) {
          event.native.target.style.cursor = activeElements.length ? "pointer" : "default"
        },

        onClick: function (evt, activeElements) {
          if (!activeElements || !activeElements.length) return

          const index = activeElements[0].index
          const receiverId = self.tasksUsersChartData.ids[index]
          const userName = self.tasksUsersChartData.labels[index]

          console.log("Clicked user:", userName, "ID:", receiverId)

          self.navegateToUsersTasks({
            filterId: receiverId,
            userName
          })
        }
      }
    },
    doneFilterData() {
      return [
        { id: 1, name: this.$t("Done") },
        { id: 0, name: this.$t("Active") },
        { id: null, name: this.$t("All") }
      ]
    }
    // tasksUsersChartDataForProgressBox() {
    //   const data = this.getTasks || []

    //   const usersMap = {}
    //   data.forEach((task) => {
    //     if (!task.receiver) return
    //     const id = task.receiver.id
    //     const name = task.receiver.full_name

    //     if (!usersMap[id]) {
    //       usersMap[id] = { id, name, count: 0 }
    //     }

    //     usersMap[id].count++
    //   })

    //   const usersArray = Object.values(usersMap).sort((a, b) => b.count - a.count)

    //   const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
    //   const colors = []

    //   usersArray.forEach((user, index) => {
    //     colors.push(baseColors[index % baseColors.length])
    //   })

    //   const finalUsers = usersArray.map((user, i) => ({
    //     ...user,
    //     color: colors[(i * 2) % colors.length]
    //   }))

    //   return finalUsers
    // }
  },
  methods: {
    //...mapActions("tpsTasks", ["fetchDashboardStats", "fetchTasks"])
    ...mapActions({
      fetchTasks: "tpsTasks/fetchTasks",
      fetchDashboardStats: "tpsTasks/fetchDashboardStats"
    }),
    applyFilters() {
      this.fetchDashboardStats(this.filters)
    },
    navegateToUsersTasks(selectedFilterId) {
      console.log("Navigating to tasks with receiver_id:", selectedFilterId)
      this.$router.push({
        name: "tps",
        query: {
          receiver_id: selectedFilterId.filterId
        }
      })
    },
    goToTaskStatus(statusId) {
      console.log("Navigating to tasks with status_id:", statusId)
      this.$router.push({
        name: "tps",
        query: {
          status_id: statusId
        }
      })
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
</style>
