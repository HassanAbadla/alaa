<template>
  <div>
    <!-- <v-card-title>{{ $t("page.add_asset") }}</v-card-title> -->
    <v-card-text>
      <v-form ref="form" @submit.prevent="showAddLogDialog">
        <v-container>
          <custom-input
            v-model="formData.name"
            :label="$t('form.name')"
            :required="true"
            :field-info-text="$t('field_info.asset_name')"
          />
          <!-- Types Lookup -->
          <custom-dropdown
            :items="typesList"
            item-value="id"
            item-text="name"
            :label="$t('table.type')"
            v-model="formData.grc_assets_types_id"
            :required="true"
            class="mx-1"
            :field-info-text="$t('field_info.asset_type')"
          />

          <!-- Categories Lookup -->
          <custom-dropdown
            :items="categoriesList"
            item-value="id"
            item-text="name"
            :label="$t('table.category')"
            v-model="formData.grc_assets_categories_id"
            :required="true"
            class="mx-1"
            :field-info-text="$t('field_info.asset_category')"
          />
          <custom-input
            v-model="formData.code"
            :label="$t('form.code')"
            :required="true"
            :field-info-text="$t('field_info.asset_id')"
            @input="validateCode"
          />

          <custom-input
            v-model="formData.owner"
            :label="$t('table.owner')"
            :required="true"
            :field-info-text="$t('field_info.asset_owner')"
          />
          <custom-input
            v-model="formData.custodian"
            :label="$t('table.asset_custodian')"
            :required="true"
            :field-info-text="$t('field_info.asset_custodian')"
          />
          <custom-input
            v-model="formData.asset_business_purpose"
            :label="$t('form.business_purpose')"
            :required="false"
            :field-info-text="$t('field_info.asset_business_purpose')"
          />
          <custom-input
            v-model="formData.apps_supported"
            :label="$t('form.apps_supported')"
            :required="false"
            :field-info-text="$t('field_info.apps_supported')"
          />
          <!-- <custom-input
            v-model="formData.system_apps"
            :label="$t('form.system_apps')"
            :required="false"
            :field-info-text="$t('field_info.system_apps')"
          /> -->
          <custom-input
            v-model="formData.asset_model"
            :label="$t('form.asset_model')"
            :required="false"
            :field-info-text="$t('field_info.asset_model')"
          />
          <custom-input
            v-model="formData.asset_cost"
            :label="$t('form.asset_cost')"
            :required="false"
            isCurrency
            :field-info-text="$t('field_info.asset_cost')"
          />
          <custom-input
            v-model="formData.asset_mac_address"
            :label="$t('form.asset_mac_address')"
            :required="false"
            :field-info-text="$t('field_info.asset_mac_address')"
          />
          <custom-input
            v-model="formData.asset_network_address"
            :label="$t('form.asset_network_address')"
            :required="false"
            :field-info-text="$t('field_info.asset_network_address')"
          />
          <custom-input
            v-model="formData.asset_active_port"
            :label="$t('form.asset_active_port')"
            :required="false"
            :field-info-text="$t('field_info.asset_active_port')"
          />
          <custom-input
            v-model="formData.compliance_standard"
            :label="$t('table.compliance_standard')"
            :required="false"
            :field-info-text="$t('field_info.compliance_standard')"
          />
          <div class="d-flex w-100 justify-space-between">
            <v-btn
              text
              outlined
              :loading="loading"
              :disabled="false"
              @click="openUnitDialogModal"
              prepend-icon="mdi-file-document-outline"
              class="pa-4"
            >
              {{ $t("form.select_unit") }}
            </v-btn>
            <span class="mx-2"></span>
            <div @click.stop="openUnitDialogModal" class="d-flex flex-grow-1 z-index-5">
              <custom-dropdown
                :items="unitDisplayfield"
                item-value="id"
                item-text="name"
                :label="$t('table.unit')"
                v-model="formData.asset_unit_id"
                :required="true"
                :disabled="true"
                :field-info-text="$t('field_info.asset_unit')"
                class="flex-grow-1 mx-1 z-index-1"
              />
            </div>
          </div>
          <custom-dropdown
            :items="criticalities"
            item-value="id"
            item-text="name"
            :label="$t('table.classification')"
            v-model="formData.asset_criticality_id"
            :required="false"
            :disabled="false"
            :field-info-text="$t('field_info.asset_criticality')"
          />

          <!-- Manufacturers Lookup -->
          <custom-dropdown
            :items="manufacturers"
            item-value="id"
            item-text="name"
            :label="$t('table.manufacturer')"
            v-model="formData.manufacturer_id"
            :required="false"
            class="mx-1"
            :field-info-text="$t('field_info.asset_manufacturer')"
          />
          <!-- Assets Locations Lookup -->
          <custom-dropdown
            :items="locationList"
            item-value="id"
            item-text="name"
            :label="$t('table.assets_location')"
            v-model="formData.asset_location_id"
            :required="true"
            class="mx-1"
            :field-info-text="$t('field_info.asset_location')"
          />
          <!-- Assets Compliance Standards  Lookup -->
          <!-- <custom-dropdown
            :items="complianceStandardList"
            item-value="id"
            item-text="name"
            :label="$t('table.compliance_standard')"
            v-model="formData.asset_compliance_standards_id"
            :required="false"
            class="mx-1"
            :field-info-text="$t('field_info.compliance_standard')"
          /> -->
          <!-- Assets Statuses  Lookup -->
          <custom-dropdown
            :items="statusesList"
            item-value="id"
            item-text="name"
            :label="$t('table.status')"
            v-model="formData.asset_status_id"
            :required="false"
            class="mx-1"
            :field-info-text="$t('field_info.asset_status')"
          />
          <CustomDatePicker
            v-model="formData.expiration_date"
            :label="$t('form.expiration_date')"
            :required="false"
            :field-info-text="$t('field_info.expiration_date')"
          />

          <!-- new fields -->
          <custom-input v-model="formData.version" :label="$t('table.version')" :required="false" />
          <custom-input v-model="formData.asset_serial" :label="$t('table.asset_serial')" :required="false" />
          <custom-input v-model="formData.asset_user" :label="$t('table.asset_user')" :required="false" />
          <custom-input v-model="formData.asset_user_system" :label="$t('table.asset_user_system')" :required="false" />
          <custom-input v-model="formData.asset_user_phone" :label="$t('table.asset_user_phone')" :required="false" />
          <custom-input v-model="formData.asset_user_email" :label="$t('table.asset_user_email')" :required="false" />
          <custom-input
            v-model="formData.asset_confidentiality"
            :label="$t('table.asset_confidentiality')"
            :required="false"
            :type="'number'"
            :rules="[(v) => [1, 2, 3].includes(Number(v)) || $t('validation.only_1_2_3')]"
          />
          <custom-input
            v-model="formData.asset_safety"
            :label="$t('table.asset_safety')"
            :required="false"
            :type="'number'"
            :rules="[(v) => [1, 2, 3].includes(Number(v)) || $t('validation.only_1_2_3')]"
          />
          <custom-input
            v-model="formData.asset_availability"
            :label="$t('table.asset_availability')"
            :required="false"
            :type="'number'"
            :rules="[(v) => [1, 2, 3].includes(Number(v)) || $t('validation.only_1_2_3')]"
          />
          <custom-checkbox v-model="formData.asset_siem" :label="$t('table.asset_siem')" />
          <custom-checkbox v-model="formData.asset_edr" :label="$t('table.asset_edr')" />
          <custom-checkbox v-model="formData.asset_ndr" :label="$t('table.asset_ndr')" />

          <custom-input
            v-model="formData.asset_qty"
            :label="$t('table.asset_qty')"
            :required="false"
            :type="'number'"
          />
          <custom-input
            v-model="formData.asset_product_number"
            :label="$t('table.asset_product_number')"
            :required="false"
          />
          <custom-input v-model="formData.asset_license_no" :label="$t('table.asset_license_no')" :required="false" />
          <CustomDatePicker
            v-model="formData.asset_license_date"
            :label="$t('table.asset_license_date')"
            :required="false"
          />
          <custom-input v-model="formData.asset_building" :label="$t('table.asset_building')" :required="false" />
          <custom-input v-model="formData.asset_room" :label="$t('table.asset_room')" :required="false" />
          <custom-input v-model="formData.asset_usage" :label="$t('table.asset_usage')" :required="false" />
          <custom-input v-model="formData.asset_card_number" :label="$t('table.asset_card_number')" :required="false" />

          <quill-editor
            v-model="formData.note"
            :label="$t('table.notes')"
            :required="false"
            :field-info-text="$t('field_info.asset_description')"
          />
        </v-container>

        <!-- Action Buttons -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="resetForm">{{ $t("table.reset") }}</v-btn>
          <v-btn color="primary" :disabled="!valid" type="submit" @click="showAddLogDialog" :loading="loading">
            {{ editForm ? $t("page.update") : $t("table.add") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- New type Dialog -->
    <custom-dialog v-model="openAssetTypeDialog" :title="$t('page.new_type')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="typeForm.name.en" :label="$t('form.en_name')" :required="true" />
        <custom-input v-model="typeForm.name.ar" :label="$t('form.ar_name')" :required="true" />
        <custom-TextArea v-model="typeForm.note" :label="$t('form.notes')" :required="false" />
        <v-btn @click="submitAssetType" :loading="loading" color="primary" block>{{ $t("form.add") }}</v-btn>
      </v-container>
    </custom-dialog>

    <!-- New Category Dialog -->
    <custom-dialog v-model="openAssetCategoryDialog" :title="$t('page.new_category')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="categoryForm.name.en" :label="$t('form.en_name')" :required="true" />
        <custom-input v-model="categoryForm.name.ar" :label="$t('form.ar_name')" :required="true" />
        <custom-TextArea v-model="categoryForm.note" :label="$t('form.notes')" :required="false" />
        <v-btn @click="submitAssetCategory" :loading="loading" color="primary" block>{{ $t("form.add") }}</v-btn>
      </v-container>
    </custom-dialog>

    <!-- New Manufacturer Dialog -->
    <custom-dialog v-model="openNewManufacturerDialog" :title="$t('page.new_manufacturer')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="manufacturerForm.name" :label="$t('form.name')" :required="true" />
        <custom-TextArea v-model="manufacturerForm.note" :label="$t('form.notes')" :required="false" />
        <v-btn @click="submitManufacturer" :loading="loading" color="primary" block>{{ $t("form.add") }}</v-btn>
      </v-container>
    </custom-dialog>

    <!-- New Location Dialog -->
    <custom-dialog v-model="openAssetlocationsDialog" :title="$t('page.new_asset_location')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="assetLocationsForm.name" :label="$t('form.name')" :required="true" />
        <custom-TextArea v-model="assetLocationsForm.note" :label="$t('form.notes')" :required="false" />
        <v-btn @click="submitAssetLocation" :loading="loading" color="primary" block>{{ $t("form.add") }}</v-btn>
      </v-container>
    </custom-dialog>

    <!-- New Compliance Standard Dialog -->
    <custom-dialog v-model="openComplianceStandardDialog" :title="$t('page.new_compliance_standard')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="complianceStandardForm.name" :label="$t('form.name')" :required="true" />
        <custom-TextArea v-model="complianceStandardForm.note" :label="$t('form.notes')" :required="false" />
        <v-btn @click="submitComplianceStandard" :loading="loading" color="primary" block>{{ $t("form.add") }}</v-btn>
      </v-container>
    </custom-dialog>

    <!-- New Status Dialog -->
    <custom-dialog v-model="openStatusesdDialog" :title="$t('page.new_status')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="StatusForm.name.en" :label="$t('form.en_name')" :required="true" />
        <custom-input v-model="StatusForm.name.ar" :label="$t('form.ar_name')" :required="true" />
        <custom-TextArea v-model="StatusForm.note" :label="$t('form.notes')" :required="false" />
        <v-btn @click="submitStatus" :loading="loading" color="primary" block>{{ $t("form.add") }}</v-btn>
      </v-container>
    </custom-dialog>

    <custom-dialog
      v-model="openUnitDialog"
      :title="$t('page.units')"
      width="580px"
      @close-dialog="openUnitDialog = false"
    >
      <UnitsTreeSelection
        :items="units"
        @selection-change="handleSelectionChange"
        @send-selected="handleSendSelected"
      />
    </custom-dialog>

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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import CustomDatePicker from "../custom-form/CustomDatePicker.vue"
import UnitsTreeSelection from "../UnitsTreeSelection.vue"

export default {
  name: "AssetsForm",

  props: {
    itemId: {
      type: [Number, String],
      required: true
    },
    // item: {
    //   type: Object,
    //   required: false
    // },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      valid: true,
      loading: false,
      dateMenu: false,
      // assetsTypes: [],
      formData: {
        name: "",
        code: "",
        note: "",
        grc_assets_types_id: null,
        grc_assets_categories_id: null,
        manufacturer_id: null,
        asset_location_id: null,
        asset_criticality_id: null,
        // asset_compliance_standards_id: null,
        compliance_standard: "",
        asset_status_id: null,
        asset_unit_id: null,
        asset_business_purpose: "",
        owner: "",
        custodian: "",
        apps_supported: "",
        system_apps: "",
        asset_model: "",
        asset_cost: "",
        asset_mac_address: "",
        asset_network_address: "",
        asset_active_port: "",
        expiration_date: null,
        version: "",
        asset_serial: "",
        asset_user: "",
        asset_user_system: "",
        asset_user_phone: "",
        asset_user_email: "",
        asset_confidentiality: "",
        asset_integrity: "",
        asset_availability: "",
        asset_siem: false,
        asset_edr: false,
        asset_ndr: false,
        asset_qty: null,
        asset_product_number: "",
        asset_license_no: "",
        asset_license_date: null,
        asset_building: "",
        asset_room: "",
        asset_usage: "",
        asset_card_number: "",
        //
        content: ""
      },
      // grcAssetsCategoriesId: this.formData.grc_assets_categories_id,
      openLogDialog: false,
      openUnitDialog: false,
      rules: {
        date: [
          (v) => !!v || "Transaction date is required",
          (v) => {
            const date = new Date(v)
            return date <= new Date() || "Transaction date cannot be in the future"
          }
        ],
        details: [
          (v) => !!v || "Details are required",
          (v) => (v && v.length <= 255) || "Details must be less than 255 characters"
        ],
        required: [(v) => !!v || "This field is required"]
      },
      snackbar: {
        show: false,
        text: "",
        color: "success"
      },
      openNewManufacturerDialog: false,
      manufacturerForm: {
        name: "",
        code: "",
        note: ""
      },
      openAssetlocationsDialog: false,
      assetLocationsForm: {
        name: "",
        code: "",
        note: ""
      },
      openComplianceStandardDialog: false,
      complianceStandardForm: {
        name: "",
        code: "",
        note: ""
      },
      openStatusesdDialog: false,
      StatusForm: {
        name: {
          en: "",
          ar: ""
        },
        code: "",
        note: ""
      },
      openAssetTypeDialog: false,
      typeForm: {
        name: {
          en: "",
          ar: ""
        },
        code: "",
        note: ""
      },
      openAssetCategoryDialog: false,
      categoryForm: {
        name: {
          en: "",
          ar: ""
        },
        code: "",
        note: ""
      }
    }
  },

  async created() {
    this.loading = true
    await this.fetchAssetsType()
    await this.fetchCategories()
    await this.loadAsset()
    await this.fetchUnits()
    await this.fetchManufacturers()
    await this.fetchAssetsLocations()
    await this.fetchCriticalities()
    await this.fetchComplianceStandards()
    await this.fetchAssetsStatuses()
    this.loading = false
  },

  watch: {
    "formData.grc_assets_categories_id": {
      handler(newCategoryId) {
        if (newCategoryId) {
          const selectedCategory = this.categoriesList.find((cat) => cat.id === newCategoryId)
          if (selectedCategory && selectedCategory.code) {
            // Get first 3 characters of category code
            const prefix = selectedCategory.code.substring(0, 3).toUpperCase()
            const nextNumber = this.getNextNumber(prefix)
            this.formData.code = `${prefix}/${nextNumber}`
          }
        }
      },
      immediate: false // Don't run on mount for edit form
    }
  },

  computed: {
    ...mapState("assets", ["assets", "assetsTypes", "criticalities"]),
    ...mapState("manufacturers", ["manufacturers"]),
    ...mapState("assetsLocations", ["locationList"]),
    ...mapState("complianceStandard", ["complianceStandardList"]),
    ...mapState("assetsStatuses", ["statusesList"]),
    ...mapState("assetCriticalities", ["criticalities"]),
    ...mapState("assetsTypes", ["typesList"]),
    ...mapState("assetsCategories", ["categoriesList"]),
    ...mapState("positions", ["units"]),
    item() {
      return this.assets.find((item) => item.id === this.itemId)
    },
    unitDisplayfield() {
      const getAllUnits = (units) => {
        let allUnits = []
        for (const unit of units) {
          allUnits.push({
            id: unit.id,
            name: unit.name
          })
          if (unit.children && unit.children.length) {
            allUnits = allUnits.concat(getAllUnits(unit.children))
          }
        }
        return allUnits
      }

      return getAllUnits(this.units)
    }
  },

  methods: {
    ...mapActions("assets", ["fetchAssets", "updateAsset", "createAsset", "fetchCategories", "fetchCriticalities"]),
    ...mapActions("assetsTypes", ["createAssetType", "fetchAssetsType"]),
    ...mapActions("assetsCategories", ["createAssetCategory", "fetchCategories"]),
    ...mapActions("manufacturers", ["createManufacturer", "fetchManufacturers"]),
    ...mapActions("assetsLocations", ["createAssetLocation", "fetchAssetsLocations"]),
    ...mapActions("complianceStandard", ["fetchComplianceStandards", "createComplianceStandard"]),
    ...mapActions("assetsStatuses", ["fetchAssetsStatuses", "createAssetStatus"]),
    ...mapActions("assetCriticalities", ["fetchCriticalities", "createCriticality"]),
    ...mapActions("positions", ["fetchUnits"]),
    ...mapActions("drawer", ["closeDrawer"]),

    async handleSubmit() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      try {
        this.editForm
          ? await this.updateAsset({ id: this.itemId, payload: this.formData })
          : await this.createAsset(this.formData)
        await this.fetchAssets()

        this.showSuccess("Transaction added successfully")
        this.$emit("transaction-created")
        this.resetForm()
      } catch (error) {
        this.showError("Failed to save transaction")
        console.error("Error saving transaction:", error)
      } finally {
        this.loading = false
        this.closeDrawer()
      }
    },

    async showAddLogDialog() {
      if (!this.$refs.form.validate()) return
      this.openLogDialog = true
    },
    getNextNumber(prefix) {
      // Filter assets that have codes starting with the prefix
      const existingCodes = this.assets
        .map((asset) => asset.code)
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

    validateCode(value) {
      this.errors = []
      // Only validate if not in edit mode, or if the code has changed
      if (!this.editForm || (this.editForm && this.item.code !== value)) {
        if (this.assets.some((asset) => asset.code === value)) {
          this.errors.push(this.$t("validation.code_exists"))
        }
      }
    },

    resetForm() {
      this.$refs.form.reset()
      this.formData = {
        note: "",
        name: "",
        code: "",
        grc_assets_categories_id: null,
        grc_assets_types_id: null
      }
    },

    showSuccess(text) {
      this.snackbar = {
        show: true,
        text,
        color: "success"
      }
    },

    showError(text) {
      this.snackbar = {
        show: true,
        text,
        color: "error"
      }
    },

    async loadAsset() {
      if (this.editForm) {
        this.formData.name = this.item.name
        this.formData.code = this.item.code
        this.formData.note = this.item.note
        this.formData.grc_assets_types_id = this.item?.type?.id
        this.formData.grc_assets_categories_id = this.item?.category?.id
        this.formData.asset_status_id = this.item?.status?.id || null
        this.formData.asset_unit_id = this.item?.unit?.id || null
        this.formData.asset_business_purpose = this.item?.asset_business_purpose || ""
        this.formData.owner = this.item?.owner || ""
        this.formData.custodian = this.item?.custodian || ""
        this.formData.apps_supported = this.item?.apps_supported || ""
        this.formData.system_apps = this.item?.system_apps || ""
        this.formData.asset_model = this.item?.asset_model || ""
        this.formData.asset_cost = this.item?.asset_cost || ""
        this.formData.asset_mac_address = this.item?.asset_mac_address || ""
        this.formData.asset_network_address = this.item?.asset_network_address || ""
        this.formData.asset_active_port = this.item?.asset_active_port || ""
        this.formData.manufacturer_id = this.item?.manufacturer?.id || null
        this.formData.asset_location_id = this.item?.location?.id || null
        // this.formData.asset_compliance_standards_id = this.item?.complianceStandard?.id || null
        this.formData.compliance_standard = this.item?.compliance_standard || ""
        this.formData.asset_criticality_id = this.item?.criticality?.id || null
        this.formData.expiration_date = this.item?.expiration_date || null
        this.formData.asset_serial = this.item?.asset_serial || ""
        this.formData.version = this.item?.version || ""
        this.formData.asset_user = this.item?.asset_user || ""
        this.formData.asset_user_system = this.item?.asset_user_system || ""
        this.formData.asset_user_phone = this.item?.asset_user_phone || ""
        this.formData.asset_user_email = this.item?.asset_user_email || ""
        this.formData.asset_confidentiality = this.item?.asset_confidentiality || ""
        this.formData.asset_safety = this.item?.asset_safety || ""
        this.formData.asset_availability = this.item?.asset_availability || ""
        this.formData.asset_siem = this.item?.asset_siem || false
        this.formData.asset_edr = this.item?.asset_edr || false
        this.formData.asset_ndr = this.item?.asset_ndr || false
        this.formData.asset_qty = this.item?.asset_qty || ""
        this.formData.asset_product_number = this.item?.asset_product_number || ""
        this.formData.asset_license_no = this.item?.asset_license_no || ""
        this.formData.asset_license_date = this.item?.asset_license_date || ""
        this.formData.asset_building = this.item?.asset_building || ""
        this.formData.asset_room = this.item?.asset_room || ""
        this.formData.asset_usage = this.item?.asset_usage || ""
        this.formData.asset_card_number = this.item?.asset_card_number || ""
      }
    },
    addManufacturer() {
      this.openNewManufacturerDialog = true
    },
    async submitManufacturer() {
      const computedCode = this.manufacturerForm.name.slice(0, 3).toLowerCase()
      this.manufacturerForm.code = computedCode
      await this.createManufacturer(this.manufacturerForm)
      this.formData.manufacturer_id = this.manufacturers[this.manufacturers.length - 1].id
      this.openNewManufacturerDialog = false
    },
    addAssetLocation() {
      this.openAssetlocationsDialog = true
    },
    openUnitDialogModal() {
      this.openUnitDialog = true
    },
    handleSelectionChange(selectedIds) {
      console.log("Selection changed:", selectedIds)
      this.formData.asset_unit_id = selectedIds
    },

    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.formData.asset_unit_id = selectedIds
      this.openUnitDialog = false
    },
    async submitAssetLocation() {
      const computedCode = this.assetLocationsForm.name.slice(0, 3).toLowerCase()
      this.assetLocationsForm.code = computedCode
      await this.createAssetLocation(this.assetLocationsForm)
      this.formData.asset_location_id = this.locationList[this.locationList.length - 1].id
      this.openAssetlocationsDialog = false
    },
    addComplianceStandard() {
      this.openComplianceStandardDialog = true
    },
    async submitComplianceStandard() {
      const computedCode = this.complianceStandardForm.name.slice(0, 3).toLowerCase()
      this.complianceStandardForm.code = computedCode
      await this.createComplianceStandard(this.complianceStandardForm)
      this.formData.compliance_standard_id = this.complianceStandardList[this.complianceStandardList.length - 1].id
      this.openComplianceStandardDialog = false
    },
    addAsseetStatus() {
      this.openStatusesdDialog = true
    },
    async submitStatus() {
      const computedCode = this.StatusForm.name.slice(0, 3).toLowerCase()
      this.StatusForm.code = computedCode
      await this.createAssetStatus(this.StatusForm)
      this.formData.asset_status_id = this.statusesList[this.statusesList.length - 1].id
      this.openStatusesdDialog = false
    },
    addAssetType() {
      this.openAssetTypeDialog = true
    },
    async submitAssetType() {
      const computedCode = this.typeForm.name.en.slice(0, 3).toLowerCase()
      this.typeForm.code = computedCode
      await this.createAssetType(this.typeForm)
      this.formData.grc_assets_types_id = this.typesList[this.typesList.length - 1].id
      this.openAssetTypeDialog = false
    },
    addAssetCategory() {
      this.openAssetCategoryDialog = true
    },
    async submitAssetCategory() {
      const computedCode = this.categoryForm.name.en.slice(0, 3).toLowerCase()
      this.categoryForm.code = computedCode
      await this.createAssetCategory(this.categoryForm)
      this.formData.grc_assets_categories_id = this.categoriesList[this.categoriesList.length - 1].id
      this.openAssetCategoryDialog = false
    }
  }
}
</script>
