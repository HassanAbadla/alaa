<template>
  <form-wrapper @submit="addAttachment" :loading="isSubmitting" :submit-text="$t('form.save')">
    <!-- <custom-input v-model="name" :label="$t('form.title')" :required="true" /> -->
    <v-select
      v-model="selectedType"
      :items="attachmentTypes"
      item-text="name"
      item-value="id"
      :label="$t('table.type')"
      dense
      outlined
      required
      :rules="[(v) => !!v || 'Type is required']"
    ></v-select>
    <v-file-input
      v-model="file"
      :label="$t('form.file')"
      outlined
      dense
      :rules="[(v) => !!v || 'File is required']"
      @change="handleFileChange"
    ></v-file-input>
    <quill-editor v-model="note" class="mb-4" />
    <v-checkbox v-model="isValid" :label="$t('form.valid')" dense outlined></v-checkbox>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="validUntil"
          :label="$t('form.valid_until')"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="validUntil" @input="menu = false"></v-date-picker>
    </v-menu>
    <small v-if="error" style="color: red">{{ error }}</small>
  </form-wrapper>
</template>

<script>
import QuillEditor from "../QuillEditor.vue"
import { mapActions, mapState } from "vuex"
export default {
  components: { QuillEditor },
  name: "OrdersAttachment",

  data() {
    return {
      error: null,
      // attachmentTypes:[],
      user_id: this.$store.$auth.state.user.id,
      order_id: this.itemId,
      name: "",
      selectedType: null,
      file: null,
      type: null,
      note: "",
      isValid: false,
      menu: false,
      validUntil: null,
      isSubmitting: false
    }
  },
  props: {
    itemId: {
      type: Number,
      required: true
    },
    isTSS: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    this.getAttachmentTypes()
  },

  computed: {
    ...mapState("oss", ["attachmentTypes"])
  },

  methods: {
    ...mapActions("oss", ["getAttachmentTypes", "createOrderAttachment"]),
    ...mapActions("drawer", ["closeDrawer"]),
    handleFileChange(file) {
      this.file = file
    },

    async addAttachment() {
      this.isSubmitting = true
      if (!this.note || !this.selectedType || !this.file) {
        this.error = "All fields are required"
        return
      }
      const formData = new FormData()
      formData.append("order_id", this.itemId)
      formData.append("user_id", this.user_id)
      formData.append("file", this.file)
      formData.append("note", this.note)
      formData.append("attachment_type_id", this.selectedType)
      formData.append("valid", this.isValid ? 1 : 0)
      if (this.validUntil) {
        formData.append("valid_until", this.validUntil)
      }
      // formData.append("valid_until", this.validUntil)
      const response = await this.createOrderAttachment(formData, this.$axios)
      this.$store.commit("tasks/ADD_ITEM_ATTACHMENT", response)
      this.isSubmitting = false
      this.isTSS ? this.$emit("upload-complete") : this.closeDrawer()
    },

    resetForm() {
      this.file = null
      this.note = ""
      this.this.selectedType = null
      this.this.validUntil = null
    }
  }
}
</script>

<style></style>
