<template>
  <v-container>
    <v-card v-if="!showAssignTaskForm" flat class="px-4">
      <v-card-text>
        <v-icon color="warning" large class="mx-2">mdi-alert-circle-outline</v-icon>
        {{ $t("form.assign_task_to_action") }}
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center">
        <v-btn @click="assignTask" color="primary" class="w-50">{{ $t("page.yes") }}</v-btn>
        <v-btn @click="cancelTask" text class="w-50">{{ $t("cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="showAssignTaskForm" flat class="pa-4">
      <form-wrapper
        @submit="handleSubmit"
        :loading="loading"
        :submitText="editForm ? $t('page.update') : $t('form.add')"
      >
        <custom-input
          v-model="formData.title"
          :label="$t('form.title')"
          :required="true"
          :error-messages="errors.title"
          :error="!!errors.title"
        />
        <custom-input
          type="date"
          v-model="formData.start_date"
          :label="$t('form.start_date')"
          :required="true"
          :error-messages="errors.start_date"
          :error="!!errors.start_date"
        />
        <custom-input
          type="date"
          v-model="formData.end_date"
          :label="$t('form.end_date')"
          :required="true"
          :error-messages="errors.end_date"
          :error="!!errors.end_date"
        />
        <!-- <custom-input
        type="date"
        v-model="formData.actual_start_date"
        :label="$t('form.actual_start_date')"
        :required="true"
      />
      <custom-input
        type="date"
        v-model="formData.actual_end_date"
        :label="$t('form.actual_end_date')"
        :required="true"
      /> -->
        <custom-dropdown
          :items="getStatuses"
          item-value="id"
          item-text="name"
          :label="$t('form.status')"
          v-model="formData.status_id"
          :required="true"
          class="mx-1"
          :error-messages="errors.status_id"
          :error="!!errors.status_id"
        />
        <custom-TextArea
          v-model="formData.body"
          :label="$t('form.body')"
          :error-messages="errors.body"
          :error="!!errors.body"
          required
        />
      </form-wrapper>
      <!-- <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
        {{ editForm ? $t("page.update") : $t("form.add") }}
      </v-btn> -->
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"
import FormWrapper from "./custom-form/FormWrapper.vue"
export default {
  name: "TPSTaskForm",
  components: { FormWrapper },
  props: {
    item: {
      type: Object,
      required: false
    },
    taskable_type: {
      type: String,
      required: true
    },
    taskable_id: {
      type: Number,
      required: true
    },
    assignedTo: {
      type: Object,
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
        title: "",
        start_date: "",
        end_date: "",
        actual_start_date: "",
        actual_end_date: "",
        body: "",
        status_id: null
      },
      loading: false,
      showAssignTaskForm: false,
      errors: {}
    }
  },
  methods: {
    ...mapActions({
      fetchStatuses: "tpsStatuses/fetchStatuses",
      addTask: "tpsTasks/addTask"
    }),
    validateForm() {
      this.errors = {}
      let isValid = true

      // Title validation
      if (!this.formData.title || this.formData.title.trim() === "") {
        this.errors.title = [this.$t("validation.title_required") || "Title is required"]
        isValid = false
      }

      // Start date validation
      if (!this.formData.start_date) {
        this.errors.start_date = [this.$t("validation.start_date_required") || "Start date is required"]
        isValid = false
      }

      // End date validation
      if (!this.formData.end_date) {
        this.errors.end_date = [this.$t("validation.end_date_required") || "End date is required"]
        isValid = false
      }

      // Date range validation
      if (this.formData.start_date && this.formData.end_date) {
        const startDate = new Date(this.formData.start_date)
        const endDate = new Date(this.formData.end_date)

        if (startDate > endDate) {
          this.errors.end_date = [this.$t("validation.end_date_after_start") || "End date must be after start date"]
          isValid = false
        }
      }

      // Status validation
      if (!this.formData.status_id) {
        this.errors.status_id = [this.$t("validation.status_required") || "Status is required"]
        isValid = false
      }
      // Body validation
      if (!this.formData.body || this.formData.body.trim() === "") {
        this.errors.body = [this.$t("validation.body_required") || "Body is required"]
        isValid = false
      }

      return isValid
    },
    clearErrors() {
      this.errors = {}
    },
    async handleSubmit() {
      this.clearErrors()

      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        const res = await this.addTask({
          ...this.formData,
          taskable_type: this.taskable_type,
          taskable_id: this.item.id || this.taskable_id,
          receiver_id: this.assignedTo.id
        })
        console.log("ADD_TASK_RES", res)
        if (res && res.success) {
          this.resetAssignTaskForm()
          this.$emit("close")
          this.showAssignTaskForm = false
          this.$emit("taskAdded", res.data)
        }
        // reset the form
        // this.formData = {
        //   title: "",
        //   start_date: "",
        //   end_date: "",
        //   actual_start_date: "",
        //   actual_end_date: "",
        //   body: "",
        //   status_id: null
        // }
      } catch (error) {
        // Handle server-side validation errors
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          // Handle other errors
          console.error("Error submitting form:", error)
          // You might want to show a general error message here
        }
      } finally {
        this.loading = false
      }
    },
    assignTask() {
      this.showAssignTaskForm = true
    },
    cancelTask() {
      this.$emit("close")
    },
    resetAssignTaskForm() {
      // this.showAssignTaskForm = false
      this.formData = {
        title: "",
        start_date: "",
        end_date: "",
        actual_start_date: "",
        actual_end_date: "",
        body: "",
        status_id: null
      }
      this.clearErrors()
    }
  },
  computed: {
    ...mapGetters({
      getStatuses: "tpsStatuses/getStatuses"
    })
  },
  watch: {
    // Clear field-specific errors when user starts typing
    "formData.title"() {
      if (this.errors.title) {
        delete this.errors.title
      }
    },
    "formData.start_date"() {
      if (this.errors.start_date) {
        delete this.errors.start_date
      }
    },
    "formData.end_date"() {
      if (this.errors.end_date) {
        delete this.errors.end_date
      }
    },
    "formData.status_id"() {
      if (this.errors.status_id) {
        delete this.errors.status_id
      }
    },
    "formData.body"() {
      if (this.errors.body) {
        delete this.errors.body
      }
    }
  },
  mounted() {
    this.fetchStatuses()
  }
}
</script>
