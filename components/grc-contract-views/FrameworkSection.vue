<template>
  <div class="d-flex flex-column">
    <v-card flat class="d-flex flex-column">
      <div class="flex-grow-0">
        <h4 class="text-subtitle-2 mb-2">
          <slot name="title-left"></slot>
          {{ title }}
        </h4>
      </div>
      <v-list-item-subtitle :class="listStyling">
        <v-card flat outlined :class="`rounded-xl pa-3 ${progressStyling}`">
          <circular-progress :title="$t('page.progress')" :value="progress" color="secondary" />
        </v-card>
        <v-card flat outlined :class="`rounded-xl pa-3 ${scoreStyling}`">
          <circular-progress :title="$t('page.score')" :value="score" color="tertiary" />
        </v-card>
      </v-list-item-subtitle>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"
import CircularProgress from "../custom-table/CircularProgress.vue"
export default {
  components: { CircularProgress },
  name: "FrameworkSection",
  props: {
    title: { type: String, default: "" },
    progress: { type: Number },
    score: { type: Number },
    row: { type: Boolean, default: false }
  },
  computed: {
    ...mapState(["isRTL"]),
    listStyling() {
      return this.row ? "d-flex flex-row " : "flex-column d-flex align-start justify-space-between"
    },
    progressStyling() {
      return this.row ? (this.isRTL ? "ml-2" : "mr-2") : "mb-1"
    },
    scoreStyling() {
      return this.row ? "" : " mt-1"
    }
  }
}
</script>

<style></style>
