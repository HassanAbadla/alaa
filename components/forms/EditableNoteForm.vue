<template>
  <div>
    <custom-dialog v-model="dialogVisible" :title="computedTitle" :width="width" @close-dialog="closeDialog">
      <v-card-text>
        <template v-if="isEditing && !disableEdit">
          <form-wrapper :loading="loading" @submit="handleSubmit">
            <quill-editor v-model="editorContent" class="pb-4" />
            <template v-slot:actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancelEdit" :disabled="loading">{{ $t("page.cancel") }}</v-btn>
              <v-btn color="primary" type="submit" :loading="loading">{{ $t("page.save") }}</v-btn>
            </template>
          </form-wrapper>
        </template>
        <template v-else>
          <div v-html="note"></div>

          <div class="d-flex justify-end">
            <v-btn
              small
              outlined
              v-if="!disableEdit"
              @click="startEditing"
              :disabled="loading"
              class="mt-4"
              color="secondary"
            >
              {{ btnText }}
              <v-icon small right>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              small
              outlined
              v-if="$route.path === '/policy'"
              @click="exportPolicy"
              :disabled="loading"
              class="mt-4 mx-4"
              color="seconday"
            >
              {{ $t("page.export") }}
              <v-icon small right>mdi-export</v-icon>
            </v-btn>
          </div>
        </template>
      </v-card-text>
    </custom-dialog>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          :color="iconColor"
          :size="iconSize"
          v-bind="attrs"
          v-on="on"
          @click="openDialog"
          :disabled="loading || disableIcon"
        >
          {{ hasActualContent ? "mdi-note-text" : "mdi-note-text-outline" }}
        </v-icon>
      </template>
      <span>{{ iconTooltipText }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import FormWrapper from "@/components/custom-form/FormWrapper.vue"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  components: { FormWrapper, QuillEditor },
  name: "EditableNote",
  props: {
    fieldName: {
      type: String,
      default: null // Default to 'note' for backward compatibility
    },
    itemKey: { type: String },
    note: { type: String, default: "" },
    title: { type: String, default: "" },
    disableEdit: { type: Boolean, default: false },
    disableIcon: { type: Boolean, default: false },
    itemId: [String, Number],
    loading: { type: Boolean, default: false },
    openButtonText: { type: String },
    iconSize: { type: String, default: "large" },
    iconColor: { type: String, default: "seconday" },
    width: { type: String, default: "600px" }
  },
  data() {
    return {
      dialogVisible: false,
      isEditing: false,
      editorContent: ""
    }
  },
  computed: {
    hasActualContent() {
      // Check if note exists and isn't just empty HTML
      return this.note && !this.isEmptyHtml(this.note)
    },
    computedTitle() {
      if (this.fieldName) {
        return this.$t(this.fieldName, { name: this.title })
      }
      return this.$t("page.note", { itemName: this.title })
    },
    btnText() {
      return this.note ? this.$t("page.edit") : this.$t("page.create")
    },
    iconTooltipText() {
      if (this.openButtonText) {
        return this.openButtonText
      }
      return this.disableEdit ? this.$t("page.view_note") : this.$t("page.view_edit_note")
    }
  },
  watch: {
    note: {
      immediate: true,
      handler(newValue) {
        this.editorContent = newValue
        this.isEditing = !newValue
      }
    }
  },
  methods: {
    isEmptyHtml(html) {
      // Remove all HTML tags and whitespace
      const textContent = html
        .replace(/<[^>]*>/g, "")
        .replace(/\s/g, "")
        .trim()

      // Check if there's any actual content left
      return textContent === ""
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.isEditing = false
      this.dialogVisible = false
      this.editorContent = this.note
    },
    startEditing() {
      this.isEditing = true
    },
    cancelEdit() {
      this.isEditing = false
      this.editorContent = this.note
    },
    handleSubmit() {
      const payload = {}
      if (this.itemKey) {
        payload[this.itemKey] = this.editorContent
      } else {
        payload.note = this.editorContent
      }

      this.$emit("update-item", this.itemId, payload)
      this.isEditing = false
    },
    exportPolicy(item) {
      this.$emit("export-policy", item)
    }
  }
}
</script>
