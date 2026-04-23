<template>
  <form-wrapper :submitText="$t('form.save')" :loading="isLoading" @submit="handleSubmit">
    <custom-input v-model="formData.name" :label="$t('name')" :required="true" />
    <custom-dropdown
      :items="workspaces"
      item-value="id"
      item-text="name"
      :label="$t('form.parent_category')"
      v-model="formData.parent_id"
      :required="false"
      :disabled="false"
    />
  </form-wrapper>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "EduCategoryForm",

  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    item: { type: Object, default: null },
    itemId: { type: Number }
  },

  data() {
    return {
      isLoading: false,
      formData: {
        name: "",
        slug: "",
        parent_id: null,
        order: 1
      },
      loading: false
    }
  },

  computed: {
    ...mapState("settings", ["categories"]),
    ...mapState("workspace", ["workspaces"]),

    categoriesList() {
      return this.categories
    },
    item() {
      return this.categoriesList.find((item) => item.id === this.itemId)
    }
  },
  methods: {
    ...mapActions("settings", ["getCategories", "addCategory", "updateCategory", "deleteCategory"]),
    ...mapActions("workspace", ["fetchWorkspaces"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),

    async handleSubmit() {
      this.formData.slug = this.formData.name.substring(0, 3).toLowerCase()
      this.isLoading = true
      if (this.editForm) {
        await this.updateCategory({ id: this.itemId, payload: this.formData })
      } else {
        await this.addCategory(this.formData)
      }
      this.isLoading = false
      this.closeDrawer()
      // this.$emit("submit")
    },
    async fetchLookupData() {
      this.loading = true
      await this.getCategories()
      await this.fetchWorkspaces()
      if (this.editForm) {
        this.formData.name = this.item.name
        this.formData.parent_id = this.item.parent_id
      }
      this.loading = false
    }
  },
  async mounted() {
    await this.fetchLookupData()
  }
}
</script>

<style></style>
