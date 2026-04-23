<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.city_id"
      :label="$t('table.city')"
      :items="getCities"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingCities"
    />
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
  name: "DistrictsForm",
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
      countries: [],
      formData: {
        city_id: null,
        name: { en: "", ar: "" },
        note: "",
        color: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentDistrict: "districts/getCurrentDistrict",
      loadingDistricts: "districts/isLoading",
      getCities: "cities/getCities",
      loadingCities: "cities/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addDistrict: "districts/addDistrict",
      updateDistrict: "districts/updateDistrict",
      fetchDistrictById: "districts/fetchDistrictById",
      fetchCities: "cities/fetchCities"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingDistricts = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateDistrict(this.formData)
      } else {
        await this.addDistrict(this.formData)
      }
      this.loadingDistricts = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchCities()
    if (this.editForm) {
      await this.fetchDistrictById(this.itemId)
      this.formData.name.en = this.getCurrentDistrict.name.en
      this.formData.name.ar = this.getCurrentDistrict.name.ar
      this.formData.city_id = Number(this.getCurrentDistrict.city_id)
      this.formData.note = this.getCurrentDistrict.note
    }
  }
}
</script>

<style scoped></style>
