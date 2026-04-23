<template>
  <v-card>
    <v-card-title>Add Policy Transaction</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-container>
          <v-row>
            <!-- Transaction Date -->
            <v-col cols="12" md="6">
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formData.transaction_date"
                    label="Transaction Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="rules.date"
                    required
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.transaction_date"
                  @input="dateMenu = false"
                  :max="new Date().toISOString().substr(0, 10)"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <!-- Transaction Type -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.policy_transaction_type_id"
                :items="transactionTypes"
                item-text="name"
                item-value="id"
                label="Transaction Type"
                :rules="rules.required"
                required
              ></v-select>
            </v-col>

            <!-- Details -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.details"
                label="Details"
                :rules="rules.details"
                required
                counter
                maxlength="255"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <!-- Action Buttons -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="resetForm">Reset</v-btn>
          <v-btn color="primary" :disabled="!valid" type="submit" :loading="loading">Save Transaction</v-btn>
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
  </v-card>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "PolicyTransactionForm",

  props: {
    itemId: {
      type: [Number, String],
      required: true
    },
    isPolicy: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      required: false
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      valid: false,
      loading: false,
      dateMenu: false,
      transactionTypes: [],
      formData: {
        transaction_date: new Date().toISOString().substr(0, 10),
        details: "",
        policy_transaction_type_id: null,
        policy_id: this.editForm ? this.item.policy_id || this.item.policy_items_id : this.itemId
      },
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
      }
    }
  },

  async created() {
    await this.fetchTransactionTypes()
  },

  methods: {
    ...mapActions("policy", [
      "fetchPolicies",
      "addPolicyTransaction",
      "updatePolicyTransaction",
      "addItemTransaction",
      "updateItemTransaction",
      "fetchItems"
    ]),
    ...mapActions("drawer", ["closeDrawer"]),
    async fetchTransactionTypes() {
      try {
        const endpoint = this.isPolicy ? "policy-transaction-types" : "item-transaction-types"
        const response = await this.$axios.get(endpoint)
        this.transactionTypes = response.data.data
      } catch (error) {
        this.showError("Failed to load transaction types")
        console.error("Error fetching transaction types:", error)
      }
    },

    async handleSubmit() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      try {
        if (this.isPolicy) {
          // Handle policy transactions
          if (this.editForm) {
            await this.updatePolicyTransaction({ id: this.itemId, payload: this.formData })
          } else {
            await this.addPolicyTransaction(this.formData)
          }
          await this.fetchPolicies()
        } else {
          // Handle policy item transactions
          const data = {
            transaction_date: this.formData.transaction_date,
            details: this.formData.details,
            item_transaction_type_id: this.formData.policy_transaction_type_id,
            policy_items_id: this.formData.policy_id
          }

          if (this.editForm) {
            await this.updateItemTransaction({ id: this.itemId, payload: data })
          } else {
            await this.addItemTransaction(data)
          }
          await this.fetchItems({ id: this.$route.params.id })
        }

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

    resetForm() {
      this.$refs.form.reset()
      this.formData = {
        transaction_date: new Date().toISOString().substr(0, 10),
        details: "",
        policy_transaction_type_id: null,
        policy_id: null
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

    async loadTransaction() {
      if (this.editForm) {
        if (this.isPolicy) {
          this.formData.transaction_date = this.item.transaction_date
          this.formData.details = this.item.details
          this.formData.policy_transaction_type_id = this.item.policy_transaction_type?.id
        } else {
          this.formData.transaction_date = this.item.transaction_date
          this.formData.details = this.item.details
          this.formData.policy_transaction_type_id = this.item.item_transaction_type.id
        }
      }
    }
  },

  mounted() {
    this.loadTransaction()
  }
}
</script>
