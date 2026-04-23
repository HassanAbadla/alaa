<template>
  <v-container class="py-8">
    <custom-input v-model="formData.syear_title" :label="$t('form.title')" :required="true" />
    <custom-TextArea v-model="formData.syear_description" :label="$t('form.description')" :required="false" />

    <custom-dropdown
      :items="classes"
      item-value="id"
      item-text="name"
      :label="$t('form.class')"
      v-model="formData.ed_class_id"
      :required="true"
      :disabled="false"
      class="w-100"
    />
    <custom-dropdown
      :items="students"
      item-value="id"
      item-text="name"
      :label="$t('form.student')"
      v-model="formData.user_id"
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
  name: "EduStudentYearForm",
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
        syear_title: "",
        syear_description: "",
        // syear_code: "",
        ed_class_id: null,
        user_id: null
      },
      loading: false,
      userTypes: []
    }
  },
  methods: {
    ...mapActions("eduStudentYear", ["addStudentYear", "fetchStudentYears", "updateStudentyear"]),
    ...mapActions("eduStudents", ["fetchStudents"]),
    ...mapActions("eduClasses", ["fetchEduClasses"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.syear_title.slice(0, 3).toLowerCase()
      this.formData.syear_code = computedCode
      if (this.editForm) {
        await this.updateStudentyear({ id: this.itemId, payload: this.formData })
        await this.fetchStudentYears()
      } else {
        await this.addStudentYear(this.formData)
        await this.fetchStudentYears()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      this.loading = true
      await this.fetchEduClasses()
      await this.fetchStudents()
      if (this.editForm) {
        this.formData.syear_title = this.item.title
        this.formData.syear_description = this.item.description
        this.formData.syear_code = this.item.code
        this.formData.ed_class_id = this.item.class.id
        this.formData.user_id = this.item.student.id
      }
      this.loading = false
    }
  },
  computed: {
    ...mapState("eduStudentYear", ["studentYearsList"]),
    ...mapState("eduStudents", ["studentsList"]),
    ...mapState("eduClasses", ["classesList"]),
    item() {
      return this.studentYearsList.find((item) => item.id === this.itemId)
    },
    students() {
      return this.studentsList.map((student) => ({
        id: student.id,
        name: student.full_name
      }))
    },
    classes() {
      return this.classesList.map((edclass) => ({
        id: edclass.id,
        name: edclass.title
      }))
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
