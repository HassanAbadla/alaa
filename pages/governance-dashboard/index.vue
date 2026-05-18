<template>
  <v-container
    fluid
    style="
      background-color: #f2f4f8;
      min-height: 100vh;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    "
  >
    <div v-if="!loading" style="width: 100%; max-width: 100%; padding: 0">
      <!-- Header -->
      <v-row class="mb-2">
        <v-col cols="12">
          <v-card class="pa-3 d-flex align-center" color="primary" dark style="border-radius: 12px; height: 70px">
            <div
              class="text-h5 font-weight-bold flex-grow-1"
              :class="{ 'text-right': isRTL, 'text-left': !isRTL }"
              style="color: white"
            >
              {{ $t("page.governance_dashboard") }}
            </div>

            <v-img :src="logo" alt="Company Logo" max-width="100" max-height="60" contain style="margin-left: auto" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Dashboard Cards and Charts -->
      <div style="display: flex; gap: 8px; margin-bottom: 8px; width: 100%">
        <!-- Total Assets Card -->
        <v-card
          class="d-flex align-center"
          outlined
          style="border-radius: 12px; padding: 20px; flex: 1; min-width: 0; min-height: 300px; height: auto"
        >
          <div
            :style="dividerBorderOnly"
            style="
              flex: 0.6;
              padding-right: 20px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              min-width: 0;
            "
          >
            <div
              class="text-h6 text-center mb-4 text-center"
              style="
                margin-bottom: 40px;
                display: inline-block;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 5px;
                white-space: nowrap;
                color: #232757;
              "
            >
              {{ $t("page.total_assets") }}
            </div>
            <div
              class="text-h2 font-weight-bold"
              style="
                line-height: 1.2;
                white-space: nowrap;
                color: #54689d;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              {{ totalAssets }}
            </div>
          </div>

          <div
            style="
              flex: 1.4;
              padding-left: 20px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              min-width: 0;
              position: relative;
            "
          >
            <div
              class="text-h6 text-center mb-4 text-center"
              style="
                display: inline-block;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 5px;
                white-space: nowrap;
                color: #232757;
              "
            >
              {{ $t("table.status") }}
            </div>

            <div class="d-flex flex-grow-1" style="align-items: center; padding-bottom: 20px">
              <!-- Chart -->
              <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 230px; height: 230px">
                <Chart
                  :type="'pie'"
                  :chart-data="totalAssetsChartData"
                  :chart-options="totalAssetsChartOptions"
                  :chart-height="230"
                  :chart-width="230"
                />
              </div>

              <!-- Custom Legend -->
              <div class="flex-grow-1" style="margin-left: 20px; overflow-y: auto; max-height: 200px">
                <ul style="list-style: none; padding: 0; margin: 0">
                  <li
                    v-for="(label, index) in totalAssetsChartData.labels"
                    :key="index"
                    class="d-flex align-center mb-2 legend-item"
                    @click="goToStatus(totalAssetsChartData.ids[index])"
                  >
                    <span
                      :style="{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        marginRight: '6px',
                        flexShrink: 0,
                        backgroundColor: totalAssetsChartData.datasets[0].backgroundColor[index]
                      }"
                    ></span>
                    <span style="font-size: 12px; color: #666; cursor: pointer">
                      {{ label }}: {{ totalAssetsChartData.datasets[0].data[index] }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Annotation: left bottom of the pie chart -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; left: 8px; bottom: -12px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </div>
        </v-card>

        <!-- Total Policies Card -->
        <v-card
          class="d-flex align-center"
          outlined
          style="border-radius: 12px; padding: 20px; flex: 1; min-width: 0; min-height: 300px; height: auto"
        >
          <div
            :style="dividerBorderOnly"
            style="
              flex: 0.6;
              padding-right: 20px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              min-width: 0;
            "
          >
            <div
              class="text-h6 text-center mb-4 text-center"
              style="
                margin-bottom: 40px;
                display: inline-block;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 5px;
                white-space: nowrap;
                color: #232757;
              "
            >
              {{ $t("page.total_policies") }}
            </div>
            <div
              class="text-h2 font-weight-bold"
              style="
                line-height: 1.2;
                white-space: nowrap;
                color: #54689d;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              {{ totalPolicies }}
            </div>
          </div>

          <div
            style="
              flex: 1.4;
              padding-left: 20px;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              min-width: 0;
              position: relative;
            "
          >
            <div
              class="text-h6 text-center mb-4 text-center"
              style="
                display: inline-block;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 5px;
                white-space: nowrap;
                color: #232757;
              "
            >
              {{ $t("table.status") }}
            </div>
            <div style="height: 100%; width: 100%; max-height: 330px; max-width: 330px">
              <div class="d-flex flex-grow-1" style="align-items: center; padding-bottom: 20px">
                <!-- Chart -->
                <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 230px; height: 230px">
                  <Chart
                    :type="'pie'"
                    :chart-data="totalPoliciesChartData"
                    :chart-options="totalPoliciesChartOptions"
                    :chart-height="230"
                    :chart-width="230"
                  />
                </div>

                <!-- Custom Legend -->
                <div class="flex-grow-1" style="margin-left: 20px; overflow-y: auto; max-height: 200px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in totalPoliciesChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="goToPolicy(totalPoliciesChartData.ids[index])"
                    >
                      <span
                        :style="{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: totalPoliciesChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ totalPoliciesChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- Annotation: left bottom of the pie chart -->
            <div
              class="d-flex align-center"
              style="font-size: 12px; color: #666; position: absolute; left: 8px; bottom: -12px"
            >
              <span style="color: #d4a017; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.click_to_drill_down") }}
              </span>
            </div>
          </div>
        </v-card>

        <!-- Sensitive Assets Card -->
        <v-card
          class="d-flex flex-column"
          outlined
          style="
            border-radius: 12px;
            padding: 20px 20px 0px 20px;
            width: calc(50% - 12px);
            min-width: 180px;
            max-width: 220px;
            flex-shrink: 0;
            min-height: 300px;
            height: auto;
            cursor: pointer;
            display: flex;
            flex-direction: column;
          "
          @click="goToSensitiveAssets"
        >
          <!-- Title -->
          <div
            class="text-h6 text-center"
            style="
              display: inline-block;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 5px;
              white-space: nowrap;
              color: #232757;
            "
          >
            {{ $t("page.sensitive_assets") }}
          </div>

          <!-- Number centered in remaining space -->
          <div style="flex: 1; display: flex; align-items: center; justify-content: center">
            <div
              class="text-h2 font-weight-bold text-center"
              style="line-height: 1.2; white-space: nowrap; color: #54689d"
            >
              {{ sensitiveAssetsCount }}
            </div>
          </div>

          <!-- Bottom: Drill-down text -->
          <div
            class="d-flex align-center"
            style="font-size: 12px; color: #666; position: absolute; left: 10px; bottom: 10px"
          >
            <span style="color: #d4a017; margin-right: 4px">▼</span>
            <span class="font-weight-bold" style="color: #232757">
              {{ $t("page.click_to_drill_down") }}
            </span>
          </div>
        </v-card>
      </div>

      <div style="display: flex; gap: 8px; width: 100%; height: 750px">
        <div style="display: flex; flex-direction: column; flex: 1; min-width: 0; gap: 8px; height: 100%">
          <!-- Assets by Location  -->
          <v-card
            class="d-flex flex-column"
            outlined
            style="border-radius: 12px; padding: 16px; width: 100%; height: 350px"
          >
            <div class="text-h6 text-center mb-4" style="color: #232757; flex-shrink: 0">
              {{ $t("page.assets_by_location") }}
            </div>

            <!--  scrollable container — same as tasks chart -->
            <div style="flex: 1; overflow-y: auto; min-height: 0">
              <!-- dynamic height — 40px per bar so each bar is thick -->
              <div
                :style="{
                  height: locationAssetsChartData.labels.length * 40 + 'px',
                  minHeight: '200px',
                  width: '100%'
                }"
              >
                <Chart
                  :type="'bar'"
                  :chart-data="locationAssetsChartData"
                  :chart-options="locationAssetsChartOptions"
                  :chart-height="'100%'"
                  :chart-width="'100%'"
                />
              </div>
            </div>
          </v-card>

          <!-- Top 5 Assets by Cost -->
          <v-card
            class="d-flex flex-column"
            outlined
            style="border-radius: 12px; padding: 16px; width: 100%; height: 350px; flex-shrink: 0; overflow: hidden"
          >
            <div class="text-h6 text-center mb-4" style="margin-top: 8px; flex-shrink: 0; color: #232757">
              {{ $t("page.top_5_assets_by_cost") }}
            </div>

            <div style="flex: 1; overflow-y: auto; border-radius: 8px; overflow: hidden">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px">
                <thead>
                  <tr style="background-color: #232757">
                    <th style="text-align: left; padding: 8px 10px; font-size: 16px; font-weight: 500; color: white">
                      {{ $t("table.assets") }}
                    </th>
                    <th style="text-align: center; padding: 8px 10px; font-size: 16px; font-weight: 500; color: white">
                      {{ $t("table.cost") }} (SAR)
                    </th>
                    <th style="text-align: right; padding: 8px 10px; font-size: 16px; font-weight: 500; color: white">
                      {{ $t("table.status") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(asset, index) in topAssets"
                    :key="asset.name"
                    :style="{
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.15s',
                      background: index % 2 !== 0 ? '#f5f7fb' : 'white'
                    }"
                    @mouseover="$event.currentTarget.style.background = '#e8ecf5'"
                    @mouseleave="$event.currentTarget.style.background = index % 2 !== 0 ? '#f5f7fb' : 'white'"
                  >
                    <td style="padding: 8px 10px">
                      <div style="display: flex; align-items: center; gap: 8px">
                        <span
                          :style="{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'inline-block',
                            background:
                              index === 0
                                ? '#e24b4a'
                                : index === 1
                                ? '#e24b4a'
                                : index === 2
                                ? '#eaa035'
                                : index === 3
                                ? '#eaa035'
                                : '#7ab541'
                          }"
                        ></span>
                        <span
                          style="
                            font-weight: 500;
                            color: #232757;
                            font-size: 14px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 90px;
                          "
                        >
                          {{ asset.name }}
                        </span>
                      </div>
                    </td>
                    <td
                      style="padding: 8px 10px; text-align: center; color: #54689d; font-weight: 500; font-size: 14px"
                    >
                      {{ formatCurrency(asset.cost) }}
                    </td>
                    <td style="padding: 8px 10px; text-align: right">
                      <span
                        :style="{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background:
                            String(asset.status).toLowerCase() === 'active' ||
                            String(asset.status).toLowerCase() === 'operational'
                              ? '#eaf3de'
                              : String(asset.status).toLowerCase() === 'inactive'
                              ? '#fde8e8'
                              : '#faeeda',
                          color:
                            String(asset.status).toLowerCase() === 'active' ||
                            String(asset.status).toLowerCase() === 'operational'
                              ? '#27500a'
                              : String(asset.status).toLowerCase() === 'inactive'
                              ? '#a32d2d'
                              : '#633806'
                        }"
                      >
                        {{ asset.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-card>
        </div>
        <div style="display: flex; flex-direction: column; flex: 2; min-width: 0; gap: 8px; height: 100%">
          <!-- Recent and Upcoming Policy Expirations -->
          <v-card
            class="d-flex flex-column align-center justify-center"
            outlined
            style="border-radius: 12px; padding: 8px; width: 100%; height: 350px; min-height: 0"
          >
            <div class="text-h6 text-center mb-4" style="color: #232757">
              {{ $t("page.policies_by_expiry_date") }}
            </div>
            <Chart
              :type="'line'"
              :chart-data="policiesByExpiryChartData"
              :chart-options="policiesByExpiryChartOptions"
              :chart-height="'280px'"
              :chart-width="'100%'"
            />
            <div
              class="align-self-start mt-auto d-flex align-center justify-center text-caption"
              style="
                margin-top: auto;
                font-size: 12px;
                color: #232757;
                width: 100%;
                padding-bottom: 0;
                margin-bottom: 0px;
              "
            >
              <span style="color: #e74c3c; margin-right: 4px">▼</span>
              <span class="font-weight-bold" style="color: #232757">
                {{ $t("page.target_expired_policies") }}
              </span>
            </div>
          </v-card>

          <!-- Assets by Custodian and Assets by Category -->
          <div style="display: flex; gap: 8px; width: 100%; height: 350px; flex-shrink: 0">
            <!-- Assets by Custodian -->
            <v-card
              class="d-flex flex-column align-center justify-center"
              outlined
              style="border-radius: 12px; padding: 16px; flex: 1.5; height: 100%; min-width: 0"
            >
              <div class="text-h6 text-center mb-4" style="color: #232757">{{ $t("page.assets_by_custodian") }}</div>
              <Chart
                :type="'bar'"
                :chart-data="assetsByCustodianChartData"
                :chart-options="assetsByCustodianChartOptions"
                :chart-height="'250px'"
                :chart-width="'100%'"
              />
            </v-card>

            <!-- Assets by Category -->
            <v-card
              class="d-flex flex-column align-center justify-center position-relative"
              outlined
              style="border-radius: 12px; padding: 16px; flex: 1.5; height: 100%; min-width: 0"
            >
              <div class="text-h6 text-center mb-4" style="color: #232757">{{ $t("page.assets_by_category") }}</div>
              <div class="d-flex flex-grow-1" style="align-items: center; padding-bottom: 20px">
                <!-- Chart -->
                <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 230px; height: 230px">
                  <Chart
                    ref="assetsByCategoryChart"
                    :type="'pie'"
                    :chart-data="assetsByCategoryChartData"
                    :chart-options="assetsByCategoryChartOptions"
                    :chart-height="230"
                    :chart-width="230"
                  />
                </div>

                <!-- Custom Legend -->
                <div class="flex-grow-1" style="margin-left: 20px; overflow-y: auto; max-height: 200px">
                  <ul style="list-style: none; padding: 0; margin: 0">
                    <li
                      v-for="(label, index) in assetsByCategoryChartData.labels"
                      :key="index"
                      class="d-flex align-center mb-2 legend-item"
                      @click="goToCategory(assetsByCategoryChartData.ids[index])"
                    >
                      <span
                        :style="{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          marginRight: '6px',
                          flexShrink: 0,
                          backgroundColor: assetsByCategoryChartData.datasets[0].backgroundColor[index]
                        }"
                      ></span>
                      <span style="font-size: 12px; color: #666; cursor: pointer">
                        {{ label }}: {{ assetsByCategoryChartData.datasets[0].data[index] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                class="d-flex align-center"
                style="font-size: 12px; color: #666; position: absolute; left: 10px; bottom: 10px"
              >
                <span style="color: #d4a017; margin-right: 4px">▼</span>
                <span class="font-weight-bold" style="color: #232757">
                  {{ $t("page.click_to_drill_down") }}
                </span>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </div>
    <!-- Dashboard Version -->
    <div class="d-flex mt-4" style="width: 100%">
      <span class="ml-auto text-caption" style="color: #666">v1.5.1</span>
    </div>
  </v-container>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex"
import Chart from "@/components/charts/Chart.vue"

export default {
  name: "GovernanceDashboard",
  components: { Chart },
  layout: "dashboard-layout",
  data() {
    return {
      loading: true,
      logo: require("@/assets/img/logo-sw1.svg"),
      policiesDataCached: null
    }
  },
  computed: {
    ...mapState("assets", ["assetsChart", "assets", "fetchCategories", "assetsCategories", "sensitiveAssetsChart"]),
    ...mapState("policy", ["policiesChart", "policies"]),
    ...mapGetters({ sensitiveAssets: "sensitiveAssets/getSensitiveAssets" }),
    ...mapState(["isRTL"]),

    dividerBorderOnly() {
      return this.isRTL ? { borderLeft: "1px solid #e2e8f0" } : { borderRight: "1px solid #e2e8f0" }
    },
    // isRTL() {
    //   return ["ar"].includes(this.$i18n.locale)
    // },
    totalAssets() {
      return this.assets?.length || 0
    },

    totalPolicies() {
      return this.policies?.length || 0
    },

    topAssets() {
      if (!this.assets?.length) return []

      return [...this.assets]
        .filter((asset) => asset?.asset_cost != null && asset?.asset_cost !== "")
        .sort((a, b) => (Number(b.asset_cost) || 0) - (Number(a.asset_cost) || 0))
        .slice(0, 5)
        .map((asset) => {
          let statusValue = "Active"

          if (asset.status) {
            if (typeof asset.status === "object" && asset.status !== null) {
              statusValue = "Operational"
            } else if (typeof asset.status === "string") {
              statusValue = asset.status
            }
          }

          return {
            name: asset.name || asset.asset_name || "Unknown Asset",
            cost: Number(asset.asset_cost) || 0,
            status: statusValue
          }
        })
    },
    //Total Assets Status
    totalAssetsChartData() {
      if (!this.assetsChart || !Array.isArray(this.assetsChart) || this.assetsChart.length === 0) {
        return {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: ["#e0e0e0"]
            }
          ],
          ids: [] // Placeholder for status IDs
        }
      }
      const labels = this.assetsChart.map((i) => i.name)
      const data = this.assetsChart.map((i) => i.count)
      const ids = this.assetsChart.map((i) => i.id)

      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: this.assetsChart.map((item) => item.color || "#4caf50")
            // hoverOffset: 10
          }
        ],
        ids
      }
    },
    totalAssetsChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        // radius: "90%",
        hoverOffset: 10,
        layout: { padding: 20 },
        clip: false,
        onClick: (evt, activeElements) => {
          if (!activeElements.length) return

          const index = activeElements[0].index
          const statusId = this.totalAssetsChartData.ids[index]

          this.goToStatus(statusId)
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
                return `Asset Status: ${tooltipItems[0].label}`
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

    totalPoliciesChartData() {
      if (!this.policiesChart || !Array.isArray(this.policiesChart) || this.policiesChart.length === 0) {
        return {
          labels: this.policiesChart.map((item) => item.name || "Unknown"),
          datasets: [
            {
              data: this.policiesChart.map((item) => item.count || 0),
              backgroundColor: ["#e0e0e0"]
            }
          ],
          ids: []
        }
      }

      return {
        labels: this.policiesChart.map((item) => item.name || "Unknown"),
        datasets: [
          {
            data: this.policiesChart.map((item) => item.count || 0),
            backgroundColor: this.policiesChart.map((item) => item.color || "#cccccc")
            // hoverOffset: 10
          }
        ],
        ids: this.policiesChart.map((item) => item.id)
      }
    },
    totalPoliciesChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        //radius: "90%",
        hoverOffset: 10,
        layout: { padding: 20 },
        clip: false,
        onClick: (evt, activeElements) => {
          if (!activeElements || !activeElements.length) return

          const index = activeElements[0].index
          const policyId = this.totalPoliciesChartData.ids[index] // get clicked policy ID

          if (policyId) {
            this.goToPolicy(policyId) // <-- call goToPolicy instead of goToStatus
          }
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
                return `Policy Status: ${tooltipItems[0].label}`
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
    // Policies by Expiry Date
    policiesByExpiryChartData() {
      if (this.policiesDataCached) return this.policiesDataCached

      const policies = this.policies || []
      const today = new Date()
      const months = []
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const expiryCountByMonth = {}
      const policyNamesByMonth = {}

      // Generate months: 4 months before today to 2 months after today (7 months total)
      for (let i = -4; i <= 2; i++) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1)
        const monthName = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`
        months.push(monthName)
        expiryCountByMonth[monthName] = 0
        policyNamesByMonth[monthName] = []
      }

      policies.forEach((policy) => {
        const date = policy?.valid_until
        if (!date) return

        const expiryDate = new Date(date)
        if (isNaN(expiryDate)) return

        const monthName = `${monthNames[expiryDate.getMonth()]} ${expiryDate.getFullYear()}`
        if (expiryCountByMonth[monthName] !== undefined) {
          expiryCountByMonth[monthName]++
          const policyName = policy?.name || policy?.title || policy?.policy_name || "Unnamed Policy"
          policyNamesByMonth[monthName].push(policyName)
        }
      })

      const result = {
        labels: months,
        policyNamesByMonth,
        datasets: [
          {
            label: "Policies Expiring",
            data: months.map((m) => expiryCountByMonth[m]),
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

      this.policiesDataCached = result
      return result
    },
    policiesByExpiryChartOptions() {
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
              label(context) {
                const count = context.parsed.y
                const monthLabel = context.chart.data.labels[context.dataIndex]
                const policyNames = context.chart.data.policyNamesByMonth?.[monthLabel] || []

                const lines = [`Policies: ${count}`]
                if (policyNames.length > 0) {
                  policyNames.forEach((name) => {
                    lines.push(`• ${name}`)
                  })
                }
                return lines
              }
            }
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 12 },
              color: "#333"
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
              font: { size: 12 },
              color: "#333"
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
    // Assets by Custodian
    assetsByCustodianChartData() {
      const primary = "#232757"

      const lighten = (hex, percent) => {
        let num = parseInt(hex.replace("#", ""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = ((num >> 8) & 0x00ff) + amt,
          B = (num & 0x0000ff) + amt

        return (
          "#" +
          (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
          )
            .toString(16)
            .slice(1)
        )
      }

      if (!this.assets?.length) {
        return {
          labels: [],
          datasets: [
            {
              label: "Number of Assets",
              data: [],
              backgroundColor: primary
            }
          ]
        }
      }

      const custodianData = {}

      this.assets.forEach((asset) => {
        const custodian = asset.custodian || asset.owner || "Unknown"
        custodianData[custodian] = (custodianData[custodian] || 0) + 1
      })

      const labels = Object.keys(custodianData)
      const data = Object.values(custodianData)

      const sortedIndices = data
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .map((item) => item.index)

      const colors = sortedIndices.map((originalIndex, sortedPosition) => {
        const percentage = (sortedPosition / (labels.length - 1)) * 50
        return lighten(primary, percentage)
      })

      const finalColors = new Array(labels.length)
      sortedIndices.forEach((originalIndex, sortedPosition) => {
        finalColors[originalIndex] = colors[sortedPosition]
      })

      return {
        labels: labels,
        datasets: [
          {
            label: "Number of Assets",
            data: data,
            backgroundColor: finalColors,
            borderColor: "transparent",
            borderWidth: 0,
            //maxBarThickness: 30,
            borderRadius: 4,
            hoverBackgroundColor: colors
          }
        ]
      }
    },
    assetsByCustodianChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,

        // FORCE vertical chart
        indexAxis: "x",

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
                return `Asset Custodian: ${tooltipItems[0].label}`
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
          // LABELS ARE HERE (X AXIS)
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              padding: 8,
              font: { size: 11 },
              color: "#333",

              callback: function (value) {
                const label = this.getLabelForValue(value) || ""

                // shorten long labels
                return label.length > 7 ? label.substring(0, 7) + "…" : label
              }
            },
            grid: {
              display: false
            }
          },

          // values axis
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 12 },
              color: "#333"
            },
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
              drawBorder: false
            }
          }
        },

        elements: {
          bar: {
            borderRadius: 4
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
    // Assets by Category
    assetsByCategoryChartData() {
      const assets = this.assets || []

      if (!assets.length) {
        return {
          labels: [],
          ids: [],
          datasets: [
            {
              data: [],
              backgroundColor: "#232757",
              borderColor: "#232757",
              borderWidth: 1,
              hoverBackgroundColor: "#232757" // same color on hover
            }
          ]
        }
      }

      // Count assets by category and collect category IDs
      const categoryCount = {}
      const categoryIds = []

      assets.forEach((asset) => {
        const categoryName = asset.category?.name || "Uncategorized"
        const categoryId = asset.category?.id || null

        if (!categoryCount[categoryName]) {
          categoryCount[categoryName] = 0
        }

        if (!categoryIds.includes(categoryId)) {
          categoryIds.push(categoryId)
        }

        categoryCount[categoryName]++
      })

      const labels = Object.keys(categoryCount)
      const data = Object.values(categoryCount)
      const ids = categoryIds

      // Primary color
      const primary = "#232757"

      // Function to lighten/darken color
      const lighten = (hex, percent) => {
        let num = parseInt(hex.replace("#", ""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = ((num >> 8) & 0x00ff) + amt,
          B = (num & 0x0000ff) + amt

        return (
          "#" +
          (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
          )
            .toString(16)
            .slice(1)
        )
      }

      // Apply shades of primary color based on index
      const colors = data.map((_, index) => {
        const percentage = (index / (labels.length - 1 || 1)) * 50
        return lighten(primary, percentage)
      })

      return {
        labels,
        ids,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: colors.map((color) => lighten(color, -15)),
            borderWidth: 0,
            hoverBackgroundColor: colors // keep same on hover
          }
        ]
      }
    },
    assetsByCategoryChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        layout: { padding: 20 },
        clip: false,
        onClick: (evt, activeElements) => {
          if (!activeElements || !activeElements.length) return
          const index = activeElements[0].index
          const categoryId = this.assetsByCategoryChartData.ids[index]
          if (categoryId) {
            this.goToCategory(categoryId)
          }
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
                return `Asset Category: ${tooltipItems[0].label}`
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
    sensitiveAssetsCount() {
      return Array.isArray(this.sensitiveAssets) ? this.sensitiveAssets.length : 0
    },
    locationAssetsChartData() {
      const locationCounts = {}

      this.assets.forEach((asset) => {
        const locationName = asset.location?.name || "Unassigned"
        locationCounts[locationName] = (locationCounts[locationName] || 0) + 1
      })

      const sortedLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      const labels = sortedLocations.map((l) => l.name)
      const data = sortedLocations.map((l) => l.count)

      const shadesColor1 = [
        "rgba(35, 39, 87, 0.9)",
        "rgba(40, 45, 105, 0.8)",
        "rgba(45, 51, 123, 0.7)",
        "rgba(50, 57, 141, 0.6)"
      ]

      const shadesColor2 = [
        "rgba(84, 104, 157, 0.9)",
        "rgba(94, 114, 167, 0.8)",
        "rgba(104, 124, 177, 0.7)",
        "rgba(114, 134, 187, 0.6)"
      ]

      const backgroundColors = labels.map((_, index) => {
        const colorSet = index % 2 === 0 ? shadesColor1 : shadesColor2
        const shadeIndex = Math.min(Math.floor(index / 2), colorSet.length - 1)
        return colorSet[shadeIndex]
      })

      return {
        labels,
        datasets: [
          {
            label: "Number of Assets",
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) => color.replace(/[\d.]+\)$/, "1)")),
            borderWidth: 0,
            borderRadius: {
              topLeft: 0,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 4
            },
            borderSkipped: false
          }
        ]
      }
    },
    locationAssetsChartOptions() {
      const dataValues = this.locationAssetsChartData.datasets[0].data
      const maxValue = Math.max(...dataValues, 0)
      const integerTicks = Array.from({ length: maxValue + 1 }, (_, i) => i)

      return {
        responsive: true,
        maintainAspectRatio: false, // ✅ must be false so chart fills the dynamic height div
        indexAxis: "y",

        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const perc = total ? ((value / total) * 100).toFixed(1) : 0
                return `${context.label}: ${value} (${perc}%)`
              },
              title: (tooltipItems) => `Asset Location: ${tooltipItems[0].label}`
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#232757",
            borderWidth: 1
          },
          datalabels: { display: false }
        },

        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 12 },
              color: "#333",
              callback: function (value) {
                return integerTicks.includes(value) ? value : null
              }
            },
            grid: { color: "#e0e0e0" }
          },
          y: {
            ticks: {
              autoSkip: false,
              font: { size: 12 },
              color: "#333"
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

        // onHover: function (event, activeElements) {
        //   event.native.target.style.cursor = activeElements.length ? "pointer" : "default"
        // },

        animation: { duration: 1000, easing: "easeOutQuart" },
        layout: { padding: { left: 5, right: 10, top: 5, bottom: 5 } }
      }
    }
    // // Sensitive Assets
    // sensitiveAssetsChartData() {
    //   return {
    //     labels: ["Sensitive Assets"],
    //     datasets: [
    //       {
    //         data: [this.sensitiveAssets.length],
    //         backgroundColor: ["#232757"],
    //         borderColor: "#232757",
    //         borderWidth: 1
    //       }
    //     ]
    //   }
    // },

    // sensitiveAssetsChartOptions() {
    //   return {
    //     responsive: true,
    //     maintainAspectRatio: false,

    //     scales: {
    //       x: {
    //         beginAtZero: true,
    //         ticks: {
    //           color: "#232757",
    //           font: { size: 12 }
    //         },
    //         grid: {
    //           display: false
    //         }
    //       },

    //       y: {
    //         beginAtZero: true,
    //         ticks: {
    //           stepSize: 1,
    //           color: "#232757",
    //           font: { size: 12 },
    //           callback: function (value) {
    //             return Number.isInteger(value) ? value : ""
    //           }
    //         },
    //         grid: {
    //           color: "#f3f3f3",
    //           lineWidth: 0.6,
    //           drawBorder: false
    //         }
    //       }
    //     },

    //     plugins: {
    //       legend: { display: false },
    //       datalabels: { display: false },
    //       tooltip: {
    //         callbacks: {
    //           label: function (context) {
    //             return `Count: ${context.parsed.y}`
    //           }
    //         }
    //       }
    //     },

    //     elements: {
    //       bar: {
    //         borderWidth: 0,
    //         borderRadius: 0,
    //         borderSkipped: false
    //       }
    //     },

    //     datasets: {
    //       bar: {
    //         barPercentage: 0.6,
    //         categoryPercentage: 0.8
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    ...mapActions("assets", ["fetchAssets", "fetchCategories"]),
    ...mapActions("policy", ["fetchPolicies"]),
    ...mapActions({ fetchSensitiveAssets: "sensitiveAssets/fetchSensitiveAssets" }),

    formatCurrency(value) {
      const numValue = Number(value) || 0
      return numValue.toLocaleString("en-US")
    },

    goToCategory(categoryId) {
      this.$router.push({
        name: "assets",
        query: {
          categoryId: categoryId
        }
      })
      console.log("Clicked category:", categoryId)
    },
    goToStatus(statusId) {
      this.$router.push({
        name: "assets",
        query: { status: statusId }
      })
    },
    goToPolicy(policyId) {
      this.$router.push({
        name: "policy", // or the route name for your policies page
        query: { policy: policyId }
      })
      console.log("Clicked policy:", policyId)
    },
    goToSensitiveAssets() {
      this.$router.push({
        name: "sensitive-assets" // <-- change to your actual route name
      })
      console.log("Navigating to Sensitive Assets page")
    }
  },
  async mounted() {
    try {
      console.log(" Dashboard mounting - Starting data fetch...")

      // Add 15 second timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Dashboard data fetch timeout")), 15000)
      )

      await Promise.race([
        Promise.all([this.fetchAssets(), this.fetchPolicies(), this.fetchSensitiveAssets()]),
        timeoutPromise
      ])
      console.log("Dashboard data loaded successfully")
    } catch (error) {
      console.error(" Dashboard loading error:", error)
    } finally {
      this.loading = false
      console.log("Loading complete, showing dashboard")
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
