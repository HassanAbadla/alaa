<template>
  <v-container>
    <v-container class="py-8">
      <custom-input v-model="formData.name.en" :label="$t('form.en_title')" :required="true" />
      <custom-input v-model="formData.name.ar" :label="$t('form.ar_title')" :required="true" />
      <custom-dropdown
        :items="units"
        item-value="id"
        item-text="title"
        :label="$t('form.parent_unit')"
        v-model="formData.parent_id"
        :required="false"
        :disabled="false"
        class="w-100"
      />
      <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
        {{ editForm ? $t("page.update") : $t("form.add") }}
      </v-btn>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "UnitsForm",
  props: {
    itemPath: {
      type: String,
      required: false
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
        parent_id: null,
        position: 1
      },
      loading: false
    }
  },
  methods: {
    ...mapActions("positions", ["fetchUnits", "getCrudUnits", "updateUnit"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      if (this.editForm) {
        await this.updateUnit({ id: this.itemId, payload: this.formData })
        await this.fetchUnits()
      } else {
        await this.$axios.post("user-units/store", this.formData)
        await this.fetchUnits()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      await this.fetchUnits()
      await this.getCrudUnits()
      if (this.editForm) {
        this.formData.name.en = this.item?.name.en || this.item.children[0]?.name.en
        this.formData.name.ar = this.item?.name.ar || this.item.children[0]?.name.ar
        this.formData.name.ar = this.item.name.ar
        this.formData.parent_id = this.item?.parent_id
        this.formData.position = this.item?.position
      }
    }
  },
  computed: {
    ...mapState("positions", ["units", "crudUnits"]),
    // item() {
    //   return this.crudUnits.find((item) => item.id === this.itemId)
    // }
    item() {
      // Recursive function to find item by id
      const findItem = (items, id) => {
        for (const item of items) {
          if (item.id === id) {
            return item
          }
          // If item has children, search recursively
          if (item.children && item.children.length > 0) {
            const found = findItem(item.children, id)
            if (found) {
              return found
            }
          }
        }
        return undefined
      }

      // Start searching from the root level
      return findItem(this.crudUnits, this.itemId)
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
