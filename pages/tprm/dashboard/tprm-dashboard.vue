<template>
  <v-can show-message :permission="'view_tprm_dashboard'">
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
            <div class="text-h5 font-weight-bold flex-grow-1">{{ $t("page.tprm_dashboard") }}</div>

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
      <!--cards-->
      <v-row dense class="mt-4 mb-3" style="display: flex; flex-wrap: nowrap">
        <div v-for="(item, index) in statCards" :key="index" style="flex: 0 0 20%; padding: 0 4px">
          <v-card
            outlined
            class="pa-3 text-center d-flex flex-column justify-center"
            style="height: 100px; border-radius: 12px; min-width: 0; position: relative"
          >
            <div class="text-subtitle-1 font-weight" style="font-size: 14px; line-height: 1.2; color: #232757">
              {{ item.title }}
            </div>
            <div class="text-h5 font-weight-bold" style="color: #54689d; font-size: 20px">
              {{ item.value }}
            </div>

            <!-- Conditional Comment / Annotation -->
            <div
              v-if="item.title === $t('page.total_number_of_incidents')"
              class="text-caption d-flex align-center justify-center"
              style="
                font-size: 12px;
                color: #666;
                position: absolute;
                bottom: 0px;
                left: 50%;
                transform: translateX(-50%);
              "
            >
              <span style="color: #e74c3c; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.target_must_be_0") }}
              </span>
            </div>

            <div
              v-if="item.title === $t('page.total_potential_risks')"
              class="text-caption d-flex align-center justify-center"
              style="
                font-size: 12px;
                color: #666;
                position: absolute;
                bottom: 0px;
                left: 50%;
                transform: translateX(-50%);
              "
            >
              <span style="color: #e74c3c; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.target_must_be_0") }}
              </span>
            </div>
          </v-card>
        </div>
      </v-row>

      <!-- Charts Section -->

      <v-row dense class="my-1">
        <!-- Chart 11 -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center"
            outlined
            style="border-radius: 12px; height: 330px; color: #232757"
          >
            <!-- Title in the top center -->
            <div class="text-h6 text-center mb-2" style="color: #232757">
              {{ $t("page.top_5_third_parties_by_urgent_incidents") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="topUrgentIncidentsChartData"
              :chart-options="topUrgentIncidentsChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>

        <!-- Chart 2 -->
        <v-col cols="12" md="4">
          <v-card class="pa-6" outlined style="border-radius: 12px; height: 330px; position: relative">
            <!-- Title -->
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.third_parties_by_industry") }}
            </div>

            <!-- Centered Wrapper -->
            <div class="d-flex align-center justify-center" style="height: calc(100% - 70px)">
              <!-- Chart + Legend -->
              <div class="d-flex align-center">
                <!-- Pie Chart (CENTER) -->
                <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                  <Chart
                    :type="'pie'"
                    :chart-data="industryChartData"
                    :chart-options="industryChartOptions"
                    :chart-height="220"
                    :chart-width="220"
                  />
                </div>

                <!-- Legend (RIGHT) -->
                <div class="ml-6" style="max-height: 200px; overflow-y: auto; min-width: 140px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in industryChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="goToIndustry(industryChartData.datasets[0].industryIds[index])"
                    >
                      <span
                        :style="{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: industryChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ industryChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>

                  <!-- Annotation on the left inside the card -->
                  <div
                    class="d-flex align-center"
                    style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
                  >
                    <span style="color: #d4a017; margin-right: 4px">▼</span>
                    <span class="font-weight-bold" style="color: #232757">
                      {{ $t("page.click_to_drill_down") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Chart 10 -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center"
            outlined
            style="border-radius: 12px; height: 330px; color: #232757"
          >
            <!-- Title in the top center -->
            <div class="text-h6 text-center mb-2" style="color: #232757">
              {{ $t("page.incident_trend_over_time") }}
            </div>
            <Chart
              :type="'line'"
              :chart-data="incidentTrendChartData"
              :chart-options="incidentTrendChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-row dense class="my-1">
        <!-- Chart 4 -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-center"
            outlined
            style="border-radius: 12px; height: 330px"
          >
            <div class="text-h6 text-center mb-2" style="color: #232757">{{ $t("page.third_parties_by_status") }}</div>
            <Chart
              :type="'bar'"
              :chart-data="statusChartData"
              :chart-options="statusChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
            <!-- Annotation on the left inside the card -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <!--  <v-card
            class="pa-4 d-flex flex-column align-center justify-center"
            outlined
            style="border-radius: 12px; height: 330px"
          >
            <div class="text-h6 text-center mb-2" style="color: #232757">
              {{ $t("page.incident_severity_by_third_party") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="incidentSeverityChartData"
              :chart-options="incidentSeverityChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
           
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>-->
          <v-card class="pa-6" outlined style="border-radius: 12px; height: 330px; position: relative">
            <!-- Title -->
            <div class="text-h6 text-center mb-4" style="color: #232757">Incident Distribution by Type</div>

            <!-- Centered Wrapper -->
            <div class="d-flex align-center justify-center" style="height: calc(100% - 70px)">
              <!-- Chart + Legend -->
              <div class="d-flex align-center">
                <!-- Doughnut Chart (CENTER) -->
                <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                  <Chart
                    :type="'doughnut'"
                    :chart-data="allIncidentsChartData"
                    :chart-options="allIncidentsChartOptions"
                    :chart-height="220"
                    :chart-width="220"
                  />
                </div>

                <!-- Legend (RIGHT) -->
                <div class="ml-6" style="max-height: 200px; overflow-y: auto; min-width: 160px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in allIncidentsChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="drillDownIncidentType(allIncidentsChartData.datasets[0].ids[index])"
                    >
                      <span
                        :style="{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: allIncidentsChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ allIncidentsChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- Annotation on the left inside the card -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>
        </v-col>

        <!-- Chart 6 -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-center"
            outlined
            style="border-radius: 12px; height: 330px"
          >
            <div class="text-h6 text-center mb-2" style="color: #232757">
              {{ $t("page.third_parties_by_potential_risk") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="potentialChartData"
              :chart-options="potentialChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-row dense class="my-1">
        <!-- Chart 7 -->
        <v-col cols="12" md="4">
          <v-card class="pa-6" outlined style="border-radius: 12px; height: 330px; position: relative">
            <!-- Title -->
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.all_risks_by_outsorce_type") }}
            </div>

            <!-- Centered Content -->
            <div class="d-flex align-center justify-center" style="height: calc(100% - 70px)">
              <div class="d-flex align-center">
                <!-- Pie Chart (CENTER) -->
                <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                  <Chart
                    :type="'pie'"
                    :chart-data="outsorceChartData"
                    :chart-options="outsorceChartOptions"
                    :chart-height="220"
                    :chart-width="220"
                  />
                </div>

                <!-- Legend (RIGHT) -->
                <div class="ml-6" style="max-height: 200px; overflow-y: auto; min-width: 160px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in outsorceChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="goToOutsourceType(outsorceChartData.datasets[0].outsourceTypeIds[index])"
                    >
                      <span
                        :style="{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: outsorceChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ outsorceChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Annotation on the left inside the card -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>
        </v-col>

        <!-- Chart 8 -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-center"
            outlined
            style="border-radius: 12px; height: 330px"
          >
            <div class="text-h6 text-center mb-2" style="color: #232757">
              {{ $t("page.incident_severity_by_third_party") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="incidentChartData"
              :chart-options="incidentChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
            <!-- Annotation on the left inside the card -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>
        </v-col>

        <!-- Chart 9 -->
        <v-col cols="12" md="4">
          <v-card class="pa-6" outlined style="border-radius: 12px; height: 330px; position: relative">
            <!-- Title -->
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.third_parties_by_risk_level") }}
            </div>

            <!-- Chart + Legend -->
            <div class="d-flex align-center justify-center" style="height: calc(100% - 70px)">
              <div class="d-flex align-center">
                <!-- Doughnut Chart (CENTER) -->
                <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                  <Chart
                    :type="'doughnut'"
                    :chart-data="riskLevelChartData"
                    :chart-options="riskLevelChartOptions"
                    :chart-height="220"
                    :chart-width="220"
                  />
                </div>

                <!-- Legend (RIGHT) -->
                <div class="ml-6" style="max-height: 200px; overflow-y: auto; min-width: 160px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in riskLevelChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="goToRiskLevel(riskLevelChartData.datasets[0].riskLevelIds[index])"
                    >
                      <span
                        :style="{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: riskLevelChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ riskLevelChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- Annotation on the left inside the card -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense class="my-1">
        <!-- Chart 3 -->
        <v-col cols="12" md="4">
          <v-card class="pa-6" outlined style="border-radius: 12px; height: 330px; position: relative">
            <!-- Title -->
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.third_parties_by_rating") }}
            </div>

            <!-- Chart + Legend -->
            <div class="d-flex align-center justify-center" style="height: calc(100% - 70px)">
              <div class="d-flex align-center">
                <!-- Doughnut Chart (CENTER) -->
                <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                  <Chart
                    :type="'doughnut'"
                    :chart-data="ratingChartData"
                    :chart-options="ratingChartOptions"
                    :chart-height="220"
                    :chart-width="220"
                  />
                </div>

                <!-- Legend (RIGHT) -->
                <div class="ml-6" style="max-height: 200px; overflow-y: auto; min-width: 160px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li v-for="(label, index) in ratingChartData.labels" :key="index" class="d-flex align-center mb-2">
                      <span
                        :style="{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: ratingChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>

                      <span style="font-size: 12px; color: #666">
                        {{ label }}:
                        {{ ratingChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Chart 1 -->
        <v-col cols="12" md="4">
          <v-card
            class="pa-4 d-flex flex-column align-center justify-center"
            outlined
            style="border-radius: 12px; height: 330px"
          >
            <div class="text-h6 text-center mb-2" style="color: #232757">
              {{ $t("page.mean_time_to_resolve_per_third_party") }}
            </div>
            <Chart
              :type="'bar'"
              :chart-data="meanTimeChartData"
              :chart-options="meanTimeChartOptions"
              :chart-height="250"
              :chart-width="'90%'"
            />
          </v-card>
        </v-col>

        <!-- Chart 12 -->
        <v-col cols="12" md="4">
          <v-card class="pa-6" outlined style="border-radius: 12px; height: 330px; position: relative">
            <!-- Title -->
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.third_parties_by_criticality") }}
            </div>

            <!-- Chart + Legend -->
            <div class="d-flex align-center justify-center" style="height: calc(100% - 70px)">
              <div class="d-flex align-center">
                <!-- Pie Chart (CENTER) -->
                <div class="d-flex align-center justify-center" style="width: 220px; height: 220px">
                  <Chart
                    :type="'pie'"
                    :chart-data="criticalityChartData"
                    :chart-options="criticalityChartOptions"
                    :chart-height="220"
                    :chart-width="220"
                  />
                </div>

                <!-- Legend (RIGHT) -->
                <div class="ml-6" style="max-height: 200px; overflow-y: auto; min-width: 160px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in criticalityChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="goToCriticality(criticalityChartData.datasets[0].criticalityIds[index])"
                    >
                      <span
                        :style="{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: criticalityChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ criticalityChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- Annotation on the left inside the card -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; bottom: 12px; left: 16px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- Dashboard Version -->
      <div class="text-caption text-right mt-4" style="color: #666">v1.5.1</div>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import Chart from "@/components/charts/Chart.vue"

export default {
  name: "TPRMDashboard",
  components: { Chart },
  layout: "dashboard-layout",
  middleware: ["auth"],

  data() {
    return {
      loading: true,
      logo: require("@/assets/img/logo-sw1.svg"),
      incidentSeverityData: []
    }
  },

  async mounted() {
    try {
      await Promise.all([
        this.fetchThirdParties(),
        this.loadData(),
        this.fetchIndustries(),
        this.fetchRatings(),
        this.fetchIncidentTypes(),
        this.fetchPotentialRisks(),
        this.fetchOutsourceTypes(),
        this.fetchIncidents(),
        this.fetchOutsourceContracts(),
        this.fetchAggregateRiskLevels(),
        this.fetchDashboardData()
      ])
    } catch (e) {
      console.error("TPRM dashboard load failed:", e)
    } finally {
      this.loading = false
    }
  },

  computed: {
    ...mapState(["isRTL"]),
    ...mapGetters("tprmCriticalities", ["getCriticalities"]),
    ...mapGetters("tprmThirdParties", ["getThirdParties", "getDashboardData"]),
    ...mapGetters("tprmIndustries", ["getIndustries"]),
    ...mapGetters("tprmRatings", ["getRatings"]),
    ...mapGetters("tprmRatings", ["getRatings"]),
    ...mapGetters("tprmStatuses", ["getStatuses"]),
    ...mapGetters("tprmIncidentTypes", ["getIncidentTypes"]),
    ...mapGetters("tprmPotentialRisks", ["getPotentialRisks", "isLoading"]),
    ...mapGetters("tprmOutsourceTypes", ["getOutsourceTypes"]),
    ...mapGetters("tprmIncidents", ["getIncidents"]),
    ...mapGetters("tprmOutsourceContracts", ["getOutsourceContracts"]),
    ...mapGetters("tprmAggregateRiskLevel", ["getAggregateRiskLevels"]),
    ...mapState("tprmThirdParties", ["dashboardData"]),

    // Cards Dat
    statCards() {
      return [
        {
          title: this.$t("page.total_third_parties"),
          value: this.getThirdParties.length || 0
        },
        {
          title: this.$t("page.total_outsource_contracts"),
          value: this.getOutsourceContracts.length || 0
        },
        {
          title: this.$t("page.total_number_of_offerings"),
          value: this.getRatings.length || 0
        },
        {
          title: this.$t("page.total_number_of_incidents"),
          value: this.getIncidents.length || 0
        },
        {
          title: this.$t("page.total_potential_risks"),
          value: this.getPotentialRisks.length || 0
        }
      ]
    },

    // Chart1--Chart Data for Criticality
    criticalityChartData() {
      if (!this.getCriticalities || this.getCriticalities.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Third Parties by Criticality",
              data: [1],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const criticalityCounts = this.calculateCriticalityCounts()
      const labels = this.getCriticalities.map((item) => item.name || "Unknown")
      const data = this.getCriticalities.map((item) => criticalityCounts[item.id] || 0)
      const criticalityIds = this.getCriticalities.map((item) => item.id)

      const backgroundColor = this.getCriticalities.map((item, index) => {
        return (
          item.color ||
          item.chart_color ||
          item.bg_color ||
          item.style_color ||
          item.style?.color ||
          item.attributes?.color ||
          this.getDefaultColor(index)
        )
      })

      return {
        labels,
        datasets: [
          {
            label: "Third Parties by Criticality",
            data,
            criticalityIds,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0
            // hoverOffset: 10
          }
        ]
      }
    },

    criticalityChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        clip: false,
        hoverOffset: 10,
        layout: { padding: 20 },
        //radius: "80%",
        // CLICK (DRILL DOWN)
        onClick: (evt, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index
          const criticalityId = chart.data.datasets[0].criticalityIds[index]

          console.log("Drill Down → Criticality ID:", criticalityId)

          if (criticalityId) {
            this.goToCriticality(criticalityId)
          }
        },

        onHover(evt, elements) {
          evt.native.target.style.cursor = elements.length ? "pointer" : "default"
        },

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
                return `Criticality: ${tooltipItems[0].label}`
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

    // Chart2--Chart Data for Industry
    industryChartData() {
      if (!this.getIndustries || this.getIndustries.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Third Parties by Industry",
              data: [1],
              industryIds: [null],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const industryCounts = this.calculateIndustryCounts()

      const labels = this.getIndustries.map((item) => item.name || "Unknown")
      const data = this.getIndustries.map((item) => industryCounts[item.id] || 0)
      const industryIds = this.getIndustries.map((item) => item.id)

      /* ===== Base Colors ===== */
      const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

      /* ===== Shade Generator ===== */
      const generateColorShades = (hex, factor) => {
        const bigint = parseInt(hex.replace("#", ""), 16)
        let r = (bigint >> 16) & 255
        let g = (bigint >> 8) & 255
        let b = bigint & 255

        r = Math.min(255, Math.round(r + (255 - r) * factor))
        g = Math.min(255, Math.round(g + (255 - g) * factor))
        b = Math.min(255, Math.round(b + (255 - b) * factor))

        return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
      }

      /* ===== Background Colors ===== */
      const backgroundColor = this.getIndustries.map((item, index) => {
        const dbColor =
          item.color ||
          item.chart_color ||
          item.bg_color ||
          item.style_color ||
          item.style?.color ||
          item.attributes?.color

        if (dbColor) return dbColor

        const baseIndex = index % baseColors.length
        const shadeLevel = Math.floor(index / baseColors.length)

        const factor = shadeLevel * 0.18

        return shadeLevel === 0 ? baseColors[baseIndex] : generateColorShades(baseColors[baseIndex], factor)
      })

      return {
        labels,
        datasets: [
          {
            label: "Third Parties by Industry",
            data,
            industryIds,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0
            // hoverOffset: 10
          }
        ]
      }
    },

    industryChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        clip: false,
        hoverOffset: 10,
        layout: { padding: 20 },
        //radius: "80%",
        // CLICK (DRILL DOWN)
        onClick: (event, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index
          const industryId = chart.data.datasets[0].industryIds[index]

          this.goToIndustry(industryId)
        },

        // HOVER (cursor pointer)
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length ? "pointer" : "default"
        },

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
                return `Industry: ${tooltipItems[0].label}`
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
    // Chart3--Chart Data for Rating
    ratingChartData() {
      if (!this.getRatings || this.getRatings.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Third Parties by Rating",
              data: [1],
              backgroundColor: ["#e0e0e0"]
            }
          ]
        }
      }

      const ratingCounts = this.calculateRatingCounts()
      const labels = this.getRatings.map((item) => item.name || "Unknown")
      const data = this.getRatings.map((item) => ratingCounts[item.id] || 0)

      const startColor = "#232757"
      const endColor = "#54689d"
      const totalRatings = this.getRatings.length

      const generateGradientColor = (index, total) => {
        const ratio = index / Math.max(total - 1, 1)
        const hexToRgb = (hex) => {
          const bigint = parseInt(hex.replace("#", ""), 16)
          return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
          }
        }
        const rgbToHex = (r, g, b) => "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")

        const start = hexToRgb(startColor)
        const end = hexToRgb(endColor)

        const r = Math.round(start.r + (end.r - start.r) * ratio)
        const g = Math.round(start.g + (end.g - start.g) * ratio)
        const b = Math.round(start.b + (end.b - start.b) * ratio)

        return rgbToHex(r, g, b)
      }

      const backgroundColor = this.getRatings.map((item, index) => {
        const dbColor =
          item.color ||
          item.chart_color ||
          item.bg_color ||
          item.style_color ||
          item.style?.color ||
          item.attributes?.color
        if (dbColor) return dbColor
        return generateGradientColor(index, totalRatings)
      })

      return {
        labels,
        datasets: [
          {
            label: "Third Parties by Rating",
            data,

            backgroundColor,
            borderColor: "#ffffff",
            borderWidth: 0
            // hoverOffset: 10
          }
        ]
      }
    },
    ratingChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        //radius: "80%",
        clip: false,
        hoverOffset: 10,
        layout: { padding: 20 },

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
                return `Rating: ${tooltipItems[0].label}`
              }
            },
            datalabels: { display: false }
          },
          elements: {
            arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
          }
        }
      }
    },
    // Chart 4 -- Third Parties by Status
    statusChartData() {
      if (!this.getStatuses || this.getStatuses.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Third Parties by Status",
              data: [1],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const statusCounts = {}
      this.getStatuses.forEach((status) => {
        statusCounts[status.id] = 0
      })

      this.getThirdParties.forEach((thirdParty) => {
        const statusId = thirdParty.tprm_status_id || thirdParty.status?.id
        if (statusId && statusCounts[statusId] !== undefined) {
          statusCounts[statusId]++
        }
      })

      const labels = this.getStatuses.map((s) => s.name || "Unknown")
      const data = this.getStatuses.map((s) => statusCounts[s.id] || 0)
      const statusIds = this.getStatuses.map((s) => s.id)
      const backgroundColor = this.getStatuses.map((s, index) => {
        return s.color || s.chart_color || s.bg_color || this.getDefaultColor(index)
      })

      return {
        labels,
        statusIds,
        datasets: [
          {
            label: "Third Parties by Status",
            data,

            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0,
            //hoverOffset: 10,
            borderRadius: 4,
            maxBarThickness: 30
          }
        ]
      }
    },

    statusChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index

          // get status id by index
          const statusId = chart.data.statusIds[index]

          this.goToStatus(statusId)
        },
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length ? "pointer" : "default"
        },
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
                return `Status: ${tooltipItems[0].label}`
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
            title: {
              display: false,
              text: "Status",
              font: {
                size: 14,
                weight: "bold"
              },
              color: "#232757",
              padding: { top: 10 }
            },
            ticks: {
              autoSkip: false,
              font: {
                size: 12
              },
              color: "#333",
              maxTicksLimit: 10
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Third Parties",
              font: {
                size: 14,
                weight: "bold"
                //family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              color: "#232757",
              padding: { bottom: 10 }
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 12
              },
              color: "#333"
            },
            grid: {
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
    // Chart 5 -- Third Parties by Incident Types
    incidentChartData() {
      const thirdParties = this.getThirdParties || []
      const incidents = this.getIncidents || []

      if (!thirdParties.length) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Number of Incidents",
              data: [0],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 1
            }
          ]
        }
      }

      const incidentCountsByThirdParty = {}
      thirdParties.forEach((tp) => {
        incidentCountsByThirdParty[tp.id] = 0
      })

      incidents.forEach((incident) => {
        const thirdPartyId = incident.third_party_id || incident.third_party?.id
        if (thirdPartyId && incidentCountsByThirdParty[thirdPartyId] !== undefined) {
          incidentCountsByThirdParty[thirdPartyId]++
        }
      })

      const sortedThirdParties = [...thirdParties]
        .sort((a, b) => {
          const countA = incidentCountsByThirdParty[a.id] || 0
          const countB = incidentCountsByThirdParty[b.id] || 0
          return countB - countA
        })
        .slice(0, 10)
      const labels = sortedThirdParties.map((tp) => tp.company_name || tp.name || "Unknown")
      const data = sortedThirdParties.map((tp) => incidentCountsByThirdParty[tp.id] || 0)
      const thirdPartyIds = sortedThirdParties.map((tp) => tp.id)

      const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

      const generateShade = (color, shadeFactor) => {
        const hexToRgb = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16)
          const g = parseInt(hex.slice(3, 5), 16)
          const b = parseInt(hex.slice(5, 7), 16)
          return { r, g, b }
        }

        const rgbToHex = (r, g, b) => {
          return (
            "#" +
            [r, g, b]
              .map((x) => {
                const hex = x.toString(16)
                return hex.length === 1 ? "0" + hex : hex
              })
              .join("")
          )
        }

        const rgb = hexToRgb(color)

        const newR = Math.round(rgb.r * (1 - shadeFactor * 0.3))
        const newG = Math.round(rgb.g * (1 - shadeFactor * 0.3))
        const newB = Math.round(rgb.b * (1 - shadeFactor * 0.3))

        return rgbToHex(
          Math.max(0, Math.min(255, newR)),
          Math.max(0, Math.min(255, newG)),
          Math.max(0, Math.min(255, newB))
        )
      }

      const backgroundColor = sortedThirdParties.map((tp, index) => {
        const dbColor =
          tp.color || tp.chart_color || tp.bg_color || tp.style_color || tp.style?.color || tp.attributes?.color

        if (dbColor) return dbColor

        if (index < baseColors.length) {
          return baseColors[index]
        } else {
          const baseColorIndex = index % baseColors.length
          const shadeLevel = Math.floor(index / baseColors.length)
          const shadeFactor = 0.2 * (shadeLevel + 1) // 0.2, 0.4, 0.6...

          return generateShade(baseColors[baseColorIndex], shadeFactor)
        }
      })

      return {
        labels,
        datasets: [
          {
            label: "Number of Incidents",
            data,
            thirdPartyIds,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 1,
            // hoverOffset: 5,
            borderRadius: 4,
            maxBarThickness: 30
          }
        ]
      }
    },

    incidentChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index
          const thirdPartyId = chart.data.datasets[0].thirdPartyIds[index]

          console.log("Drill Down → Third Party ID:", thirdPartyId)

          if (thirdPartyId) {
            this.goToThirdPartyIncidents(thirdPartyId)
          }
        },

        onHover(evt, elements) {
          evt.native.target.style.cursor = elements.length ? "pointer" : "default"
        },
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
                return `Incident: ${tooltipItems[0].label}`
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
            title: {
              display: false,
              text: "Third Parties",
              font: {
                size: 12
                // weight: "bold"
              },
              color: "#232757",
              padding: { top: 10 }
            },
            ticks: {
              autoSkip: false,
              // maxRotation: 45,
              // minRotation: 30,
              font: {
                size: 12
              },
              color: "#666",
              maxTicksLimit: 10
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Incidents",
              font: {
                size: 12
                //weight: "bold"
              },
              color: "#232757",
              padding: { bottom: 10 }
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 12
              },
              color: "#666"
            },
            grid: {
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
        }
      }
    },
    // Chart 6 -- Third Parties by Potential Risks
    potentialChartData() {
      const thirdParties = this.getThirdParties || []
      const potentialRisks = this.getPotentialRisks || []

      if (!thirdParties.length || !potentialRisks.length) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Potential Risks per Third Party",
              data: [0],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 1
            }
          ]
        }
      }

      const riskCountsByThirdParty = {}
      thirdParties.forEach((tp) => {
        riskCountsByThirdParty[tp.id] = 0
      })

      potentialRisks.forEach((risk) => {
        const thirdPartyId = risk.third_party_id || risk.third_party?.id
        if (thirdPartyId && riskCountsByThirdParty[thirdPartyId] !== undefined) {
          riskCountsByThirdParty[thirdPartyId]++
        }
      })

      const sortedThirdParties = [...thirdParties]
        .filter((tp) => riskCountsByThirdParty[tp.id] > 0)
        .sort((a, b) => {
          const countA = riskCountsByThirdParty[a.id] || 0
          const countB = riskCountsByThirdParty[b.id] || 0
          return countB - countA
        })
        .slice(0, 10)

      if (sortedThirdParties.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Potential Risks per Third Party",
              data: [0],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 1
            }
          ]
        }
      }

      const labels = sortedThirdParties.map((tp) => tp.company_name || tp.name || "Unknown")
      const data = sortedThirdParties.map((tp) => riskCountsByThirdParty[tp.id] || 0)

      const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

      const generateShade = (color, shadeFactor) => {
        const hexToRgb = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16)
          const g = parseInt(hex.slice(3, 5), 16)
          const b = parseInt(hex.slice(5, 7), 16)
          return { r, g, b }
        }

        const rgbToHex = (r, g, b) => {
          return (
            "#" +
            [r, g, b]
              .map((x) => {
                const hex = x.toString(16)
                return hex.length === 1 ? "0" + hex : hex
              })
              .join("")
          )
        }

        const rgb = hexToRgb(color)

        const newR = Math.round(rgb.r * (1 - shadeFactor * 0.3))
        const newG = Math.round(rgb.g * (1 - shadeFactor * 0.3))
        const newB = Math.round(rgb.b * (1 - shadeFactor * 0.3))

        return rgbToHex(
          Math.max(0, Math.min(255, newR)),
          Math.max(0, Math.min(255, newG)),
          Math.max(0, Math.min(255, newB))
        )
      }

      const backgroundColor = sortedThirdParties.map((tp, index) => {
        const dbColor =
          tp.color || tp.chart_color || tp.bg_color || tp.style_color || tp.style?.color || tp.attributes?.color

        if (dbColor) return dbColor

        if (index < baseColors.length) {
          return baseColors[index]
        } else {
          const baseColorIndex = index % baseColors.length
          const shadeLevel = Math.floor(index / baseColors.length)
          const shadeFactor = 0.2 * (shadeLevel + 1) // 0.2, 0.4, 0.6...

          return generateShade(baseColors[baseColorIndex], shadeFactor)
        }
      })

      return {
        labels,
        datasets: [
          {
            label: "Potential Risks per Third Party",
            data,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 1,
            hoverOffset: 10,
            borderRadius: 4,
            maxBarThickness: 30
          }
        ]
      }
    },

    potentialChartOptions() {
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
                return `Potential Risk: ${tooltipItems[0].label}`
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
            title: {
              display: false,
              text: "Third Parties",
              font: {
                size: 14,
                weight: "bold"
              },
              color: "#232757",
              padding: { top: 10 }
            },
            ticks: {
              autoSkip: false,
              // maxRotation: 45,
              // minRotation: 30,
              font: {
                size: 12
              },
              color: "#333",
              maxTicksLimit: 10
            },
            grid: {
              display: false
            },
            categoryPercentage: 0.5,
            barPercentage: 0.5
          },
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Incidents",
              font: {
                size: 12
                //weight: "bold"
              },
              // color: "#232757",
              padding: { bottom: 10 }
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 12
              },
              color: "#333"
            },
            grid: {
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
        }
      }
    },
    // Chart 7 -- All Risks by Outsorce type
    outsorceChartData() {
      const outsourceTypes = this.getOutsourceTypes || []
      const outsourceContracts = this.getOutsourceContracts || []

      if (!outsourceTypes.length) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "All Risks by Outsource Type",
              data: [1],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const contractCounts = {}
      outsourceTypes.forEach((t) => (contractCounts[t.id] = 0))

      outsourceContracts.forEach((contract) => {
        const typeId = contract.tprm_outsource_type_id || contract.outsource_type?.id
        if (typeId && contractCounts[typeId] !== undefined) {
          contractCounts[typeId]++
        }
      })

      const labels = outsourceTypes.map((t) => t.name || "Unknown")
      const data = outsourceTypes.map((t) => contractCounts[t.id] || 0)
      const outsourceTypeIds = outsourceTypes.map((t) => t.id)

      /* ===== Base Colors ===== */
      const baseColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

      /* ===== Shade Generator ===== */
      const generateColorShades = (hex, factor) => {
        const bigint = parseInt(hex.replace("#", ""), 16)
        let r = (bigint >> 16) & 255
        let g = (bigint >> 8) & 255
        let b = bigint & 255

        r = Math.min(255, Math.round(r + (255 - r) * factor))
        g = Math.min(255, Math.round(g + (255 - g) * factor))
        b = Math.min(255, Math.round(b + (255 - b) * factor))

        return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
      }

      /* ===== Background Colors ===== */
      const backgroundColor = outsourceTypes.map((t, index) => {
        const dbColor = t.color || t.chart_color || t.bg_color || t.style_color || t.style?.color || t.attributes?.color

        if (dbColor) return dbColor

        const baseIndex = index % baseColors.length
        const shadeLevel = Math.floor(index / baseColors.length)
        const factor = shadeLevel * 0.18

        return shadeLevel === 0 ? baseColors[baseIndex] : generateColorShades(baseColors[baseIndex], factor)
      })

      return {
        labels,

        datasets: [
          {
            label: "Number of Contracts by Outsource Type",
            data,
            outsourceTypeIds,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0
            //hoverOffset: 10
          }
        ]
      }
    },

    outsorceChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        //radius: "80%",
        clip: false,
        hoverOffset: 10,
        layout: { padding: 20 },
        onClick: (evt, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index
          const outsourceTypeId = chart.data.datasets[0].outsourceTypeIds[index]

          console.log("Drill Down Outsource Type ID:", outsourceTypeId)

          if (outsourceTypeId) {
            this.goToOutsourceType(outsourceTypeId)
          }
        },

        onHover(evt, elements) {
          evt.native.target.style.cursor = elements.length ? "pointer" : "default"
        },
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
                return `Outsource Type: ${tooltipItems[0].label}`
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
    //Chart 8 -- All Incidents by Incident Type
    allIncidentsChartData() {
      const incidents = this.getIncidents || []
      const incidentTypes = this.getIncidentTypes || []

      if (!incidents.length || !incidentTypes.length) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "All Incidents by Incident Type",
              data: [1],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const incidentCounts = {}
      incidentTypes.forEach((type) => {
        incidentCounts[type.id] = 0
      })

      incidents.forEach((incident) => {
        const typeId = incident.tprm_incident_type_id || incident.incident_type?.id
        if (typeId && incidentCounts[typeId] !== undefined) {
          incidentCounts[typeId]++
        }
      })

      const labels = incidentTypes.map((type) => type.name || "Unknown")
      const data = incidentTypes.map((type) => incidentCounts[type.id] || 0)
      const ids = incidentTypes.map((type) => type.id)

      const palette = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
      const shadeColor = (hex, percent) => {
        const num = parseInt(hex.slice(1), 16)
        const amt = Math.round(2.55 * percent)

        const r = Math.min(255, Math.max(0, (num >> 16) + amt))
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
        const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))

        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      }

      const backgroundColor = incidentTypes.map((type, index) => {
        const dbColor =
          type.color ||
          type.chart_color ||
          type.bg_color ||
          type.style_color ||
          type.style?.color ||
          type.attributes?.color

        if (dbColor) return dbColor

        const baseIndex = index % palette.length
        const shadeLevel = Math.floor(index / palette.length)

        const shadePercent = shadeLevel * 12

        return shadeColor(palette[baseIndex], shadePercent)
      })

      return {
        labels,
        datasets: [
          {
            label: "All Incidents by Incident Type",
            data,
            ids,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0
            // hoverOffset: 10
          }
        ]
      }
    },
    allIncidentsChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        //radius: "80%",
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
              label: function (context) {
                const label = context.label || ""
                const value = context.parsed || 0
                return `${label}: ${value}`
              }
            }
          },
          datalabels: { display: false }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
        },
        onClick: (evt, activeEls) => {
          if (!activeEls.length) return

          const chart = activeEls[0].element.$context.chart
          const dataset = chart.data.datasets[activeEls[0].datasetIndex]
          const index = activeEls[0].index

          const incidentTypeId = dataset.ids[index] // <-- use ID
          const incidentCount = dataset.data[index]

          console.log("Drilling down for Incident Type ID:", incidentTypeId)

          this.drillDownIncidentType(incidentTypeId)
        },

        onHover(evt, elements) {
          evt.native.target.style.cursor = elements.length ? "pointer" : "default"
        }
      }
    },
    // Chart 9 -- Third Parties by Risk Level
    riskLevelChartData() {
      const thirdParties = this.getThirdParties || []
      const riskLevels = this.getAggregateRiskLevels || []

      if (!riskLevels.length) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Third Parties by Risk Level",
              data: [1],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }
      const riskLevelCounts = {}
      riskLevels.forEach((level) => {
        riskLevelCounts[level.id] = 0
      })

      thirdParties.forEach((thirdParty) => {
        const riskLevelId =
          thirdParty.tprm_aggregate_risk_level_id ||
          thirdParty.aggregate_risk_level_id ||
          thirdParty.risk_level?.id ||
          thirdParty.aggregate_risk_level?.id

        if (riskLevelId && riskLevelCounts[riskLevelId] !== undefined) {
          riskLevelCounts[riskLevelId]++
        } else {
        }
      })

      const labels = riskLevels.map((level) => level.name || "Unknown")
      const data = riskLevels.map((level) => riskLevelCounts[level.id] || 0)
      const riskLevelIds = riskLevels.map((level) => level.id)

      const generateGradientColor = (index, total) => {
        const startColor = "#232757"
        const endColor = "#54689d"
        const ratio = index / Math.max(total - 1, 1)

        const hexToRgb = (hex) => {
          const bigint = parseInt(hex.replace("#", ""), 16)
          return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
          }
        }

        const rgbToHex = (r, g, b) => "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")

        const start = hexToRgb(startColor)
        const end = hexToRgb(endColor)

        const r = Math.round(start.r + (end.r - start.r) * ratio)
        const g = Math.round(start.g + (end.g - start.g) * ratio)
        const b = Math.round(start.b + (end.b - start.b) * ratio)

        return rgbToHex(r, g, b)
      }

      const backgroundColor = riskLevels.map((level, index) => {
        const dbColor =
          level.color ||
          level.chart_color ||
          level.bg_color ||
          level.style_color ||
          level.style?.color ||
          level.attributes?.color

        if (dbColor) return dbColor

        return generateGradientColor(index, riskLevels.length)
      })

      return {
        labels,
        datasets: [
          {
            label: "Third Parties by Risk Level",
            data,
            riskLevelIds,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0
            //hoverOffset: 10
          }
        ]
      }
    },

    riskLevelChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        //radius: "80%",
        clip: false,
        hoverOffset: 10,
        layout: { padding: 20 },
        onClick: (evt, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index
          const riskLevelId = chart.data.datasets[0].riskLevelIds[index]

          console.log("Drill Down → Risk Level ID:", riskLevelId)

          if (riskLevelId) {
            this.goToRiskLevel(riskLevelId)
          }
        },

        onHover(evt, elements) {
          evt.native.target.style.cursor = elements.length ? "pointer" : "default"
        },
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
                return `Risk Level: ${tooltipItems[0].label}`
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
    // Chart 11 -- Top 5 Third Parties by Urgent Incidents
    topUrgentIncidentsChartData() {
      if (!this.getThirdParties?.length || !this.getCriticalities?.length) {
        return { labels: [], datasets: [] }
      }

      const urgentCriticality = this.getCriticalities.find((c) => c.name === "Urgent")
      if (!urgentCriticality) return { labels: [], datasets: [] }

      const urgentId = urgentCriticality.id

      const filteredThirdParties = this.getThirdParties.filter(
        (tp) => tp.criticality?.id === urgentId || tp.tprm_criticality_id === urgentId
      )

      const result = filteredThirdParties.map((tp) => ({
        name: tp.company_name || tp.name,
        count: tp.incidents?.length || 0,
        color: tp.criticality?.color || "#232757"
      }))

      // Top 5
      const top5 = result.sort((a, b) => b.count - a.count).slice(0, 5)

      return {
        labels: top5.map((i) => i.name),
        datasets: [
          {
            label: "Urgent Incidents",
            data: top5.map((i) => i.count),
            borderRadius: 4,
            barThickness: 24,
            backgroundColor: top5.map((i) => i.color),
            maxBarThickness: 30
          }
        ]
      }
    },

    topUrgentIncidentsChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y", // Horizontal Bar Chart
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
                return `Urgent Incidents: ${tooltipItems[0].label}`
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
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Incidents",
              font: { size: 14, weight: "bold" },
              color: "#232757",
              padding: { top: 10 }
            },
            ticks: {
              stepSize: 1,
              font: { size: 12 },
              color: "#333"
            },
            grid: {
              display: true,
              drawTicks: true,
              color: "rgba(0, 0, 0, 0.1)",
              drawBorder: true
            }
          },
          y: {
            title: {
              display: false,
              text: "Third Parties",
              font: { size: 14, weight: "bold" },
              color: "#232757",
              padding: { bottom: 10 }
            },
            ticks: {
              autoSkip: false,
              font: { size: 12 },
              color: "#333",
              maxTicksLimit: 10
            },
            grid: {
              display: false,
              drawTicks: true,
              color: "rgba(0, 0, 0, 0.1)",
              drawBorder: true
            }
          }
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart"
        },
        layout: {
          padding: { left: 5, right: 5, top: 10, bottom: 10 }
        }
      }
    },
    //Chart 10 -- Incident Trend Over Time
    incidentTrendChartData() {
      const incidents = this.getIncidents || []

      if (!incidents.length) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Incidents",
              data: [0],
              borderColor: "#232757",
              backgroundColor: "transparent",
              borderWidth: 2,
              fill: false
            }
          ]
        }
      }

      const incidentsByMonth = {}

      incidents.forEach((incident) => {
        const incidentDate = incident.incident_date || incident.date || incident.created_at

        if (incidentDate) {
          try {
            const date = new Date(incidentDate)

            if (!isNaN(date.getTime())) {
              const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
              const monthName = date.toLocaleString("default", { month: "short" }) // Jan, Feb, etc.
              const fullMonthName = date.toLocaleString("default", { month: "long" }) // January, February

              if (!incidentsByMonth[yearMonth]) {
                incidentsByMonth[yearMonth] = {
                  count: 0,
                  monthName: monthName,
                  fullMonthName: fullMonthName,
                  monthIndex: date.getMonth(),
                  year: date.getFullYear()
                }
              }
              incidentsByMonth[yearMonth].count++
            }
          } catch (error) {
            console.warn("Invalid date format:", incidentDate)
          }
        }
      })

      if (Object.keys(incidentsByMonth).length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Incidents",
              data: [0],
              borderColor: "#232757",
              backgroundColor: "transparent",
              borderWidth: 2,
              fill: false
            }
          ]
        }
      }

      const incidentsArray = Object.values(incidentsByMonth)
        .sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year
          return a.monthIndex - b.monthIndex
        })
        .slice(-12)

      const labels = incidentsArray.map((item) => `${item.monthName} ${item.year}`)
      const data = incidentsArray.map((item) => item.count)

      return {
        labels: labels,
        datasets: [
          {
            label: "Incident Trend",
            data: data,
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

    incidentTrendChartOptions() {
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
              },
              color: "#232757"
            },
            ticks: {
              precision: 0,
              font: {
                size: 12
                //weight: "bold"
              },
              color: "#232757"
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
              },
              color: "#232757"
            },
            ticks: {
              font: {
                size: 12
                // weight: "bold"
              },
              color: "#232757",
              maxRotation: 45,
              minRotation: 45
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
            borderColor: "#232757",
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
                return `${label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => {
                return `Incident Date: ${tooltipItems[0].label}`
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
    //Chart 13 -- Incident Severity by Third party
    incidentSeverityChartData() {
      const dashboardData = this.dashboardData || {}
      const incidentCounts = dashboardData.incident_counts || []

      if (!Array.isArray(incidentCounts) || incidentCounts.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Incident Count",
              data: [0],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const sortedData = [...incidentCounts].sort((a, b) => b.incident_count - a.incident_count)

      const labels = sortedData.map((item) => item.name || "Unknown")
      const data = sortedData.map((item) => item.incident_count || 0)
      const severityIds = sortedData.map((item) => item.id)

      const baseColor = "#232757"
      const backgroundColor = sortedData.map((item, index) => {
        const intensity = 1.0 - (index / sortedData.length) * 0.4
        const r = Math.round(parseInt(baseColor.slice(1, 3), 16) * intensity)
        const g = Math.round(parseInt(baseColor.slice(3, 5), 16) * intensity)
        const b = Math.round(parseInt(baseColor.slice(5, 7), 16) * intensity)
        return `rgb(${r}, ${g}, ${b})`
      })

      return {
        labels,

        datasets: [
          {
            label: "Incident Count",
            data,
            severityIds,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0,
            // hoverOffset: 5,
            borderRadius: 4,
            maxBarThickness: 30
          }
        ]
      }
    },

    incidentSeverityChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements, chart) => {
          if (!elements.length) return

          const index = elements[0].index
          const severityId = chart.data.severityIds[index]

          this.goToIncidentSeverity(severityId)
        },
        onHover: (evt, activeElements) => {
          evt.native.target.style.cursor = activeElements.length ? "pointer" : "default"
        },
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
                return `Incident Severity: ${tooltipItems[0].label}`
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
            title: {
              display: false,
              text: "Third Parties",
              font: {
                size: 14,
                weight: "bold"
                // family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              color: "#232757",
              padding: { top: 10 }
            },
            ticks: {
              autoSkip: false,
              // maxRotation: 45,
              // minRotation: 30,
              font: {
                size: 12
                // family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              color: "#333",
              maxTicksLimit: 10
            },
            grid: {
              display: false
            },
            categoryPercentage: 0.5,
            barPercentage: 0.5
          },
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Potential Risks",
              font: {
                size: 14,
                weight: "bold"
              },
              color: "#232757",
              padding: { bottom: 10 }
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 12
              },
              color: "#333"
            },
            grid: {
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
        }
      }
    },

    // Chart 12 -- Mean Time to Resolve per Third Party
    meanTimeChartData() {
      const dashboardData = this.dashboardData || {}
      const dateDifferences = dashboardData.date_differences || []

      if (!Array.isArray(dateDifferences) || dateDifferences.length === 0) {
        return {
          labels: ["No Data"],
          datasets: [
            {
              label: "Days to Resolve",
              data: [0],
              backgroundColor: ["#e0e0e0"],
              borderColor: "transparent",
              borderWidth: 0
            }
          ]
        }
      }

      const sortedData = [...dateDifferences].sort((a, b) => b.days_difference - a.days_difference)

      const labels = sortedData.map((item) => item.company_name || "Unknown")
      const data = sortedData.map((item) => item.days_difference || 0)

      const baseColor = "#232757"
      const backgroundColor = sortedData.map((item, index) => {
        const intensity = 1.0 - (index / sortedData.length) * 0.4
        const r = Math.round(parseInt(baseColor.slice(1, 3), 16) * intensity)
        const g = Math.round(parseInt(baseColor.slice(3, 5), 16) * intensity)
        const b = Math.round(parseInt(baseColor.slice(5, 7), 16) * intensity)
        return `rgb(${r}, ${g}, ${b})`
      })

      return {
        labels,
        datasets: [
          {
            label: "Days to Resolve",
            data,
            backgroundColor,
            borderColor: "transparent",
            borderWidth: 0,
            hoverOffset: 5,
            borderRadius: 4,
            maxBarThickness: 30
          }
        ]
      }
    },

    meanTimeChartOptions() {
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
                return `Mean Time to Resolve: ${tooltipItems[0].label}`
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
            title: {
              display: false,
              text: "Third Parties",
              font: {
                size: 12
                //weight: "bold"
                // family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              // color: "#232757",
              padding: { top: 10 }
            },
            ticks: {
              autoSkip: false,
              // maxRotation: 45,
              // minRotation: 30,
              font: {
                size: 12
                // family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              color: "#666",
              maxTicksLimit: 10
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: "Number of Potential Risks",
              font: {
                size: 12
                // weight: "bold"
              },
              //color: "#232757",
              padding: { bottom: 10 }
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 12
              },
              color: "#666"
            },
            grid: {
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
        }
      }
    }
  },

  methods: {
    ...mapActions("tprmCriticalities", ["fetchCriticalities"]),
    ...mapActions("tprmThirdParties", ["fetchThirdParties", "fetchDashboardData"]),
    ...mapActions("tprmIndustries", ["fetchIndustries"]),
    ...mapActions("tprmRatings", ["fetchRatings"]),
    ...mapActions("tprmStatuses", ["fetchStatuses"]),
    ...mapActions("tprmIncidentTypes", ["fetchIncidentTypes"]),
    ...mapActions("tprmPotentialRisks", ["fetchPotentialRisks"]),
    ...mapActions("tprmOutsourceTypes", ["fetchOutsourceTypes"]),
    ...mapActions("tprmIncidents", ["fetchIncidents"]),
    ...mapActions("tprmOutsourceContracts", ["fetchOutsourceContracts"]),
    ...mapActions("tprmAggregateRiskLevel", ["fetchAggregateRiskLevels"]),

    getDefaultColor(index) {
      const hue = (index * 137.508) % 360
      return `hsl(${hue}, 70%, 60%)`
    },

    calculateCriticalityCounts() {
      if (!this.getThirdParties || this.getThirdParties.length === 0) {
        return {}
      }

      const counts = {}

      if (this.getCriticalities && this.getCriticalities.length > 0) {
        this.getCriticalities.forEach((criticality) => {
          counts[criticality.id] = 0
        })
      }

      this.getThirdParties.forEach((thirdParty) => {
        const criticalityId = thirdParty.tprm_criticality_id || thirdParty.criticality?.id
        if (criticalityId && counts[criticalityId] !== undefined) {
          counts[criticalityId]++
        }
      })

      return counts
    },

    async loadData() {
      try {
        this.loading = true
        await this.fetchCriticalities()
        await this.fetchThirdParties()
        //await this.fetchIndustries()
        //await this.fetchRatings()
        await this.fetchStatuses()
        //await this.fetchIncidentTypes()
        //await this.fetchPotentialRisks()
        //await this.fetchOutsourceTypes()
        // await this.fetchIncidents()
        // await this.fetchOutsourceContracts()
        // await this.fetchAggregateRiskLevels()
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        this.loading = false
      }
    },
    calculateIndustryCounts() {
      if (!this.getThirdParties || this.getThirdParties.length === 0) {
        return {}
      }

      const counts = {}

      if (this.getIndustries && this.getIndustries.length > 0) {
        this.getIndustries.forEach((industry) => {
          counts[industry.id] = 0
        })
      }

      this.getThirdParties.forEach((thirdParty) => {
        const industryId = thirdParty.tprm_industry_id || thirdParty.industry?.id
        if (industryId && counts[industryId] !== undefined) {
          counts[industryId]++
        }
      })

      return counts
    },
    calculateRatingCounts() {
      if (!this.getThirdParties || this.getThirdParties.length === 0) return {}

      const counts = {}
      if (this.getRatings && this.getRatings.length > 0) {
        this.getRatings.forEach((rating) => {
          counts[rating.id] = 0
        })
      }

      this.getThirdParties.forEach((thirdParty) => {
        const ratingId = thirdParty.tprm_rating_id || thirdParty.rating?.id
        if (ratingId && counts[ratingId] !== undefined) {
          counts[ratingId]++
        }
      })

      return counts
    },

    goToIndustry(industryId) {
      console.log("Navigating with industry_id:", industryId)

      this.$router.push({
        path: "/tprm/third-parties",
        query: {
          industry_id: industryId
        }
      })
    },
    goToStatus(statusId) {
      console.log("Navigating with status_id:", statusId)

      this.$router.push({
        path: "/tprm/third-parties",
        query: {
          status_id: statusId
        }
      })
    },
    goToIncidentSeverity(severityId) {
      console.log("Drill down → Incident Severity ID:", severityId)

      this.$router.push({
        path: "/tprm/incidents",
        query: {
          severity_id: severityId
        }
      })
    },
    goToOutsourceType(outsourceTypeId) {
      console.log("Navigating to outsource type:", outsourceTypeId)

      this.$router.push({
        path: "/tprm/outsource-contracts",
        query: {
          outsource_type_id: outsourceTypeId
        }
      })
    },
    goToThirdPartyIncidents(thirdPartyId) {
      console.log("Navigating to incidents for third party:", thirdPartyId)

      this.$router.push({
        path: "/tprm/incidents",
        query: {
          third_party_id: thirdPartyId
        }
      })
    },
    goToRiskLevel(riskLevelId) {
      console.log("Navigating to risk level:", riskLevelId)

      this.$router.push({
        path: "/tprm/third-parties",
        query: {
          risk_level_id: riskLevelId
        }
      })
    },
    goToCriticality(criticalityId) {
      console.log("Navigating to criticality:", criticalityId)

      this.$router.push({
        path: "/tprm/third-parties",
        query: {
          criticality_id: criticalityId
        }
      })
    },
    drillDownIncidentType(typeId) {
      // Navigate to page filtered by incident type ID
      this.$router.push({
        path: "/tprm/incidents", // Assuming you have a route named 'incidents'
        query: { type_id: typeId } // pass the ID, not the name
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
