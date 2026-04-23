<template>
  <v-container>
    <!-- Offerings Risks Section -->
    <div
      v-if="
        potentialRisks && (potentialRisks.offeringsRisks?.length > 0 || potentialRisks.outsourceTypeRisks?.length > 0)
      "
    >
      <div class="mb-6">
        <h3 class="mb-3">{{ $t("form.offerings_risks") || "Offerings Risks" }}</h3>
        <v-radio-group
          v-if="potentialRisks.offeringsRisks && potentialRisks.offeringsRisks.length > 0"
          v-model="selectedPotentialRisk"
          @change="onRiskChange"
        >
          <CustomRadio
            v-for="risk in potentialRisks.offeringsRisks"
            :key="risk.id"
            :value="risk.id"
            :label="risk.name"
          />
        </v-radio-group>
        <div v-else>
          <v-alert type="warning" outlined>
            {{ $t("form.no_offering_risks_available") || "No offering risks available." }}
          </v-alert>
        </div>
      </div>

      <!-- Outsource Type Risks Section -->
      <div class="mb-6">
        <h3 class="mb-3">{{ $t("form.outsource_type_risks") || "Outsource Type Risks" }}</h3>
        <v-radio-group
          v-if="potentialRisks.outsourceTypeRisks && potentialRisks.outsourceTypeRisks.length > 0"
          v-model="selectedPotentialRisk"
          @change="onRiskChange"
        >
          <CustomRadio
            v-for="risk in potentialRisks.outsourceTypeRisks"
            :key="risk.id"
            :value="risk.id"
            :label="risk.name"
          />
        </v-radio-group>
        <div v-else>
          <v-alert type="warning" outlined>
            {{ $t("form.no_outsource_type_risks_available") || "No outsource type risks available." }}
          </v-alert>
        </div>
      </div>

      <!-- Action Buttons -->
      <v-row justify="end" class="mt-4">
        <v-col cols="auto">
          <v-btn block color="primary" @click="onConfirm" :disabled="!hasSelection">
            {{ $t("form.confirm") || "Confirm" }}
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-alert type="warning" outlined>
        {{ $t("form.no_potential_risks_available") || "No potential risks available." }}
      </v-alert>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "PotentialRiskSelection",
  props: {
    thirdPartyId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      potentialRisks: [],
      selectedPotentialRisk: null
    }
  },
  watch: {
    // Add this watcher
    async thirdPartyId(newId) {
      if (newId) {
        // Reset selections when third party changes
        this.selectedPotentialRisk = null
        this.selectedOfferingRisk = null
        this.selectedOutsourceRisk = null

        // Fetch new potential risks
        const response = await this.fetchPotentialRisksList({ thirdPartyId: newId })
        this.potentialRisks = response.data.data || []
      }
    }
  },
  methods: {
    ...mapActions({
      fetchPotentialRisksList: "tprmPotentialRisks/fetchPotentialRisksList"
    }),
    onRiskChange(value) {
      // Clear the other selection when one is selected
      if (value) {
        this.selectedOutsourceTypeRisk = null
      }
      this.emitSelection()
    },
    onOutsourceTypeRiskChange(value) {
      // Clear the other selection when one is selected
      if (value) {
        this.selectedOfferingRisk = null
      }
      this.emitSelection()
    },
    emitSelection() {
      this.$emit("risk-selected", this.selectedRiskData)
    },
    onConfirm() {
      if (this.hasSelection) {
        this.$emit("confirm", this.selectedRiskData)
      }
    },
    onCancel() {
      this.$emit("cancel")
    }
  },
  computed: {
    ...mapGetters({
      potentialRisksData: "tprmPotentialRisks/getPotentialRisksData"
    }),
    offeringsRisks() {
      return this.potentialRisks?.offeringsRisks || []
    },
    outsourceTypeRisks() {
      return this.potentialRisks?.outsourceTypeRisks || []
    },
    hasSelection() {
      return this.selectedPotentialRisk !== null
    },
    selectedRiskData() {
      let selectedRisk = null

      if (this.selectedPotentialRisk) {
        return (selectedRisk =
          this.potentialRisks.offeringsRisks.find((risk) => risk.id === this.selectedPotentialRisk) ||
          this.potentialRisks.outsourceTypeRisks.find((risk) => risk.id === this.selectedPotentialRisk))
      }
    }
  },
  async mounted() {
    const response = await this.fetchPotentialRisksList({ thirdPartyId: this.thirdPartyId })
    this.potentialRisks = response.data.data || []
  }
}
</script>
