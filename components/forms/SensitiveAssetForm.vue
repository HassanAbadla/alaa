<template>
  <v-container class="py-8">
    <!-- Basic Information -->
    <div class="section-title mb-4">{{ $t("form.basic_info") }}</div>

    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.entity_name" :label="$t('table.entity_name')" :required="false" />
    <!-- Dropdowns -->
    <!-- <custom-dropdown
      v-model="formData.asset_criticality_id"
      :items="criticalities"
      item-text="name"
      item-value="id"
      :label="$t('table.criticality')"
      :required="true"
      clearable
    /> -->
    <custom-dropdown
      v-model="formData.system_segments_id"
      :items="systemSegments"
      item-text="name"
      item-value="id"
      :label="$t('table.asset_sector')"
      :required="true"
      clearable
    />
    <custom-dropdown
      v-model="formData.asset_sub_sectors_id"
      :items="assetSubSectors"
      item-text="name"
      item-value="id"
      :label="$t('table.sub_sector')"
      :required="true"
      clearable
    />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />

    <v-switch
      v-model="formData.is_sensitive"
      :label="$t('table.is_sensitive')"
      color="primary"
      inset
      class="mt-2"
    ></v-switch>

    <!-- Score Information -->
    <!-- <div class="section-title mb-4 mt-6">{{ $t("form.score_info") }}</div>

    <custom-input v-model.number="formData.score" :label="$t('form.score')" :required="true" type="number" />

    <custom-input
      v-model.number="formData.score_percentage"
      :label="$t('form.score_percentage')"
      :required="true"
      type="number"
      suffix="%"
    /> -->

    <!-- System Details -->
    <div class="section-title mb-4 mt-6">{{ $t("table.system_details") }}</div>

    <custom-input v-model="formData.asset_system_desc" :label="$t('form.description')" :required="false" />

    <custom-input
      v-model.number="formData.asset_system_qty"
      :label="$t('table.asset_system_qty')"
      :required="false"
      type="number"
    />

    <custom-input v-model="formData.asset_system_types" :label="$t('table.asset_system_types')" :required="false" />

    <custom-input
      v-model.number="formData.asset_system_types_qty"
      :label="$t('table.asset_system_types_qty')"
      :required="false"
      type="number"
    />

    <!-- Asset Standards -->
    <div class="section-title mb-4 mt-6">
      {{ $t("table.standards") }}
      <span class="text-caption grey--text ml-2">(7 {{ $t("form.required") }})</span>
    </div>

    <v-alert v-if="formData.asset_standards.length !== 7" type="warning" dense text class="mb-4">
      {{ $t("table.select_7_standards") }}
    </v-alert>

    <div class="standards-list">
      <div v-for="(standard, index) in formData.asset_standards" :key="index" class="standard-item mb-4 pa-3">
        <div class="d-flex align-center mb-2">
          <span class="standard-number mr-3">{{ index + 1 }}</span>
          <v-select
            v-model="standard.asset_standard_id"
            :items="availableStandards(index)"
            item-text="name"
            item-value="id"
            :label="$t('table.select_standard')"
            outlined
            dense
            hide-details
            class="flex-grow-1"
          >
            <template v-slot:selection="{ item }">
              <span>{{ item.name }}</span>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <!-- <v-list-item-subtitle>{{ item.code }}</v-list-item-subtitle> -->
              </v-list-item-content>
            </template>
          </v-select>
          <v-btn
            icon
            small
            color="error"
            class="ml-2"
            @click="removeStandard(index)"
            :disabled="formData.asset_standards.length <= 1"
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </div>

        <div class="d-flex align-center">
          <v-switch
            v-model="standard.applicable"
            :label="$t('table.applicable')"
            color="primary"
            inset
            hide-details
            class="mt-0 mr-4"
          ></v-switch>
          <custom-dropdown
            v-model="standard.value"
            :items="[1, 2, 3, 4, 5]"
            :label="$t('table.value')"
            :required="true"
            class="flex-grow-1"
          />

          <!-- <custom-input
            v-model.number="standard.value"
            :label="$t('form.value')"
            :required="true"
            type="number"
            class="flex-grow-1"
            @input="validateStandardValue(index)"
          /> -->
        </div>
      </div>

      <v-btn v-if="formData.asset_standards.length < 7" text color="primary" @click="addStandard" block class="mt-2">
        <v-icon left>mdi-plus</v-icon>
        {{ $t("table.add_standard") }}
      </v-btn>
    </div>

    <!-- Notes -->
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" class="mt-6" />

    <!-- Submit Button -->
    <v-btn
      @click="showAddLogDialog"
      :loading="loading"
      color="primary"
      block
      class="mt-6"
      :disabled="formData.asset_standards.length !== 7"
    >
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
    <!-- Log notes -->
    <custom-dialog
      v-model="openLogDialog"
      :title="$t('page.enter_log_message')"
      width="580px"
      @close-dialog="openLogDialog = false"
    >
      <v-container>
        <custom-TextArea v-model="formData.content" :label="$t('form.notes')" :required="true" />
        <v-btn @click="handleSubmit" :loading="loading" color="primary" block>{{ $t("submit") }}</v-btn>
      </v-container>
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "AssetSystemForm",

  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        name: "",
        code: "",
        note: "",
        entity_name: "",
        is_sensitive: false,
        score: 0,
        score_percentage: 0,
        asset_system_desc: "",
        asset_system_qty: null,
        asset_system_types: "",
        asset_system_types_qty: null,
        system_segments_id: null,
        asset_sub_sectors_id: null,
        asset_criticality_id: null,
        tenants_id: null,
        asset_standards: [],
        //
        content: ""
      },
      loading: false,
      openLogDialog: false
    }
  },

  watch: {
    "formData.system_segments_id": {
      handler(newSegmentId) {
        // Only auto-generate for new records, not when editing
        if (newSegmentId) {
          const selectedSegment = this.systemSegments.find((seg) => seg.id === newSegmentId)
          if (selectedSegment && selectedSegment.code) {
            // Get first 3 characters of segment code
            const prefix = selectedSegment.code.substring(0, 3).toUpperCase()
            const nextNumber = this.getNextNumber(prefix)
            this.formData.code = `${prefix}/${nextNumber}`
          }
        }
      },
      immediate: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentAssetSystem: "sensitiveAssets/getCurrentSensitiveAsset",
      assetStandards: "assetStandards/getStandards",
      systemSegments: "assetSegments/getSegments",
      assetSubSectors: "assetSubSectors/getSubSectors",
      loadingAssetSystems: "sensitiveAssets/isLoading",
      allAssetSystems: "sensitiveAssets/getSensitiveAssets" // Make sure this getter exists
    }),
    ...mapState("assetCriticalities", ["criticalities"]),

    selectedStandardIds() {
      return this.formData.asset_standards.map((s) => s.asset_standard_id).filter((id) => id !== null)
    }
  },

  methods: {
    ...mapActions({
      addSensitiveAsset: "sensitiveAssets/addSensitiveAsset",
      updateSensitiveAsset: "sensitiveAssets/updateSensitiveAsset",
      fetchSensitiveAssetById: "sensitiveAssets/fetchSensitiveAssetById",
      fetchSensitiveAssets: "sensitiveAssets/fetchSensitiveAssets", // Add this action
      fetchStandards: "assetStandards/fetchStandards",
      fetchSegments: "assetSegments/fetchSegments",
      fetchSubSectors: "assetSubSectors/fetchSubSectors"
    }),
    ...mapActions("assetCriticalities", ["createCriticality", "fetchCriticalities", "deleteCriticality"]),
    ...mapActions("drawer", ["closeDrawer"]),

    async showAddLogDialog() {
      // if (!this.$refs.form.validate()) return
      this.openLogDialog = true
    },

    getNextNumber(prefix) {
      // Filter asset systems that have codes starting with the prefix
      const existingCodes = this.allAssetSystems
        .map((system) => system.code)
        .filter((code) => code && code.startsWith(`${prefix}/`))

      let maxNumber = 0

      existingCodes.forEach((code) => {
        // Extract the number part after the "/"
        const parts = code.split("/")
        if (parts.length === 2) {
          const numberPart = parts[1]
          const number = parseInt(numberPart, 10)
          if (!isNaN(number)) {
            maxNumber = Math.max(maxNumber, number)
          }
        }
      })

      // Increment and pad with zeros to 3 digits
      const nextNumber = (maxNumber + 1).toString().padStart(3, "0")
      return nextNumber
    },

    availableStandards(currentIndex) {
      const currentStandardId = this.formData.asset_standards[currentIndex]?.asset_standard_id

      return this.assetStandards.filter((standard) => {
        return !this.selectedStandardIds.includes(standard.id) || standard.id === currentStandardId
      })
    },

    addStandard() {
      if (this.formData.asset_standards.length < 7) {
        this.formData.asset_standards.push({
          asset_standard_id: null,
          applicable: true,
          value: 0
        })
      }
    },

    removeStandard(index) {
      this.formData.asset_standards.splice(index, 1)
    },

    async handleSubmit() {
      // Validate that we have exactly 7 standards
      if (this.formData.asset_standards.length !== 7) {
        // this.$toast.error(this.$t("form.select_7_standards"))
        return
      }

      // Validate that all standards are selected
      const hasEmptyStandard = this.formData.asset_standards.some((s) => s.asset_standard_id === null)
      if (hasEmptyStandard) {
        // this.$toast.error(this.$t("form.all_standards_required"))
        return
      }

      this.loading = true

      try {
        if (this.editForm) {
          this.formData.id = this.itemId
          await this.updateSensitiveAsset(this.formData)
        } else {
          await this.addSensitiveAsset(this.formData)
        }

        this.closeDrawer()
        // this.$toast.success(
        //   this.editForm ? this.$t("messages.updated_successfully") : this.$t("messages.created_successfully")
        // )
      } catch (error) {
        console.log(error.response?.data?.message || this.$t("messages.error_occurred"))
      } finally {
        this.loading = false
      }
    }
  },

  async mounted() {
    this.loading = true

    try {
      // Load dropdown options and all asset systems for code generation
      await Promise.all([
        this.fetchStandards(),
        this.fetchSegments(),
        this.fetchSubSectors(),
        this.fetchCriticalities(),
        this.fetchSensitiveAssets() // Fetch all systems for code generation
      ])

      // Load data if editing
      if (this.editForm) {
        await this.fetchSensitiveAssetById(this.itemId)

        const current = this.getCurrentAssetSystem
        console.log(current)

        this.formData = {
          name: current.name,
          code: current.code,
          note: current.note,
          entity_name: current.entity_name,
          is_sensitive: Boolean(current.is_sensitive),
          score: current.score,
          score_percentage: current.score_percentage,
          asset_system_desc: current.asset_system_desc,
          asset_system_qty: current.asset_system_qty,
          asset_system_types: current.asset_system_types,
          asset_system_types_qty: current.asset_system_types_qty,
          system_segments_id: current.system_segment_id,
          asset_sub_sectors_id: current.asset_sub_sector_id,
          asset_criticality_id: current.asset_criticality_id,
          tenants_id: current.tenants_id,
          asset_standards: current.standard_values.map((asv) => ({
            id: asv.id,
            asset_standard_id: asv.asset_standard_id,
            applicable: Boolean(asv.applicable),
            value: asv.value
          }))
        }
      }
    } catch (error) {
      console.log("error loading data:", error)
      // this.$toast.error(this.$t("messages.error_loading_data"))
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.standards-list {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.standard-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.standard-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #1976d2;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}
</style>
