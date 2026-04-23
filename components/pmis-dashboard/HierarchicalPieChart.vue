<template>
  <v-container>
    <v-row v-if="!loading">
      <template v-if="items.length === 0">
        <v-col cols="12">
          <v-card flat class="mb-0">
            <v-card-text class="text-center py-12">
              <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-chart-pie</v-icon>
              <h3 class="text-h6 grey--text">{{ $t("page.no_available_items", { items: itemType.toLowerCase() }) }}</h3>
              <p class="grey--text text--darken-1 mt-2">
                {{ $t("page.no_available_items_to_display", { items: itemType.toLowerCase() }) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col v-for="item in items" :key="item.name" cols="12" md="24">
          <v-card flat class="mb-0">
            <v-card-title class="text-h6">{{ item.name }}</v-card-title>
            <v-card-text>
              <template v-if="item[childrenKey]?.length">
                <chart-component
                  type="pie"
                  :chart-data="getChartData(item)"
                  :chart-options="chartOptions"
                  :chart-height="250"
                />
                <v-list dense class="mt-4">
                  <v-list-item v-for="child in item[childrenKey]" :key="child.name">
                    <v-list-item-content>
                      <v-list-item-title>{{ child.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          $t(childrenValueDisplayName, {
                            value: isCost ? formatNumber(child[childrenValueKey]) : child[childrenValueKey]
                          })
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
              <template v-else>
                <div class="text-center py-8">
                  <v-icon size="48" color="grey lighten-1" class="mb-2">mdi-folder-outline</v-icon>
                  <p class="grey--text text--darken-1 mb-0">
                    {{ $t("page.no_available_items", { items: childrenType.toLowerCase() }) }}
                  </p>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-skeleton-loader v-for="n in 4" :key="n" v-bind="attrs" type="card-avatar, articleå"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex"
import ChartComponent from "@/components/charts/Chart.vue"
import { formatNumber } from "../../helpers/misc"

export default {
  name: "HierarchicalPieChart",
  components: {
    ChartComponent
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    childrenKey: {
      type: String,
      required: true
    },
    childrenValueKey: {
      type: String,
      required: true
    },
    isCost: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    childrenValueDisplayName: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      default: "Item"
    },
    childrenType: {
      type: String,
      default: "Sub-item"
    }
  },
  data() {
    return {
      attrs: {
        class: "mb-6",
        boilerplate: true,
        elevation: 2
      },

      baseColors: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#33CC99",
        "#FF99CC",
        "#6699FF",
        "#FFB366",
        "#99CC33",
        "#FF66B2"
      ]
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    chartOptions() {
      return {
        plugins: {
          legend: {
            position: "bottom",
            rtl: this.isRTL,
            labels: {
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.parsed || 0
                return `${label}: $${this.formatNumber(value)}`
              }
            }
          }
        }
      }
    }
  },

  methods: {
    formatNumber,
    generateColor(index, total) {
      const hue = (index * (360 / total)) % 360
      return `hsl(${hue}, 70%, 60%)`
    },

    getColors(count) {
      if (count <= this.baseColors.length) {
        return this.baseColors.slice(0, count)
      } else {
        return Array.from({ length: count }, (_, i) => {
          if (i < this.baseColors.length) {
            return this.baseColors[i]
          }
          return this.generateColor(i, count)
        })
      }
    },

    getChartData(item) {
      const children = item[this.childrenKey] || []
      const labels = children.map((child) => child.name)
      const data = children.map((child) => child[this.childrenValueKey])
      const colors = this.getColors(children.length)

      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  height: 100%;
}
</style>
