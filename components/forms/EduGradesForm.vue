<template>
  <v-container class="py-8">
    <custom-input v-model="formData.grade_title" :label="$t('form.title')" :required="true" />
    <custom-TextArea v-model="formData.grade_description" :label="$t('form.notes')" :required="false" />
    <custom-dropdown
      :items="systemsList"
      item-value="id"
      item-text="name"
      :label="$t('form.system')"
      v-model="formData.ed_system_id"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <custom-dropdown
      :items="levelsList"
      item-value="id"
      item-text="name"
      :label="$t('form.level')"
      v-model="formData.ed_level_id"
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
  name: "EduGradesForm",
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
        grade_title: "",
        grade_description: "",
        ed_system_id: null,
        ed_level_id: null
      },
      loading: false
    }
  },
  methods: {
    ...mapActions("eduGrades", ["addEduGrade", "fetchEduGrades", "updateEduGrade"]),
    ...mapActions("eduSystems", ["fetchEduSystems"]),
    ...mapActions("eduLevels", ["fetchEduLevels"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.grade_title.slice(0, 3).toLowerCase()
      this.formData.grade_code = computedCode
      if (this.editForm) {
        await this.updateEduGrade({ id: this.itemId, payload: this.formData })
        await this.fetchEduGrades()
      } else {
        await this.addEduGrade(this.formData)
        await this.fetchEduGrades()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      await this.fetchEduSystems()
      await this.fetchEduLevels()
      if (this.editForm) {
        this.formData.grade_title = this.item.grade_title
        this.formData.grade_description = this.item.grade_description
        this.formData.grade_code = this.item.grade_code
        this.formData.ed_system_id = this.item.grade_system.id
        this.formData.ed_level_id = this.item.grade_level.id
        // this.formData.note = this.item.note
      }
    }
  },
  computed: {
    ...mapState("eduGrades", ["gradesList"]),
    ...mapState("eduSystems", ["systemsList"]),
    ...mapState("eduLevels", ["levelsList"]),
    item() {
      return this.gradesList.find((item) => item.id === this.itemId)
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
