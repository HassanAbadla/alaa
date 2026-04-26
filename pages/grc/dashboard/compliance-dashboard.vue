<template>
  <v-can show-message :permission="'view_compliance_dashboard'">
    <v-progress-linear
      v-if="loading"
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="primary"
    ></v-progress-linear>
    <v-container v-if="!loading" fluid style="background-color: #f2f4f8; min-height: 100vh; padding: 16px">
      <v-row>
        <v-col cols="12">
          <v-card
            class="pa-3 d-flex align-center"
            color="primary"
            dark
            elevation="3"
            style="border-radius: 12px; height: 70px"
          >
            <div class="text-h5 font-weight-bold flex-grow-1">
              {{ $t("page.compliance_insights_dashboard") }}
            </div>

            <v-img
              :src="logo"
              alt="Company Logo"
              max-width="100"
              max-height="60"
              contain
              style="background: transparent; padding: 5px; border-radius: 6px; margin-left: auto; object-fit: contain"
            ></v-img>
          </v-card>
        </v-col>
      </v-row>

      <!--<v-row dense justify="center" align="center" style="margin-top: 16px; margin-bottom: 16px">
      <v-col cols="auto">
        <v-select
          v-model="selectedRegulator"
          :items="regulators"
          item-text="name"
          item-value="id"
          label="Regulator"
          dense
          outlined
          clearable
          hide-details
          append-icon="mdi-menu-down"
          color="white"
          append-icon-color="white"
          style="background-color: #232757; width: 150px; border-radius: 12px"
          label-color="white"
          dark
        ></v-select>
      </v-col>
     
      <v-col cols="auto">
        <v-select
          v-model="selectedFramework"
          :items="frameworks"
          item-text="name"
          item-value="id"
          label="Framework"
          dense
          outlined
          clearable
          hide-details
          append-icon="mdi-menu-down"
          color="white"
          append-icon-color="white"
          label-color="white"
          dark
        ></v-select>
      </v-col>
   
     <v-col cols="auto">
        <v-select
          v-model="selectedCompany"
          :items="companies"
          item-text="name"
          item-value="id"
          label="Company"
          dense
          outlined
          clearable
          hide-details
          append-icon="mdi-menu-down"
          color="white"
          append-icon-color="white"
          style="background-color: #232757; width: 150px; border-radius: 12px"
          label-color="white"
          dark
        ></v-select>
      </v-col>
    </v-row>-->

      <!--CARDS-->
      <div class="cards-grid-fixed" style="margin-top: 16px; margin-bottom: 0px">
        <v-card
          v-for="(card, index) in statCards"
          :key="index"
          class="stat-card-item no-shadow outlined-card"
          outlined
          style="height: 100px; border-radius: 12px"
        >
          <div class="pa-3 text-center rounded-lg d-flex flex-column justify-center" style="color: #232757">
            <div class="stat-title text-subtitle-1 font-weight mb-2" style="font-size: 14px; line-height: 1.2">
              {{ card.title }}
            </div>

            <div class="stat-value text-h5">
              {{ card.value }}
            </div>
            <div
              v-if="
                card.title === $t('page.unassigned_controls') || card.title === $t('page.number_of_overdue_controls')
              "
              class="d-flex align-center text-body-2"
              style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)"
            >
              <span style="color: #e74c3c; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.target_must_be_0") }}
              </span>
            </div>
          </div>
        </v-card>
      </div>

      <v-row dense>
        <!-- - number of controls per domain -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-start"
            outlined
            style="border-radius: 12px; height: 350px"
          >
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.number_of_controls_per_domain") }}
            </div>
            <Chart
              :type="'line'"
              :chart-data="domainChartData"
              :chart-options="domainChartOptions"
              :chart-height="300"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>
        <!--  Number of Controls -->
        <v-col cols="12" md="4">
          <v-card class="pa-4 d-flex flex-column" outlined style="border-radius: 12px; height: 350px">
            <div class="text-h6 text-center mb-2">
              {{ $t("page.assigned_controls") }}
            </div>

            <div class="flex-grow-1 d-flex align-center justify-center">
              <!-- <Chart
                :type="'doughnut'"
                :chart-data="controlsByStatusChartData"
                :chart-options="controlsByStatusChartOptions"
                :chart-height="200"
                :chart-width="'90%'"
                :chart-plugins="[centerPercentagePlugin]"
              /> -->
              <Chart :key="chartKey" :type="'bar'" :chart-data="chartData" :chart-options="chartOptions" />
            </div>
            <!-- <div
              class="d-flex align-center justify-center mb-o pb-0"
              style="font-size: 12px; color: #666; font-family: inherit"
            >
              <v-icon small color="primary" class="mr-1">mdi-arrow-up-bold</v-icon>
              <span style="font-weight: bold; color: #232757">{{ $t("page.largest_percentage") }}</span>
            </div>-->
          </v-card>
        </v-col>

        <!--- Number of Controls by Reviewer -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-start no-shadow"
            outlined
            elevation="0"
            style="border-radius: 12px; height: 350px"
          >
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.number_of_controls_by_reviewer") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="controlsByReviewerChartData"
              :chart-options="controlsByReviewerChartOptions"
              :chart-height="300"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>
      </v-row>
      <!--  Number of Open and Closed Contracts-->
      <v-row dense class="mt-2">
        <v-col cols="12" md="4">
          <v-card class="pa-4 d-flex flex-column" outlined style="border-radius: 12px; height: 350px">
            <!-- Title -->
            <div class="text-h6 text-center mb-3" style="color: #232757">
              {{ $t("page.number_of_open_and_closed_contracts") }}
            </div>

            <!-- CONTENT -->
            <div class="flex-grow-1 d-flex align-center justify-center">
              <!-- Pie Chart (CENTER) -->
              <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                <Chart
                  :type="'pie'"
                  :chart-data="pieChartData"
                  :chart-options="pieChartOptions"
                  :chart-height="220"
                  :chart-width="220"
                />
              </div>

              <!-- Legend (RIGHT) -->
              <div class="ml-4" style="max-height: 220px; overflow-y: auto">
                <ul style="list-style: none; padding: 0; margin: 0">
                  <li v-for="(label, index) in pieChartData.labels" :key="index" class="d-flex align-center mb-2">
                    <span
                      :style="{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        marginRight: '6px',
                        flexShrink: 0,
                        backgroundColor: pieChartData.datasets[0].backgroundColor[index]
                      }"
                    ></span>

                    <span style="font-size: 12px; color: #666">
                      {{ label }}: {{ pieChartData.datasets[0].data[index] }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </v-card>
        </v-col>

        <!--- Number of Overdue Controls Per Reviewer-->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-start"
            outlined
            style="border-radius: 12px; height: 350px"
          >
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.number_of_overdue_controls_per_reviewer") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="NumberOverdueChartData"
              :chart-options="NumberOverdueChartOptions"
              :chart-height="300"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>
        <!--- Controls Required by Framework-->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-start"
            outlined
            style="border-radius: 12px; height: 350px"
          >
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.controls_required_by_framework") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="controlsByFrameworkChartData"
              :chart-options="controlsByFrameworkChartOptions"
              :chart-height="300"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>
      </v-row>
      <!--  Compliance Percentage By Framework & Task Line (Due Date)-->
      <!--
    <v-row dense class="mt-2">
      chart7 - Compliance Percentage Per Framework
      <v-col cols="12" md="4">
        <v-card
          class="pa-4 d-flex flex-column align-center justify-center"
          outlined
          style="border-radius: 12px; height: 250px"
        >
          <div class="text-h6 text-center mb-2">{{ $t("page.compliance_percentage_by_framework") }}</div>
          <Chart
            :type="'bar'"
            :chart-data="compliancePercentageChartData"
            :chart-options="compliancePercentageChartOptions"
            :chart-height="180"
            :chart-width="'90%'"
          />
        </v-card>
      </v-col>

      <!-- chart8-->
      <!--<v-col cols="12" md="4">
        <v-card
          class="pa-4 d-flex flex-column align-center justify-center"
          outlined
          style="border-radius: 12px; height: 250px"
        >
          <div class="text-h6 text-center mb-2">Number of Assigned Controls</div>
          <Chart
            :type="'pie'"
            :chart-data="assignedChartData"
            :chart-options="assignedChartOptions"
            :chart-height="180"
            :chart-width="'90%'"
          />
        </v-card>
      </v-col>-->

      <!--- Task Line (Due Date)-->
      <!-- <v-col cols="12" md="4">
        <v-card
          class="pa-4 d-flex flex-column align-center justify-center"
          outlined
          style="border-radius: 12px; height: 250px"
        >
          <div class="text-h6 text-center mb-2">{{ $t("page.task_line") }}</div>
          <Chart
            :type="'bar'"
            :chart-data="taskChartData"
            :chart-options="taskChartOptions"
            :chart-height="180"
            :chart-width="'90%'"
          />
        </v-card>
      </v-col>
    </v-row> -->
      <!-- Dashboard Version -->
      <div class="text-caption text-right mt-4" style="color: #666">v1.5.1</div>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapActions } from "vuex"
import Chart from "@/components/charts/Chart.vue"
import UserMasterDashboard from "@/components/sidebar/UserMasterDashboard.vue"
import { getAllSubcriptions } from "@/api/subscriptions-api"
import { userChart } from "@/api/user-api"
const centerPercentagePlugin = {
  id: "centerPercentage",
  beforeDraw(chart) {
    if (chart.config.type !== "doughnut") return

    const { ctx, chartArea } = chart
    if (!chartArea) return

    const dataset = chart.data.datasets[0]
    if (!dataset || !dataset.data?.length) return

    const total = dataset.data.reduce((a, b) => a + b, 0)
    if (!total) return

    const maxValue = Math.max(...dataset.data)
    const percentage = Math.round((maxValue / total) * 100)

    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    ctx.save()
    ctx.font = "23px Arial"
    ctx.fillStyle = "#232757"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${percentage}%`, centerX, centerY)
    ctx.restore()
  }
}

export default {
  name: "ComplianceDashboard",
  components: { Chart, UserMasterDashboard },
  layout: "dashboard-layout",
  data() {
    return {
      loading: true,
      selectedRegulator: null,
      selectedFramework: null,
      selectedCompany: null,
      regulators: [],
      auditItemsData: [],
      logo: require("@/assets/img/logo-sw1.svg"),
      centerPercentagePlugin,
      //chartPlugins: [],
      // user master chart
      chartKey: 0,
      chartData: null,
      loading: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              // stacked: true
              // barPercentage: 0.1, // Adjust this value to change bar width
              // categoryPercentage: 0.8
            }
          ],
          yAxes: [
            {
              // stacked: true,
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  if (Math.floor(value) === value) {
                    return value
                  }
                }
              }
            }
          ]
        },
        legend: {
          display: false
          // position: "top"
        }
      }
    }
  },
  computed: {
    ...mapState("risk", ["regulators", "frameworks", "companies"]),
    ...mapState("audits", ["audits"]),
    ...mapState("complianceDashboard", {
      frameworkAuditItems: (state) => state.frameworkAuditItems,
      complianceStatuses: (state) => state.complianceStatuses,
      controlsByFramework: (state) => state.controlsByFramework,
      avgAuditScore: (state) => state.avgAuditScore,
      avgAuditProgress: (state) => state.avgAuditProgress
    }),
    ...mapState(["isRTL"]),

    filteredAudits() {
      return this.audits.filter((audit) => {
        if (this.selectedRegulator && audit.regulator?.id !== this.selectedRegulator) return false

        if (
          this.selectedFramework &&
          !audit.audit_contracts?.some((contract) => contract.framework?.id === this.selectedFramework)
        )
          return false

        if (this.selectedCompany && Number(audit.company?.id) !== Number(this.selectedCompany)) return false

        return true
      })
    },
    // isRTL() {
    //   return (this.$i18n.locale = "ar")
    // },
    statCards() {
      console.log("auditItemsData:", this.auditItemsData)

      if (!this.auditItemsData) {
        console.log("No auditItemsData found")
        return this.getDefaultStats()
      }

      const data = this.auditItemsData.data || this.auditItemsData
      console.log("Extracted data:", data)

      if (!data) {
        console.log("No data found in auditItemsData")
        return this.getDefaultStats()
      }

      const activeFrameworks = data.audit_by_compliance
        ? data.audit_by_compliance.filter((item) => item.count > 0).length
        : 0

      const avgComplianceScore = data.avg_audit_score || 0

      const pendingItems = data.audit_status ? data.audit_status.find((item) => item.status === "Pending") : null
      const unassignedControls = pendingItems ? pendingItems.count : 0

      const overdueControls = data.overdue_controls !== undefined ? data.overdue_controls : 0

      const avgComplianceProgress = data.avg_audit_progress || 0

      console.log("Calculated stats:", {
        activeFrameworks,
        avgComplianceScore,
        unassignedControls,
        overdueControls,
        avgComplianceProgress
      })

      return [
        {
          title: this.$t("page.active_frameworks"),
          value: activeFrameworks.toString()
        },
        {
          title: this.$t("page.average_compliance_score"),
          value: `${avgComplianceScore}%`
        },
        {
          title: this.$t("page.unassigned_controls"),
          value: unassignedControls.toString()
        },
        {
          title: this.$t("page.number_of_overdue_controls"),
          value: overdueControls.toString()
        },
        {
          title: this.$t("page.average_compliance_percentage"),
          value: `${avgComplianceProgress}%`
        }
      ]
    },
    //chart1
    compliancePercentageChartData() {
      if (!this.auditItemsData?.audit_by_compliance || this.auditItemsData.audit_by_compliance.length === 0) {
        return {
          labels: [],
          datasets: [
            {
              label: "Compliance Percentage",
              data: [],
              backgroundColor: "#4a6fa5",
              borderColor: "#2d4a7a",
              borderWidth: 0,
              barPercentage: 0.6,
              categoryPercentage: 0.8,
              borderRadius: 10
            }
          ]
        }
      }

      const items = this.auditItemsData.audit_by_compliance
      console.log("Compliance data for chart:", items)

      const labels = items.map((item) => {
        const name = item.name || "Unknown Framework"

        let shortName = name
          .split("-")[0]
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .trim()

        if (shortName.length > 30) {
          shortName = shortName.substring(0, 30) + "..."
        }

        return shortName
      })

      const data = items.map((item) => item.compliance_percentage || 0)

      return {
        labels,
        datasets: [
          {
            label: "Compliance Percentage",
            data,
            backgroundColor: "#4a6fa5",
            borderColor: "#2d4a7a",
            borderWidth: 2,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
            borderRadius: 8
          }
        ]
      }
    },

    compliancePercentageChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: function (value) {
                return value
              },
              font: {
                size: 12
              }
              //color: "#232757"
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false
            },
            title: {
              display: false,
              text: "Compliance Percentage",
              font: {
                size: 12
                //weight: "bold"
              }
              //color: "#232757"
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              //color: "#232757",
              font: {
                size: 12
              },
              maxRotation: 45,
              minRotation: 45,
              padding: 10
            },
            title: {
              display: false,
              text: "Frameworks",
              font: {
                size: 12
                // weight: "bold"
              }
              //color: "#232757"
            }
          }
        },
        plugins: {
          centerPercentage: false,
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgba(35, 39, 87, 0.9)",
            titleColor: "white",
            bodyColor: "white",
            titleFont: {
              size: 12,
              weight: "bold"
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%) `
              },
              title: (tooltipItems) => {
                return ` Compliance: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: {
            display: false,
            anchor: "end",
            align: "top",
            formatter: function (value) {
              return value
            },
            color: "#232757",
            font: {
              size: 12,
              weight: "bold"
            },
            padding: 4
          }
        },
        layout: {
          padding: {
            top: 20,
            right: 15,
            bottom: 15,
            left: 15
          }
        }
      }
    },
    //chart2
    controlsByStatusChartData() {
      const items = this.auditItemsData?.audit_status || []
      const labels = items.map((item) => item.status)
      const data = items.map((item) => item.count)
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ["#e2be36", "#7aba41", "#232757", "#eaa035", "#54689d"],
            borderColor: "#2d4a7a",
            borderWidth: 0,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            borderSkipped: false,
            hoverOffset: 10
          }
        ]
      }
    },
    controlsByStatusChartOptions() {
      const items = this.auditItemsData?.audit_status || []
      const total = items.reduce((sum, item) => sum + item.count, 0)

      return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          centerPercentage: {
            enabled: true
          },
          title: { display: false },
          subtitle: { display: false },
          legend: {
            display: false,
            position: "right",
            labels: {
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
              font: { size: 12 },
              padding: 10,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || ""
                const value = context.parsed || 0
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%) `
              },

              title: (tooltipItems) => {
                return `Control Status: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: {
            display: false,
            color: "#232757",
            font: { weight: "bold", size: 16 },
            formatter: function (value, context) {
              const data = context.chart.data.datasets[0].data
              const maxValue = Math.max(...data)
              if (value === maxValue) {
                return value + "%"
              }
              return ""
            }
          }
        },
        elements: {
          arc: { borderWidth: 2, borderColor: "#ffffff", borderAlign: "center" }
        }
      }
    },
    //chart3 - Number of Controls by Reviewer
    controlsByReviewerChartData() {
      if (!this.auditItemsData?.items_by_reviewer || this.auditItemsData.items_by_reviewer.length === 0) {
        console.log("No items_by_reviewer data found:", this.auditItemsData)
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Number of Controls",
              data: [0],
              backgroundColor: "#232757",
              borderColor: "#232757",
              borderWidth: 0,
              barPercentage: 0.4,
              categoryPercentage: 0.6,
              borderRadius: 4
            }
          ]
        }
      }

      const items = this.auditItemsData.items_by_reviewer
      console.log("Controls by Reviewer data from API:", items)

      const labels = items.map((item) => {
        const reviewerName = item.name || "Unknown Reviewer"
        return reviewerName.length > 15 ? reviewerName.substring(0, 15) + "..." : reviewerName
      })

      const data = items.map((item) => item.count || 0)

      return {
        labels,
        datasets: [
          {
            label: "Number of Controls",
            data,
            backgroundColor: "#232757",
            borderColor: "#232757",
            borderWidth: 0,
            barPercentage: 0.4,
            categoryPercentage: 0.6,
            borderRadius: 4,
            maxBarThickness: 30
          }
        ]
      }
    },

    controlsByReviewerChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: {
                size: 12
                // weight: "bold"
              }
              //color: "#232757"
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false
            },
            title: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              // color: "#232757",
              font: {
                size: 12
                // weight: "bold"
              }
              //maxRotation: 45,
              //minRotation: 45
            }
          }
        },
        plugins: {
          centerPercentage: false,
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#232757",
            titleFont: {
              size: 12,
              weight: "bold"
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Control Reviewer: ${tooltipItems[0].label}`
              }
            },
            displayColors: false
          },
          datalabels: {
            display: false,
            anchor: "end",
            align: "top",
            formatter: function (value) {
              return value
            },
            color: "#232757",
            font: {
              size: 12
              // weight: "bold"
            },
            padding: 4
          }
        },
        layout: {
          padding: {
            top: 20,
            right: 15,
            bottom: 15,
            left: 15
          }
        }
      }
    },
    //chart4
    pieChartData() {
      const openCount = this.audits.filter((audit) => audit.close === 0 || audit.isClosed === false).length
      const closedCount = this.audits.filter((audit) => audit.close === 1 || audit.isClosed === true).length

      console.log("Pie Chart Data: ", { openCount, closedCount })

      return {
        labels: ["Open", "Closed"],
        datasets: [
          {
            backgroundColor: ["#e2be36", "#232757"],
            data: [openCount, closedCount]
            // hoverOffset: 10
          }
        ]
      }
    },
    pieChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        layout: { padding: 20 },
        clip: false,
        plugins: {
          centerPercentage: false,
          legend: {
            display: false,
            position: "right",
            labels: {
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
              font: { size: 12 },
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
                return `Contracts: ${tooltipItems[0].label}`
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
    //chart5
    NumberOverdueChartData() {
      const items = this.auditItemsData?.overdue_items_by_reviewer || []
      // return items
      const labels = items.map((item) => item.name.split("-")[0] || "Unknown Framework")
      const data = items.map((item) => item.count)
      return {
        labels,
        datasets: [
          {
            label: "#Audit Items",
            backgroundColor: this.getThemeColor("primary"),
            borderRadius: 3,
            data,
            maxBarThickness: 30
          }
        ]
      }
    },
    NumberOverdueChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 12 }
              // color: "#232757"
            },
            grid: { color: "#f0f0f0", drawBorder: false },
            title: { display: false }
          },
          x: {
            grid: { display: false },
            ticks: {
              // color: "#232757",
              font: { size: 12 }
              //maxRotation: 45,
              // minRotation: 45
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#232757",
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 12 },
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Reviewer: ${tooltipItems[0].label}`
              }
            },
            displayColors: false
          },
          datalabels: {
            display: false,
            anchor: "end",
            align: "top",
            formatter: function (value) {
              return value
            },
            color: "#232757",
            font: { size: 12 },
            padding: 4
          }
        },
        layout: { padding: { top: 20, right: 15, bottom: 15, left: 15 } },
        elements: {
          bar: {
            borderWidth: 0,
            borderRadius: {
              topLeft: 4,
              topRight: 4
            },
            borderSkipped: "bottom"
          }
        }
      }
    },
    //chart6
    controlsByFrameworkChartData() {
      const items = this.auditItemsData?.audit_by_compliance || []
      // return items
      const labels = items.map((item) => item.name.split("-")[0] || "Unknown Framework")
      const data = items.map((item) => item.count)

      return {
        labels,
        datasets: [
          {
            label: "# Controls Required",
            backgroundColor: this.getThemeColor("primary"),
            borderRadius: 5,
            data,
            maxBarThickness: 30
          }
        ]
      }
    },

    controlsByFrameworkChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "#Controls Required",
              font: {
                size: 12
                //weight: "bold"
              }
              // color: "#232757"
            },
            ticks: {
              precision: 0,
              // color: "#232757",
              font: {
                size: 12
                // weight: "bold"
              }
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false
            }
          },
          x: {
            title: {
              beginAtZero: true,
              min: 0,
              display: false,
              text: "Frameworks",
              font: {
                size: 12
                //weight: "bold"
              }
              //  color: "#232757"
            },
            grid: {
              display: false,
              color: "#f0f0f0",
              drawBorder: false
            },
            ticks: {
              // color: "#232757",
              font: {
                size: 12
                // weight: "bold"
              }
              //maxRotation: 45,
              //minRotation: 45
            }
          }
        },
        plugins: {
          centerPercentage: false,
          datalabels: {
            display: false
          },
          legend: {
            display: false
          },
          title: {
            display: false,
            text: "#Controls Required by Frameworks",
            font: {
              size: 12,
              weight: "bold"
            }
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#232757",
            titleFont: {
              size: 12,
              weight: "bold"
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Framework: ${tooltipItems[0].label}`
              }
            }
          }
        }
      }
    },
    // chart7 - Number of Controls Per Domain

    domainChartData() {
      const domains = this.auditItemsData?.controls_per_domain || []

      if (!domains || domains.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Number of Controls",
              data: [0],
              backgroundColor: "#232757",
              borderColor: "#232757",
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: "#232757",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8
            }
          ]
        }
      }

      const sortedDomains = [...domains].sort((a, b) => b.count - a.count)

      const labels = sortedDomains.map((domain) => {
        const name = domain.name || "Unknown Domain"

        let shortName = name
          .split("-")[0]
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .trim()

        if (shortName.length > 20) {
          shortName = shortName.substring(0, 20) + "..."
        }

        return shortName
      })

      const data = sortedDomains.map((domain) => domain.count || 0)

      return {
        labels,
        datasets: [
          {
            label: "Number of Controls",
            data,
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

    domainChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          x: {
            type: "number",
            easing: "linear",
            duration: 1000,
            from: NaN, // Important for progressive line
            delay: function (context) {
              return context.dataIndex * 100
            }
          },
          y: {
            type: "number",
            easing: "easeInOutQuart",
            duration: 1500,
            from: function (context) {
              return context.chart.scales.y.min
            },
            delay: function (context) {
              return context.dataIndex * 100
            }
          }
        },

        interaction: {
          intersect: false,
          mode: "index"
        },

        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Controls",
              font: {
                size: 12
                // weight: "bold"
              }
              // color: "#232757"
            },
            ticks: {
              precision: 0,
              font: {
                size: 12
                //weight: "bold"
              }
              // color: "#232757"
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false
            }
          },
          x: {
            title: {
              display: false,
              text: "Domains",
              font: {
                size: 12
                // weight: "bold"
              }
              // color: "#232757"
            },
            ticks: {
              font: {
                size: 12
                // weight: "bold"
              }
              //color: "#232757",
              // maxRotation: 45,
              // minRotation: 45
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          centerPercentage: false,
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#232757",

            titleFont: {
              size: 12,
              weight: "bold"
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Domain: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: {
            display: false
          }
        },
        interaction: {
          intersect: false,
          mode: "index"
        },
        elements: {
          line: {
            tension: 0.4
          }
        }
      }
    },
    // chart8 - Number of Assigned Controls
    assignedChartData() {
      const assigned = this.auditItemsData?.assigned_controls || []
      const labels = assigned.map((item) => item.status)
      const data = assigned.map((item) => item.count)
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ["#7aba41", "#e2be36", "#232757", "#eaa035", "#54689d"],
            borderColor: "#2d4a7a",
            borderWidth: 0,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            borderSkipped: false
          }
        ]
      }
    },
    assignedChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          centerPercentage: false,
          legend: {
            position: "right",
            labels: {
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
                    index: i
                  }
                })
              },
              boxWidth: 40,
              font: {
                size: 12
              },
              padding: 15
            }
          },
          title: {
            display: false,
            text: "Assigned Controls"
          },
          datalabels: {
            display: false
          }
        }
      }
    }

    // chart9 - Task Line (Due Date)
    // taskChartData() {
    //   const items = this.auditItemsData?.items_by_due_date || []

    //   console.log("Items by due date for chart9:", items)

    //   if (!items || items.length === 0) {
    //     console.log("No items_by_due_date data found for chart9")
    //     return {
    //       labels: ["No Data"],
    //       datasets: [
    //         {
    //           label: "Tasks Due",
    //           data: [0],
    //           backgroundColor: "#232757",
    //           borderColor: "#232757",
    //           borderWidth: 2
    //         }
    //       ]
    //     }
    //   }

    //   const labels = items.map((item) => {
    //     const date = new Date(item.start_date)
    //     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    //   })

    //   const data = items.map((item) => item.count || 0)

    //   console.log("Chart9 processed data:", { labels, data })

    //   return {
    //     labels,
    //     datasets: [
    //       {
    //         label: "Tasks Due",
    //         data,
    //         backgroundColor: "#232757",
    //         borderColor: "#232757",
    //         borderWidth: 2,
    //         borderRadius: 4,
    //         barPercentage: 0.6,
    //         categoryPercentage: 0.8
    //       }
    //     ]
    //   }
    // },

    // taskChartOptions() {
    //   return {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     scales: {
    //       x: {
    //         title: {
    //           display: false,
    //           text: "Week Starting",
    //           font: {
    //             size: 12
    //             //weight: "bold"
    //           },
    //           color: "#232757"
    //         },
    //         grid: {
    //           display: false,
    //           color: "#f0f0f0",
    //           drawBorder: false
    //         },
    //         ticks: {
    //           color: "#232757",
    //           font: {
    //             size: 12
    //             // weight: "bold"
    //           },
    //           maxRotation: 45,
    //           minRotation: 45
    //         }
    //       },
    //       y: {
    //         beginAtZero: true,
    //         title: {
    //           display: false,
    //           text: "Number of Tasks",
    //           font: {
    //             size: 12
    //             // weight: "bold"
    //           },
    //           color: "#232757"
    //         },
    //         ticks: {
    //           precision: 0,
    //           font: {
    //             size: 12
    //             // weight: "bold"
    //           },
    //           color: "#232757"
    //         },
    //         grid: {
    //           color: "#f0f0f0",
    //           drawBorder: false
    //         }
    //       }
    //     },
    //     plugins: {
    //       centerPercentage: false,
    //       legend: {
    //         display: false
    //       },
    //       datalabels: {
    //         display: false
    //       },
    //       tooltip: {
    //         backgroundColor: "rgba(35, 39, 87, 0.9)",
    //         titleColor: "white",
    //         bodyColor: "white",
    //         titleFont: {
    //           size: 12
    //           //weight: "bold"
    //         },
    //         bodyFont: {
    //           size: 12
    //         },
    //         callbacks: {
    //           label: (context) => {
    //             const label = context.label || ""
    //             const value = context.raw || 0
    //             const total = context.dataset.data.reduce((a, b) => a + b, 0)
    //             const perc = total ? ((value / total) * 100).toFixed(1) : 0
    //             return `${label}: ${value} (${perc}%)`
    //           },
    //           title: (tooltipItems) => {
    //             return `Due Date: ${tooltipItems[0].label}`
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  },

  async mounted() {
    try {
      await Promise.all([
        this.fetchComplianceCharts().then((audits) => {
          this.auditItemsData = audits.data.data
        }),
        this.loadChartData(),
        getAllSubcriptions(this.$axios).then((response) => {
          this.regulators = response.data.data
        }),
        this.$store.dispatch("audits/fetchAudits")
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions("complianceDashboard", ["fetchComplianceCharts"]),
    getThemeColor(colorName) {
      return this.$vuetify.theme.themes.light[colorName]
    },
    // user master chart methods
    loadChartData() {
      this.loading = true
      this.chartData = null
      userChart(this.$axios)
        .then((res) => {
          this.chartData = {
            labels: res.data.data.map((item) => item.compliance_package),
            datasets: [
              {
                label: this.$t("page.count"),
                data: res.data.data.map((item) => item.audit_reviews_count),
                // backgroundColor: this.$vuetify.theme.themes.light.secondary
                backgroundColor: "#001B37"
              }
            ]
          }
          this.forceChartRerender()
        })
        .catch((error) => {
          console.error("Error loading chart data:", error)
          this.chartData = null
        })
        .finally(() => {
          this.loading = false
        })
    },
    forceChartRerender() {
      this.chartKey += 1
    }
  }
}
</script>

<style scoped>
.stat-title {
  color: #232757 !important;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  color: #54689d !important;
  font-size: 40px;
  font-weight: bold;
}

.cards-grid-fixed {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card-item {
  height: 120px;
  border-radius: 12px;
  min-width: 0;
}

.cards-grid-fixed::after {
  content: "";
  flex: auto;
}

@media (max-width: 600px) {
  .cards-grid-fixed {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .cards-grid-fixed {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1264px) and (max-width: 1499px) {
  .cards-grid-fixed {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1500px) {
  .cards-grid-fixed {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media (min-width: 1600px) {
  .cards-grid-fixed {
    grid-template-columns: repeat(5, 1fr);
  }
}

.stat-title {
  color: black;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  color: black;
  font-size: 40px;
  font-weight: bold;
}
.no-shadow {
  box-shadow: none !important;
}

.outlined-card {
  border: 1px solid #e0e0e0;
}
</style>
