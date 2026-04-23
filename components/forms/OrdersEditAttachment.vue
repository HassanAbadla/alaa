<template>
  <form-wrapper @submit="updateAttachment">
    <!-- <custom-input v-model="name" :label="$t('form.title')" :required="true" /> -->
    <!-- <div v-if="this.attachments.path" class="image-container d-flex justify-center pa-2">
      <img :src="`http://127.0.0.1:8000/storage/${this.attachments.path}`" alt="Attachment Image">
      <v-icon @click="removeImage" class="remove-icon">mdi-close</v-icon>
    </div> -->
    <!-- <v-select v-model="selectedType" :items="attachmentTypes" item-text="name" item-value="id" label="Type" dense
      outlined required>
    </v-select> -->

    <!-- <v-file-input v-model="file" :label="$t('form.file')" outlined dense :rules="[(v) => !!v || 'File is required']"
      @change="handleFileChange">
    </v-file-input> -->
    <quill-editor v-model="note" class="mb-4" />
  </form-wrapper>
</template>

<script>
import QuillEditor from "../QuillEditor.vue"
export default {
  components: { QuillEditor },
  name: "OrdersEditAttachment",

  data() {
    return {
      attachmentTypes: [],
      user_id: this.$store.$auth.state.user.id,
      order_id: this.itemId,
      name: this.attachments.name,
      selectedType: this.attachments.attachment_type_id,
      file: null,
      type: null,
      note: this.attachments.note
    }
  },
  props: {
    itemId: {
      type: Number,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    },
    attachments: {
      type: Object
    }
  },

  mounted() {
    this.$axios.get("orders-attachment-types").then((response) => {
      this.attachmentTypes = response.data.data
    })
  },

  methods: {
    handleFileChange(file) {
      this.file = file
    },

    async updateAttachment() {
      const data = {
        note: this.note
      }

      await this.$axios
        .put(`https://api.ordonsoft.com/api/order-attachment/${this.attachments.id}`, data)
        .then((response) => {
          this.$store.dispatch("oss/allOrders")
          // this.$emit('attachment-updated', response.data.data);
        })
      this.$store.dispatch("drawer/closeDrawer")
    },

    resetForm() {
      this.file = null
      this.note = ""
    },

    handleFileChange(file) {
      if (file) {
        this.file = file
      } else {
        this.file = null
      }
    },
    removeImage() {
      this.attachments.path = null
      this.file = null
    }
  }
}
</script>

<style></style>
