<template>
  <v-tooltip :left="isRTL" :right="!isRTL">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-2" dense small text color="" v-bind="attrs" v-on="on" @click="handleClick">
        <v-icon left>{{ btnIcon }}</v-icon>
        {{ $t("page.back") }}
      </v-btn>
    </template>
    <span>{{ tooltipTextToDisplay }}</span>
  </v-tooltip>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "CustomTableBackBtn",
  props: {
    tooltipText: {
      type: String
    },
    path: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    btnIcon() {
      return this.isRTL ? "mdi-chevron-right" : "mdi-chevron-left"
    },
    tooltipTextToDisplay() {
      return this.tooltipText || this.$t("page.back")
    }
  },
  methods: {
    handleClick() {
      if (this.path) {
        // If a specific path is provided, navigate to it
        this.routeTo(this.path)
      } else {
        // Go back to the previous page using browser history
        this.$router.go(-1)

        // Also emit click event to maintain backward compatibility
        this.$emit("click")
      }
    },
    routeTo(path) {
      if (this.$router) {
        this.$router.push(path)
      } else {
        console.warn("Vue Router is not available. Navigation aborted.")
      }
    }
  }
}
</script>
