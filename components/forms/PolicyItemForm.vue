<template>
  <v-card class="pa-4">
    <v-card-title>Create Policy Item</v-card-title>
    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <v-container>
        <v-row>
          <v-col>
            <AssetSelector v-model="formData.grc_assets" :availableAssets="assets" @input="clearError('grc_assets')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
            <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
          </v-col>
          <v-col>
            <v-select
              v-model="formData.active"
              :items="activeOptions"
              label="Active Status"
              required
              :rules="[(v) => !!v || 'Status is required']"
            ></v-select>
            <v-select
              v-model="formData.policy_item_status_id"
              :items="statusOptions"
              label="Status"
              item-text="name"
              item-value="id"
              required
              :rules="[(v) => !!v || 'Status is required']"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <quill-editor v-model="formData.details" :label="$t('table.details')" required />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="grey" text class="mr-4" @click="resetForm">Reset</v-btn>
            <v-btn color="primary" type="submit" :disabled="!valid" :loading="loading">Create Policy Item</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex"
import AssetSelector from "./AssetSelector.vue"

export default {
  name: "PolicyItemForm",
  components: { AssetSelector },

  props: {
    itemId: {
      type: Number,
      required: false
    },
    item: {
      type: Object,
      required: false
    },
    editForm: {
      type: Boolean,
      default: false
    },
    policyId: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      valid: false,
      loading: false,
      formData: {
        grc_assets: [],
        name: "",
        code: "",
        details: "",
        active: "Y",
        policy_id: this.$route.params.id || this.item.id,
        policy_item_status_id: null,
        policy_items_id: null
      },
      activeOptions: [
        { text: "Yes", value: "Y" },
        { text: "No", value: "N" }
      ],
      errors: {},
      statusOptions: []
    }
  },

  methods: {
    ...mapActions("policy", ["createPolicyItem", "updatePolicyItem", "fetchItems"]),
    ...mapActions("assets", ["fetchAssets"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async submitForm() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      try {
        this.editForm
          ? await this.updatePolicyItem({ id: this.itemId, payload: this.formData })
          : await this.createPolicyItem(this.formData)
        this.fetchItems({ id: this.$route.params.id, filters: {} })
        this.$emit("created")
        this.$emit("success", "Policy item created successfully")
        this.resetForm()
      } catch (error) {
        this.$emit("error", error.message || "Failed to create policy item")
      } finally {
        this.loading = false
        this.closeDrawer()
      }
    },
    resetForm() {
      this.$refs.form.reset()
      this.formData = {
        active: "Y",
        policy_id: null,
        policy_item_status_id: null,
        policy_items_id: null,
        grc_assets: []
      }
    },
    async loadItemData() {
      if (this.editForm) {
        const item = this.items.find((item) => item.id === this.itemId)
        console.log("item", item)

        if (item) {
          this.formData.name = item.name
          this.formData.code = item.code
          this.formData.active = item.active
          this.formData.details = item.details
          this.formData.policy_item_status_id = item.status.id
          this.formData.policy_items_id = item.id
          this.formData.grc_assets = item.assets
        }
      } else {
        throw new Error("Policy not found")
      }
    },

    async fetchStatusOptions() {
      try {
        const response = await this.$axios.get("/policy-item-statuses")
        this.statusOptions = response.data.data
      } catch (error) {
        this.$emit("error", "Failed to fetch status options")
      }
    },
    clearError(field) {
      this.errors[field] = []
    }
  },

  computed: {
    ...mapState("policy", ["policies", "items"]),
    ...mapState("assets", ["assets"])
  },

  created() {
    // this.fetchPolicies()
    this.fetchAssets()
    this.loadItemData()
    this.fetchStatusOptions()
  }
}
</script>
