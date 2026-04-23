<template>
  <v-can show-message :permission="'access_pmweb_ap_payments'">
    <v-container fluid>
      <custom-table
        pmweb-table
        :full-page-table="false"
        :title="$t('page.ap_payments')"
        :headers="headers"
        :tableConfig="tableConfig"
        :prop-items="apPayments"
        :prop-loading="loading"
        hideEdit
        hideView
        hideDelete
        hideCreate
      >
        <template v-slot:item.PaymentDate="{ item }">
          {{ formatPMISDate(item.PaymentDate) }}
        </template>
        <template v-slot:item._CreateDate="{ item }">
          {{ formatPMISDate(item._CreateDate) }}
        </template>
      </custom-table>
    </v-container>
  </v-can>
</template>

<script>
import { formatPMISDate } from "@/helpers/date-helpers"
import { mapState, mapActions } from "vuex"

export default {
  name: "PMWEBApPaymentsTable",
  props: {
    propFilters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      headers: [
        { text: "table.program", value: "_ProgramName" },
        { text: "table.project_name", value: "_ProjectName" },
        { text: "table.project_#", value: "ProjectNumber" },
        { text: "table.commitment", value: "_Commitment" },
        { text: "table.linked_invoice", value: "_LinkedProgressInvoice" },
        { text: "table.record_#", value: "ID" },
        { text: "table.description", value: "Description" },
        { text: "table.payment_batch", value: "PaymentNumber" },
        { text: "table.status", value: "Status" },
        { text: "table.currency", value: "CurrencyCode" },
        { text: "table.revision", value: "Revision" },
        { text: "table.open_balance", value: "OpenBalance" },
        { text: "table.payment_amount", value: "PaymentAmount" },
        { text: "table.cost_code", value: "CostCode" },
        { text: "table.period", value: "Period" },
        { text: "table.invoice_#", value: "InvoiceNumber" },
        { text: "table.payment_method", value: "PaymentMethod" },
        { text: "table.payment_date", value: "PaymentDate" },
        { text: "table.company", value: "_CompanyName" },
        { text: "table.type", value: "Type" },
        { text: "table.category", value: "Category" },
        { text: "table.reference", value: "Reference" },
        { text: "table.notes", value: "Notes" },
        { text: "table.applied_in_full", value: "AppliedInFull" },
        { text: "table.created_by", value: "_LastUpdateBy" },
        { text: "table.created_date", value: "_CreateDate" }
      ],
      tableConfig: {},
      filters: {},
      selectedAPPayment: null
    }
  },
  computed: {
    ...mapState("pmwebApPayments", ["apPayments", "loading", "error"])
  },
  methods: {
    formatPMISDate,
    ...mapActions("pmwebApPayments", ["fetchApPayments"]),
    fetchData() {
      this.fetchApPayments({ ...this.filters, ...this.propFilters })
    }
  },
  watch: {
    filters: {
      handler: function () {
        this.fetchData()
      },
      deep: true
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style></style>
