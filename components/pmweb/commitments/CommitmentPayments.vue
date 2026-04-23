<template>
  <custom-table
    :headers="headers"
    :prop-items="payments"
    :prop-loading="isLoading"
    :tableConfig="tableConfig"
    hideEdit
    hideView
    hideDelete
    hideCreate
    :full-page-table="false"
  >
    <template v-slot:item.PaymentDate="{ item }">
      {{ formatPMISDate(item.PaymentDate) }}
    </template>
  </custom-table>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { formatPMISDate } from "@/helpers/date-helpers"

export default {
  name: "CommitmentPayments",

  data() {
    return {
      tableConfig: {},
      headers: [
        { text: "table.id", value: "ID" },
        { text: "table.status", value: "Status" },
        { text: "table.company", value: "_CompanyName" },
        { text: "table.description", value: "Description" },

        { text: "table.payment_method", value: "PaymentMethod" },
        { text: "table.payment_#", value: "PaymentNumber" },
        { text: "table.payment_date", value: "PaymentDate" },
        { text: "table.payment_amount", value: "PaymentAmount" },
        { text: "table.cost_code", value: "CostCode" },
        { text: "table.period", value: "Period" },
        { text: "table.type", value: "Type" },
        { text: "table.category", value: "Category" },
        { text: "table.reference", value: "Reference" },
        { text: "table.notes", value: "Notes" }
      ]
    }
  },

  computed: {
    ...mapGetters({
      payments: "pmwebApPayments/getApPayments",
      isLoading: "pmwebApPayments/isLoading",
      hasError: "pmwebApPayments/hasError",
      currentCommitment: "pmwebCommitments/getCurrentCommitment"
    })
  },

  methods: {
    formatPMISDate,
    ...mapActions({
      fetchPayments: "pmwebApPayments/fetchApPayments",
      fetchCommitmentById: "pmwebCommitments/fetchCommitmentById"
    }),

    async loadCommitment() {
      // Only fetch commitment if we don't have it already
      if (!this.currentCommitment) {
        try {
          const id = this.$route.params.id
          if (!id) {
            console.error("No commitment ID found in route params")
            return
          }
          await this.fetchCommitmentById(id)
        } catch (error) {
          console.error("Failed to load commitment:", error)
        }
      }
    },

    async loadPayments() {
      try {
        // First make sure we have the commitment
        await this.loadCommitment()

        // Only proceed if we have a commitment with a ProjectNumber
        if (this.currentCommitment && this.currentCommitment.ProjectNumber) {
          const filters = {
            ProjectNumber: this.currentCommitment.ProjectNumber
          }
          await this.fetchPayments(filters)
          console.log("Payments loaded for project:", this.currentCommitment.ProjectNumber)
        } else {
          console.warn("Cannot load payments: No ProjectNumber available")
        }
      } catch (error) {
        console.error("Failed to load payments:", error)
      }
    }
  },

  mounted() {
    this.loadPayments()
  }
}
</script>

<style>
/* Styles can be added later */
</style>
