<template>
  <v-can show-message :permission="'access_contracts'">
    <custom-table-wrapper>
      <custom-table
        :title="$t('table.contracts')"
        :headers="headers"
        :prop-items="contracts"
        :prop-loading="loading"
        :tableConfig="tableConfig"
      />
    </custom-table-wrapper>
  </v-can>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { getUsers } from "@/api/tenent-api"
import CustomTable from "@/components/custom-table/CustomTable.vue"
import CustomTableWrapper from "../custom-table/CustomTableWrapper.vue"

export default {
  name: "ContractsTable",
  components: { CustomTable, CustomTableWrapper },
  layout: "dashboard-layout",
  middleware: ["auth", "is-pmis"],

  data() {
    return {
      headers: [
        {
          text: "table.id",
          align: "start",
          value: "id"
        },
        {
          text: "table.description",
          value: "description"
        },
        {
          text: "table.estimated_cost",
          value: "estimated_cost"
        },
        {
          text: "table.user_access",
          value: "access",
          sortable: false
        },
        { text: "table.company", value: "company.name" },
        { text: "table.disipline", value: "disipline.name" },
        { text: "table.status", value: "status.name" },
        { text: "table.type", value: "type.name" },

        {
          text: "table.actions",
          value: "actions",
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapState("contracts", ["contracts", "loading", "error", "currentContract"]),
    projectId() {
      // optional only for get contracts by project id
      return this.$route.params.id
    },
    tableConfig() {
      return {
        // fetch: this.fetchContracts,
        itemPath: "contracts",
        delete: this.removeContract,
        dataAccess: { accessibleType: "contract", update: this.updateDataAccess, remove: this.removeDataAccess },
        CANS: {
          props: {
            postableType: "contract",
            usersApi: () => this.getUsers(this.$axios),
            updateCount: (contractId) => {
              this.updateMessageCount(contractId)
            }
          }
        },
        createForm: {
          componentPath: "forms/ContractForm"
        },
        editForm: {
          componentPath: "forms/ContractForm",
          props: { editForm: true }
        },
        permissions: {
          create: "create_contract",
          edit: "edit_contract",
          delete: "delete_contract",
          view: "view_contract",
          dataAccess: "assign_contract_data_access"
        }
      }
    }
  },
  methods: {
    ...mapActions("contracts", [
      "fetchContracts",
      "deleteContract",
      "updateMessageCount",
      "updateDataAccess",
      "removeDataAccess"
    ]),
    getUsers,
    // fetchContracts() {
    //   return getAllContractsByProjectId(this.projectId, this.$axios)
    // },
    removeContract(contractId) {
      return this.deleteContract(contractId)
    }
  },
  mounted() {
    this.fetchContracts(this.projectId)
  }
}
</script>

<style scoped></style>
