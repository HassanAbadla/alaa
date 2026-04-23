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
  name: "SrvVisitStatusesForm",
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
      getCurrentResultStatus: "srvResultStatuses/getCurrentResultStatus",
      loadingResultStatuses: "srvResultStatuses/isLoading"
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
      addResultStatus: "srvResultStatuses/addResultStatus",
      updateResultStatus: "srvResultStatuses/updateResultStatus",
      fetchResultStatusById: "srvResultStatuses/fetchResultStatusById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      this.loadingResultStatuses = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateResultStatus(this.formData)
      } else {
        await this.addResultStatus(this.formData)
      }
      this.loadingResultStatuses = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchResultStatusById(this.itemId)
      this.formData.name = this.getCurrentResultStatus.name
      this.formData.note = this.getCurrentResultStatus.note
      this.formData.color = this.getCurrentResultStatus.color || "#1976D2"
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
