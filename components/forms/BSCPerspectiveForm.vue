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
import { mapActions, mapState } from "vuex"
import { mapGetters } from "vuex/dist/vuex.common.js"
export default {
  name: "BSCLookupForm",
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
      getPerspectives: "bscPerspectives/getBscPerspectives",
      getCurrentPerspective: "bscPerspectives/getCurrentPerspective"
    })
  },

  methods: {
    ...mapActions({
      addPerspective: "bscPerspectives/addPerspective",
      fetchPerspectives: "bscPerspectives/fetchPerspectives",
      updatePerspective: "bscPerspectives/updatePerspective",
      fetchPerspectiveById: "bscPerspectives/fetchPerspectiveById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loading = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updatePerspective(this.formData)
        this.fetchPerspectives()
      } else {
        await this.addPerspective(this.formData)
        this.fetchPerspectives()
      }
      this.loading = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchPerspectiveById(this.itemId)
      this.formData.name.en = this.getCurrentPerspective.name.en
      this.formData.name.ar = this.getCurrentPerspective.name.ar
      this.formData.note = this.getCurrentPerspective.note
    }
  }
}
</script>
