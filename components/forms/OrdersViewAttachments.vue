<template>
  <div class="px-6 my-6">
    <div v-if="!editMode">
      <v-row
        v-for="(userAttachments, userName) in attachmentsByUser"
        :key="userName"
        style="border-bottom: 1px solid #e0e0e0"
        class="d-flex flex-row justify-center align-center mb-4"
      >
        <v-col cols="12" class="px-0">
          <h3 class="">
            <small>{{ $t("table.upload_by") }}</small>
            {{ userName }}
          </h3>
        </v-col>
        <v-row
          v-for="attachment in userAttachments"
          :key="attachment.id"
          class="d-flex flex-row justify-center align-start mb-2"
        >
          <v-col cols="2" class="d-flex flex-column justify-center">
            <file-preview :file="attachment" />
            <small class="font-weight-bold text-center">{{ (attachment.size * 1024).toFixed(2) }} KB</small>
          </v-col>
          <v-col cols="6" class="d-flex justify-space-between">
            <div>
              <p class="font-weight-bold mb-0">
                {{ attachment.name }}
                <span class="mx-2 font-weight-light text--secondary">
                  {{ formatDate(attachment.created_at).date }}@{{ formatDate(attachment.created_at).time }}
                </span>
              </p>
              <p class="text-lg-left" v-html="attachment.note"></p>
              <v-chip
                small
                :color="chipColor(attachment)"
                text-color="white"
                class="mr-2"
                @click="openValidityConfirmDialog(attachment)"
                :ripple="!attachment.isLoading"
                :style="{ cursor: attachment.isLoading ? 'wait' : 'pointer' }"
                :disabled="attachment.isLoading"
              >
                <v-icon left small>
                  {{ attachment.valid ? "mdi-check-circle" : "mdi-close-circle" }}
                </v-icon>
                {{ attachment.valid ? $t("page.valid") : $t("page.not_valid") }}
                <v-progress-circular
                  v-if="attachment.isLoading"
                  indeterminate
                  size="16"
                  width="2"
                  color="white"
                  class="ml-2"
                />
              </v-chip>
              <span v-if="attachment.valid_until" class="text-caption">
                {{ $t("table.valid_until") }}: {{ formatDate(attachment.valid_until).date }}
              </span>
            </div>
          </v-col>
          <v-col cols="4" class="relative">
            <div>
              <v-btn
                v-if="$auth.user.type.code !== 'c-owner'"
                icon
                small
                @click="editAttachment(attachment)"
                :disabled="isOrderClosed"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="$auth.user.type.code !== 'c-owner'"
                small
                icon
                @click="removeAttachment(attachment)"
                :disabled="isOrderClosed"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
              <v-btn small icon @click="downloadAttachment(attachment)">
                <v-icon small>mdi-download</v-icon>
              </v-btn>
              <v-btn
                small
                icon
                v-if="mainAttachments"
                :disabled="isAttachmentInMain(attachment) || isOrderClosed"
                :color="getAttachmentColor(attachment)"
                @click="toggleApproved(attachment)"
              >
                <v-icon small>
                  {{ getAttachmentIcon(attachment) }}
                </v-icon>
              </v-btn>
              <span v-if="mainAttachments" style="font-size: 0.7rem">
                {{ isAttachmentInMain(attachment) ? $t("page.included") : $t("page.not_included") }}
              </span>

              <v-menu
                :close-on-content-click="false"
                :nudge-width="200"
                offset-y
                v-if="$auth.user.type.code === 'sm' && subOrders !== undefined"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" :disabled="isOrderClosed">
                    <v-icon small>mdi-folder-move</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Move to...</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-item>
                      <v-list-item-action>
                        <v-select :items="moveOptions" v-model="selectedMoveOption" label="Select Sub-order"></v-select>
                        <v-btn small @click="sendMoveRequest(attachment)">Send</v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-row>
    </div>
    <div v-if="editMode">
      <custom-dialog v-model="editMode" :title="$t('page.edit_attachment')" width="600px">
        <OrdersEditAttachment @attachment-updated="attachmentUpdated" :attachments="attachment" :itemId="itemId" />
      </custom-dialog>
    </div>
    <!-- Validity Confirm Dialog -->
    <confirm-dialog
      v-model="showValidityConfirmDialog"
      :title="$t('page.confirm_validity_change')"
      :message="confirmMessage"
      :confirm-button-text="$t('page.confirm')"
      :confirm-button-color="confirmButtonColor"
      :cancel-button-text="$t('page.cancel')"
      :show-cancel-button="true"
      @confirm="handleValidityConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import OrdersEditAttachment from "./OrdersEditAttachment.vue"
import ConfirmDialog from "../ConfirmDialog.vue"
import { formatDate } from "../../helpers/misc"
import FilePreview from "../FilePreview.vue"
import { mapState, mapActions } from "vuex"

export default {
  components: { OrdersEditAttachment, ConfirmDialog, FilePreview },
  name: "OrdersViewAttachments",

  data() {
    return {
      editMode: false,
      attachment: null,
      selectedAttachment: {},
      showValidityConfirmDialog: false,
      confirmMessage: "",
      confirmButtonColor: "primary",
      showMoveOptions: false,
      // moveOptions: [
      //   { text: 'Option 1', value: 'option1' },
      //   { text: 'Option 2', value: 'option2' },
      // ],
      selectedMoveOption: null
    }
  },
  props: {
    mainAttachments: {
      type: Array,
      required: false
    },
    mainOrderId: {
      type: Number,
      required: false
    },
    itemId: {
      type: Number,
      required: true
    },
    attachments: {
      type: Array
    },
    subOrders: {
      type: Array
    }
  },

  methods: {
    formatDate,
    ...mapActions("oss", ["addToMainOrder"]),
    chipColor(attachment) {
      if (attachment.isLoading) return "grey"
      return attachment.valid ? "success" : "error"
    },
    async sendMoveRequest(attachment) {
      console.log("Attachment:", attachment)
      console.log("before:", attachment.id)

      let movedAttachment = { ...attachment }
      movedAttachment.order_id = this.selectedMoveOption
      await this.addToMainOrder(movedAttachment)
      // console.log("after:", movedAttachment.id)
      // const response = await this.$axios
      //   .post("https://api.ordonsoft.com/api/order-attachment/addToMainOrder", movedAttachment)
      //   .then((response) => {
      //     this.$store.dispatch("oss/allOrders")
      //   })
      // // Add your logic to send the move request here
      // console.log("Send move request with option:", this.selectedMoveOption)
    },
    isImage(item) {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
      const extension = item.path.split(".").pop().toLowerCase()
      return imageExtensions.includes(extension)
    },
    getFileExtension(filename) {
      return filename.split(".").pop().toLowerCase()
    },

    getFileTypeIcon(item) {
      const extension = this.getFileExtension(item.path)

      switch (extension) {
        case "dwg":
        case "dxf":
          return "autocad-icon.png"
        case "rvt":
          return "revit-icon.png"
        case "xls":
        case "xlsx":
          return "excel-icon.png"
        case "ppt":
        case "pptx":
          return "powerpoint-icon.png"
        case "doc":
        case "docx":
          return "word-icon.png"
        case "pdf":
          return "pdf-icon.png"
        default:
          return "default-file-icon.png"
      }
    },
    isAudio(item) {
      const audioExtensions = ["mp3", "wav", "ogg", "m4a", "flac"]
      const extension = item.path.split(".").pop().toLowerCase()
      return audioExtensions.includes(extension)
    },

    editAttachment(item) {
      this.attachment = item
      this.editMode = true
      console.log(this.attachment)
    },
    attachmentUpdated(attachment) {
      this.$emit("submission-success")
      this.editMode = false
    },

    openValidityConfirmDialog(attachment) {
      this.selectedAttachment = attachment
      this.confirmButtonColor = attachment.valid ? "error" : "success"
      this.confirmMessage = attachment.valid
        ? this.$t("page.confirm_invalidate_attachment", { name: attachment.name })
        : this.$t("page.confirm_validate_attachment", { name: attachment.name })
      this.showValidityConfirmDialog = true
    },
    async handleValidityConfirm() {
      if (this.selectedAttachment) {
        await this.$axios
          .put(`https://api.ordonsoft.com/api/order-attachment/${this.selectedAttachment.id}`, {
            valid: !this.selectedAttachment.valid
          })
          .then((response) => {
            this.$store.dispatch("oss/allOrders")
          })
        this.$store.dispatch("drawer/closeDrawer")
      }
      this.resetDialog()
    },
    handleCancel() {
      this.resetDialog()
    },
    resetDialog() {
      this.showValidityConfirmDialog = false
      this.confirmMessage = ""
      this.confirmButtonColor = "primary"
    },

    async removeAttachment(item) {
      const id = item.id

      await this.$axios.delete(`https://api.ordonsoft.com/api/order-attachment/${id}`).then((response) => {
        this.$store.commit("oss/REMOVE_ATTACHMENT", item)
      })
      this.$store.dispatch("oss/allOrders")
    },
    downloadAttachment(attachment) {
      const link = document.createElement("a")
      link.href = `https://api.ordonsoft.com/storage/${attachment.path}`
      link.download = attachment.name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    isAttachmentInMain(attachment) {
      if (this.mainAttachments && attachment) {
        return this.mainAttachments.some((mainAttachment) => mainAttachment.name === attachment.name)
      }
      return false
    },
    getAttachmentColor(attachment) {
      return this.isAttachmentInMain(attachment) ? "success" : "error"
    },
    getAttachmentIcon(attachment) {
      return this.isAttachmentInMain(attachment) ? "mdi-check-circle" : "mdi-circle-outline"
    },

    async toggleApproved(itemAttachment) {
      console.log("toggleAprove Attachment:", itemAttachment)
      let toggledattachment = { ...itemAttachment }
      toggledattachment.order_id = this.mainOrderId

      const response = await this.$axios
        .post("https://api.ordonsoft.com/api/order-attachment/addToMainOrder", toggledattachment)
        .then((response) => {
          this.$store.commit("oss/UPDATE_ATTACHMENT", toggledattachment)
        })
      this.isAttachmentInMain(toggledattachment)
      this.$store.dispatch("oss/allOrders")
    }

    // formatDate(dateString) {
    //   const date = new Date(dateString)
    //   const year = date.getFullYear()
    //   const month = String(date.getMonth() + 1).padStart(2, "0")
    //   const day = String(date.getDate()).padStart(2, "0")
    //   const hours = String(date.getHours()).padStart(2, "0")
    //   const minutes = String(date.getMinutes()).padStart(2, "0")
    //   return `${year}-${month}-${day} ${hours}:${minutes}`
    // }
  },

  computed: {
    attachmentsByUser() {
      return this.attachments.reduce((acc, attachment) => {
        const userName = attachment.user.full_name
        if (!acc[userName]) {
          acc[userName] = []
        }
        acc[userName].push(attachment)
        return acc
      }, {})
    },

    isOrderClosed() {
      let foundOrder
      if (this.mainOrderId !== undefined) {
        foundOrder = this.$store.state.oss.orders.find((order) => order.id === this.mainOrderId)
      } else {
        foundOrder = this.$store.state.oss.orders.find((order) => order.id === this.itemId)

        // If not found, look through children of each order
        if (!foundOrder) {
          foundOrder = this.$store.state.oss.orders.find(
            (order) => order.children && order.children.find((child) => child.id === this.itemId)
          )
          if (foundOrder) {
            foundOrder = foundOrder.children.find((child) => child.id === this.itemId)
          }
        }
      }

      if (this.$auth.user.type.code === "b-owner") {
        return foundOrder ? foundOrder.status.code !== "req" : false
      }

      return foundOrder
        ? foundOrder.status.code === "closed" ||
            foundOrder.status.code === "replied" ||
            this.$auth.user.type.code === "c-owner"
        : false
    },

    moveOptions() {
      if (!this.subOrders) {
        return
      }
      return this.subOrders.map((subOrder) => ({
        text: `${subOrder.code} - ${subOrder.receiver.name}`,
        value: subOrder.id
      }))
    }
  },

  watch: {
    attachments: {
      handler() {
        this.isAttachmentInMain(this.selectedAttachment)
      },
      deep: true
    }
  }
}
</script>

<style></style>
