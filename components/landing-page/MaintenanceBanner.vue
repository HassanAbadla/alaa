<template>
  <div v-if="$config.isUnderMaintenance" class="maintenance-overlay">
    <v-card class="maintenance-card" elevation="8" rounded="lg">
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-center text-center">
          <div>
            <v-icon color="warning" size="32" class="mb-2">mdi-wrench</v-icon>
            <div class="text-h6 font-weight-bold warning--text mb-2">
              {{ $t("maintenance.title") }}
            </div>
            <div class="text-body-1 grey--text text--darken-1">
              {{ $t("maintenance.message") }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "MaintenanceBanner"
}
</script>

<style scoped>
.maintenance-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none; /* Allows clicks to pass through to content below */
}

.maintenance-card {
  min-width: 320px;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #ff9800;
  pointer-events: auto; /* Re-enable pointer events for the card itself */
  animation: fadeInScale 0.4s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .maintenance-card {
    min-width: 280px;
    max-width: 90vw;
    margin: 0 16px;
  }
}
</style>
