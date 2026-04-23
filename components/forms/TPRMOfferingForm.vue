<template>
  <v-container class="py-8">
    <form-wrapper :width="width" @submit="handleSubmit">
      <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
      <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
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
      <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    </form-wrapper>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMOfferingForm",
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
    },
    thirdPartyId: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    return {
      formData: {
        name: "",
        note: "",
        code: "",
        third_party_id: this.thirdPartyId ?? null,
        tprm_outsource_type_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentOffering: "tprmOfferings/getCurrentOffering",
      loadingOfferings: "tprmOfferings/isLoading",
      getOutsourceTypes: "tprmOutsourceTypes/getOutsourceTypes",
      loadingOutsourceTypes: "tprmOutsourceTypes/isLoading",
      getThirdParties: "tprmThirdParties/getThirdParties",
      loadingThirdParties: "tprmThirdParties/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addOffering: "tprmOfferings/addOffering",
      updateOffering: "tprmOfferings/updateOffering",
      fetchOfferingById: "tprmOfferings/fetchOfferingById",
      fetchOutsourceTypes: "tprmOutsourceTypes/fetchOutsourceTypes",
      fetchThirdParties: "tprmThirdParties/fetchThirdParties"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingOfferings = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateOffering(this.formData)
      } else {
        await this.addOffering(this.formData)
      }
      if (this.thirdPartyId) {
        this.$emit("saved")
        this.$emit("close")
      }
      this.loadingOfferings = false
      this.closeDrawer()
    }
  },
  async mounted() {
    await this.fetchOutsourceTypes()
    await this.fetchThirdParties()
    if (this.editForm) {
      await this.fetchOfferingById(this.itemId)
      this.formData = { ...this.getCurrentOffering }
    }
  }
}
</script>

<style scoped></style>
