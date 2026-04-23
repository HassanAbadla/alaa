<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMIndustryForm",
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
        code: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getIndustries: "tprmIndustries/getIndustries",
      getCurrentIndustry: "tprmIndustries/getCurrentIndustry",
      loadingIndustries: "tprmIndustries/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addIndustry: "tprmIndustries/addIndustry",
      // fetchStatuses: "tprmIndustries/fetchStatuses",
      updateIndustry: "tprmIndustries/updateIndustry",
      fetchIndustryById: "tprmIndustries/fetchIndustryById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingIndustries = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateIndustry(this.formData)
      } else {
        await this.addIndustry(this.formData)
      }
      this.loadingIndustries = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchIndustryById(this.itemId)
      this.formData.name = this.getCurrentIndustry.name
      this.formData.note = this.getCurrentIndustry.note
      this.formData.code = this.getCurrentIndustry.code
    }
  }
}
</script>

<style scoped>
/* .color_field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  margin-bottom: 1.8rem;
  border: 1px solid #929292;
  border-radius: 4px;
} */
</style>
