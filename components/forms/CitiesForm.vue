<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.country_id"
      :label="$t('form.country')"
      :items="countries"
      item-text="name"
      item-value="id"
      :required="true"
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
        country_id: null,
        name: { en: "", ar: "" },
        note: "",
        color: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentCity: "cities/getCurrentCity",
      loadingCities: "cities/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addCity: "cities/addCity",
      updateCity: "cities/updateCity",
      fetchCityById: "cities/fetchCityById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingCities = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateCity(this.formData)
      } else {
        await this.addCity(this.formData)
      }
      this.loadingCities = false
      this.closeDrawer()
    }
  },
  async mounted() {
    await this.$axios.get("countries").then((response) => {
      this.countries = response.data.data
    })
    if (this.editForm) {
      await this.fetchCityById(this.itemId)
      this.formData.name.en = this.getCurrentCity.name.en
      this.formData.name.ar = this.getCurrentCity.name.ar
      this.formData.country_id = Number(this.getCurrentCity.country_id)
      this.formData.note = this.getCurrentCity.note
    }
  }
}
</script>

<style scoped></style>
