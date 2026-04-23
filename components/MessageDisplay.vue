<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="text-center">
          <v-card-title>{{ messageTitle }} {{ code }}</v-card-title>
          <v-card-text>{{ messageText }}</v-card-text>
          <v-btn color="primary" @click="handleClick">{{ btnText }}</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MessageDisplay",
  /**
   * Props passed to the component.
   */
  props: {
    /**
     * The title of the message card.
     * @type {String}
     * @default "Error"
     */
    messageTitle: {
      type: String,
      default() {
        return this.$t("error.error")
      }
    },
    /**
     * The text of the message card.
     * @type {String}
     * @default "An unexpected error occurred. Please try again later."
     */
    messageText: {
      type: String,
      default() {
        return this.$t("error.generic")
      }
    },
    /**
     * The error code (if any) to display alongside the title.
     * @type {Number}
     * @default null
     */
    code: {
      type: Number,
      default: null
    },
    /**
     * Configuration for the button. It should contain text and path.
     * @type {Object}
     * @default { text: "", path: "" }
     */
    btnConfig: {
      type: Object,
      default: () => ({ text: "", path: "" })
    }
  },
  methods: {
    /**
     * Handles the button click event.
     * If a path is provided in btnConfig, it navigates to that path.
     * Otherwise, it navigates back to the previous page.
     */
    handleClick() {
      const { path } = this.btnConfig
      if (path) {
        this.$router.push(this.localePath(path))
      } else {
        this.$router.back()
      }
    }
  },
  computed: {
    /**
     * Computes the button text. If btnConfig.text is not provided,
     * it defaults to a generic "Go Back" text.
     * @returns {String}
     */
    btnText() {
      return this.btnConfig.text || this.$t("generic.go_back")
    }
  }
}
</script>

<style scoped>
.v-card {
  padding: 20px;
  margin-top: 20px;
}
</style>
