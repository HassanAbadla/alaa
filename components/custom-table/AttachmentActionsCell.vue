<template>
  <div class="d-flex align-center justify-center">
    <v-can disable-only :permission="permissions?.add">
      <template #default="{ disabled }">
        <v-tooltip v-if="showAdd" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small :disabled="disabled" icon @click="openAttachmentForm" v-bind="attrs" v-on="on">
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("table.add") }}</span>
        </v-tooltip>
      </template>
    </v-can>
    <v-can disable-only :permission="permissions?.view">
      <template #default="{ disabled }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              :disabled="disabled"
              icon
              class="d-flex align-center justify-center"
              @click="openAttachmentList"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small>mdi-paperclip</v-icon>
              <span>{{ attachmentCount }}</span>
            </v-btn>
          </template>
          <span>{{ $t("table.view") }}</span>
        </v-tooltip>
      </template>
    </v-can>
  </div>
</template>

<script>
import VCan from "../VCan.vue"
export default {
  components: { VCan },
  name: "AttachmentActionsCell",
  props: {
    attachmentCount: {
      type: Number,
      default: 0
    },
    showAdd: { type: Boolean, default: true },
    permissions: { type: Object }
  },
  methods: {
    openAttachmentList() {
      this.$emit("open-attachment-list")
    },
    openAttachmentForm() {
      this.$emit("open-attachment-form")
    }
  }
}
</script>
