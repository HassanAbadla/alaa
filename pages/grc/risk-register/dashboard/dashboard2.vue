<template>
  <v-container v-if="!loading" fluid style="background-color: #f2f4f8; min-height: 100vh; padding: 16px">
    <!--header-->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-3 d-flex align-center" color="primary" dark style="border-radius: 12px; height: 70px">
          <div
            class="text-h5 font-weight-bold flex-grow-1"
            :class="isRTL ? 'text-right' : 'text-left'"
            style="color: white"
          >
            {{ $t("page.risk_dashboard") }}
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

    <!--cards  -->
    <v-row dense class="mb-2 justify-start" style="margin-top: 14px; margin-bottom: 0px">
      <v-col v-for="(item, index) in statCards" :key="index" cols="12" sm="6" md="4" lg="2">
        <v-card outlined class="pa-3 text-center" style="height: 100px; border-radius: 12px">
          <div class="text-subtitle-1 font-weight mb-2" style="font-size: 14px; line-height: 1.2; color: #232757">
            {{ item.title }}
          </div>
          <div class="text-h5 font-weight-bold" style="color: #54689d; font-size: 20px"">{{ item.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-2">

  <!-- Top Threats and Exposure -->
  <v-col cols="12" sm="6" md="3" lg="3">
   <v-card class="pa-4" outlined style="border-radius: 12px; min-height: 355px; max-height: 355px; height: 355px; display: flex; flex-direction: column; position: relative; overflow: hidden;">
    <div class="text-h6 text-center mb-4"style="color: #232757">{{ $t("page.top_threats_and_exposure") }}</div>
      <v-simple-table dense style="background-color: white; table-layout: fixed; width: 100%; flex: 1; overflow-y: auto; max-height: 280px;">
        <colgroup>
          <col style="width: 33.33%" />
          <col style="width: 33.33%" />
          <col style="width: 33.33%" />
        </colgroup>
        <thead>
          <tr style="background-color: #232757">
            <th class="text-center" style="color: white; font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; border-right: 2px solid white; font-size: 16px;">
              {{ $t("table.threat") }}
            </th>
            <th class="text-center" style="color: white; font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; border-right: 2px solid white; font-size: 16px;">
              {{ $t("page.number_of_risks") }}
            </th>
            <th class="text-center" style="color: white; font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 16px;">
              {{ $t("page.exposure") + " (SAR)" }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in riskTableData1" :key="index" style="border-bottom: 1px solid #e0e0e0">
            <td style="padding: 8px 12px; color: #232757; border-right: 1px solid #e0e0e0; word-wrap: break-word; text-align: center; font-size: 15px;">
              {{ item.threat_name }}
            </td>
            <td style="padding: 8px 12px; color: #232757; border-right: 1px solid #e0e0e0; word-wrap: break-word; text-align: center; font-size: 15px;">
              {{ item.risks_count }}
            </td>
            <td style="padding: 8px 12px; color: #232757; word-wrap: break-word; text-align: center; font-size: 15px;">
              {{ formatCurrency(item.budget) }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-col>

  <!-- Total Risks by Likelihood -->
  <v-col cols="12" sm="6" md="3" lg="3">
  <v-card class="pa-4" outlined style="border-radius: 12px; height: 355px; position: relative; overflow: hidden;">
      <div class="text-h6 text-center mb-4" style="color: #232757">{{ $t("page.total_risks_by_liklihood") }}</div>
      <Chart
        :type="'bar'"
        :chart-data="totalRisksLikelihoodChartData"
        :chart-options="totalRisksLikelihoodChartOptions"
        :chart-height="275"
        :chart-width="'100%'"
      />
      <div class="d-flex align-center" style="font-size: 12px; color: #666; position: absolute; bottom: 0px; left: 16px">
        <span style="color: #d4a017; margin-right: 4px">▼</span>
        <span class="font-weight-bold" style="color: #232757">{{ $t("page.click_to_drill_down") }}</span>
      </div>
    </v-card>
  </v-col>

  <!-- Total Risks by Impact -->
  <v-col cols="12" sm="6" md="3" lg="3">
    <v-card class="pa-4" outlined style="border-radius: 12px; height: 355px; position: relative; overflow: hidden;">
      <div class="text-h6 text-center mb-4" style="color: #232757">{{ $t("page.total_risks_by_impact") }}</div>
      <Chart
        :type="'bar'"
        :chart-data="riskImpactChartData"
        :chart-options="riskImpactChartOptions"
        :chart-height="265"
        :chart-width="'100%'"
      />
      <div class="d-flex align-center" style="font-size: 12px; color: #666; position: absolute; bottom: 0px; left: 16px">
        <span style="color: #d4a017; margin-right: 4px">▼</span>
        <span class="font-weight-bold" style="color: #232757">{{ $t("page.click_to_drill_down") }}</span>
      </div>
    </v-card>
  </v-col>

  <!-- Risks by Status -->
  <v-col cols="12" sm="6" md="3" lg="3">
  <v-card class="pa-4" outlined style="border-radius: 12px; height: 355px; position: relative; overflow: hidden;">
      <div class="text-h6 text-center mb-4" style="color: #232757">{{ $t("page.risks_by_status") }}</div>

      <div class="d-flex" style="height: calc(100% - 70px); align-items: center;">
        <div class="flex-shrink-0" style="width: 220px; height: 220px;">
          <Chart
            :type="'pie'"
            :chart-data="pieChartData"
            :chart-options="pieChartOptions"
            :chart-height="220"
            :chart-width="220"
          />
        </div>
        <div class="flex-grow-1" style="margin-left: 24px; overflow-y: auto;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li
              v-for="(label, index) in pieChartData.labels"
              :key="index"
              class="d-flex align-center mb-2 legend-item"
              @click="goToRisksByStatus(pieChartData.statusIds[label], label)"
            >
              <span :style="{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                marginRight: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: pieChartData.datasets[0].backgroundColor[index]
              }"></span>
              <span style="font-size: 12px; color: #666; cursor: pointer;">
                {{ label }}: {{ pieChartData.datasets[0].data[index] }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="d-flex align-center" style="font-size: 12px; color: #666; position: absolute; bottom: 0px; left: 16px">
        <span style="color: #d4a017; margin-right: 4px">▼</span>
        <span class="font-weight-bold" style="color: #232757">{{ $t("page.click_to_drill_down") }}</span>
      </div>
    </v-card>
  </v-col>

</v-row>

   <v-row dense class="mt-2">

  <!-- Risk by Unit -->
  <v-col cols="12" md="3">
  <v-card class="pa-4" outlined style="border-radius: 12px; min-height: 355px; height: 355px; position: relative; overflow: hidden;">
      <div class="text-h6 text-center mb-4" style="color: #232757">
        {{ $t("page.risk_by_unit") }}
      </div>

      <div class="d-flex" style="height: calc(100% - 70px); align-items: center;">
        <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 220px; height: 220px;">
          <Chart
            :type="'doughnut'"
            :chart-data="riskUnitChartData"
            :chart-options="riskUnitsChartOptions"
            :chart-height="220"
            :chart-width="220"
          />
        </div>

        <div class="flex-grow-1" style="margin-left: 24px; overflow-y: auto; max-height: 220px;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li
              v-for="(label, index) in riskUnitChartData.labels"
              :key="index"
              class="d-flex align-center mb-2"
            >
              <span :style="{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                marginRight: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: riskUnitChartData.datasets[0].backgroundColor[index]
              }"></span>
              <span style="font-size: 12px; color: #666">
                {{ label }}: {{ riskUnitChartData.datasets[0].data[index] }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </v-card>
  </v-col>

  <!-- Risk Treatment Effect -->
  <v-col cols="12" md="6">
  <v-card class="pa-4" outlined style="border-radius: 12px; height: 355px; position: relative; overflow: hidden;">
      <div class="text-h6 text-center mb-3" style="color: #232757">{{ $t("page.risk_treatment_effect") }}</div>
        <v-row justify="center" class="mt-1 mb-3">
  <div class="grc-legend">
    
    <div 
      class="legend-item"
      @click="showInherent = !showInherent"
      :style="{ opacity: showInherent ? 1 : 0.4, cursor: 'pointer' }"
    >
      <span class="dot inherent"></span> Inherent
    </div>

    <div 
      class="legend-item"
      @click="showResidual = !showResidual"
      :style="{ opacity: showResidual ? 1 : 0.4, cursor: 'pointer' }"
    >
      <span class="dot residual"></span> Residual
    </div>

  </div>
</v-row>
      <div  style="height: calc(100% - 90px); width: 100%; position: relative">
        <Chart
          :type="'bar'"
          :chart-data="overallResidualChartData"
          :chart-options="overallResidualChartOptions"
          :chart-height="'100%'"
          :chart-width="'100%'"
        />
      </div>
    </v-card>
  </v-col>

  <!-- Risk Area (Scope of Risk) -->
  <v-col cols="12" md="3">
<v-card class="pa-4" outlined style="border-radius: 12px; min-height: 355px; height: 355px; position: relative; overflow: hidden;">
      <div class="text-h6 text-center mb-4" style="color: #232757">
        {{ $t("table.risk_area") }}
      </div>

      <div class="d-flex" style="height: calc(100% - 70px); align-items: center;">
        <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 220px; height: 220px;">
          <Chart
            :type="'doughnut'"
            :chart-data="riskAreaschartData"
            :chart-options="riskAreaschartOptions"
            :chart-height="220"
            :chart-width="220"
          />
        </div>

        <div class="flex-grow-1" style="margin-left: 24px; overflow-y: auto; max-height: 220px;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li
              v-for="(label, index) in riskAreaschartData.labels"
              :key="index"
              class="d-flex align-center mb-2 legend-item"
              @click="goToRisksByCategory(riskAreaschartData.categoryIds[label], label)"
            >
              <span :style="{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                marginRight: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: riskAreaschartData.datasets[0].backgroundColor[index]
              }"></span>
              <span style="font-size: 12px; color: #666; cursor: pointer;">
                {{ label }}: {{ riskAreaschartData.datasets[0].data[index] }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="d-flex align-center" style="font-size: 12px; color: #666; position: absolute; bottom: 0px; left: 16px">
        <span style="color: #d4a017; margin-right: 4px">▼</span>
        <span class="font-weight-bold" style="color: #232757">
          {{ $t("page.click_to_drill_down") }}
        </span>
      </div>
    </v-card>
  </v-col>

</v-row>

    <v-row dense class="mt-2">
     <!-- Risk by Asset Type -->
<v-col cols="12" md="3">
<v-card class="pa-4" outlined style="border-radius: 12px; height: 355px; position: relative; overflow: hidden;">
    <!-- Title -->
    <div class="text-h6 text-center mb-4" style="color: #232757">
      {{ $t("page.risk_by_asset_type") }}
    </div>

    <!-- Flex container: chart + legend -->
    <div class="d-flex" style="height: calc(100% - 70px); align-items: center;">
      <!-- Chart area -->
      <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 220px; height: 220px;">
        <Chart
          :type="'pie'"
          :chart-data="riskAssetsTypeChartData"
          :chart-options="riskAssetsTypeChartOptions"
          :chart-height="220"
          :chart-width="220"
        />
      </div>

      <!-- Legend area -->
      <div class="flex-grow-1" style="margin-left: 24px; overflow-y: auto; max-height: 220px;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li
            v-for="(label, index) in riskAssetsTypeChartData.labels"
            :key="index"
           class="d-flex align-center mb-2"

          >
            <span
              :style="{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                marginRight: '6px',
                borderRadius: '50%',
                  flexShrink: 0,
                backgroundColor: riskAssetsTypeChartData.datasets[0].backgroundColor[index]
              }"
            ></span>
            <span style="font-size: 12px; color: #666">
              {{ label }}: {{ riskAssetsTypeChartData.datasets[0].data[index] }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </v-card>
</v-col>


      <!-- Upcoming Risk Treatment Deadlines (Next 5 Days) -->
      <v-col cols="12" md="6">
       <v-card class="pa-4" outlined style="border-radius: 12px; height: 355px; position: relative; overflow: hidden;">
          <div class="text-h6 text-center mb-4"style="color: #232757">{{ $t("page.risk_treatment_deadline") }}</div>
          <chart
            :type="'scatter'"
            :chart-data="riskTreatmentDeadlineChartData"
            :chart-options="riskTreatmentDeadlineChartOptions"
            :chart-height="275"
            :chart-width="'100%'"
          />
        </v-card>
      </v-col>

      <!-- Top 5 Risks Identified and Exposure -->
      <v-col cols="12" sm="6" md="6" lg="3">
        <v-card class="pa-4" outlined style="border-radius: 12px; min-height: 355px; max-height: 355px; height: 355px; display: flex; flex-direction: column; position: relative; overflow: hidden;">
          <div class="text-h6 text-center mb-4"style="color: #232757">{{ $t("page.top_5_risks_identified_and_exposure") }}</div>
          <v-simple-table dense style="background-color: white; table-layout: fixed; width: 100%; flex: 1; overflow-y: auto; max-height: 280px;">
            <colgroup>
              <col style="width: 33.33%" />
              <col style="width: 33.33%" />
              <col style="width: 33.33%" />
            </colgroup>
            <thead>
              <tr style="background-color: #232757">
                <th
                  class="text-center"
                  style="
                    color: white;
                    font-weight: bold;
                    padding: 8px 12px;
                    border-bottom: 1px solid #e0e0e0;
                    border-right: 2px solid white;
                    font-size: 16px;
                  "
                >
                  {{ $t("table.name") }}
                </th>
                <th
                  class="text-center"
                  style="
                    color: white;
                    font-weight: bold;
                    padding: 8px 12px;
                    border-bottom: 1px solid #e0e0e0;
                    border-right: 2px solid white;
                    font-size: 16px;
                  "
                >
                  {{ $t("page.risk_severity") }}
                </th>
                <th
                  class="text-center"
                  style="
                    color: white;
                    font-weight: bold;
                    padding: 8px 12px;
                    border-bottom: 1px solid #e0e0e0;
                    font-size: 16px;
                  "
                >
                  {{ $t("table.identification_date") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in riskTableData2" :key="index" style="border-bottom: 1px solid #e0e0e0">
                <td
                  style="
                    padding: 8px 12px;
                    color: #232757;
                    border-right: 1px solid #e0e0e0;
                    word-wrap: break-word;
                    text-align: center;
                    font-size: 15px;
                  "
                >
                  {{ item.riskName }}
                </td>
                <td
                  style="
                    padding: 8px 12px;
                    color: #232757;
                    border-right: 1px solid #e0e0e0;
                    word-wrap: break-word;
                    text-align: center;
                    font-size: 15px;
                  "
                >
                  {{ item.severity }}
                </td>
                <td
                  style="padding: 8px 12px; color: #232757; word-wrap: break-word; text-align: center; font-size: 15px"
                >
                  {{ formatDate(item.identifiedDate) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

   <v-row dense class="mt-2" style="align-items: stretch;">
  
 
 <!-- Risk by Owner -->
<v-col cols="12" md="3" style="display: flex;">
  <v-card class="pa-4" outlined style="border-radius: 12px; width: 100%; display: flex; flex-direction: column; position: relative;">
    <div class="text-h6 text-center mb-4" style="color: #232757">
      {{ $t("page.risk_by_owner") }}
    </div>

    <div class="d-flex flex-grow-1" style="align-items: center; overflow: hidden;">
      <div class="flex-shrink-0 d-flex align-center justify-center" style="width: 220px; height: 350px;">
        <Chart
          :type="'pie'"
          :chart-data="riskByOwnerChartData"
          :chart-options="riskByOwnerChartOptions"
          :chart-height="350"
          :chart-width="220"
        />
      </div>

      <div class="flex-grow-1" style="margin-left: 24px; overflow-y: auto; max-height: 350px;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li
            v-for="(label, index) in riskByOwnerChartData.labels"
            :key="index"
            class="d-flex align-center mb-2 legend-item"
            @click="goToRisksByOwner(riskByOwnerChartData.ownerIds[index], label)"
          >
            <span
              :style="{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                marginRight: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: riskByOwnerChartData.datasets[0].backgroundColor[index]
              }"
            ></span>
            <span style="font-size: 12px; color: #666; cursor: pointer;">
              {{ label }}: {{ riskByOwnerChartData.datasets[0].data[index] }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="d-flex align-center"
      style="font-size: 12px; color: #666; position: absolute; bottom: 0px; left: 16px"
    >
      <span style="color: #d4a017; margin-right: 4px">▼</span>
      <span class="font-weight-bold" style="color: #232757">
        {{ $t("page.click_to_drill_down") }}
      </span>
    </div>
  </v-card>
</v-col>

  <!-- Heatmap -->
  <v-col cols="12" md="9" style="display: flex;">
    <v-card class="pa-4 heatmap-card" outlined style="border-radius: 12px; width: 100%; display: flex; flex-direction: column;">
      <div class="font-weight-bold mb-4" style="font-size: 20px; color: #232757">
        {{ $t("page.heatmap") }}
      </div>

      <div v-if="loadingHeatmap" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">Loading Heatmap Data...</div>
      </div>

      <div v-else-if="!hasHeatmapData" class="text-center pa-8">
        <v-icon large color="grey">mdi-alert</v-icon>
        <div class="mt-2">No data available for heatmap</div>
        <v-btn small class="mt-2" @click="loadHeatmapData" :loading="loadingHeatmap">
          Load Heatmap Data
        </v-btn>
      </div>

      <div v-else class="heatmap-wrapper flex-grow-1">
        <RiskHeatmap
          :risks="filteredRisks"
          :impacts="safeImpacts"
          :likelihoods="safeLikelihoods"
          :onset-speeds="safeOnsetSpeeds"
          :priorities="safePriorities"
        />
      </div>
    </v-card>
  </v-col>

</v-row>
     <!-- Dashboard Version -->
      <div class="text-caption text-right mt-4" style="color: #666">v1.5.1</div>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex"
import Chart from "@/components/charts/Chart.vue"
import RiskHeatmap from "@/components/charts/RiskHeatmap.vue"

export default {
  name: "RiskDashboard",
  components: { Chart, RiskHeatmap },
  layout: "dashboard-layout",
  data() {
    return {
      loading: true,
      loadingHeatmap: false,
      heatmapDataLoaded: false,
      logo: require("@/assets/img/logo-sw1.svg"),
      showInherent: true,
    showResidual: true
    }
  },
  computed: {
    ...mapState("risk", [
      "risks",
      "stats",
      "riskPriorities",
      "riskTypes",
      "riskCategories",
      "riskStatuses",
      "impacts",
      "likelihoods",
      "onsetSpeeds",
      // "loading",
      "errors"
    ]),
    ...mapState("riskDashboard", ["treatmentDeadline", "riskTableData", "risksByAssetType", "top5Risks", "topThreats"]),
    ...mapState(["isRTL"]),

    //heatmap safe data
    safeImpacts() {
      return Array.isArray(this.impacts) ? this.impacts : []
    },
    safeLikelihoods() {
      return Array.isArray(this.likelihoods) ? this.likelihoods : []
    },
    safeOnsetSpeeds() {
      return Array.isArray(this.onsetSpeeds) ? this.onsetSpeeds : []
    },
    safePriorities() {
      return Array.isArray(this.riskPriorities) ? this.riskPriorities : []
    },

    filteredRisks() {
      if (!Array.isArray(this.risks)) return []
      return this.risks.filter(
        (risk) => risk && risk.risk_rating?.score !== undefined && risk.risk_rating?.score !== null
      )
    },

    hasHeatmapData() {
      return (
        this.heatmapDataLoaded &&
        this.filteredRisks.length > 0 &&
        this.safeImpacts.length > 0 &&
        this.safeLikelihoods.length > 0 &&
        this.safePriorities.length > 0
      )
    },

    //cards
    statCards() {
      const stats = this.stats || {}
      const risksArray = Array.isArray(this.risks) ? this.risks : []
      const totalResidual = risksArray.filter((r) => r?.overall_residual_rating != null).length
      const evaluated = risksArray?.filter((r) => r?.analysis_evaluation_date != null).length || 0
      const unevaluated = risksArray?.filter((r) => r?.analysis_evaluation_date == null).length || 0

      return [
        {
          title: this.$t("page.total_residual_risks"),
          value: totalResidual
        },
        {
          title: this.$t("page.total_evaluated_risks"),
          value: evaluated
        },
        {
          title: this.$t("page.total_unevaluated_risks"),
          value: unevaluated,
          note: "▼ Target must be 0"
        },
        {
          title: this.$t("page.average_treatment_progress"),
          value: (stats.progress || 0) + "%"
        },
        {
          title: this.$t("page.total_risk"),
          value: stats.total_risks || risksArray.length || "0"
        },
        {
          title: this.$t("page.exposure"),
          value: this.formatCurrencyWithSAR(stats.risk_exposure || 0)
        }
      ]
    },

    //chart1
    totalRisksLikelihoodChartData() {
      const counts = {}
      const colors = {}
      const likelihoodIds = {}

      this.risks.forEach((r) => {
        const name = r.likely_hood?.name?.trim() || "Unknown"
        const id = r.likely_hood?.id || null
        const color = r.likely_hood?.color || "#cccccc"

        counts[name] = (counts[name] || 0) + 1
        colors[name] = color

        // store id by name
        if (!likelihoodIds[name]) {
          likelihoodIds[name] = id
        }
      })
      return {
        labels: Object.keys(counts),
        likelihoodIds,
        datasets: [
          {
            display: true,
            label: "Total Risks by Likelihood",
            data: Object.values(counts),
            backgroundColor: Object.keys(counts).map((key) => colors[key]),
            maxBarThickness: 30
          }
        ]
      }
    },
    totalRisksLikelihoodChartOptions() {
      // const self = this
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              //color: "#232757",
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
              //color: "#232757",
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
                return `Risk Likelihood: ${tooltipItems[0].label}`
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
        },
        // Drill-down
        onClick: (evt, activeElements, chart) => {
          if (!activeElements.length) return

          const index = activeElements[0].index

          const likelihoodName = chart.data.labels[index]
          const likelihoodId = chart.data.likelihoodIds?.[likelihoodName]

          console.log("Drill down → Likelihood:", likelihoodName, likelihoodId)

          if (likelihoodId) {
            this.goToRisksByLikelihood(likelihoodId, likelihoodName)
          }
        },
        onHover: (evt, activeElements) => {
          evt.native.target.style.cursor = activeElements.length ? "pointer" : "default"
        }
      }
    },

    pieChartData() {
      if (!this.risks || !this.risks.length) return { labels: [], datasets: [], statusIds: {} }

      const statusCounts = {}
      const statusColors = {}
      const statusIds = {}

      this.risks.forEach((r) => {
        const statusName = r.risk_status?.name || "Unknown"
        const statusColor = r.risk_status?.color || "#cccccc"
        const statusId = r.risk_status?.id || null

        statusCounts[statusName] = (statusCounts[statusName] || 0) + 1
        statusColors[statusName] = statusColor
        statusIds[statusName] = statusId
      })
      return {
        labels: Object.keys(statusCounts),
        statusIds,
        datasets: [
          {
            data: Object.values(statusCounts),
            backgroundColor: Object.keys(statusCounts).map((key) => statusColors[key]),
            borderWidth: 0,
            //hoverOffset: 10
          }
        ]
      }
    },
    pieChartOptions() {
      const self = this
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,


        //radius: "80%",
        layout:{padding: 20
        },
        // Drill-down
        onClick: (evt, activeElements) => {
          if (!activeElements.length) return

          const index = activeElements[0].index
          const chartData = self.pieChartData
          const statusName = chartData.labels[index]
          const statusId = chartData.statusIds[statusName]

          if (statusId) {
            self.goToRisksByStatus(statusId, statusName)
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
                return `Risk Status: ${tooltipItems[0].label}`
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

    // Total Risk by impact -
    riskImpactChartData() {
      if (this.stats?.impacts) {
        return {
          labels: this.stats.impacts.map((i) => i.name),
          impactIds: this.stats.impacts.reduce((acc, i) => {
            acc[i.name] = i.id
            return acc
          }, {}),
          datasets: [
            {
              label: "Total Risks by Impact",
              data: this.stats.impacts.map((i) => i.count),
              backgroundColor: this.stats.impacts.map((i) => i.color || "#9b59b6")
            }
          ]
        }
      }

      const counts = {}
      const colors = {}
      const impactIds = {}

      this.risks.forEach((r) => {
        const name = r.impact?.name || "Unknown"
        const id = r.impact?.id || null
        const color = r.impact?.color || "#9b59b6"

        counts[name] = (counts[name] || 0) + 1
        colors[name] = color

        if (!impactIds[name]) {
          impactIds[name] = id
        }
      })

      return {
        labels: Object.keys(counts),
        impactIds,
        datasets: [
          {
            label: "Total Risks by Impact",
            data: Object.values(counts),
            backgroundColor: Object.keys(colors).map((key) => colors[key]),
            maxbarThickness: 30
          }
        ]
      }
    },

    riskImpactChartOptions() {
      const self = this
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              //color: "#232757",
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
              //color: "#232757",
              font: {
                size: 12
              },
              maxRotation: 15,
              minRotation: 15
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
                return `Risk Impact: ${tooltipItems[0].label}`
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
            barPercentage: 0.5,
            categoryPercentage: 0.8
          }
        },
        // DRILL DOWN
        onClick: (evt, activeElements, chart) => {
          if (!activeElements.length) return

          const index = activeElements[0].index
          const impactName = chart.data.labels[index]
          const impactId = chart.data.impactIds?.[impactName]

          console.log("Drill down → Impact:", impactName, impactId)

          if (impactId) {
            self.goToRisksByImpact(impactId, impactName)
          }
        },

        onHover: (evt, activeElements) => {
          evt.native.target.style.cursor = activeElements.length ? "pointer" : "default"
        }
      }
    },

   overallResidualChartData() {
  const inherentData = this.stats?.inherent?.map((r) => r.count) || []
  const residualData = this.stats?.residual?.map((r) => r.count) || []
  const labels = this.stats?.inherent?.map((r) => r.name) || []

  const datasets = []

  if (this.showInherent) {
    datasets.push({
      label: "Inherent",
      data: inherentData,
      backgroundColor: "#232757",
      borderWidth: 0
    })
  }

  if (this.showResidual) {
    datasets.push({
      label: "Residual",
      data: residualData,
      backgroundColor: "#54689d",
      borderWidth: 0
    })
  }

  return {
    labels,
    datasets
  }
},
    overallResidualChartOptions() {
      //const self = this
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              //color: "#232757",
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
            stacked: true,
            display: true,
            ticks: {
             // color: "#232757",
              font: {
                size: 12
              }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            position: "top",
            labels: {
              font: {
                size: 12
              }
            }
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
                return `Risk Treatment Effect: ${tooltipItems[0].label}`
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
        },
        // DRILL DOWN
          //  onClick:(evt, activeElements, chart) => {
          //   if (!activeElements.length) return

          //   const element = activeElements[0]

          //   const index = element.index // X label index
          //   const datasetIndex = element.datasetIndex // Overall / Residual

          //   const labelName = chart.data.labels[index]
          //   const datasetLabel = chart.data.datasets[datasetIndex].label

          //   let riskType = null
          //   let riskId = null

          //   if (datasetLabel === "Inherent") {
          //     riskType = "inherent"
          //     riskId = chart.data.inherentIds?.[labelName]
          //   }

          //   if (datasetLabel === "Residual") {
          //     riskType = "residual"
          //     riskId = chart.data.residualIds?.[labelName]
          //   }

          //   console.log("Drill down →", datasetLabel, labelName, riskId)

          //   if (riskId && riskType) {
          //     self.goToRisksByTreatment(riskType, riskId)
          //   }
          // },

          // onHover: (evt, activeElements) => {
          //   evt.native.target.style.cursor = activeElements.length ? "pointer" : "default"
          // }
      }
    },
    //chart4
    /* overallChartData() {
     const name = this.stats?.inherent.map((r) => {
       return r.name
     })
     const data = this.stats?.inherent.map((r) => {
       return r.count
     })
     const colors = this.stats?.inherent.map((r) => {
        return r.color
      })

      return {
        labels: name,
        datasets: [
          {
            display: false,
            label: "Overall",
            data: data,
            backgroundColor: colors
          }
        ]
      }
    },
    overallChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "#232757",
              font: {
                size: 14
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
              color: "#232757",
              font: {
                size: 14
              },
              maxRotation: 45,
              minRotation: 45
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
          }
        }
      }
    },
    //chart5
    residualchartData() {
      const name = this.stats?.residual.map((r) => {
        return r.name
      })
      const data = this.stats?.residual.map((r) => {
        return r.count
      })
      const colors = this.stats?.residual.map((r) => {
        return r.color
      })

      return {
        labels: name,
        datasets: [
          {
            display: false,
            label: "Residual",
            data: data,
            backgroundColor: colors
          }
        ]
      }
    },
    residualchartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "#232757",
              font: {
                size: 14
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
              color: "#232757",
              font: {
                size: 14
              },
              maxRotation: 45,
              minRotation: 45
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
          }
        }
      }
    },*/
    //chart6
    riskAreaschartData() {
      if (!Array.isArray(this.risks) || this.risks.length === 0) {
        return { labels: [], datasets: [], categoryIds: {} }
      }

      const data = {}
      const categoryIds = {}

      this.risks.forEach((r) => {
        const name = r.risk_category?.name || "Unknown"
        const id = r.risk_category?.id || null

        data[name] = (data[name] || 0) + 1
        categoryIds[name] = id
      })

      const fixedColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]

      const categoryCount = Object.keys(data).length

      let colors = []
      if (categoryCount <= fixedColors.length) {
        colors = Object.keys(data).map((_, i) => fixedColors[i % fixedColors.length])
      } else {
        colors = this.generateColorShades(fixedColors, categoryCount)
      }

      return {
        labels: Object.keys(data),
        categoryIds,
        datasets: [
          {
            label: "Total Risks",
            data: Object.values(data),
            backgroundColor: colors,
            borderWidth: 0,
            //hoverOffset: 10
          }
        ]
      }
    },
    riskAreaschartOptions() {
      const self = this
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        //radius: "85%",
          layout:{padding: 20
          },
        onClick: (evt, activeElements, chart) => {
          if (!activeElements.length) return

          const element = activeElements[0]
          const index = element.index

          const chartData = chart.data
          const categoryName = chartData.labels[index]
          const categoryId = chartData.categoryIds ? chartData.categoryIds[categoryName] : null

          if (categoryId) {
            self.goToRisksByCategory(categoryId, categoryName)
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
                return `Risk Area: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: { display: false }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
        },
        clip: false
      }
    },
    //chart7
    riskUnitChartData() {
      if (!Array.isArray(this.risks) || this.risks.length === 0) {
        return { labels: [], datasets: [] }
      }

      const data = {}
      const colors = {}

      this.risks.forEach((r) => {
        const unitName = r.unit?.name || "Unknown"
        data[unitName] = (data[unitName] || 0) + 1
      })

      const fixedColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
      const unitCount = Object.keys(data).length

      let unitColors = []
      if (unitCount <= fixedColors.length) {
        unitColors = Object.keys(data).map((_, i) => fixedColors[i % fixedColors.length])
      } else {
        unitColors = this.generateColorShades(fixedColors, unitCount)
      }

      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: "Total Risks",
            data: Object.values(data),
            backgroundColor: unitColors,
            borderWidth: 0,
           // hoverOffset: 10
          }
        ]
      }
    },
    riskUnitsChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        // radius: "90%",
        // cutout: "50%",
        layout:{padding: 20
        },
         onClick: (evt, activeElements, chart) => {
          if (!activeElements.length) return

          const element = activeElements[0]
          const index = element.index

          const chartData = chart.data
          const unitName = chartData.labels[index]

          this.goToRisksByUnit(unitName)
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
                return `Risk Unit: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: { display: false }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
        },
         clip: false
      }
    },
    //chart8
    // Risk by Owner Chart -
    riskByOwnerChartData() {
      if (!Array.isArray(this.risks) || this.risks.length === 0) {
        return { labels: [], datasets: [], ownerIds: [] }
      }

      const ownerCounts = {}
      const colors = {}
      const ownerIdsMap = {}
      Object.values(ownerCounts)

      this.risks.forEach((r) => {
        const ownerName = r.owner?.full_name || r.owner?.name || "Unassigned"
        const ownerId = r.owner?.id || null

        ownerCounts[ownerName] = (ownerCounts[ownerName] || 0) + 1
        if (!ownerIdsMap[ownerName]) ownerIdsMap[ownerName] = ownerId
      })

      const fixedColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
      const ownerCount = Object.keys(ownerCounts).length

      let ownerColors = []
      if (ownerCount <= fixedColors.length) {
        ownerColors = Object.keys(ownerCounts).map((_, i) => fixedColors[i % fixedColors.length])
      } else {
        ownerColors = this.generateColorShades(fixedColors, ownerCount)
      }

      return {
        labels: Object.keys(ownerCounts),
        ownerIds: Object.keys(ownerCounts).map((name) => ownerIdsMap[name]),
        datasets: [
          {
            label: "Total Risks by Owner",
            data: Object.values(ownerCounts),
            backgroundColor: ownerColors,
            borderColor: ownerColors.map((color) => this.adjustColor(color, -20)),
            borderWidth: 1,
           // hoverOffset: 10
          }
        ]
      }
    },

    riskByOwnerChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
         layout:{padding: 20},
        //radius: "85%",
        onClick: (evt, activeElements) => {
          if (!activeElements.length) return

          const index = activeElements[0].index
          const ownerId = this.riskByOwnerChartData.ownerIds[index]
          const ownerName = this.riskByOwnerChartData.labels[index]

          this.goToRisksByOwner(ownerId, ownerName)
        },
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
                return `Risk Owner: ${tooltipItems[0].label} `
              }
            }
          },
          datalabels: { display: false }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
        }
      }
      clip: false
    },

    // --- Risk by Threats --- Table1
    // riskTableData1() {
    //   return this.topThreats
    // },
    riskTableData1() {
      if (!Array.isArray(this.topThreats) || this.topThreats.length === 0) {
        return []
      }

      const topThreats = [...this.topThreats]
        .sort((a, b) => {
          const exposureA = a.budget || 0
          const exposureB = b.budget || 0
          return exposureB - exposureA
        })
        .slice(0, 5)

      return topThreats.map((item) => ({
        threat_name: item.threat_name || "N/A",
        risks_count: item.risks_count || 0,
        budget: item.budget || 0
      }))
    },
    //Table2
    riskTableData2() {
      if (!Array.isArray(this.top5Risks)) {
        return []
      }

      const topRisks = [...this.top5Risks]
        .sort((a, b) => {
          const severityA = a.severity || 0
          const severityB = b.severity || 0
          return severityB - severityA
        })
        .slice(0, 5)

      return topRisks.map((item) => {
        const originalDate = item.identification_date
        let displayDate = "N/A"

        if (originalDate) {
          const dateString = String(originalDate).trim()

          const invalidValues = [
            "null",
            "undefined",
            "invalid",
            "nan",
            "0000-00-00",
            "0000-00-00 00:00:00",
            "1970-01-01",
            "1900-01-01"
          ]

          if (!dateString || invalidValues.includes(dateString.toLowerCase())) {
            displayDate = "N/A"
          } else {
            try {
              let date = new Date(dateString)

              if (isNaN(date.getTime())) {
                const parts = dateString.split("/")
                if (parts.length === 3) {
                  date = new Date(parts[2], parts[1] - 1, parts[0])
                }

                if (isNaN(date.getTime())) {
                  const isoParts = dateString.split("-")
                  if (isoParts.length === 3) {
                    date = new Date(isoParts[0], isoParts[1] - 1, isoParts[2])
                  }
                }

                if (isNaN(date.getTime())) {
                  date = new Date(dateString.replace(" ", "T"))
                }
              }

              if (!isNaN(date.getTime())) {
                const year = date.getFullYear()
                if (year >= 1900 && year <= 2100) {
                  displayDate = date.toISOString().split("T")[0] // YYYY-MM-DD
                } else {
                  displayDate = "Invalid Year"
                }
              } else {
                displayDate = "Invalid Format"
              }
            } catch (error) {
              displayDate = "Date Error"
            }
          }
        }

        return {
          riskName: item.name || "N/A",
          severity: item.severity || "N/A",
          identifiedDate: displayDate
        }
      })
    },
    // --- Risk by Assets Type ---
    riskAssetsTypeChartData() {
      if (!Array.isArray(this.risksByAssetType) || this.risksByAssetType.length === 0) {
        return { labels: [], datasets: [] }
      }

      const labels = this.risksByAssetType.map((item) => item.asset_type || "Unknown")
      const data = this.risksByAssetType.map((item) => item.count || 0)

      const fixedColors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
      const assetTypeCount = this.risksByAssetType.length

      let assetTypeColors = []
      if (assetTypeCount <= fixedColors.length) {
        assetTypeColors = this.risksByAssetType.map((_, i) => fixedColors[i % fixedColors.length])
      } else {
        assetTypeColors = this.generateColorShades(fixedColors, assetTypeCount)
      }

      const colors = this.risksByAssetType.map((item, index) => item.color || assetTypeColors[index])

      return {
        labels,
        datasets: [
          {
            label: "Total Risks",
            data,
            backgroundColor: colors,
            borderColor: colors.map((color) => this.adjustColor(color, -20)),
            borderWidth: 1,
            //hoverOffset: 10
          }
        ]
      }
    },

    riskAssetsTypeChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        hoverOffset: 10,
        layout:{padding: 20
        },
        
        //radius: "80%",
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
                return `Risk Asset Type: ${tooltipItems[0].label}`
              }
            }
          },
          datalabels: { display: false }
        },
        elements: {
          arc: { borderWidth: 0, borderColor: "#ffffff", borderAlign: "center" }
        },
        clip: false
      }
    },
    // --- Risk Treatment Deadline ---

    riskTreatmentDeadlineChartData() {
      if (!this.treatmentDeadline || !Array.isArray(this.treatmentDeadline)) return { datasets: [] }

      const baseColors = ["#7ab541", "#232757", "#eaa035", "#54689d", "#e2be36"]

      const allDates = this.treatmentDeadline
        .flatMap((r) => (Array.isArray(r.end_date) ? r.end_date : [r.end_date]))
        .map((d) => new Date(d))
        .filter((d) => !isNaN(d))

      if (allDates.length === 0) return { datasets: [] }

      const maxDate = new Date(Math.max(...allDates))

      const minDate = new Date(maxDate)
      minDate.setDate(minDate.getDate() - 7)

      const riskNames = [...new Set(this.treatmentDeadline.map((r) => r.name))]

      const riskCount = this.treatmentDeadline.length
      let colors = []
      if (riskCount <= baseColors.length) {
        colors = baseColors.slice(0, riskCount)
      } else {
        colors = this.generateColorShades(baseColors, riskCount)
      }

      const dateMap = {}
      allDates.forEach((date) => {
        const dateStr = date.toISOString().split("T")[0]
        dateMap[dateStr] = date.getTime()
      })

      const uniqueDates = Object.keys(dateMap).sort()

      const xPositions = {}
      uniqueDates.forEach((dateStr, index) => {
        xPositions[dateStr] = index
      })

      const yPositions = {}
      riskNames.forEach((name, index) => {
        yPositions[name] = index
      })

      const datasets = this.treatmentDeadline
        .map((risk, idx) => {
          const dates = Array.isArray(risk.end_date) ? risk.end_date : [risk.end_date]

          const filteredDates = dates
            .map((d) => new Date(d))
            .filter((date) => !isNaN(date) && date >= minDate && date <= maxDate)

          if (filteredDates.length === 0) return null

          return {
            label: risk.name,
            data: filteredDates.map((date) => {
              const dateStr = date.toISOString().split("T")[0]
              return {
                x: xPositions[dateStr] || 0,
                y: yPositions[risk.name],
                riskName: risk.name,
                originalDate: date,
                dateStr: dateStr
              }
            }),
            backgroundColor: colors[idx % colors.length],
            borderColor: colors[idx % colors.length],
            pointRadius: 8,
            pointHoverRadius: 12,
            pointBorderWidth: 2,
            showLine: false
          }
        })
        .filter(Boolean)

      return {
        datasets,
        riskNames,
        uniqueDates
      }
    },
    riskTreatmentDeadlineChartOptions() {
      const allDates =
        this.treatmentDeadline
          ?.flatMap((r) => (Array.isArray(r.end_date) ? r.end_date : [r.end_date]))
          ?.filter(Boolean)
          ?.map((d) => new Date(d)) || []

      if (allDates.length === 0) {
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      }

      const riskNames = [...new Set(this.treatmentDeadline.map((r) => r.name))]

      const uniqueDates = [...new Set(allDates.map((date) => date.toISOString().split("T")[0]))].sort()

      return {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
            position: "top",
            labels: {
              font: { size: 12 },
              color: "#232757",
              usePointStyle: true,
              pointStyle: "circle",
              padding: 10,
              boxWidth: 20
            }
          },

          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: "#ffffff",
            borderWidth: 1,

            cornerRadius: 6,
            padding: {
              top: 10,
              bottom: 10,
              left: 14,
              right: 14
            },

            titleColor: "#ffffff",
            bodyColor: "#ffffff",

            titleFont: {
              size: 12,
              //weight: "bold"
            },
            bodyFont: {
              size: 12
            },

            displayColors: false,

            callbacks: {
              title: (tooltipItems) => {
                if (tooltipItems.length && tooltipItems[0].raw) {
                  return `Upcomming Risk Treatment: ${tooltipItems[0].raw.riskName || ""}`
                }
                return ""
              },
              label: (context) => {
                if (context.raw && context.raw.originalDate) {
                  const date = new Date(context.raw.originalDate)
                  return `Due: ${date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                  })}`
                }
                return "Date not available"
              }
            }
          },

          datalabels: { display: false }
        },

        scales: {
          x: {
            type: "linear",
            position: "bottom",
            min: -0.5,
            max: Math.max(uniqueDates.length - 0.5, 0),
            ticks: {
             // color: "#232757",
              font: { size: 12 },
              autoSkip: false,
              maxTicksLimit: 20,
              precision: 0,
              callback: function (value) {
                if (value >= 0 && value < uniqueDates.length && Number.isInteger(value)) {
                  const date = new Date(uniqueDates[value])
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit"
                  })
                }
                return ""
              }
            },
            grid: {
              color: "rgba(0,0,0,0.1)",
              drawBorder: false,
              lineWidth: 1
            },
            title: {
              display: false,
              text: "Timeline",
              color: "#232757",
              font: { size: 14, weight: "bold" }
            }
          },

          y: {
            type: "linear",
            position: "left",
            min: -0.5,
            max: Math.max(riskNames.length - 0.5, 0),
            ticks: {
              //color: "#232757",
              font: {
                size: 12
              },
              padding: 1,
              stepSize: 1,
              precision: 0,
              autoSkip: false,
              callback: function (value) {
                if (value >= 0 && value < riskNames.length && Number.isInteger(value)) {
                  return riskNames[value]
                }
                return ""
              }
            },
            grid: {
              color: "rgba(0,0,0,0.05)",
              drawBorder: false,
              lineWidth: 1
            },
            title: {
              display: false,
              text: "Risks",
              color: "#232757",
              font: { size: 14, weight: "bold" }
            }
          }
        },

        interaction: {
          intersect: false,
          mode: "nearest",
          axis: "xy"
        },

        elements: {
          radius: 1.5,
          hoverRadius: 4,
          hoverBorderWidth: 2,
          borderWidth: 1,
          hoverBackgroundColor: "#ffffff",
          pointStyle: "circle"
        },

        layout: {
          padding: {
            left: 1,
            right: 1,
            top: 20,
            bottom: 1
          }
        },

        width: "100%",
        height: 600,

        animation: {
          duration: 800,
          easing: "easeOutQuart"
        }
      }
    }
  },
  async mounted() {
    try {
      await this.loadInitialData()

      if (!this.hasHeatmapData) {
        await this.loadHeatmapData()
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions("risk", [
      "fetchRisks",
      "fetchRiskPriorities",
      "fetchRiskTypes",
      "fetchRiskCategories",
      "fetchRiskStatuses",
      "fetchImpacts",
      "fetchLikelihoods",
      "fetchOnsetSpeeds",
      "fetchStats"
    ]),
    ...mapActions("riskDashboard", ["fetchRiskTableData"]),

    async loadInitialData() {
      try {
        this.loading = true
        await Promise.all([this.fetchRisks(), this.fetchRiskTableData(), this.fetchStats()])
      } catch (error) {
        console.error("Failed to load initial data:", error)
      } finally {
        this.loading = false
      }
    },

    async loadHeatmapData() {
      try {
        this.loadingHeatmap = true

        await Promise.all([
          this.fetchRiskPriorities(),
          this.fetchImpacts(),
          this.fetchLikelihoods(),
          this.fetchOnsetSpeeds()
        ])

        this.heatmapDataLoaded = true
        console.log("Heatmap data loaded:", {
          risks: this.filteredRisks.length,
          impacts: this.safeImpacts.length,
          likelihoods: this.safeLikelihoods.length,
          priorities: this.safePriorities.length
        })
      } catch (error) {
        console.error("Failed to load heatmap data:", error)
      } finally {
        this.loadingHeatmap = false
      }
    },

    formatCurrencyWithSAR(value) {
      if (value === null || value === undefined || isNaN(value)) return "0 SAR"
      return value.toLocaleString("en-US", { minimumFractionDigits: 0 }) + " SAR"
    },

    formatCurrency(value) {
      if (value === null || value === undefined || isNaN(value)) return "0"
      return value.toLocaleString("en-US", { minimumFractionDigits: 0 })
    },

    adjustColor(color, amount) {
      return (
        "#" +
        color
          .replace(/^#/, "")
          .replace(/../g, (color) =>
            ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
          )
      )
    },
    formatDate(date) {
      if (!date) return "N/A"
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    },
    generateColor(index) {
      const colors = ["#232757", "#54689d", "#7ab541", "#eaa035", "#e2be36"]
      return colors[index % colors.length]
    },
    generateColorShades(baseColors, requiredCount) {
      const shades = []
      const shadesPerColor = Math.ceil(requiredCount / baseColors.length)

      baseColors.forEach((baseColor) => {
        shades.push(baseColor)

        for (let i = 1; i < shadesPerColor; i++) {
          if (shades.length >= requiredCount) break

          const lightnessFactor = 0.2 * i
          const lighterColor = this.lightenColor(baseColor, lightnessFactor)
          shades.push(lighterColor)
        }
      })

      return shades.slice(0, requiredCount)
    },

    lightenColor(hex, factor) {
      let r = parseInt(hex.slice(1, 3), 16)
      let g = parseInt(hex.slice(3, 5), 16)
      let b = parseInt(hex.slice(5, 7), 16)

      r = Math.min(255, Math.floor(r + (255 - r) * factor))
      g = Math.min(255, Math.floor(g + (255 - g) * factor))
      b = Math.min(255, Math.floor(b + (255 - b) * factor))

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    },

    adjustColor(color, amount) {
      return (
        "#" +
        color
          .replace(/^#/, "")
          .replace(/../g, (color) =>
            ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
          )
      )
    },
    goToRisksByOwner(ownerId, ownerName) {
      console.log("Drill down → Owner:", ownerName, ownerId)

      this.$router.push({
        path: "/grc/risk-register",
        query: {
          owner_id: ownerId
        }
      })
    },
    goToRisksByStatus(statusId, statusName) {
      console.log("Drill down → Status:", statusName, statusId)
      this.$router.push({
        path: "/grc/risk-register",
        query: {
          risk_status_id: statusId
        }
      })
    },
    goToRisksByCategory(categoryId, categoryName) {
      console.log("Drill down → Category:", categoryName, categoryId)
      this.$router.push({
        path: "/grc/risk-register",
        query: { risk_category_id: categoryId }
      })
    },
    goToRisksByLikelihood(likelihoodId) {
      console.log("Navigate with likelihood_id:", likelihoodId)

      this.$router.push({
        path: "/grc/risk-register",
        query: {
          likelihood_id: likelihoodId
        }
      })
    },
    goToRisksByImpact(impactId, impactName) {
      console.log("Navigate → Impact:", impactName, impactId)

      this.$router.push({
        path: "/grc/risk-register",
        query: {
          impact_id: impactId
        }
      })
    },
    // goToRisksByTreatment(type, id) {
    //   console.log(`Navigate → Treatment Type: ${type}, ID: ${id}`)
    //   this.$router.push({
    //     path: "/grc/risk-register",
    //     query: {
    //       treatment_type: type, // inherent | residual
    //       treatment_id: id
    //     }
    //   })
    // }
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
.heatmap-wrapper {
  width: 100%;
  overflow: auto;
}

.heatmap-wrapper > * {
  max-width: 100%;
  height: auto;
}
.grc-legend {
  display: flex;
  gap: 20px;
  font-size: 13px;
  align-items: center;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 20px;
  height: 10px;
  border-radius: 3px;
}

.inherent {
  background-color: #232757;
}

.residual {
  background-color: #54689d;
}
</style>