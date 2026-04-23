<template>
  <v-container class="py-8">
    <custom-input v-model="formData.a2class_title" :label="$t('form.title')" :required="true" />
    <custom-TextArea v-model="formData.a2class_description" :label="$t('form.description')" :required="false" />
    <custom-dropdown
      :items="classesList"
      item-value="id"
      item-text="title"
      :label="$t('form.class')"
      v-model="formData.ed_class_id"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <custom-dropdown
      :items="stories"
      item-value="id"
      item-text="title"
      :label="$t('form.story')"
      v-model="formData.ed_stories_id"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "EduAssignToClassForm",
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
        a2class_title: "",
        a2class_description: "",
        ed_stories_id: null,
        ed_class_id: null
      },
      loading: false
    }
  },
  methods: {
    ...mapActions("eduAssignedToClasses", ["addClassAsigned", "fetchClassAssigned", "updateClassAsigned"]),
    ...mapActions("stories", ["fetchStories"]),
    ...mapActions("eduClasses", ["fetchEduClasses"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      if (this.editForm) {
        await this.updateClassAsigned({ id: this.itemId, payload: this.formData })
        await this.fetchClassAssigned()
      } else {
        await this.addClassAsigned(this.formData)
        await this.fetchClassAssigned()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      await this.fetchStories()
      await this.fetchEduClasses()
      if (this.editForm) {
        this.formData.a2class_title = this.item.title
        this.formData.a2class_description = this.item.description
        this.formData.ed_stories_id = this.item.story.id
        this.formData.ed_class_id = this.item.class.id
      }
    }
  },
  computed: {
    ...mapState("eduAssignedToClasses", ["assignedToClassList"]),
    ...mapState("stories", ["stories"]),
    ...mapState("eduClasses", ["classesList"]),
    item() {
      return this.assignedToClassList.find((item) => item.id === this.itemId)
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
