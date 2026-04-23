<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TPRMOutsourceTypesForm",
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
        code: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentOutsourceType: "tprmOutsourceTypes/getCurrentOutsourceType",
      loadingOutsourceTypes: "tprmOutsourceTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addOutsourceType: "tprmOutsourceTypes/addOutsourceType",
      updateOutsourceType: "tprmOutsourceTypes/updateOutsourceType",
      fetchOutsourceTypeById: "tprmOutsourceTypes/fetchOutsourceTypeById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingOutsourceTypes = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateOutsourceType(this.formData)
      } else {
        await this.addOutsourceType(this.formData)
      }
      this.loadingOutsourceTypes = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchOutsourceTypeById(this.itemId)
      this.formData.name = this.getCurrentOutsourceType.name
      this.formData.note = this.getCurrentOutsourceType.note
      this.formData.code = this.getCurrentOutsourceType.code
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
