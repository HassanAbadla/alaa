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
  name: "AssetSectorsForm",
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
      getSectors: "assetSectors/getSectors",
      getCurrentSector: "assetSectors/getCurrentSector",
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
      addSector: "assetSectors/addSector",
      updateSector: "assetSectors/updateSector",
      fetchSectorById: "assetSectors/fetchSectorById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingSectors = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateSector(this.formData)
      } else {
        await this.addSector(this.formData)
      }
      this.loadingSectors = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchSectorById(this.itemId)
      this.formData.name.en = this.getCurrentSector.name.en
      this.formData.name.ar = this.getCurrentSector.name.ar
      this.formData.note = this.getCurrentSector.note
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
