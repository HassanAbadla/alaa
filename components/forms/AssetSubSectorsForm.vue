<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-dropdown
      :items="getSectors"
      item-text="name"
      item-value="id"
      v-model="formData.asset_sector_id"
      :label="$t('table.asset_sector')"
      :required="true"
      :loading="loadingSectors"
    />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "AssetSubSectorsForm",
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
        note: "",
        asset_sector_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentSubSector: "assetSubSectors/getCurrentSubSector",
      loadingSubSectors: "assetSubSectors/isLoading",
      getSectors: "assetSectors/getSectors",
      loadingSectors: "assetSectors/isLoading"
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
      addSubSector: "assetSubSectors/addSubSector",
      updateSubSector: "assetSubSectors/updateSubSector",
      fetchSubSectorById: "assetSubSectors/fetchSubSectorById",
      fetchSectors: "assetSectors/fetchSectors"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingSubSectors = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateSubSector(this.formData)
      } else {
        await this.addSubSector(this.formData)
      }
      this.loadingSubSectors = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchSectors()
    if (this.editForm) {
      await this.fetchSubSectorById(this.itemId)
      this.formData.name.en = this.getCurrentSubSector.name.en
      this.formData.name.ar = this.getCurrentSubSector.name.ar
      this.formData.note = this.getCurrentSubSector.note
      this.formData.asset_sector_id = this.getCurrentSubSector.asset_sector_id
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
