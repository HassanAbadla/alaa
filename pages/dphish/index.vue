<template>
  <v-can show-message :permission="'view_tasks_dashboard'">
    <v-container fluid style="background-color: #f2f4f8; min-height: 100vh; padding: 20px">
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
            <div class="text-h5 font-weight-bold flex-grow-1">Awareness Dashboard</div>
            <v-img :src="logo" max-width="110" max-height="60" contain />
          </v-card>
        </v-col>
      </v-row>

      <!-- MAIN CONTENT -->
      <v-row dense>
        <v-col cols="12" md="2" class="pr-md-3">
          <v-row dense class="g-3">
            <v-col cols="12" v-for="(item, index) in statCards" :key="index">
              <v-card
                outlined
                class="pa-3 d-flex flex-column"
                style="height: 170px; border-radius: 14px; position: relative"
              >
                <!-- Card Title -->
                <div class="text-subtitle-1 mb-2" style="font-size: 12px; text-align: center">
                  {{ item.title }}
                </div>

                <!-- Card Number -->
                <div class="d-flex align-center justify-center" style="flex: 1">
                  <div class="text-h3 font-weight-bold">
                    {{ item.value }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- RIGHT COLUMN (Charts) -->
        <v-col cols="12" md="10">
          <v-row dense class="g-3">
            <v-col cols="12" md="5">
              <v-card class="pa-4 d-flex flex-column" outlined style="height: 350px; border-radius: 12px">
                <div class="text-h6 text-center mb-2">Pass count by Course</div>

                <Chart
                  :type="'bar'"
                  :chart-data="passCountChartData"
                  :chart-options="passCountChartOptions"
                  :chart-height="300"
                  :chart-width="'95%'"
                />
              </v-card>
            </v-col>

            <v-col cols="12" md="7">
              <v-card class="pa-4 d-flex flex-column align-center" outlined style="height: 350px; border-radius: 12px">
                <div class="text-h6 text-center mb-2">Employee Awareness Status</div>
                <Chart
                  :type="'line'"
                  :chart-data="empAwarenessChartData"
                  :chart-options="empAwarenessChartOptions"
                  :chart-height="300"
                  :chart-width="'95%'"
                />
              </v-card>
            </v-col>
          </v-row>

          <!-- ROW 2 -->
          <v-row dense class="g-3 mt-2">
            <v-col cols="12" md="8">
              <v-card class="pa-4 d-flex flex-column align-center" outlined style="height: 340px; border-radius: 12px">
                <div class="text-h6 text-center mb-2">Awareness Campaign Timeline</div>
                <Chart
                  :type="'line'"
                  :chart-data="campaignTimelineChartData"
                  :chart-options="campaignTimelineChartOptions"
                  :chart-height="300"
                  :chart-width="'95%'"
                />
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-4 d-flex flex-column align-center" outlined style="height: 340px; border-radius: 12px">
                <div class="text-h6 text-center mb-2">Policy Statuses</div>
                <Chart
                  :type="'doughnut'"
                  :chart-data="policyStatusesChartData"
                  :chart-options="policyStatusesChartOptions"
                  :chart-height="300"
                  :chart-width="'95%'"
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
import Chart from "@/components/charts/Chart.vue"
export default {
  name: "DPhishDashboard",
  middleware: ["auth"],
  layout: "dashboard-layout",
  data() {
    return {
      logo: require("@/assets/img/logo-sw1.svg"),
      riskScores: [],
      campaignItem: [],
      campaignsData: [],
      awarenessStats: [],
      charts: [],
      policies: [],
      courses: [],
      quiz: []
    }
  },
  async mounted() {
    try {
      console.log("Logging in to Silverwolf...")

      const loginRes = await this.$silverwolf.post("api-auth/login/", {
        username: "alaa.othman.sw@menaqualification.com",
        password: "Alaa12345678!"
      })

      const access = loginRes.data.access
      const refresh = loginRes.data.refresh

      console.log("Silverwolf Login OK", { access, refresh })

      const headers = { Authorization: `Bearer ${access}` }

      const riskScores = await this.$silverwolf.get("risk_scores", { headers })
      this.riskScores = riskScores.data
      console.log("risk_scores:", riskScores.data)

      const campaignItem = await this.$silverwolf.get("dashboard/stats", { headers })
      this.campaignItem = campaignItem.data
      console.log("campaignItem", campaignItem.data)

      const campaignsData = await this.$silverwolf.get("dashboard2/stats", { headers })
      this.campaignsData = campaignsData.data
      console.log("campaignsData ", campaignsData.data)

      const awarenessStats = await this.$silverwolf.get("lms/dashboard/stats", { headers })
      this.awarenessStats = awarenessStats.data
      console.log("awarenessStats ", awarenessStats.data)

      const charts = await this.$silverwolf.get("lms/dashboard/charts", { headers })
      this.charts = charts.data
      console.log("charts", charts.data)

      const policies = await this.$silverwolf.get("policies/all_statistics", { headers })
      this.policies = policies.data
      console.log("policies", policies.data)

      const courses = await this.$silverwolf.get("/lms/dashboard/course-users", { headers })
      this.courses = courses.data
      console.log("courses", courses.data)

      const quiz = await this.$silverwolf.get("lms/dashboard/quiz-results", { headers })
      this.quiz = quiz.data
      console.log("quiz", quiz.data)
    } catch (err) {
      console.error("Silverwolf API error:", err)
    }
  },
  computed: {
    statCards() {
      const courseData = this.courses?.course_user_data || {}

      // Completed / Uncompleted
      const completedCourses = courseData.completed_courses_count || 0
      const uncompletedCourses = courseData.uncompleted_courses_count || 0

      // Campaign Performance Categories
      const campaignCategories = Array.isArray(this.campaignsData)
        ? this.campaignsData.length
        : Object.keys(this.campaignsData || {}).length

      // Risk Score (Latest)
      const latestRiskScore =
        Array.isArray(this.riskScores) && this.riskScores.length
          ? Math.round(this.riskScores[this.riskScores.length - 1].value)
          : 0

      return [
        {
          title: "Completed Courses",
          value: completedCourses
        },
        {
          title: "Uncompleted Courses",
          value: uncompletedCourses
        },
        {
          title: "Campaign Performance Categories",
          value: campaignCategories
        },
        {
          title: "Risk Score",
          value: latestRiskScore
        }
      ]
    },

    empAwarenessChartData() {
      const labels = this.awarenessStats?.results?.map((r) => r.name) || []
      const data = this.awarenessStats?.results?.map((r) => r.value) || []

      return {
        labels,
        datasets: [
          {
            label: "Employee Awareness Status",
            data,
            tension: 0.4,
            fill: false,
            borderColor: "#3f51b5",
            backgroundColor: "#3f51b5"
          }
        ]
      }
    },
    empAwarenessChartOptions() {
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
            backgroundColor: "rgba(35, 39, 87, 0.9)",
            titleColor: "#fff",
            bodyColor: "#fff",
            callbacks: {
              label(context) {
                return `Policies: ${context.parsed.y}`
              }
            }
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
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
    }
  }
}
</script>
