<template>
  <div>
    <custom-dialog v-model="dialogVisible" :title="computedTitle" :width="width" @close-dialog="closeDialog">
      <v-card-text flat class="policy-note-form">
        <template v-if="isEditing && !disableEdit">
          <div class="actions-wrapper edit-actions">
            <v-spacer></v-spacer>
            <v-btn text @click="cancelEdit" :disabled="loading">
              {{ $t("page.cancel") }}
            </v-btn>
            <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="loading">
              {{ $t("page.save") }}
            </v-btn>
          </div>
          <!-- <form-wrapper :loading="loading" @submit="handleSubmit"> -->
          <text-editor v-model="editorContent" :min-height="400" outlined />

          <!-- Empty actions slot to remove default button placement -->
          <!-- <template v-slot:actions> -->
          <!-- Intentionally empty -->
          <!-- </template> -->
          <!-- </form-wrapper> -->

          <!-- Custom action buttons at the bottom -->
        </template>
        <template v-else>
          <!-- Action Buttons at Top -->
          <div class="actions-wrapper view-actions">
            <v-spacer></v-spacer>
            <v-btn small outlined v-if="!disableEdit" @click="startEditing" :disabled="loading" color="secondary">
              {{ btnText }}
              <v-icon small right>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              small
              outlined
              v-if="$route.path === '/policy'"
              @click="exportPolicy"
              :disabled="loading"
              color="seconday"
            >
              {{ $t("page.export") }}
              <v-icon small right>mdi-export</v-icon>
            </v-btn>
          </div>

          <!-- Content Container -->
          <div class="content-wrapper">
            <text-editor
              v-if="hasActualContent"
              :value="note"
              :min-height="400"
              :readonly="true"
              :hide-toolbar="true"
            />
            <div v-else class="text-center py-8 grey--text">
              {{ $t("page.no_content") }}
            </div>
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
import TextEditor from "@/components/TextEditor.vue"

export default {
  components: { FormWrapper, TextEditor },
  name: "PolicyEditableNoteForm",
  props: {
    fieldName: {
      type: String,
      default: null
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
      if (!this.note) return false

      try {
        const data = typeof this.note === "string" ? JSON.parse(this.note) : this.note
        return data.blocks && data.blocks.length > 0
      } catch (error) {
        return this.note.trim().length > 0
      }
    },
    computedTitle() {
      if (this.fieldName) {
        return this.$t(this.fieldName, { name: this.title })
      }
      return this.$t("page.note", { itemName: this.title })
    },
    btnText() {
      return this.hasActualContent ? this.$t("page.edit") : this.$t("page.create")
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
        this.editorContent = newValue || ""
        this.isEditing = !this.hasActualContent
      }
    }
  },
  methods: {
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

<style scoped>
.theme--light.v-sheet--outlined {
  border: none !important;
}
.policy-note-form {
  position: relative;
}

/* Content wrapper */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* Actions wrapper - ensure buttons are clickable */
.actions-wrapper {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: white;
  padding: 12px 0;
  clear: both;
  gap: 8px;
}

/* View mode actions at top */
.actions-wrapper.view-actions {
  /* border-bottom: 1px solid #e0e0e0; */
  margin-bottom: 16px;
  padding-bottom: 16px;
}

/* Edit mode actions at bottom */
.actions-wrapper.edit-actions {
  /* border-top: 1px solid #e0e0e0; */
  margin-top: 16px;
  padding-top: 16px;
}

/* Prevent editor content from overlapping buttons */
::v-deep .codex-editor {
  position: relative;
  z-index: 1;
}

::v-deep .ce-block__content {
  max-width: 100% !important;
  position: relative;
  z-index: 1;
}

/* Ensure toolbar doesn't overflow */
::v-deep .ce-toolbar {
  position: absolute;
  z-index: 2;
}

/* Fix card content spacing */
::v-deep .v-card__text {
  position: relative;
}

/* Remove default form-wrapper actions spacing */
::v-deep .form-actions {
  display: none;
}
</style>
