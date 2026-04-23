<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <v-menu
      v-if="itemPath === 'statuses'"
      bottom
      origin="center center"
      transition="scale-transition"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="color_field">
          <p class="my-0">Color:</p>
          <p class="mx-2 my-0">{{ formData.color || "" }}</p>
          <div :style="swatchStyle" v-bind="attrs" v-on="on"></div>
        </div>
      </template>
      <v-card>
        <v-card-text>
          <v-color-picker
            value="#1976D2"
            v-model="formData.color"
            mode="hexa"
            hide-sliders
            show-swatches
            class="mx-auto"
          ></v-color-picker>
        </v-card-text>
      </v-card>
    </v-menu>
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "LookupForm",
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
        name: {
          en: "",
          ar: ""
        },
        note: "",
        code: "",
        color: ""
      },
      loading: false,
      selectedColor: "#1976D2",
      showPicker: false
    }
  },
  methods: {
    ...mapActions("assetsTypes", ["addAssetType", "getAssetsType", "fetchAssetsType", "updateAssetType"]),
    ...mapActions("assetCriticalities", [
      "createCriticality",
      "fetchCriticalities",
      "updateCriticality",
      "getAssetsCriticalities"
    ]),
    ...mapActions("assetsCategories", [
      "addAssetCategories",
      "getAssetsCategories",
      "fetchCategories",
      "updateAssetCategories"
    ]),
    ...mapActions("assetsStatuses", [
      "addAssetStatus",
      "getAssetsStatuses",
      "fetchAssetsStatuses",
      "updateAssetStatus"
    ]),
    ...mapActions("positionSettings", [
      "fetchPositionCategories",
      "getPositionCategories",
      "createPositionCategory",
      "updatePositionCategory",
      "fetchPositionLevels",
      "getPositionLevels",
      "createPositionLevel",
      "updatePositionLevel"
    ]),
    ...mapActions("eduSystems", ["fetchEduSystems", "getCrudYearsList", "addEduSystem", "updateEduSystem"]),
    ...mapActions("eduLevels", ["fetchEduLevels", "getCrudLevelsList", "addEduLevel", "updateEduLevel"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      if (this.editForm) {
        switch (this.itemPath) {
          case "types":
            await this.updateAssetType({ id: this.itemId, payload: this.formData })
            await this.fetchAssetsType()
            break
          case "categories":
            await this.updateAssetCategories({ id: this.itemId, payload: this.formData })
            await this.fetchCategories()
            break
          case "statuses":
            await this.updateAssetStatus({ id: this.itemId, payload: this.formData })
            await this.fetchAssetsStatuses()
            break
          case "criticalities":
            await this.updateCriticality({ id: this.itemId, payload: this.formData })
            await this.fetchCriticalities()
            break
          case "position-categories":
            await this.updatePositionCategory({ id: this.itemId, payload: this.formData })
            await this.fetchPositionCategories()
            break
          case "position-levels":
            await this.updatePositionLevel({ id: this.itemId, payload: this.formData })
            await this.fetchPositionLevels()
            break
          case "edu-systems":
            await this.updateEduSystem({ id: this.itemId, payload: this.formData })
            await this.fetchEduSystems()
            break
          case "edu-levels":
            await this.updateEduLevel({ id: this.itemId, payload: this.formData })
            await this.fetchEduLevels()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
      } else {
        switch (this.itemPath) {
          case "types":
            await this.addAssetType(this.formData)
            await this.fetchAssetsType()
            break
          case "categories":
            await this.addAssetCategories(this.formData)
            await this.fetchCategories()
            break
          case "statuses":
            await this.addAssetStatus(this.formData)
            await this.fetchAssetsStatuses()
            break

          case "criticalities":
            await this.createCriticality(this.formData)
            await this.fetchCriticalities()
            break
          case "position-categories":
            await this.createPositionCategory(this.formData)
            await this.fetchPositionCategories()
            break
          case "position-levels":
            await this.createPositionLevel(this.formData)
            await this.fetchPositionLevels()
            break
          case "edu-systems":
            await this.addEduSystem(this.formData)
            await this.fetchEduSystems()
            break
          case "edu-levels":
            await this.addEduLevel(this.formData)
            await this.fetchEduLevels()
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
          case "types":
            await this.getAssetsType()
            break
          case "categories":
            await this.getAssetsCategories()
            break
          case "statuses":
            await this.getAssetsStatuses()
            break
          case "position-categories":
            await this.getPositionCategories()
            break
          case "position-levels":
            await this.getPositionLevels()
            break
          case "criticalities":
            await this.getAssetsCriticalities()
            break
          case "edu-systems":
            await this.getCrudYearsList()
            break
          case "edu-levels":
            await this.getCrudLevelsList()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
        this.formData.name.en = this.item.name?.en || ""
        this.formData.name.ar = this.item.name?.ar || ""
        this.formData.code = this.item.code
        this.formData.note = this.item.note
        this.formData.color = this.item.color || ""
      }
    }
  },
  computed: {
    ...mapState("assetsTypes", ["crudTypesList"]),
    ...mapState("assetsCategories", ["categoriesCrudList"]),
    ...mapState("assetsStatuses", ["crudStatusesList"]),
    ...mapState("assetCriticalities", ["crudCriticalities"]),
    ...mapState("positionSettings", ["crudCategories", "crudLevels"]),
    ...mapState("eduSystems", ["crudSystemsList"]),
    ...mapState("eduLevels", ["crudLevelList"]),
    item() {
      switch (this.itemPath) {
        case "types":
          return this.crudTypesList.find((item) => item.id === this.itemId)
        case "categories":
          return this.categoriesCrudList.find((item) => item.id === this.itemId)
        case "statuses":
          return this.crudStatusesList.find((item) => item.id === this.itemId)
        case "criticalities":
          return this.crudCriticalities.find((item) => item.id === this.itemId)
        case "position-categories":
          return this.crudCategories.find((item) => item.id === this.itemId)
        case "position-levels":
          return this.crudLevels.find((item) => item.id === this.itemId)
        case "edu-systems":
          return this.crudSystemsList.find((item) => item.id === this.itemId)
        case "edu-levels":
          return this.crudLevelList.find((item) => item.id === this.itemId)
        default:
          return null
      }
    },
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
  async mounted() {
    await this.loadLookup()
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
