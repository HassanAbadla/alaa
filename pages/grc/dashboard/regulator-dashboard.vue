<template>
  <v-can show-message :permission="'view_regulator_dashboard'">
    <v-container fluid style="background-color: #f5f5f5; min-height: 100vh; padding: 20px">
      <!-- العنوان -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card class="pa-3" color="#232757" dark elevation="3" style="border-radius: 12px">
            <div class="text-h5 font-weight-bold text-left">Risk Dashboard</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- الفلاتر -->
      <v-row dense justify="center" align="center" class="mb-4">
        <!-- Regulator -->
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
      </v-row>

      <!--cards-->
      <v-row dense class="mb-4 justify-start">
        <v-col v-for="(item, index) in stats" :key="index" cols="12" sm="6" md="4" lg="2">
          <v-card outlined class="pa-3 text-center" style="height: 100px; border-radius: 12px">
            <div class="text-subtitle-1 font-weight mb-2" style="font-size: 12px; line-height: 1.2">
              {{ item.title }}
            </div>
            <div class="text-h5 font-weight-bold" style="color: #232757">{{ item.value }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- الصف الذي يحتوي على الجدول والرسوم البيانية -->
      <v-row class="mt-4" dense align="start">
        <!-- العمود الأول: الجدول -->
        <v-col cols="12" md="3">
          <v-card class="pa-4" outlined style="border-radius: 12px; height: 100%">
            <div class="font-weight-bold text-center mb-4">Top 5 Risk Treatments</div>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>Framework</th>
                  <th>Subscriptions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in frameworksTableData" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.subscriptions }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Total</td>
                  <td class="font-weight-bold">{{ frameworksTotalSubscriptions }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>

        <!-- العمود الثاني: الرسوم البيانية -->
        <v-col cols="12" md="9">
          <!-- الصف الأول من الرسوم -->
          <v-row dense>
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4" outlined style="border-radius: 12px">
                <div class="text-h6 text-center mb-4">Total Risks by Likelihood</div>
                <Chart
                  :type="'bar'"
                  :chart-data="complianceItemsByFrameworkChartData"
                  :chart-options="complianceItemsByFrameworkChartOptions"
                  :chart-height="250"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4" outlined style="border-radius: 12px">
                <div class="text-h6 text-center mb-4">Active Frameworks</div>
                <Chart
                  :type="'bar'"
                  :chart-data="activeFrameworksChartData"
                  :chart-options="activeFrameworksChartOptions"
                  :chart-height="250"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4" outlined style="border-radius: 12px">
                <div class="text-h6 text-center mb-4">Regulators by Country</div>
                <Chart
                  :type="'bar'"
                  :chart-data="regulatorCountryChartData"
                  :chart-options="regulatorCountryChartOptions"
                  :chart-height="250"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>
          </v-row>

          <!-- الصف الثاني من الرسوم -->
          <v-row dense class="mt-4">
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4" outlined style="border-radius: 12px">
                <div class="text-h6 text-center mb-4">Frameworks by Regulator</div>
                <Chart
                  :type="'bar'"
                  :chart-data="frameworksChartData"
                  :chart-options="frameworksChartOptions"
                  :chart-height="250"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4" outlined style="border-radius: 12px">
                <div class="text-h6 text-center mb-4">Additional Chart 1</div>
                <Chart
                  :type="'bar'"
                  :chart-data="chart5Data"
                  :chart-options="chart5Options"
                  :chart-height="250"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4" outlined style="border-radius: 12px">
                <div class="text-h6 text-center mb-4">Additional Chart 2</div>
                <Chart
                  :type="'bar'"
                  :chart-data="chart6Data"
                  :chart-options="chart6Options"
                  :chart-height="250"
                  :chart-width="'100%'"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-can>
</template>
<script>
import { getAllSubcriptions } from "@/api/subscriptions-api"
import { mapState, mapActions } from "vuex"
import Chart from "@/components/charts/Chart.vue"

export default {
  name: "RegulatorDashboard",
  components: { Chart },
  layout: "dashboard-layout",
  data() {
    return {
      selectedRegulator: null,
      regulators: []
    }
  },
  computed: {
    ...mapState("regulatorDashboard", [
      "dashboardData",
      "regulatorsByCountry",
      "frameworksByPackage",
      "complianceItemsByActivePackages",
      "frameworkTable",
      "frameworkByRegulator"
    ]),

    stats() {
      return [
        { title: "Total Residual Risks", value: "0" },
        { title: "Total Evaluated Risks", value: "0" },
        { title: "Total Unevaluated Risks", value: "0" },
        { title: "Average Treatment Progress", value: "0%" },
        { title: "Total Risks", value: "0" },
        { title: "Exposure", value: "0 SAR" }
      ]
    },
    //table
    frameworksTableData() {
      const items = this.frameworkTable || []

      return items.map((item, index) => {
        const name = item.package_name || `Unnamed ${index}`
        const count = Number(item.count) || 0

        return {
          name: name.trim(),
          subscriptions: count
        }
      })
    },
    frameworksTotalSubscriptions() {
      return this.frameworksTableData.reduce((total, item) => total + item.subscriptions, 0)
    },

    //chart1
    regulatorCountryChartData() {
      const labels = this.regulatorsByCountry.map((item) => item.country)
      const data = this.regulatorsByCountry.map((item) => item.count)

      return {
        labels,
        datasets: [
          {
            label: "Total Risk by likelihood",
            backgroundColor: "#232757",
            data
          }
        ]
      }
    },
    regulatorCountryChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Country"
            },
            ticks: { precision: 0 }
          },
          x: {
            title: {
              display: false,
              text: "#Regulators"
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          },
          tooltip: {
            enabled: true
          },
          legend: { display: false, position: "top" },
          title: {
            display: false,
            text: "#Regulators by Country"
          }
        }
      }
    },
    //chart2
    frameworksChartData() {
      const items = this.frameworkByRegulator || []
      const labels = items.map((item) => item.regulator.split("-")[0])
      const data = items.map((item) => item.frameworks_count)

      return {
        labels,
        datasets: [
          {
            label: "Frameworks by Package",
            backgroundColor: "#66BB6A",
            data
          }
        ]
      }
    },
    frameworksChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "#Regulators"
            },
            ticks: { precision: 0 }
          },
          x: {
            title: {
              display: true,
              text: "#Frameworks"
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          },
          legend: { position: "top" },
          title: {
            display: true,
            text: "#FrameWorks by Regulators"
          }
        }
      }
    },
    //chart3
    complianceItemsByFrameworkChartData() {
      const items = this.complianceItemsByActivePackages || []
      const labels = items.map((item) => item.package_name.split("-")[0] || "Unknown Framework")
      const data = items.map((item) => item.items_count)

      return {
        labels,
        datasets: [
          {
            label: "#Compliance Items",
            backgroundColor: "#AB47BC",
            data
          }
        ]
      }
    },
    complianceItemsByFrameworkChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "#Compliance Items"
            }
          },
          x: {
            title: {
              display: true,
              text: "#Frameworks"
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          },
          legend: { display: false },
          title: {
            display: true,
            text: "Compliance Items by Active Frameworks"
          }
        }
      }
    },
    //chart4
    activeFrameworksChartData() {
      const items = this.frameworksByPackage || []
      const labels = items.map((item) => item.package_name)
      const data = items.map((item) => item.items_count)

      return {
        labels,
        datasets: [
          {
            label: "#Compliance Items",
            backgroundColor: "#AB47BC",
            data
          }
        ]
      }
    },
    activeFrameworksChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "#FrameWorks"
            }
          },
          x: {
            title: {
              display: true,
              text: "Active Frameworks"
            }
          }
        },
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Active Frameworks"
          }
        }
      }
    }
  },
  async mounted() {
    try {
      const response = await getAllSubcriptions(this.$axios)
      this.regulators = response.data.data

      await this.fetchRegulatorCharts()
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  },
  methods: {
    ...mapActions("regulatorDashboard", [
      "fetchRegulatorCharts",
      "fetchRegulatorsByCountry",
      "fetchFrameworksByPackage",
      "fetchComplianceItemsByActivePackages",
      "fetchFrameworkTable",
      "fetchFrameworksByRegulator"
    ])
  }
}
</script>
