<template>
  <v-container class="py-8">
    <custom-input v-model="formData.class_title" :label="$t('form.title')" :required="true" />
    <custom-TextArea v-model="formData.class_description" :label="$t('form.description')" :required="false" />
    <custom-input v-model="formData.section" :label="$t('form.section')" :required="false" />
    <custom-dropdown
      :items="gradesList"
      item-value="id"
      item-text="grade_title"
      :label="$t('form.grade')"
      v-model="formData.ed_grade_id"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <custom-dropdown
      :items="yearsList"
      item-value="id"
      item-text="name"
      :label="$t('form.year')"
      v-model="formData.ed_year_id"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <v-switch v-model="formData.active" :label="$t('form.active')" color="primary" class="mt-4"></v-switch>

    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  name: "EduClassesForm",
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
        class_title: "",
        class_description: "",
        ed_year_id: null,
        ed_grade_id: null,
        section: "",
        active: true
      },
      loading: false
    }
  },
  methods: {
    ...mapActions("eduClasses", ["addEduClass", "fetchEduClasses", "updateEduClass"]),
    ...mapActions("eduGrades", ["fetchEduGrades"]),
    ...mapActions("eduYears", ["fetchEduYears"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.class_title.slice(0, 3).toLowerCase()
      this.formData.class_code = computedCode
      if (this.editForm) {
        await this.updateEduClass({ id: this.itemId, payload: this.formData })
        await this.fetchEduClasses()
      } else {
        await this.addEduClass(this.formData)
        await this.fetchEduClasses()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      await this.fetchEduGrades()
      await this.fetchEduYears()
      if (this.editForm) {
        this.formData.class_title = this.item.title
        this.formData.class_description = this.item.description
        this.formData.class_code = this.item.code
        this.formData.ed_year_id = this.item.year.id
        this.formData.ed_grade_id = this.item.grade.id
        this.formData.section = this.item.section || ""
        this.formData.active = this.item.active !== undefined ? this.item.active : true
        // this.formData.note = this.item.note
      }
    }
  },
  computed: {
    ...mapState("eduClasses", ["classesList"]),
    ...mapState("eduGrades", ["gradesList"]),
    ...mapState("eduYears", ["yearsList"]),
    item() {
      return this.classesList.find((item) => item.id === this.itemId)
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
