<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
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
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMInventoryTypesForm",
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
        code: "",
        color: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getInventoryTypes: "tprmInventoryTypes/getInventoryTypes",
      getCurrentInventoryType: "tprmInventoryTypes/getCurrentInventoryType",
      loadingInventoryTypes: "tprmInventoryTypes/isLoading"
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
      addInventoryType: "tprmInventoryTypes/addInventoryType",
      updateInventoryType: "tprmInventoryTypes/updateInventoryType",
      fetchInventoryTypeById: "tprmInventoryTypes/fetchInventoryTypeById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingInventoryTypes = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateInventoryType(this.formData)
      } else {
        await this.addInventoryType(this.formData)
      }
      this.loadingInventoryTypes = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchInventoryTypeById(this.itemId)
      this.formData.name = this.getCurrentInventoryType.name
      this.formData.note = this.getCurrentInventoryType.note
      this.formData.code = this.getCurrentInventoryType.code
      this.formData.color = this.getCurrentInventoryType.color
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
