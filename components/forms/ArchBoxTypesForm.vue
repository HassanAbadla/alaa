<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name.en" :label="$t('form.en_name')" :required="true" />
    <custom-input v-model="formData.name.ar" :label="$t('form.ar_name')" :required="true" />
    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "ArchBoxTypesForm",
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
        name: { en: "", ar: "" },
        note: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentBoxType: "archBoxTypes/getCurrentBoxType",
      loadBoxTypes: "archBoxTypes/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addBoxType: "archBoxTypes/addBoxType",
      updateBoxType: "archBoxTypes/updateBoxType",
      fetchBoxTypeById: "archBoxTypes/fetchBoxTypeById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadBoxTypes = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateBoxType(this.formData)
      } else {
        await this.addBoxType(this.formData)
      }
      this.loadBoxTypes = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchBoxTypeById(this.itemId)
      this.formData.name.en = this.getCurrentBoxType.name.en
      this.formData.name.ar = this.getCurrentBoxType.name.ar
      this.formData.note = this.getCurrentBoxType.note
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
