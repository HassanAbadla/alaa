<template>
  <v-container>
    <v-container class="py-8">
      <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
      <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
      <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
        {{ editForm ? $t("page.update") : $t("form.add") }}
      </v-btn>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "LookupForm1",
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
        note: ""
      },
      loading: false
    }
  },
  methods: {
    ...mapActions("manufacturers", ["createManufacturer", "fetchManufacturers", "updateManufacturer"]),
    ...mapActions("assetsLocations", ["createAssetLocation", "fetchAssetsLocations", "updateAssetLocation"]),
    ...mapActions("eduYears", ["addEduYear", "fetchEduYears", "updateEduYear"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      if (this.editForm) {
        switch (this.itemPath) {
          case "manufacturers":
            await this.updateManufacturer({ id: this.itemId, payload: this.formData })
            await this.fetchManufacturers()
            break
          case "locations":
            await this.updateAssetLocation({ id: this.itemId, payload: this.formData })
            await this.fetchAssetsLocations()
            break
          case "edu-years":
            await this.updateEduYear({ id: this.itemId, payload: this.formData })
            await this.fetchEduYears()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
      } else {
        switch (this.itemPath) {
          case "manufacturers":
            await this.createManufacturer(this.formData)
            await this.fetchManufacturers()
            break
          case "locations":
            await this.createAssetLocation(this.formData)
            await this.fetchAssetsLocations()
            break
          case "edu-years":
            await this.addEduYear(this.formData)
            await this.fetchEduYears()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
      }
      this.closeDrawer()
    },
    async loadLookup() {
      if (this.editForm) {
        switch (this.itemPath) {
          case "manufacturers":
            await this.fetchManufacturers()
            break
          case "locations":
            await this.fetchAssetsLocations()
            break
          case "edu-years":
            await this.fetchEduYears()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
        this.formData.name = this.item.name
        this.formData.code = this.item.code
        this.formData.note = this.item.note
      }
    }
  },
  computed: {
    ...mapState("manufacturers", ["manufacturers"]),
    ...mapState("assetsLocations", ["locationList"]),
    ...mapState("eduYears", ["yearsList"]),
    item() {
      switch (this.itemPath) {
        case "manufacturers":
          return this.manufacturers.find((item) => item.id === this.itemId)
        case "locations":
          return this.locationList.find((item) => item.id === this.itemId)
        case "edu-years":
          return this.yearsList.find((item) => item.id === this.itemId)
        default:
          return null
      }
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
