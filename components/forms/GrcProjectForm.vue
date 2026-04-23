<template>
  <v-container class="py-8">
    <custom-input
      v-model="formData.name"
      :label="$t('form.name')"
      :required="true"
      :errors="errors.name"
      @clear-errors="clearError('name')"
    />
    <custom-input
      v-model="formData.short_name"
      :label="$t('form.code')"
      :required="true"
      :errors="errors.short_name"
      @clear-errors="clearError('short_name')"
    />

    <v-btn @click="handleSubmit" :loading="isSubmitting" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "GrcProjectForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    return {
      formData: {
        name: "",
        short_name: "",
        title: "Place Holder"
      },
      errors: {},
      isSubmitting: false,
      loading: false
    }
  },

  computed: {
    ...mapState("projectsList", ["projects"])
  },

  methods: {
    ...mapActions("projectsList", ["addProject", "updateProject", "fetchProjects"]),
    ...mapActions("drawer", ["closeDrawer"]),

    clearError(field) {
      if (this.errors[field]) {
        this.errors[field] = []
      }
    },

    async handleSubmit() {
      this.isSubmitting = true
      this.errors = {}

      try {
        if (this.editForm) {
          await this.updateProject({ id: this.itemId, ...this.formData })
        } else {
          await this.addProject(this.formData)
        }
        await this.fetchProjects()
        this.closeDrawer()
      } catch (error) {
        if (error?.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else if (error?.response?.data?.message) {
          this.$toast?.error(error.response.data.message)
        }
      } finally {
        this.isSubmitting = false
      }
    },

    loadItemData() {
      if (this.editForm && this.itemId) {
        const item = this.projects.find((p) => p.id === this.itemId)
        if (item) {
          this.formData.name = item.name || ""
          this.formData.short_name = item.short_name || ""
        }
      }
    }
  },

  async mounted() {
    if (this.editForm) {
      this.loading = true
      await this.fetchProjects()
      this.loadItemData()
      this.loading = false
    }
  }
}
</script>
