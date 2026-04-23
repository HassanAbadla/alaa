<template>
  <div>
    <div class="subscriptions-container">
      <div v-for="subscription in subscriptions" :key="subscription.id" class="subscription-card">
        <unified-card-wrapper :title="subscription.title || `Contract id: ${subscription.id}`">
          <template v-slot:title-right>
            <v-chip v-if="isContractClosed(subscription)" x-small class="ml-2" color="red" text-color="white">
              {{ $t("page.closed") }}
            </v-chip>
          </template>

          <v-card-title class="d-flex flex-column align-start mx-0 px-0">
            <div class="text-caption mt-1">
              <div>
                <span class="caption ma-0 pa-0">{{ $t("page.code") }}:</span>
                <span class="body-4 font-weight-bold secondary--text text--darken-2">{{ subscription.code }}</span>
              </div>
              <div>{{ $t("page.start") }}: {{ formatDate(subscription.start_date) }}</div>
              <div>{{ $t("page.end") }}: {{ formatDate(subscription.end_date) }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <framework-section
              v-for="pkg in subscription.audit_contracts"
              :key="pkg.id"
              :title="pkg.compliance_package?.name"
              :progress="pkg.progress"
              :score="pkg.score"
              class="mb-4"
              row
            >
              <template v-slot:title-left>
                <v-icon color="secondary" @click="openChartDialog(pkg)">mdi-chart-bar</v-icon>
              </template>
            </framework-section>
          </v-card-text>
        </unified-card-wrapper>
      </div>
    </div>

    <custom-dialog v-model="chartDialog" :title="AuditContract?.compliance_package?.name" width="600px">
      <v-card-text v-if="AuditContract">
        <chart type="bar" :chart-data="chartData" />
      </v-card-text>
    </custom-dialog>
  </div>
</template>

<script>
import { getAuditContractsChart } from "../../api/audit-api"
import Chart from "../charts/Chart.vue"
import CircularProgress from "../custom-table/CircularProgress.vue"
import ProgressPieChart from "../custom-table/ProgressPieChart.vue"
import FrameworkSection from "./FrameworkSection.vue"
import UnifiedCardWrapper from "./UnifiedCardWrapper.vue"
export default {
  name: "ContractsViewOne",
  props: {
    // subscriptions: { type: Array, required: true, default: () => [] }
  },
  components: { Chart, CircularProgress, ProgressPieChart, FrameworkSection, UnifiedCardWrapper },
  data() {
    return {
      subscriptions: [],
      chartDialog: false,
      AuditContract: null,
      chartData: {
        labels: [""],
        datasets: [
          {
            label: "Progress",
            maxBarThickness: 100,
            data: [],
            backgroundColor: this.$vuetify.theme.themes.light.secondary, // secondary
            tension: 1
          },
          {
            label: "Score",
            maxBarThickness: 100,
            data: [],
            backgroundColor: this.$vuetify.theme.themes.light.tertiary, // warning
            tension: 0.1
          }
        ]
      }
    }
  },
  computed: {
    computedSubs() {}
  },
  methods: {
    pkgLabels(pkg) {
      console.log(pkg)
    },
    openChartDialog(auditContract) {
      this.AuditContract = auditContract
      this.chartDialog = true
      this.chartData.labels = this.AuditContract.children.map((audit) => audit.name)
      this.chartData.datasets[0].data = this.AuditContract.children.map((audit) => audit.progress)
      this.chartData.datasets[1].data = this.AuditContract.children.map((audit) => audit.score)
    },
    closeChartDialog() {
      this.AuditContract = null
      this.chartDialog = false
    },
    formatDate(dateString) {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        })
        .replace(/\//g, "/")
    },
    isContractClosed(subscription) {
      return subscription.close
    },
    fetchChart() {
      getAuditContractsChart(this.$axios).then((res) => {
        this.subscriptions = res.data.subscriptions
        console.log("Subscriptions", this.subscriptions)
      })
    }
  },
  mounted() {
    this.fetchChart()
  }
}
</script>

<style scoped>
.subscriptions-container {
  column-count: 1;
  column-gap: 16px;
  /* padding: 0 16px; */
}

@media (min-width: 600px) {
  .subscriptions-container {
    column-count: 1;
  }
}

@media (min-width: 960px) {
  .subscriptions-container {
    column-count: 2;
  }
}

@media (min-width: 1264px) {
  .subscriptions-container {
    column-count: 3;
  }
}

@media (min-width: 1904px) {
  .subscriptions-container {
    column-count: 3;
  }
}

.subscription-card {
  break-inside: avoid;
  margin-bottom: 16px;
  display: inline-block;
  width: 100%;
}
</style>
