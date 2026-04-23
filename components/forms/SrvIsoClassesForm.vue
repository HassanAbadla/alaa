<template>
  <v-container class="py-8">
    <custom-input v-model="formData.class_name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.class_short_name" :label="$t('form.code')" :required="true" />
    <custom-input v-model="formData.class_number" :label="$t('form.number')" :type="'number'" :required="true" />
    <!-- <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvIsoClassesForm",
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
        class_name: "",
        class_short_name: "",
        class_number: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentClass: "srvIsoClasses/getCurrentClass",
      loadingClasses: "srvIsoClasses/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addClass: "srvIsoClasses/addClass",
      updateClass: "srvIsoClasses/updateClass",
      fetchClassById: "srvIsoClasses/fetchClassById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingClasses = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateClass(this.formData)
      } else {
        await this.addClass(this.formData)
      }
      this.loadingClasses = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchClassById(this.itemId)
      this.formData.class_name = this.getCurrentClass.class_name
      this.formData.class_short_name = this.getCurrentClass.class_short_name
      this.formData.class_number = this.getCurrentClass.class_number
    }
  }
}
</script>

<style scoped></style>
