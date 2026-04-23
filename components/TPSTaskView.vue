<template>
  <div class="my-4">
    <v-card flat v-if="selectedItemTask.length" class="task-details-card">
      <v-card elevation-5 v-for="task in selectedItemTask" :key="task.id" class="mb-4">
        <!-- Header Section with Title -->
        <div class="task-header pa-6 pb-4">
          <div class="d-flex align-start justify-space-between mb-4">
            <div class="flex-grow-1">
              <h3 class="task-title text-h6 font-weight-medium mb-2">
                {{ task?.title }}
              </h3>
              <div class="task-meta d-flex align-center">
                <v-avatar size="24" class="mr-2">
                  <v-icon small color="primary">mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-2 text--secondary">
                  {{ $t("page.sender") }}:
                  <strong class="text--primary">{{ task?.sender?.full_name }}</strong>
                </span>
              </div>
              <div class="task-meta d-flex align-center">
                <v-avatar size="24" class="mr-2">
                  <v-icon small color="primary">mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-2 text--secondary">
                  {{ $t("page.receiver") }}:
                  <strong class="text--primary">{{ task?.receiver?.full_name }}</strong>
                </span>
              </div>
            </div>
            <v-chip :color="task?.status?.color" text-color="white" small class="font-weight-medium">
              {{ task?.status?.name }}
            </v-chip>
          </div>
        </div>
        <v-divider></v-divider>
        <!-- Main Content Section -->
        <div class="task-content pa-6 pt-4">
          <!-- Date Information -->
          <div class="date-section mb-6">
            <h4 class="section-title text-subtitle-1 font-weight-medium mb-3 text--secondary">
              {{ $t("page.schedule") }}
            </h4>
            <v-row no-gutters>
              <v-col cols="6" class="pr-2">
                <div class="date-item">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="success" class="mr-2">mdi-calendar-start</v-icon>
                    <span class="text-caption text--secondary font-weight-medium">
                      {{ $t("page.start_date") }}
                    </span>
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(task?.start_date) }}
                  </div>
                </div>
                <div class="date-item">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="success" class="mr-2">mdi-calendar-start</v-icon>
                    <span class="text-caption text--secondary font-weight-medium">
                      {{ $t("table.actual_start_date") }}
                    </span>
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(task?.actual_start_date) || "---" }}
                  </div>
                </div>
              </v-col>
              <v-col cols="6" class="pl-2">
                <div class="date-item">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="error" class="mr-2">mdi-calendar-end</v-icon>
                    <span class="text-caption text--secondary font-weight-medium">
                      {{ $t("page.end_date") }}
                    </span>
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(task?.end_date) }}
                  </div>
                </div>
                <div class="date-item">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="error" class="mr-2">mdi-calendar-end</v-icon>
                    <span class="text-caption text--secondary font-weight-medium">
                      {{ $t("table.actual_end_date") }}
                    </span>
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(task?.actual_end_date) || "---" }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
          <!-- Description/Note Section -->
          <div class="note-section" v-if="task?.body">
            <h4 class="section-title text-subtitle-1 font-weight-medium mb-3 text--secondary">
              {{ $t("page.note") }}
            </h4>
            <div class="note-content pa-4 rounded" :class="noteBackgroundClass">
              <p class="text-body-1 mb-0 line-height-relaxed">
                {{ task?.body }}
              </p>
            </div>
          </div>
        </div>
        <!-- Action Section (if needed) -->
        <v-divider></v-divider>
        <!-- <div class="task-actions pa-4 d-flex justify-end">
              <v-btn text color="primary" @click="handleCloseDialog" class="text-capitalize">
                {{ $t("page.close") }}
              </v-btn>
            </div> -->
      </v-card>
    </v-card>
    <v-card flat v-else class="task-details-card">
      <v-card-text class="text-center">
        {{ $t("table.no_data") }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TPSTaskView",
  props: {
    selectedItemTask: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ""

      // Customize date formatting based on your locale
      const date = new Date(dateString)
      return date.toLocaleDateString(this.$i18n.locale, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }
  }
}
</script>

<style scoped>
.task-details-card {
  background: var(--v-surface-base);
}

.task-header {
  background: linear-gradient(135deg, var(--v-primary-lighten5) 0%, var(--v-primary-lighten4) 100%);
}

.task-title {
  color: var(--v-primary-darken2);
  line-height: 1.4;
}

.section-title {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-item {
  padding: 12px;
  border-radius: 8px;
  background: var(--v-surface-base);
  border: 1px solid var(--v-border-base);
  transition: all 0.2s ease;
}

.date-item:hover {
  border-color: var(--v-primary-base);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.note-content {
  border-left: 4px solid var(--v-primary-base);
  background: var(--v-background-base);
}

.line-height-relaxed {
  line-height: 1.6;
}

.task-actions {
  background: var(--v-background-base);
}

/* Dark theme adjustments */
.theme--dark .task-header {
  background: linear-gradient(135deg, var(--v-primary-darken3) 0%, var(--v-primary-darken2) 100%);
}

.theme--dark .date-item {
  background: var(--v-surface-lighten1);
}

.theme--dark .note-content {
  background: var(--v-surface-lighten1);
}
</style>
