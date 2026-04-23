<template>
  <v-container class="" fluid>
    <form-wrapper @submit="handleSubmit">
      <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
      <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
      <v-card outlined dense class="pa-3 mb-2">
        <span class="body-2 grey--text">{{ $t("table.source") }}</span>
        <v-radio-group v-model="selectedSection" row class="px-3">
          <v-radio :label="$t('form.type')" class="px-0" value="outsource" color="primary" />
          <v-spacer />
          <v-radio :label="$t('table.offerings')" class="px-0" value="offering" color="primary" />
        </v-radio-group>

        <v-expand-transition>
          <custom-dropdown
            v-if="selectedSection === 'outsource'"
            v-model="formData.tprm_outsource_type_id"
            :label="$t('form.type')"
            :items="getOutsourceTypes"
            item-text="name"
            item-value="id"
            :required="isOutsourceTypeRequired"
            :loading="loadingOutsourceTypes"
            :error-messages="outsourceTypeErrorMessages"
          />
        </v-expand-transition>

        <v-expand-transition>
          <custom-dropdown
            v-if="selectedSection === 'offering'"
            v-model="formData.tprm_offering_id"
            :label="$t('table.offerings')"
            :items="getOfferings"
            item-text="name"
            item-value="id"
            :required="isOfferingRequired"
            :loading="loadingOfferings"
            :error-messages="offeringErrorMessages"
          />
        </v-expand-transition>
      </v-card>
      <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
      <v-alert v-if="showValidationError" type="error" class="mt-4">
        {{ $t("validation.either_type_or_offering_required") }}
      </v-alert>
    </form-wrapper>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMPotentialRiskForm",
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
      selectedSection: null,
      hasAttemptedSubmit: false,
      formData: {
        name: "",
        note: "",
        code: "",
        tprm_offering_id: null,
        tprm_outsource_type_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentPotentialRisk: "tprmPotentialRisks/getCurrentPotentialRisk",
      loadingPotentialRisks: "tprmPotentialRisks/isLoading",
      getOutsourceTypes: "tprmOutsourceTypes/getOutsourceTypes",
      loadingOutsourceTypes: "tprmOutsourceTypes/isLoading",
      getOfferings: "tprmOfferings/getOfferings",
      loadingOfferings: "tprmOfferings/isLoading"
    }),
    isOutsourceTypeRequired() {
      return !this.formData.tprm_offering_id
    },

    isOfferingRequired() {
      return !this.formData.tprm_outsource_type_id
    },

    isEitherFieldFilled() {
      return !!(this.formData.tprm_outsource_type_id || this.formData.tprm_offering_id)
    },

    showValidationError() {
      return !this.isEitherFieldFilled && this.hasAttemptedSubmit
    },

    outsourceTypeErrorMessages() {
      if (!this.hasAttemptedSubmit) return []
      if (!this.isEitherFieldFilled) {
        return [this.$t("validation.either_type_or_offering_required")]
      }
      return []
    },

    offeringErrorMessages() {
      if (!this.hasAttemptedSubmit) return []
      if (!this.isEitherFieldFilled) {
        return [this.$t("validation.either_type_or_offering_required")]
      }
      return []
    }
  },

  methods: {
    ...mapActions({
      addPotentialRisk: "tprmPotentialRisks/addPotentialRisk",
      updatePotentialRisk: "tprmPotentialRisks/updatePotentialRisk",
      fetchPotentialRiskById: "tprmPotentialRisks/fetchPotentialRiskById",
      fetchOutsourceTypes: "tprmOutsourceTypes/fetchOutsourceTypes",
      fetchOfferings: "tprmOfferings/fetchOfferings"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.hasAttemptedSubmit = true
      if (!this.isEitherFieldFilled) {
        // Prevent form submission
        this.$toast.error(this.$t("validation.either_type_or_offering_required"))
        return
      }
      this.loadingPotentialRisks = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updatePotentialRisk(this.formData)
      } else {
        await this.addPotentialRisk(this.formData)
      }
      this.loadingPotentialRisks = false
      this.closeDrawer()
    }
  },
  async mounted() {
    await this.fetchOutsourceTypes()
    await this.fetchOfferings()
    if (this.editForm) {
      await this.fetchPotentialRiskById(this.itemId)
      this.formData = { ...this.getCurrentPotentialRisk }
    }
  }
}
</script>

<style scoped></style>
