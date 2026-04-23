<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />

    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvConsumedTypesForm",
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
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentConsumedType: "srvConsumedTypes/getCurrentConsumedType",
      loafingConsumedTypes: "srvConsumedTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addConsumedType: "srvConsumedTypes/addConsumedType",
      updateConsumedType: "srvConsumedTypes/updateConsumedType",
      fetchConsumedTypeById: "srvConsumedTypes/fetchConsumedTypeById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loafingConsumedTypes = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateConsumedType(this.formData)
      } else {
        await this.addConsumedType(this.formData)
      }
      this.loafingConsumedTypes = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchConsumedTypeById(this.itemId)
      this.formData.name = this.getCurrentConsumedType.name
      this.formData.note = this.getCurrentConsumedType.note
    }
  }
}
</script>

<style scoped></style>
