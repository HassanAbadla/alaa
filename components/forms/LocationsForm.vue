<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.district_id"
      :label="$t('page.districts')"
      :items="getDistricts"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingDistricts"
    />
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />

    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "CitiesForm",
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
        district_id: null,
        name: "",
        note: "",
        color: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentLocation: "locations/getCurrentLocation",
      loadingLocations: "locations/isLoading",
      getDistricts: "districts/getDistricts",
      loadingDistricts: "districts/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addLocation: "locations/addLocation",
      updateLocation: "locations/updateLocation",
      fetchLocationById: "locations/fetchLocationById",
      fetchDistricts: "districts/fetchDistricts",
      deleteDistrict: "districts/deleteDistrict"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingLocations = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateLocation(this.formData)
      } else {
        await this.addLocation(this.formData)
      }
      this.loadingLocations = false
      this.closeDrawer()
    }
  },
  async mounted() {
    await this.fetchDistricts()
    if (this.editForm) {
      await this.fetchLocationById(this.itemId)
      this.formData.name = this.getCurrentLocation.name
      this.formData.district_id = Number(this.getCurrentLocation.district_id)
      this.formData.note = this.getCurrentLocation.note
    }
  }
}
</script>

<style scoped></style>
