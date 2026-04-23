<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"
export default {
  name: "TPRMAttachmentTypeForm",
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
        code: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentAttachmentType: "tprmAttachmentTypes/getCurrentAttachmentType",
      loadingAttachmentTypes: "tprmAttachmentTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addAttachmentType: "tprmAttachmentTypes/addAttachmentType",
      updateAttachmentType: "tprmAttachmentTypes/updateAttachmentType",
      fetchAttachmentTypeById: "tprmAttachmentTypes/fetchAttachmentTypeById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingAttachmentTypes = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateAttachmentType(this.formData)
      } else {
        await this.addAttachmentType(this.formData)
      }
      this.loadingAttachmentTypes = false

      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchAttachmentTypeById(this.itemId)
      this.formData.name = this.getCurrentAttachmentType.name
      this.formData.code = this.getCurrentAttachmentType.code
    }
  }
}
</script>

<style scoped></style>
