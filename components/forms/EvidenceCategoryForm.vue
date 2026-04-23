<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
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
  name: "EvidenceCategoryForm",
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
        color: ""
      },
      loading: false,
      selectedColor: "#1976D2",
      showPicker: false
    }
  },
  methods: {
    ...mapActions("auditSettings", ["getCategories", "getCrudCategories", "createCategory", "updateCategory"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      if (this.editForm) {
        switch (this.itemPath) {
          case "categories":
            await this.updateCategory({ id: this.itemId, payload: this.formData })
            await this.getCategories()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
      } else {
        switch (this.itemPath) {
          case "categories":
            await this.createCategory(this.formData)
            await this.getCategories()
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
          case "categories":
            await this.getCrudCategories()
            break
          default:
            console.error("Invalid itemPath prop:", this.itemPath)
        }
        this.formData.name = this.item.name || ""
        this.formData.code = this.item.code
        this.formData.note = this.item.note
        this.formData.color = this.item.color || ""
      }
    }
  },
  computed: {
    ...mapState("auditSettings", ["CrudCategories"]),
    item() {
      switch (this.itemPath) {
        case "categories":
          return this.CrudCategories.find((item) => item.id === this.itemId)
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
