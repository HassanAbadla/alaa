<template>
  <div class="checklist-schedule">
    <!-- Display Section -->
    <div class="d-flex align-center mb-2">
      <div class="dates-display">
        <div class="d-flex align-center mb-1">
          <span class="font-weight-medium mr-2">{{ $t("page.start_date") }}:</span>
          <span>{{ currentStartDate }}</span>
          <!-- <formatted-date-time :date="currentStartDate" hide-time /> -->
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-medium mr-2">{{ $t("page.end_date") }}:</span>
          <span>{{ currentEndDate }}</span>
          <!-- <formatted-date-time :date="currentEndDate" hide-time /> -->
        </div>
      </div>

      <v-can disable-only :permission="'set_stage_dates'">
        <template #default="{ disabled }">
          <v-btn
            color="primary"
            @click="toggleEditMode"
            :loading="isSubmitting"
            :disabled="disabled"
            small
            class="ml-3"
          >
            {{ $t("page.update_dates") }}
          </v-btn>
        </template>
      </v-can>
    </div>

    <!-- Edit Section -->
    <v-expand-transition>
      <v-card v-if="showEditMode" flat outlined class="pa-3 mt-2">
        <v-row>
          <v-col cols="12" sm="6">
            <custom-date-picker v-model="editStartDate" :label="$t('page.start_date')" outlined dense />
          </v-col>
          <v-col cols="12" sm="6">
            <custom-date-picker v-model="editEndDate" :label="$t('page.end_date')" outlined dense />
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn text @click="cancelEdit" :disabled="isSubmitting" class="mr-2">
              {{ $t("page.cancel") }}
            </v-btn>
            <v-btn color="primary" @click="submitDates" :loading="isSubmitting">
              {{ $t("page.save") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import FormatedDateTime from "@/components/FormatedDateTime.vue"
export default {
  name: "ChecklistSchedule",
  components: { FormatedDateTime },
  props: {
    checklistId: {
      type: Number,
      required: true
    },
    initialStartDate: {
      type: [String, Date],
      default: null
    },
    initialEndDate: {
      type: [String, Date],
      default: null
    },
    initialDone: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showEditMode: false,
      isSubmitting: false,
      currentStartDate: null,
      currentEndDate: null,
      editStartDate: null,
      editEndDate: null
    }
  },
  computed: {
    ...mapGetters("projectChecklist", ["isDoneItem"])
  },
  created() {
    this.currentStartDate = this.initialStartDate
    this.currentEndDate = this.initialEndDate
    this.resetEditDates()
  },
  watch: {
    initialStartDate(newVal) {
      this.currentStartDate = newVal
      if (!this.showEditMode) {
        this.editStartDate = newVal
      }
    },
    initialEndDate(newVal) {
      this.currentEndDate = newVal
      if (!this.showEditMode) {
        this.editEndDate = newVal
      }
    }
  },
  methods: {
    ...mapActions("projectChecklist", ["updateChecklistItem"]),

    toggleEditMode() {
      this.showEditMode = !this.showEditMode
      if (this.showEditMode) {
        this.resetEditDates()
      }
    },

    resetEditDates() {
      this.editStartDate = this.currentStartDate
      this.editEndDate = this.currentEndDate
    },

    cancelEdit() {
      this.showEditMode = false
      this.resetEditDates()
    },

    submitDates() {
      this.isSubmitting = true

      const updatedItem = {
        id: this.checklistId,
        done: this.isDoneItem(this.checklistId),
        start_date: this.editStartDate,
        end_date: this.editEndDate
      }

      console.log("ChecklistSchedule - updatedItem:", updatedItem)

      this.updateChecklistItem({
        updatedItem,
        projectId: this.$route.params.id,
        contractId: this.$route.params.contract_id
      })
        .then(() => {
          this.currentStartDate = this.editStartDate
          this.currentEndDate = this.editEndDate
          this.showEditMode = false
          this.$emit("item-updated", updatedItem)
        })
        .catch((error) => {
          console.error("Error updating dates:", error)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.checklist-schedule {
  .dates-display {
    min-width: 200px;
  }
}
</style>
