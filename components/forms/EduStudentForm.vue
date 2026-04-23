<template>
  <v-container class="py-8">
    <custom-input v-model="formData.first_name" :label="$t('form.first_name')" :required="true" />
    <custom-input v-model="formData.last_name" :label="$t('form.title')" :required="true" />
    <custom-input v-model="formData.student_title" :label="$t('form.title')" :required="true" />
    <custom-TextArea v-model="formData.student_description" :label="$t('form.description')" :required="false" />
    <custom-input v-model="formData.birth_date" :label="$t('form.birth_date')" :required="true" :type="'date'" />

    <custom-dropdown
      :items="userTypesList"
      item-value="id"
      item-text="name"
      :label="$t('form.user_type')"
      v-model="formData.ed_userType_id"
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
import { getUserTypes } from "../../api/oss-api"
export default {
  name: "EduStudentForm",
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
        first_name: "",
        last_name: "",
        student_title: "",
        student_description: "",
        student_code: "",
        ed_userType_id: null,
        birth_date: null,
        avatar: ""
      },
      loading: false,
      userTypes: []
    }
  },
  methods: {
    ...mapActions("eduStudents", ["addStudent", "fetchStudents", "updateStudent"]),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.student_title.slice(0, 3).toLowerCase()
      this.formData.student_code = computedCode
      if (this.editForm) {
        await this.updateStudent({ id: this.itemId, payload: this.formData })
        await this.fetchStudents()
      } else {
        await this.addStudent(this.formData)
        await this.fetchStudents()
      }
      this.closeDrawer()
    },
    async loadLookup() {
      const {
        data: { data }
      } = await getUserTypes(this.$axios)
      this.userTypes = data

      if (this.editForm) {
        this.formData.first_name = this.item.first_name
        this.formData.last_name = this.item.last_name
        this.formData.student_title = this.item.title
        this.formData.student_description = this.item.description
        this.formData.birth_date = this.item.birth_date
        this.formData.ed_userType_id = this.item.type.id
        this.formData.student_code = this.item.code
        this.formData.avatar = this.item.avatar
      }
    }
    // async fetchUserTypes() {
    //   try {
    //     const {
    //       data: { data }
    //     } = await getUserTypes(this.$axios)
    //     this.userTypes = data
    //   } catch (error) {
    //     console.error("Error fetching user types:", error)
    //   }
    // }
  },
  computed: {
    ...mapState("eduStudents", ["studentsList"]),
    item() {
      return this.studentsList.find((item) => item.id === this.itemId)
    },
    userTypesList() {
      return this.userTypes.map((userType) => ({
        id: userType.id,
        name: userType.title[this.$store.state.language]
      }))
    }
  },
  async mounted() {
    await this.loadLookup()
  }
}
</script>
