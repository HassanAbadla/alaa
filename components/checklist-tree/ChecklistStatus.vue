<template>
  <div class="d-flex align-center">
    <v-menu v-model="showDropdown" :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-can disable-only :permission="'set_stage_status'">
          <template #default="{ disabled }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="handleButtonClick"
              :loading="fetchingStatuses || isSubmitting"
              :disabled="disabled"
              small
            >
              {{ currentStatus ? $t("page.update_status") : $t("page.set_status") }}
            </v-btn>
          </template>
        </v-can>
      </template>
      <v-list>
        <v-list-item v-for="status in statuses" :key="status.id" @click="handleStatusSelect(status)">
          <v-list-item-title>{{ status.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <span v-if="currentStatus" class="ml-3 body-2">{{ $t("page.current_status") }}: {{ currentStatus.name }}</span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { getStatusOptions } from "@/api/checklists-api"
import VCan from "../VCan.vue"

export default {
  components: { VCan },
  name: "ChecklistStatus",
  props: {
    checklistId: { type: Number, required: true },
    initialStatus: { type: Object, default: null },
    initialDone: { type: Boolean, required: true }
  },
  data() {
    return {
      fetchingStatuses: false,
      isSubmitting: false,
      statuses: null,
      showDropdown: false,
      currentStatus: null
    }
  },
  computed: {
    ...mapGetters("projectChecklist", ["isDoneItem"])
  },
  created() {
    this.currentStatus = this.initialStatus
  },
  methods: {
    ...mapActions("projectChecklist", ["updateChecklistItem"]),

    handleButtonClick() {
      this.fetchStatuses()
    },
    fetchStatuses() {
      this.fetchingStatuses = true
      getStatusOptions(this.$axios)
        .then((res) => {
          this.statuses = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching statuses:", error)
        })
        .finally(() => {
          this.fetchingStatuses = false
        })
    },
    handleStatusSelect(status) {
      this.submitStatus(status)
      this.showDropdown = false
    },

    submitStatus(status) {
      this.isSubmitting = true
      const updatedItem = {
        id: this.checklistId,
        done: this.isDoneItem(this.checklistId),
        status: status
      }

      this.updateChecklistItem({
        updatedItem,
        projectId: this.$route.params.id,
        contractId: this.$route.params.contract_id
      })
        .then(() => {
          this.currentStatus = status
          this.$emit("item-updated", updatedItem)
        })
        .catch((error) => {
          console.error("Error updating status:", error)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>
