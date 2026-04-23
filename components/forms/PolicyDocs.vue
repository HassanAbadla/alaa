<template>
  <form-wrapper @submit="addAttachment" :loading="isSubmitting" :submit-text="$t('form.save')">
    <v-file-input
      v-model="file"
      :label="$t('form.file')"
      outlined
      dense
      :rules="[(v) => !!v || 'File is required']"
      @change="handleFileChange"
    ></v-file-input>
    <small v-if="error" style="color: red">{{ error }}</small>
  </form-wrapper>
</template>

<script>
import { mapActions, mapState } from "vuex"
export default {
  components: {},
  name: "PolicyAddDocuments",

  data() {
    return {
      error: null,
      // attachmentTypes:[],
      user_id: this.$store.$auth.state.user.id,
      policy_id: this.itemId,
      name: "",
      file: null,
      isSubmitting: false
    }
  },
  props: {
    itemId: {
      type: Number,
      required: true
    }
  },

  methods: {
    ...mapActions("policy", ["getAttachmentTypes", "createOrderAttachment", "createDocument"]),
    ...mapActions("drawer", ["closeDrawer"]),
    handleFileChange(file) {
      this.file = file
    },

    async addAttachment() {
      this.isSubmitting = true
      if (!this.file) {
        this.error = "All fields are required"
        return
      }
      const formData = new FormData()
      formData.append("policy_id", this.itemId)
      formData.append("file", this.file)
      // formData.append("valid_until", this.validUntil)
      await this.createDocument(formData, this.$axios)
      this.isSubmitting = false
      this.closeDrawer()
    },

    resetForm() {
      this.file = null
    }
  }
}
</script>

<style></style>
