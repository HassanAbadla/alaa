<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-dropdown
      v-model="formData.tprm_inventory_type_id"
      :label="$t('form.inventory_type')"
      :items="getInventoryTypes"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingInventoriesTypes"
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
  name: "TPRMInventoryForm",
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
        // color: "",
        tprm_inventory_type_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getInventories: "tprmInventories/getInventories",
      getCurrentInventory: "tprmInventories/getCurrentInventory",
      loadingInventories: "tprmInventories/isLoading",
      getInventoryTypes: "tprmInventoryTypes/getInventoryTypes",
      loadingInventoriesTypes: "tprmInventoryTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addInventory: "tprmInventories/addInventory",
      updateInventory: "tprmInventories/updateInventory",
      fetchInventoryById: "tprmInventories/fetchInventoryById",
      fetchInventoryTypes: "tprmInventoryTypes/fetchInventoryTypes"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingInventories = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateInventory(this.formData)
      } else {
        await this.addInventory(this.formData)
      }
      this.loadingInventories = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchInventoryTypes()
    if (this.editForm) {
      await this.fetchInventoryById(this.itemId)
      this.formData.name = this.getCurrentInventory.name
      this.formData.note = this.getCurrentInventory.note
      this.formData.code = this.getCurrentInventory.code
      // this.formData.color = this.getCurrentInventory.color
      this.formData.tprm_inventory_type_id = this.getCurrentInventory.inventory_type.id
    }
  }
}
</script>

<style scoped></style>
