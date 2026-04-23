<template>
  <div>
    <div
      v-if="
        $auth.user.type.code === 'owner' ||
        $auth.user.type.code === 'sm' ||
        $auth.user.type.code === 'expro' ||
        $auth.user.type.code === 'finance' ||
        $auth.user.type.code === 'tasks'
      "
      class="d-flex flex-row align-center justify-end my-4"
    >
      <v-btn v-if="item.status.code === 'draft'" color="primary" class="mx-2" @click="changeStatus('send')">
        <v-icon left>mdi-send</v-icon>
        {{ $t("send") }}
      </v-btn>
      <v-btn v-if="item.status.code === 'req'" color="purple white--text" class="mx-2" @click="changeStatus('accept')">
        <v-icon left>mdi-check</v-icon>
        {{ $t("accept") }}
      </v-btn>
      <v-btn v-if="item.status.code === 'req'" color="error white--text" class="mx-2" @click="changeStatus('decline')">
        <v-icon left>mdi-check</v-icon>
        {{ $t("decline") }}
      </v-btn>
      <v-btn
        v-if="!item.linked_order_id && item.status.code === 'inprogress' && $auth.user.type.code === 'expro'"
        color="info white--text"
        class="mx-2"
        @click="openEorderDialog"
      >
        <v-icon left>mdi-check</v-icon>
        make estimation order
      </v-btn>
      <v-btn
        v-if="
          item.linked_order_id &&
          item.sender.orders_user_type.code === 'owner' &&
          item.receiver.orders_user_type.code === 'expro'
        "
        color="info white--text"
        class="mx-2"
        @click="openRedirectDialog"
      >
        <v-icon left>mdi-check</v-icon>
        redirect to Finance
      </v-btn>
    </div>
    <!-- b-owner to send to the owner -->
    <!-- <div v-if="$auth.user.type.code === 'b-owner'" class="d-flex flex-row align-center justify-end my-4">
      <v-btn v-if="item.status.code === 'draft'" color="primary" class="mx-2" @click="changeStatus('send')">
        <v-icon left>mdi-send</v-icon>
        {{ $t("send") }}
      </v-btn>
    </div> -->
    <div class="d-flex flex-row align-start justify-space-between pa-4 w-100">
      <div class="w-50">
        <p class="mb-0">
          {{ $t("page.sender") }}:
          <span>{{ item.sender.full_name }}</span>
        </p>
        <p class="mb-0">
          {{ $t("page.receiver") }}:
          <span>{{ item.receiver.full_name }}</span>
        </p>
        <p class="mb-0">
          {{ $t("project_name") }}:
          <span>{{ item.project?.title }}</span>
        </p>
        <p class="mb-0">
          {{ $t("building_name") }}:
          <span>{{ item.building?.name }}</span>
        </p>
      </div>
      <div>
        <div class="d-flex flex-row w-50">
          <p
            class="mx-2 px-2 py-1 rounded"
            :class="{
              error: item.priority.code === 'high',
              warning: item.priority.code === 'med',
              primary: item.priority.code === 'low'
            }"
            style="color: white"
          >
            {{ item.priority.name }}
          </p>
          <p
            class="px-2 py-1 rounded"
            :class="{
              'blue-grey white--text': item.status.code === 'draft',
              'purple white--text': item.status.code === 'req',
              'grey white--text': item.status.code === 'declined',
              info: item.status.code === 'sent',
              primary: item.status.code === 'replied',
              warning: item.status.code === 'inprogress',
              error: item.status.code === 'closed'
            }"
            style="color: white"
          >
            {{ item.status.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="pa-4">
      <p class="font-weight-bold">{{ $t("page.note") }}</p>
      <div v-html="item.note"></div>
    </div>
    <div class="pa-4">
      <p class="font-weight-bold">{{ $t("attachments") }}</p>
      <div class="">
        <div v-for="attachment in item.orderAttachements" :key="attachment.id" class="d-flex align-start">
          <!-- <v-img
            v-if="isImage(attachment)"
            :src="`https://api.ordonsoft.com/storage/${attachment.path}`"
            aspect-ratio="1.7"
            class="rounded object-fit-cover"
          ></v-img> -->
          <!-- <v-img
            v-if="isImage(attachment)"
            :src="attachment.path"
            aspect-ratio="1.7"
            class="rounded object-fit-cover"
          ></v-img>
          <v-img
            v-else
            :src="require(`@/static/attachment-types/${getFileTypeIcon(attachment)}`)"
            contain
            height="64"
            width="64"
            class="align-self-center"
          ></v-img> -->
          <!-- <v-icon v-else-if="isAudio(attachment)" size="54" class="align-self-center">mdi-music</v-icon>
          <v-icon v-else size="64">mdi-file-document</v-icon> -->
          <file-preview :file="attachment" :size="150" />
          <div class="ma-2">
            <p class="font-weight-bold mb-0">{{ attachment.name }}</p>
            <p class="text-lg-left" v-html="attachment.note"></p>
          </div>
        </div>
      </div>
    </div>

    <!-- E-order Dialog -->
    <custom-dialog v-model="eOrderDialog" :title="$t('page.select_receiver')" width="500px">
      <form-wrapper :submit-text="$t('submit')" @submit="createEOrder" :loading="submitting">
        <custom-dropdown
          :items="receivers"
          v-model="receiver_id"
          item-value="id"
          item-text="name"
          :label="$t('page.receiver')"
          :required="true"
          :loading="loadingUsers"
        />
      </form-wrapper>
    </custom-dialog>
    <!-- Redirect Dialog -->
    <custom-dialog v-model="redirectDialog" :title="$t('page.redirect')" width="500px">
      <form-wrapper :submit-text="$t('submit')" @submit="changeReceiver" :loading="submitting">
        <custom-dropdown
          :items="receivers"
          v-model="receiver_id"
          item-value="id"
          item-text="name"
          :label="$t('page.receiver')"
          :required="true"
          :loading="loadingUsers"
        />
      </form-wrapper>
    </custom-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { getUsers } from "@/api/tenent-api"

export default {
  name: "ViewOrder",

  props: {
    itemId: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      eOrderDialog: false,
      receiver_id: null,
      receivers: [],
      users: [],
      loadingUsers: false,
      submitting: false,
      redirectDialog: false
    }
  },

  methods: {
    ...mapActions("oss", ["updateOrderStatus", "allOrders", "createOrder"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async changeStatus(status) {
      console.log(status)

      const data = {
        order_id: this.item.id,
        orders_status_id: null
      }

      switch (status) {
        case "send":
          data.orders_status_id = 2
          break
        case "closed":
          data.orders_status_id = 4
          break
        case "accept":
          data.orders_status_id = 1
          break
        case "decline":
          data.orders_status_id = 7
          break
        default:
          data.orders_status_id = 3
      }
      if (this.$auth.user.type.code === "expro" && status === "send") {
        // data.orders_status_id = 5 // 5 = Request
        this.openRedirectDialog()
        return
      }
      if (this.$auth.user.type.code === "owner" && status === "send") {
        this.openRedirectDialog()
        return
      }
      if (this.$auth.user.type.code === "finance" && status === "send") {
        this.openRedirectDialog()
        return
      }
      await this.updateOrderStatus({ id: this.item.id, payload: data })
      this.closeDrawer()
    },

    // async changeStatus(status) {
    //   console.log(status)

    //   const data = {
    //     order_id: this.item.id,
    //     orders_status_id: status === "send" ? 2 : status === "closed" ? 4 : status === "accept" ? 1 : status === "decline" ? 7 : 3
    //   }
    //   if (this.$auth.user.type.code === "b-owner") {
    //     data.orders_status_id = 5
    //   }
    //   await this.updateOrderStatus({ id: this.item.id, payload: data })
    //   this.closeDrawer()
    // },
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
      console.log(extension)

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
    openEorderDialog() {
      this.eOrderDialog = true
      this.loadingUsers = true
      getUsers(this.$axios)
        .then((res) => {
          const alUsers = res.data.data
          this.receivers =
            alUsers
              .filter((u) => u.type?.code === "owner" || u.type?.code === "finance")
              .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
          this.loadingUsers = false
        })
        .catch((err) => {
          this.loadingUsers = false
        })
    },
    async createEOrder() {
      try {
        this.submitting = true
        const data = { ...this.item }
        data.receiver_id = this.receiver_id
        data.sender_id = this.$auth.user.id
        data.orders_priority_id = data.priority.id
        data.orders_category_id = data.category.id
        data.orders_type_id = data.type.id
        data.orders_status_id = 2 // To Save it as a sent
        data.code = "est-" + data.code
        data.linked_order_id = this.item.id
        console.log("estimate order:", data)

        await this.createOrder(data)
        this.eOrderDialog = false
        this.closeDrawer()
        // this.$emit("order-submitted")
      } catch (error) {
        console.error("Error submitting E-order:", error)
      } finally {
        this.submitting = false
      }
    },
    openRedirectDialog() {
      this.redirectDialog = true
      this.loadingUsers = true
      getUsers(this.$axios)
        .then((res) => {
          const alUsers = res.data.data
          if (this.$auth.user.type.code === "expro") {
            this.receivers =
              alUsers
                .filter((u) => u.type?.code === "owner" || u.type?.code === "finance")
                .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
          }
          if (this.$auth.user.type.code === "owner") {
            this.receivers =
              alUsers
                .filter((u) => u.type?.code === "sm")
                .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
          }
          if (this.$auth.user.type.code === "finance") {
            this.receivers =
              alUsers
                .filter((u) => u.type?.code === "expro")
                .map((user) => ({ id: user.id, name: `${user.full_name}-${user?.type?.title}` })) || null
          }

          this.loadingUsers = false
        })
        .catch((err) => {
          this.loadingUsers = false
        })
    },
    async changeReceiver() {
      try {
        this.submitting = true
        const data = { ...this.item }
        data.receiver_id = this.receiver_id
        data.orders_status_id = 5 // To Save it as a Request
        if (this.$auth.user.type.code === "owner" || this.$auth.user.type.code === "finance") data.orders_status_id = 2 // To Save it as a Sent
        // if (this.$auth.user.type.code === "finance") data.orders_status_id = 4 // To Save it as a Closed
        await this.updateOrderStatus({ id: this.item.id, payload: data })
        this.redirectDialog = false
        this.closeDrawer()
        // this.$emit("order-submitted")
      } catch (error) {
        console.error("Error redirecting E-order:", error)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
