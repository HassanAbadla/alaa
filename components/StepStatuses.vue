<template>
  <v-card flat>
    <v-card-title class="pb-2">
      <span class="text-h6">{{ $t("table.step_statuses") }}</span>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openStatusForm" :disabled="showStatusForm">
        <v-icon left>mdi-plus</v-icon>
        {{ $t("form.add") }}
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Add Status Form -->
    <v-expand-transition>
      <v-card-text v-if="showStatusForm">
        <v-form ref="statusForm" v-model="formValid">
          <custom-dropdown
            :items="statuses"
            item-text="name"
            item-value="id"
            :label="$t('form.status')"
            v-model="formData.statusable_id"
            :rules="[(v) => !!v || 'Status is required']"
            outlined
            dense
          />

          <div class="d-flex justify-end mt-3">
            <v-btn text @click="cancelForm" class="mr-2">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn color="primary" @click="submitForm" :disabled="!formValid">
              {{ $t("submit") }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-expand-transition>

    <!-- Status List -->
    <v-card-text v-if="!showStatusForm">
      <v-list v-if="getStepStatuses && getStepStatuses.length > 0" two-line>
        <v-list-item
          v-for="(status, index) in getStepStatuses"
          :key="status.id"
          :class="{ 'mb-2': index !== getStepStatuses.length - 1 }"
        >
          <v-list-item-content>
            <v-list-item-title class="text-body-1">
              {{ status?.status.name }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="status.description">
              {{ status.description }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action class="flex-row">
            <v-btn icon small @click="editStatus(status)" color="primary">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="deleteStatus(status)" color="error" class="ml-2">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>

          <!-- <v-divider v-if="index !== statuses.length - 1" class="mt-2"></v-divider> -->
        </v-list-item>
      </v-list>

      <v-alert v-else text type="info" class="mb-0">
        No statuses available. Click "Add Step Status" to create one.
      </v-alert>
    </v-card-text>

    <!-- Delete Confirmation Dialog -->
    <confirm-dialog
      v-model="deleteDialog"
      :title="$t('delete')"
      :message="
        $t('page.confirm_delete_message', {
          itemName: this.statusToDelete?.status?.name
        })
      "
      :confirm-button-color="'red'"
      @confirm="confirmDelete"
    ></confirm-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"

export default {
  name: "StepStatuses",
  props: {
    stepStatuses: { type: Array, default: () => [] },
    stepId: { type: Number, required: true }
  },
  data() {
    return {
      showStatusForm: false,
      formValid: false,
      formData: {
        statusable_id: null,
        flow_node_id: this.stepId,
        statusable_type: "order_status"
      },
      deleteDialog: false,
      statusToDelete: null,
      selectedStatus: {},
      editForm: false
    }
  },
  methods: {
    ...mapActions("oss", ["getStatuses"]),
    ...mapActions({
      fetchStepStatuses: "stepStatuses/fetchStepStatuses",
      addStepStatus: "stepStatuses/addStepStatus",
      updateStepStatus: "stepStatuses/updateStepStatus",
      deleteStepStatus: "stepStatuses/deleteStepStatus"
    }),

    openStatusForm() {
      this.showStatusForm = true
    },

    cancelForm() {
      this.showStatusForm = false
      this.formData.statusable_id = null
      if (this.$refs.statusForm) {
        this.$refs.statusForm.reset()
      }
    },

    async submitForm() {
      if (this.$refs.statusForm.validate()) {
        // Add your submit logic here
        console.log("Submitting:", this.formData)
        if (this.editForm) {
          this.formData.id = this.selectedStatus.id
          await this.updateStepStatus(this.formData)
        } else {
          await this.addStepStatus(this.formData)
        }
        this.cancelForm()
      }
    },

    editStatus(status) {
      console.log("Editing:", status)
      this.selectedStatus = status
      this.formData.statusable_id = status.statusable_id
      this.editForm = true
      this.showStatusForm = true
    },

    deleteStatus(status) {
      this.statusToDelete = status
      this.deleteDialog = true
    },

    async confirmDelete() {
      // Add your delete logic here
      console.log("Deleting:", this.statusToDelete)
      this.deleteDialog = false
      await this.deleteStepStatus(this.statusToDelete.id)
      this.statusToDelete = null
    }
  },
  computed: {
    ...mapState("oss", ["statuses"]),
    ...mapGetters({
      getStepStatuses: "stepStatuses/getStepStatuses",
      getCurrentStepStatus: "stepStatuses/getCurrentStepStatus",
      loadingStepStatuses: "stepStatuses/isLoading"
    })
  },
  mounted() {
    this.getStatuses()
    this.fetchStepStatuses(this.stepId)
  }
}
</script>

<style scoped>
.v-list-item__action {
  flex-direction: row !important;
  align-items: center;
}
</style>
