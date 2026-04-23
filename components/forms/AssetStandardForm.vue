<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "AssetStandardForm",
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
        name: { en: "", ar: "" },
        note: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getStandards: "assetStandards/getStandards",
      getCurrentStandard: "assetStandards/getCurrentStandard",
      loadingStandards: "assetStandards/isLoading"
    }),
    swatchStyle() {
      return {
        backgroundColor: this.formData.color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        border: "1px solid #929292",
        borderRadius: "4px"
      }
    }
  },

  methods: {
    ...mapActions({
      addStandard: "assetStandards/addStandard",
      updateStandard: "assetStandards/updateStandard",
      fetchStandardById: "assetStandards/fetchStandardById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingStandards = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateStandard(this.formData)
      } else {
        await this.addStandard(this.formData)
      }
      this.loadingStandards = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchStandardById(this.itemId)
      this.formData.name.en = this.getCurrentStandard.name.en
      this.formData.name.ar = this.getCurrentStandard.name.ar
      this.formData.note = this.getCurrentStandard.note
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
