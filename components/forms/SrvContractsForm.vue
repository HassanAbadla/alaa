<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-dropdown
      :items="getTenants"
      item-value="id"
      item-text="company_name"
      :label="$t('page.receiver')"
      v-model="formData.receiver_tenant_id"
      :loading="loadingTenants"
      :required="true"
      @input="getTenantUsers"
      :disabled="!editForm && this.$route.query.receiver_tenant_id ? true : false"
    />
    <custom-dropdown
      :items="getUsers"
      item-value="id"
      item-text="full_name"
      :label="$t('form.user')"
      v-model="formData.receiver_user_id"
      :loading="loadingUsers"
      :required="true"
    />
    <custom-dropdown
      :items="getStatuses"
      item-value="id"
      item-text="name"
      :label="$t('form.status')"
      v-model="formData.srv_contract_status_id"
      :loading="loadingStatuses"
      :required="true"
    />
    <custom-dropdown
      :items="getCategories"
      item-value="id"
      item-text="name"
      :label="$t('table.category')"
      v-model="formData.srv_contract_category_id"
      :loading="loadingCategories"
      :required="true"
    />
    <custom-input v-model="formData.quote_no" :label="$t('form.quote_no')" :required="true" />
    <custom-date-picker v-model="formData.quote_date" :label="$t('form.quote_date')" :required="true" />
    <custom-input v-model="formData.qty_rooms" :label="$t('form.qty_rooms')" :type="'number'" :required="true" />
    <custom-input v-model="formData.qty_racks" :label="$t('form.qty_racks')" :type="'number'" :required="true" />
    <custom-input
      v-model="formData.qty_certifications"
      :label="$t('form.qty_certifications')"
      :type="'number'"
      :required="true"
    />
    <custom-input
      v-model="formData.total_test_readings"
      :label="$t('form.total_test_readings')"
      :type="'number'"
      :required="true"
    />
    <custom-input
      v-model="formData.total_area_served"
      :label="$t('form.total_area_served')"
      :type="'number'"
      :required="true"
    />
    <custom-date-picker
      v-model="formData.date_contract_starts"
      :label="$t('form.date_contract_starts')"
      :required="true"
    />
    <custom-date-picker v-model="formData.date_contract_ends" :label="$t('form.date_contract_ends')" :required="true" />
    <custom-date-picker
      v-model="formData.date_contract_started"
      :label="$t('form.date_contract_started')"
      :required="true"
    />
    <custom-date-picker
      v-model="formData.date_contract_ended"
      :label="$t('form.date_contract_ended')"
      :required="true"
    />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import CustomDatePicker from "../custom-form/CustomDatePicker.vue"
export default {
  name: "SrvContractsForm",
  components: { CustomDatePicker },
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
        name: "",
        code: "",
        srv_contract_status_id: null,
        srv_contract_category_id: null,
        quote_no: "",
        quote_date: null,
        qty_rooms: 0,
        qty_racks: 0,
        qty_certifications: 0,
        total_test_readings: 0,
        total_area_served: 0,
        date_contract_starts: null,
        date_contract_ends: null,
        date_contract_started: null,
        date_contract_ended: null,
        receiver_tenant_id: Number(this.$route.query.receiver_tenant_id) || null,
        receiver_user_id: null,
        note: ""
      },
      filters: {
        receiver_tenant_id: null
      },
      loading: false
    }
  },
  // watch: {
  //   "formData.receiver_tenant_id"(newTenantId) {
  //     // this.formData.receiver_user_id = null
  //     this.filters.receiver_tenant_id = newTenantId
  //     if (newTenantId) {
  //       this.fetchUsers(this.filters)
  //     }
  //   }
  // },

  computed: {
    ...mapGetters({
      getCurrentContract: "srvContracts/getCurrentContract",
      loadingContracts: "srvContracts/isLoading",
      getStatuses: "srvContractStatuses/getStatuses",
      loadingStatuses: "srvContractStatuses/isLoading",
      getCategories: "srvContractCategories/getCategories",
      loadingCategories: "srvContractCategories/isLoading",
      getTenants: "srvTenants/getTenants",
      loadingTenants: "srvTenants/isLoading",
      getUsers: "srvUsers/getUsers",
      loadingUsers: "srvUsers/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addContract: "srvContracts/addContract",
      updateContract: "srvContracts/updateContract",
      fetchContractById: "srvContracts/fetchContractById",
      fetchStatuses: "srvContractStatuses/fetchStatuses",
      fetchCategories: "srvContractCategories/fetchCategories",
      fetchTenants: "srvTenants/fetchTenants",
      fetchUsers: "srvUsers/fetchUsers"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    getTenantUsers(tenantId) {
      console.log("receiver tenant:", tenantId)

      // this.formData.receiver_user_id = null
      this.filters.receiver_tenant_id = tenantId
      this.fetchUsers(this.filters)
    },
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingFrequencies = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateContract(this.formData)
      } else {
        await this.addContract(this.formData)
      }
      this.loadingFrequencies = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchStatuses()
    this.fetchCategories()
    await this.fetchTenants()
    if (this.editForm) {
      await this.fetchContractById(this.itemId)
      this.formData.name = this.getCurrentContract.name
      this.formData.code = this.getCurrentContract.code
      this.formData.note = this.getCurrentContract.note
      this.formData.srv_contract_status_id = this.getCurrentContract.srv_contract_status_id
      this.formData.srv_contract_category_id = this.getCurrentContract.srv_contract_category_id
      this.formData.receiver_tenant_id = this.getCurrentContract.receiver_tenant_id
      await this.getTenantUsers(this.getCurrentContract.receiver_tenant_id)
      this.formData.receiver_user_id = this.getCurrentContract.receiver_user_id
      this.formData.date_contract_started = this.getCurrentContract.date_contract_started
      this.formData.date_contract_ended = this.getCurrentContract.date_contract_ended
      this.formData.date_contract_starts = this.getCurrentContract.date_contract_starts
      this.formData.date_contract_ends = this.getCurrentContract.date_contract_ends
      this.formData.quote_date = this.getCurrentContract.quote_date
      this.formData.quote_no = this.getCurrentContract.quote_no
      this.formData.qty_rooms = this.getCurrentContract.qty_rooms
      this.formData.qty_racks = this.getCurrentContract.qty_racks
      this.formData.qty_certifications = this.getCurrentContract.qty_certifications
      this.formData.total_test_readings = this.getCurrentContract.total_test_readings
      this.formData.total_area_served = this.getCurrentContract.total_area_served
    }
  }
}
</script>

<style scoped>
.color_field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  margin-bottom: 1.8rem;
  border: 1px solid #929292;
  border-radius: 4px;
}
</style>
