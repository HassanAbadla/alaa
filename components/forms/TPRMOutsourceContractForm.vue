<template>
  <v-container class="py-8">
    <form-wrapper :width="width" @submit="handleSubmit">
      <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
      <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
      <CustomDatePicker v-model="formData.start_date" :label="$t('form.start_date')" :required="true" />
      <CustomDatePicker v-model="formData.end_date" :label="$t('form.end_date')" :required="false" />
      <custom-dropdown
        v-model="formData.tprm_outsource_type_id"
        :label="$t('form.type')"
        :items="getOutsourceTypes"
        item-text="name"
        item-value="id"
        :required="true"
        :loading="loadingOutsourceTypes"
      />
      <custom-dropdown
        v-model="formData.third_party_id"
        :label="$t('form.third_party')"
        :items="getThirdParties"
        item-text="company_name"
        item-value="id"
        :required="true"
        :loading="loadingThirdParties"
      />
      <CustomCheckbox v-model="formData.active" :label="$t('form.active')" />
      <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
      <!-- <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn> -->
    </form-wrapper>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMOutsourceContractForm",
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
        note: "",
        code: "",
        active: true,
        start_date: null,
        end_date: null,
        third_party_id: null,
        tprm_outsource_type_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentOutsourceContract: "tprmOutsourceContracts/getCurrentOutsourceContract",
      loadingOutsourceContracts: "tprmOutsourceContracts/isLoading",
      getOutsourceTypes: "tprmOutsourceTypes/getOutsourceTypes",
      loadingOutsourceTypes: "tprmOutsourceTypes/isLoading",
      getThirdParties: "tprmThirdParties/getThirdParties",
      loadingThirdParties: "tprmThirdParties/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addOutsourceContract: "tprmOutsourceContracts/addOutsourceContract",
      updateOutsourceContract: "tprmOutsourceContracts/updateOutsourceContract",
      fetchOutsourceContractById: "tprmOutsourceContracts/fetchOutsourceContractById",
      fetchOutsourceTypes: "tprmOutsourceTypes/fetchOutsourceTypes",
      fetchThirdParties: "tprmThirdParties/fetchThirdParties"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingOutsourceContracts = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateOutsourceContract(this.formData)
      } else {
        await this.addOutsourceContract(this.formData)
      }
      this.loadingOutsourceContracts = false
      this.closeDrawer()
    }
  },
  async mounted() {
    await this.fetchOutsourceTypes()
    await this.fetchThirdParties()
    if (this.editForm) {
      await this.fetchOutsourceContractById(this.itemId)
      this.formData = { ...this.getCurrentOutsourceContract }
    }
  }
}
</script>

<style scoped></style>
