<template>
  <v-container fluid>
    <!-- Search Bar -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search transactions"
          clearable
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Loading Progress -->
    <v-row v-if="loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>

    <!-- Transaction Cards -->
    <v-row>
      <v-col v-for="transaction in filteredTransactions" :key="transaction.id" cols="12">
        <v-card outlined :elevation="2" class="mx-auto transition-swing" hover>
          <v-card-text>
            <v-row align="start" no-gutters>
              <!-- Date -->
              <v-col cols="12" sm="2">
                <div class="text-subtitle-2 grey--text">{{ $t("table.date") }}</div>
                <div class="text-body-1">{{ formatDate(transaction.transaction_date) }}</div>
              </v-col>

              <!-- Transaction Type -->
              <v-col cols="12" sm="2">
                <div class="text-subtitle-2 grey--text">{{ $t("type") }}</div>
                <v-chip
                  small
                  :color="
                    getTransactionTypeColor(
                      transaction?.policy_transaction_type?.code || transaction?.item_transaction_type?.code
                    )
                  "
                  class="mt-1"
                >
                  {{ transaction?.policy_transaction_type?.name || transaction?.item_transaction_type?.name }}
                </v-chip>
              </v-col>

              <!-- Details -->
              <v-col cols="12" sm="4">
                <div class="text-subtitle-2 grey--text">{{ $t("detail") }}</div>
                <div class="text-body-1">{{ transaction.details }}</div>
              </v-col>

              <!-- Created At -->
              <v-col cols="12" sm="2" class="text-right">
                <div class="text-subtitle-2 grey--text">{{ $t("table.created_at") }}</div>
                <div class="text-caption">{{ formatDateTime(transaction.created_at) }}</div>
              </v-col>

              <!-- Actions -->
              <v-col cols="12" sm="2" class="text-right mt-auto">
                <!-- Actions -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small v-bind="attrs" v-on="on" @click="editTransaction(transaction)">
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("form.edit") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small v-bind="attrs" v-on="on" @click="deleteTransaction(transaction)">
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("table.delete") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <div class="d-flex flex-row align-center pa-2" v-if="transaction.user_position">
            <custom-avatar
              :name="transaction.user_position?.user_fullname"
              :image="transaction.user_position?.avatar"
            />
            <div class="d-flex flex-column">
              <span class="h6 px-2 justify-self-center word-wrap">
                {{ transaction.user_position?.user_fullname }}
              </span>
              <small class="px-2 justify-self-center text-capitalize text--secondary no-wrap">
                {{ transaction.user_position?.title }}
              </small>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-row v-if="filteredTransactions?.length === 0 && !loading">
      <v-col cols="12" class="text-center">
        <v-img src="/no-results.svg" max-width="200" class="mx-auto mb-4"></v-img>
        <div class="text-h6 grey--text">
          {{ search ? "No matching transactions found" : "No transactions available" }}
        </div>
      </v-col>
    </v-row>

    <custom-dialog v-model="openDeleteConfirmation" :title="$t('page.notice')" width="580px">
      <div>
        <v-card-text>{{ $t("page.delete_confirmation") }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="confirmDelete" :disabled="isDeleting">
            {{ $t("table.delete") }}
          </v-btn>
        </v-card-actions>
      </div>
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex"
import CustomAvatar from "../profile/CustomAvatar.vue"

export default {
  name: "PolicyTransactionsList",

  components: { CustomAvatar },

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    transactions: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      search: "",
      openDeleteConfirmation: false,
      isDeleting: false,
      secelctedTransaction: null
    }
  },

  computed: {
    filteredTransactions() {
      if (!this.search) return this.transactions

      const searchTerm = this.search.toLowerCase()
      return this.transactions.filter((transaction) => {
        return (
          transaction.details.toLowerCase().includes(searchTerm) ||
          transaction.policy_transaction_type.name.toLowerCase().includes(searchTerm) ||
          transaction.transaction_date.includes(searchTerm)
        )
      })
    },
    isPolicy() {
      const firstTransaction = this.transactions[0]

      return "policy_id" in firstTransaction && !("policy_item_id" in firstTransaction)
    }
  },

  methods: {
    ...mapActions("policy", [
      "fetchPolicies",
      "deleteItemTransaction",
      "fetchItems",
      "updatePolicyTransaction",
      "deletePolicyTransaction"
    ]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    editTransaction(transaction) {
      this.openDrawer({
        component: "forms/PolicyTransactionsForm",
        props: { itemId: transaction.id, item: transaction, isPolicy: this.isPolicy, editForm: true },
        title: this.$t("page.new_transaction"),
        width: 700
      })
    },
    formatDate(dateString) {
      if (!dateString) return "-"
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },

    formatDateTime(dateTimeString) {
      if (!dateTimeString) return "-"
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
      return new Date(dateTimeString).toLocaleString(undefined, options)
    },

    getTransactionTypeColor(code) {
      const colorMap = {
        trnx1: "primary"
        // Add more mappings as needed for different transaction types
      }
      return colorMap[code] || "grey"
    },
    async deleteTransaction(transaction) {
      console.log("transaction:", transaction)

      this.secelctedTransaction = transaction
      this.openDeleteConfirmation = true
    },
    async confirmDelete() {
      this.isDeleting = true
      if (this.isPolicy) {
        await this.deletePolicyTransaction({ id: this.secelctedTransaction.id })
        await this.fetchPolicies()
      } else {
        await this.deleteItemTransaction({ id: this.secelctedTransaction.id })
        await this.fetchItems({ id: this.$route.params.id })
      }
      this.isDeleting = false
      this.openDeleteConfirmation = false
      this.closeDrawer()
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: translateX(4px);
}
</style>
