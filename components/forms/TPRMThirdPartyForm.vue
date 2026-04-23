<template>
  <v-container class="py-8">
    <custom-input v-model="formData.company_name" :label="$t('form.company_name')" :required="true" />
    <custom-dropdown
      v-model="formData.tprm_status_id"
      :label="$t('form.status')"
      :items="getStatuses"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingStatuses"
    />
    <custom-dropdown
      v-model="formData.tprm_criticality_id"
      :label="$t('form.criticality')"
      :items="getCriticalities"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingCriticalities"
    />
    <custom-dropdown
      v-model="formData.tprm_inventory_id"
      :label="$t('form.inventory')"
      :items="getInventories"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingInventories"
    />
    <custom-dropdown
      v-model="formData.tprm_aggregate_risk_level_id"
      :label="$t('form.risk_level')"
      :items="getAggregateRiskLevels"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingAggregateRiskLevels"
    />
    <custom-dropdown
      v-model="formData.tprm_industry_id"
      :label="$t('form.industry')"
      :items="getIndustries"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingIndustries"
    />
    <custom-dropdown
      v-model="formData.tprm_rating_id"
      :label="$t('form.rating')"
      :items="getRatings"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingRatings"
    />
    <quill-editor v-model="formData.practicies" :label="$t('form.practices')" class="pb-4" />
    <quill-editor v-model="formData.policies" :label="$t('form.policies')" class="pb-4" />
    <quill-editor v-model="formData.compliance_history" :label="$t('form.compliance_history')" class="pb-4" />
    <quill-editor v-model="formData.Security_incidents" :label="$t('form.Security_incidents')" class="pb-4" />
    <!-- <custom-TextArea v-model="formData.Security_incidents" :label="$t('form.Security_incidents')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMThirdPartyForm",
  components: {},
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
        company_name: "",
        practicies: "",
        policies: "",
        compliance_history: "",
        Security_incidents: "",
        tprm_status_id: null,
        tprm_criticality_id: null,
        tprm_inventory_id: null,
        tprm_aggregate_risk_level_id: null,
        tprm_industry_id: null,
        tprm_rating_id: null
      },
      loading: false,
      editorConfig: {
        removePlugins: ["Title"],
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontfamily",
            "fontsize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "|",
            "link",
            "blockQuote",
            "codeBlock",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent"
          ],
          shouldNotGroupWhenFull: true
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      getThirdParties: "tprmThirdParties/getThirdParties",
      getCurrentThirdParty: "tprmThirdParties/getCurrentThirdParty",
      loadingInventories: "tprmThirdParties/isLoading",
      getStatuses: "tprmStatuses/getStatuses",
      loadingStatuses: "tprmStatuses/isLoading",
      getCriticalities: "tprmCriticalities/getCriticalities",
      loadingCriticalities: "tprmCriticalities/isLoading",
      getInventories: "tprmInventories/getInventories",
      loadingInventories: "tprmInventories/isLoading",
      getAggregateRiskLevels: "tprmAggregateRiskLevel/getAggregateRiskLevels",
      loadingAggregateRiskLevels: "tprmAggregateRiskLevel/isLoading",
      getIndustries: "tprmIndustries/getIndustries",
      loadingIndustries: "tprmIndustries/isLoading",
      getRatings: "tprmRatings/getRatings",
      loadingRatings: "tprmRatings/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addThirdParty: "tprmThirdParties/addThirdParty",
      updateThirdParty: "tprmThirdParties/updateThirdParty",
      fetchThirdPartyById: "tprmThirdParties/fetchThirdPartyById",
      fetchStatuses: "tprmStatuses/fetchStatuses",
      fetchCriticalities: "tprmCriticalities/fetchCriticalities",
      fetchInventories: "tprmInventories/fetchInventories",
      fetchAggregateRiskLevels: "tprmAggregateRiskLevel/fetchAggregateRiskLevels",
      fetchIndustries: "tprmIndustries/fetchIndustries",
      fetchRatings: "tprmRatings/fetchRatings"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingInventories = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateThirdParty(this.formData)
      } else {
        await this.addThirdParty(this.formData)
      }
      this.loadingInventories = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchStatuses()
    this.fetchCriticalities()
    this.fetchInventories()
    this.fetchAggregateRiskLevels()
    this.fetchIndustries()
    this.fetchRatings()
    if (this.editForm) {
      await this.fetchThirdPartyById(this.itemId)
      this.formData.company_name = this.getCurrentThirdParty.company_name
      this.formData.practicies = this.getCurrentThirdParty.practicies
      this.formData.policies = this.getCurrentThirdParty.policies
      this.formData.compliance_history = this.getCurrentThirdParty.compliance_history
      this.formData.Security_incidents = this.getCurrentThirdParty.Security_incidents
      this.formData.tprm_inventory_id = this.getCurrentThirdParty.inventory?.id
      this.formData.tprm_status_id = this.getCurrentThirdParty.status?.id
      this.formData.tprm_criticality_id = this.getCurrentThirdParty.criticality?.id
      this.formData.tprm_inventory_id = this.getCurrentThirdParty.inventory?.id
      this.formData.tprm_aggregate_risk_level_id = this.getCurrentThirdParty.aggregate_risk_level?.id
      this.formData.tprm_industry_id = this.getCurrentThirdParty.industry?.id
      this.formData.tprm_rating_id = this.getCurrentThirdParty.rating?.id
    }
  }
}
</script>

<style scoped></style>
