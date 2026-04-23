<template>
  <v-container class="py-8">
    <custom-input v-model="formData.a2student_title" :label="$t('form.title')" :required="true" />
    <custom-TextArea v-model="formData.a2student_description" :label="$t('form.description')" :required="false" />
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
  name: "EduAssignToStudentForm",
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
        a2student_title: "",
        a2student_description: "",
        ed_stories_id: null,
        user_id: null
      },
      loading: false
    }
  },
  methods: {
    ...mapActions("eduAssignedToStudent", ["addStudentAsigned", "fetchStudentAssigned", "updateStudentAsigned"]),
    ...mapActions("stories", ["fetchStories"]),
    ...mapActions("eduStudents", ["fetchStudents"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      if (this.editForm) {
        await this.updateStudentAsigned({ id: this.itemId, payload: this.formData })
        await this.fetchStudentAssigned()
      } else {
        await this.addStudentAsigned(this.formData)
        await this.fetchStudentAssigned()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      await this.fetchStories()
      await this.fetchStudents()
      if (this.editForm) {
        this.formData.a2student_title = this.item.title
        this.formData.a2student_description = this.item.description
        this.formData.ed_stories_id = this.item.story.id
        this.formData.user_id = this.item.student.id
      }
    }
  },
  computed: {
    ...mapState("eduAssignedToStudent", ["assignedToStudentList"]),
    ...mapState("stories", ["stories"]),
    ...mapState("eduStudents", ["studentsList"]),
    item() {
      return this.assignedToStudentList.find((item) => item.id === this.itemId)
    },
    students() {
      return this.studentsList.map((student) => ({
        id: student.id,
        name: student.full_name
      }))
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
