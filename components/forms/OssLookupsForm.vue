<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <v-menu bottom origin="center center" transition="scale-transition" :close-on-content-click="false">
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
  name: "OssLookupForm",
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
        code: "",
        note: "",
        color: ""
      },
      loading: false,
      selectedColor: "#1976D2",
      showPicker: false
    }
  },
  methods: {
    ...mapActions("ossLookups", [
      "createType",
      "getTypes",
      "getCrudTypes",
      "updateType",

      "getCategories",
      "getCrudCategories",
      "createCategory",
      "updateCategory",

      "getPriorities",
      "getCrudPriorities",
      "createPriority",
      "updatePriority"
    ]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      if (this.editForm) {
        switch (this.itemPath) {
          case "types":
            await this.updateType({ id: this.itemId, payload: this.formData })
            await this.getTypes()
            break
          case "categories":
            await this.updateCategory({ id: this.itemId, payload: this.formData })
            await this.getCategories()
            break
          case "priorities":
            await this.updatePriority({ id: this.itemId, payload: this.formData })
            await this.getPriorities()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
      } else {
        switch (this.itemPath) {
          case "types":
            await this.createType(this.formData)
            await this.getTypes()
            break
          case "categories":
            await this.createCategory(this.formData)
            await this.getCategories()
            break
          case "priorities":
            await this.createPriority(this.formData)
            await this.getPriorities()
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
            await this.getCrudTypes()
            break
          case "categories":
            await this.getCrudCategories()
            break
          case "priorities":
            await this.getCrudPriorities()
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
    ...mapState("ossLookups", ["CrudTypes", "CrudCategories", "CrudPriorities"]),
    item() {
      switch (this.itemPath) {
        case "types":
          return this.CrudTypes.find((item) => item.id === this.itemId)
        case "categories":
          return this.CrudCategories.find((item) => item.id === this.itemId)
        case "priorities":
          return this.CrudPriorities.find((item) => item.id === this.itemId)
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
