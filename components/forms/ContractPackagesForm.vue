<template>
  <form-wrapper :submit-text="$t('page.subscribe')" @submit="submit" :loading="submitting">
    <v-card-text>
      <custom-input v-model="title" :label="$t('form.title')" :required="true" />

      <!-- Filter Chips -->
      <div class="mb-6">
        <v-chip-group v-model="selectedFilters" column multiple @change="handleFilterChange">
          <v-chip v-for="domain in domains" :key="domain.id" filter outlined class="ma-1" :value="domain.id">
            {{ domain.name }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-card-text class="pa-0 font-weight-bold mb-4">{{ $t("page.select_package_msg") }}:</v-card-text>
      <v-alert v-if="!loading && !regulatorsWithPackages.length" type="info">
        {{ $t("error.no_packages_available") }}
      </v-alert>
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

      <v-alert v-if="error" type="error" dismissible>
        {{ error }}
      </v-alert>

      <template v-if="!loading">
        <div class="regulators-container">
          <v-card
            v-for="regulator in regulatorsWithPackages"
            :key="regulator.id"
            class="regulator-card"
            width="350"
            outlined
          >
            <!-- Regulator Title -->
            <v-card-title class="text-center d-flex flex-column justify-center py-4" style="min-height: 300px">
              <v-img
                v-if="regulator.image_path"
                :src="regulator.image_path"
                class="mx-auto mb-3"
                width="200"
                height="120"
                contain
                lazy
              />
              <v-icon v-else size="120" class="mb-2">mdi-package</v-icon>
              <span class="display-5 font-weight-bold">{{ regulator.name }}</span>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-4">
              <!-- Packages -->
              <div class="d-flex flex-column">
                <div
                  v-for="pkg in regulator.packages"
                  :key="pkg.id"
                  class="mb-2 rounded-lg transition-swing"
                  :class="{
                    'grey lighten-4 hover-trigger': !selectedPackages[pkg.id],
                    'blue lighten-5': selectedPackages[pkg.id]
                  }"
                >
                  <v-hover v-slot="{ hover }">
                    <div
                      class="pa-3"
                      :class="{
                        'grey lighten-3': hover && !selectedPackages[pkg.id],
                        'blue lighten-4': hover && selectedPackages[pkg.id]
                        // 'd-flex': true,
                        // 'align-center': true
                      }"
                      style="min-height: 120px"
                    >
                      <div class="d-flex">
                        <custom-checkbox v-model="selectedPackages[pkg.id]" @input="updateSelectedIds" class=" " />
                        <div class="mx-2" style="flex: 1; position: relative">
                          <div
                            class="subtitle-2 font-weight-medium"
                            :class="isRTL ? 'pl-8' : 'pr-8'"
                            style="word-wrap: break-word"
                          >
                            {{ pkg.name }}
                          </div>
                          <div
                            v-if="pkg.version"
                            class="caption font-weight-medium primary--text"
                            :style="{
                              position: 'absolute',
                              top: 0,
                              [isRTL ? 'left' : 'right']: 0
                            }"
                          >
                            v{{ pkg.version }}
                          </div>
                          <div class="d-flex flex-column">
                            <div class="caption grey--text text--darken-1">
                              {{ pkg.short_name }}
                            </div>
                            <div
                              v-if="pkg.issue_date"
                              class="caption grey--text text--darken-1"
                              v-html="$t('page.pkg_issue_date', { date: formatDate(pkg.issue_date) })"
                            ></div>
                          </div>
                          <div
                            v-if="pkg.controls_count"
                            class="caption mt-1"
                            v-html="
                              $t('page.controls_count', {
                                count: `<span class='primary--text'>${pkg.controls_count}</span>`
                              })
                            "
                          ></div>
                        </div>
                      </div>
                    </div>
                  </v-hover>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <quill-editor v-model="note" class="mt-4" />
      </template>
    </v-card-text>
  </form-wrapper>
</template>

<script>
import { subscribe } from "@/api/subscriptions-api"
import { mapActions, mapState } from "vuex"

export default {
  name: "ContractPackagesForm",
  layout: "dashboard-layout",

  data() {
    return {
      regulators: [],
      selectedPackages: {},
      selectedIds: [],
      loading: false,
      domains: [],
      loadingDomains: false,
      submitting: false,
      note: "",
      error: null,
      code: "",
      title: "",
      selectedFilters: [],
      domain_ids: []
    }
  },

  computed: {
    ...mapState(["isRTL"]),
    regulatorsWithPackages() {
      return this.regulators.filter((regulator) => regulator.packages && regulator.packages.length > 0)
    }
  },

  methods: {
    ...mapActions("audits", ["fetchAudits"]),
    ...mapActions("drawer", ["closeDrawer"]),

    formatDate(date) {
      if (!date) return ""
      return new Date(date).getFullYear()
    },

    async fetchDomains() {
      this.loadingDomains = true
      this.error = null
      try {
        const response = await this.$axios.get("compliance-packages-domains")
        this.domains = response.data.data
      } catch (err) {
        this.error = "Failed to fetch compliance packages. Please try again later."
        console.error("Error fetching compliance packages:", err)
      } finally {
        this.loadingDomains = false
      }
    },

    handleFilterChange(selectedValues) {
      this.domain_ids = selectedValues
      this.fetchRegulators()
    },

    async fetchRegulators() {
      this.loading = true
      this.error = null
      try {
        const response = await this.$axios.get("regulators", { params: { domain_ids: this.domain_ids } })
        this.regulators = response.data.data
        // Initialize selectedPackages for all packages
        this.regulators.forEach((regulator) => {
          regulator.packages.forEach((pkg) => {
            this.$set(this.selectedPackages, pkg.id, false)
          })
        })
      } catch (err) {
        this.error = "Failed to fetch regulators. Please try again later."
        console.error("Error fetching regulators:", err)
      } finally {
        this.loading = false
      }
    },

    updateSelectedIds() {
      this.selectedIds = Object.keys(this.selectedPackages)
        .filter((id) => this.selectedPackages[id])
        .map((id) => parseInt(id))
    },

    async submit() {
      if (this.selectedIds.length === 0) {
        this.error = "Please select at least one compliance package."
        return
      }
      if (!this.title) {
        this.error = "Please enter a Title."
        return
      }
      this.submitting = true
      this.error = null
      try {
        await subscribe(
          {
            compliance_package_ids: this.selectedIds,
            note: this.note,
            code: this.code,
            title: this.title
          },
          this.$axios
        )

        await this.fetchAudits()
        this.closeDrawer()

        this.$emit("submission-success")
      } catch (err) {
        this.error = err.response?.data?.message || "An error occurred while subscribing."
        console.error("Error subscribing:", err)
      } finally {
        this.submitting = false
      }
    }
  },

  mounted() {
    this.fetchRegulators()
    this.fetchDomains()
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem auto;
  display: block;
}

.regulators-container {
  column-count: 1;
  column-gap: 16px;
  padding: 0 16px;
  min-height: 300px;
}

@media (min-width: 600px) {
  .regulators-container {
    column-count: 2;
  }
}

@media (min-width: 960px) {
  .regulators-container {
    column-count: 3;
  }
}

@media (min-width: 1264px) {
  .regulators-container {
    column-count: 4;
  }
}

@media (min-width: 1904px) {
  .regulators-container {
    column-count: 5;
  }
}

.regulator-card {
  break-inside: avoid;
  margin-bottom: 16px;
  display: inline-block;
  width: 100%;
}

.regulator-card {
  height: auto !important;
  display: flex;
  flex-direction: column;
}

.v-card-title {
  word-break: break-word;
  line-height: 1.2;
  white-space: normal;
}

/* Fix for RTL support */
[dir="rtl"] .regulator-card {
  text-align: right;
}
</style>
