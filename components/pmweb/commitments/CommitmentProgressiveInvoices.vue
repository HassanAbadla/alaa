<template>
  <custom-table
    :headers="headers"
    :prop-items="invoices"
    :prop-loading="isLoading"
    :tableConfig="tableConfig"
    hideEdit
    hideView
    hideDelete
    hideCreate
    :full-page-table="false"
  >
    <template v-slot:item.InvoiceDate="{ item }">
      {{ formatPMISDate(item.InvoiceDate) }}
    </template>
    <template v-slot:item.InvoiceDueDate="{ item }">
      {{ formatPMISDate(item.InvoiceDueDate) }}
    </template>
    <!-- <template v-slot:item._LastUpdateDate="{ item }">
      {{ formatPMISDate(item._LastUpdateDate) }}
    </template> -->
  </custom-table>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { formatPMISDate } from "@/helpers/date-helpers"

export default {
  name: "CommitmentProgressiveInvoices",

  data() {
    return {
      tableConfig: {},
      headers: [
        { text: "table.record_#", value: "RecordNumber" },
        { text: "table.invoice_#", value: "_InvoiceNumber" },
        { text: "table.cost_period", value: "CostPeriod" },
        { text: "table.invoice_date", value: "InvoiceDate" },
        { text: "table.invoice_due", value: "InvoiceDueDate" },
        { text: "table.invoice_type", value: "InvoiceType" },
        { text: "table.total_this_invoice", value: "_CurrentPaymentDue" },
        { text: "table.status", value: "Status" },
        { text: "table.revision_#", value: "RevisionNumber" }
        // { text: "table.date", value: "_LastUpdateDate" }
      ]
    }
  },

  computed: {
    ...mapGetters({
      invoices: "pmwebProgressInvoices/getProgressInvoices",
      isLoading: "pmwebProgressInvoices/isLoading",
      hasError: "pmwebProgressInvoices/hasError",
      currentCommitment: "pmwebCommitments/getCurrentCommitment"
    })
  },

  methods: {
    formatPMISDate,
    ...mapActions({
      fetchInvoices: "pmwebProgressInvoices/fetchProgressInvoices",
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

    async loadInvoices() {
      try {
        // First make sure we have the commitment
        await this.loadCommitment()

        // Only proceed if we have a commitment with a ProjectNumber
        if (this.currentCommitment && this.currentCommitment.ProjectNumber) {
          const filters = {
            ProjectNumber: this.currentCommitment.ProjectNumber
          }
          await this.fetchInvoices(filters)
          console.log("Progressive invoices loaded for project:", this.currentCommitment.ProjectNumber)
        } else {
          console.warn("Cannot load progressive invoices: No ProjectNumber available")
        }
      } catch (error) {
        console.error("Failed to load progressive invoices:", error)
      }
    }
  },

  mounted() {
    this.loadInvoices()
  }
}
</script>

<style>
/* Styles can be added later */
</style>
