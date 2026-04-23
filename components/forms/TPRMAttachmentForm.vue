<template>
  <div class="">
    <!-- <div class="d-flex align-center mb-4">
      <h3>{{ isEditing ? "Edit Attachment" : "Add New Attachment" }}</h3>
    </div> -->

    <!-- <form-wrapper
      :loading="saving"
      :title="isEditing ? $t('form.edit_attachment') : $t('form.add_attachment')"
      :width="600"
      @submit="handleSubmit"
    > -->
    <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
      <v-card flat class="pa-4">
        <v-card-text>
          <!-- File Upload Section -->
          <div v-if="!isEditing" class="mb-4">
            <v-file-input
              v-model="form.file"
              :rules="fileRules"
              label="Select file"
              prepend-icon="mdi-paperclip"
              show-size
              @change="onFileChange"
              outlined
              dense
            ></v-file-input>
          </div>

          <!-- File Preview for Editing -->
          <div v-if="isEditing && form.name" class="mb-4">
            <v-list-item class="pa-0">
              <div class="mx-4">
                <FilePreview :file="attachment" />
                <!-- <v-icon :color="getFileIconColor(form.type)">
                  {{ getFileIcon(form.type) }}
                </v-icon> -->
              </div>
              <v-list-item-content>
                <v-list-item-title>{{ form.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ (attachment.size * 1024).toFixed(2) }} KB</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>

          <!-- Form Fields -->
          <!-- <v-text-field
            v-model="form.name"
            :rules="nameRules"
            label="Display Name"
            outlined
            dense
            required
          ></v-text-field> -->
          <custom-dropdown
            v-model="form.tprm_attachment_type_id"
            :items="getAttachmentTypes"
            :label="$t('form.type')"
            item-text="name"
            item-value="id"
            :loading="loadingAttachmentTypes"
            :required="true"
          />
          <custom-date-picker v-model="form.retention_date" required :label="$t('table.retention_date')" class="mb-4" />
          <custom-date-picker v-model="form.valid_until" required :label="$t('table.valid_until')" class="mb-4" />
          <custom-checkbox v-model="form.valid" :label="$t('table.valid')" class="mb-4" />
          <v-textarea v-model="form.notes" :label="$t('table.notes')" outlined dense rows="3"></v-textarea>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <!-- <v-btn text @click="$emit('cancel')">Cancel</v-btn> -->
          <v-btn block color="primary" type="submit" :disabled="!formValid" :loading="saving">
            {{ isEditing ? "Update" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <!-- </form-wrapper> -->
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
import FilePreview from "../FilePreview.vue"
export default {
  name: "AttachmentForm",
  components: { FilePreview },
  props: {
    attachment: {
      type: Object,
      default: null
    },
    thirdPartyId: {
      type: [Number, String],
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValid: false,
      saving: false,
      form: {
        file: null,
        name: "",
        notes: "",
        tprm_attachment_type_id: null,
        third_party_id: this.thirdPartyId,
        valid: true,
        valid_until: "",
        retention_date: ""
      },
      fileRules: [
        (v) => !!v || "File is required",
        (v) => !v || v.size < 10000000 || "File size should be less than 10 MB"
      ]
    }
  },

  // watch: {
  //   attachment: {
  //     immediate: true,
  //     handler(newVal) {
  //       if (newVal) {
  //         this.form = { ...newVal }
  //       } else {
  //         this.resetForm()
  //       }
  //     }
  //   }
  // },

  computed: {
    ...mapGetters({
      getAttachmentTypes: "tprmAttachmentTypes/getAttachmentTypes",
      loadingAttachmentTypes: "tprmAttachmentTypes/isLoading",
      getCurrentAttachment: "tprmAttachments/getCurrentAttachment"
    })
  },
  methods: {
    ...mapActions({
      addAttachment: "tprmAttachments/addAttachment",
      updateAttachment: "tprmAttachments/updateAttachment",
      fetchAttachmentById: "tprmAttachments/fetchAttachmentById",
      deleteAttachment: "tprmAttachments/deleteAttachment",
      fetchAttachmentTypes: "tprmAttachmentTypes/fetchAttachmentTypes"
    }),

    ...mapMutations({
      incrementAttachmentCount: "tprmThirdParties/ADD_TPRM_ATTACHMENT"
    }),
    ...mapActions("drawer", ["openDrawer", "closeDrawer"]),
    resetForm() {
      this.form = {
        file: null,
        name: "",
        notes: "",
        tprm_attachment_type_id: null,
        third_party_id: this.thirdPartyId,
        valid: true,
        valid_until: "",
        retention_date: ""
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },

    onFileChange(file) {
      if (file) {
        this.form.file = file
        // this.form.name = file.name
        this.form.name = file.name.replace(/\.[^/.]+$/, "") // Remove extension for display name
        // this.form.type = file.name.split(".").pop()
        // this.form.size = file.size

        // Auto-categorize based on file type
        // this.autoCategorize(this.form.type)
      }
    },
    async handleSubmit() {
      if (!this.formValid) {
        console.log("Form is invalid")

        return
      }

      this.saving = true
      const formData = new FormData()

      formData.append("third_party_id", this.form.third_party_id)
      formData.append("file", this.form.file)
      formData.append("notes", this.form.notes)
      formData.append("valid_until", this.form.valid_until)
      formData.append("retention_date", this.form.retention_date)
      formData.append("tprm_attachment_type_id", this.form.tprm_attachment_type_id)
      formData.append("valid", this.form.valid ? 1 : 0)

      try {
        if (this.isEditing) {
          delete formData.file
        }
        if (!this.isEditing) {
          await this.addAttachment(formData)
        } else {
          this.form.id = this.getCurrentAttachment.id
          await this.updateAttachment(this.form)
        }
        this.incrementAttachmentCount(this.thirdPartyId)
        this.$emit("save", formData)
        this.$emit("cancel")
      } catch (error) {
        console.error("Error saving attachment:", error)
      } finally {
        this.saving = false
        this.closeDrawer()
      }
    }
  },
  async mounted() {
    await this.fetchAttachmentTypes()
    if (this.isEditing) {
      await this.fetchAttachmentById(this.attachment?.id)
      this.form.name = this.getCurrentAttachment.name
      this.form.tprm_attachment_type_id = this.getCurrentAttachment.attachment_type.id
      this.form.valid = this.getCurrentAttachment.valid ? 1 : 0
      this.form.valid_until = this.getCurrentAttachment?.valid_until || ""
      this.form.retention_date = this.getCurrentAttachment?.retention_date || ""
      this.form.notes = this.getCurrentAttachment?.notes || ""
    }
  }
}
</script>

<style scoped>
.attachment-form {
  width: 100%;
  max-width: 600px;
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.v-file-input >>> .v-file-input__text {
  color: rgba(0, 0, 0, 0.6);
}

.v-chip.v-size--small {
  margin: 2px;
}

.v-list-item {
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
