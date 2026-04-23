<template>
  <v-footer app height="24" class="footer-container py-0">
    <span class="footer-text">{{ title }} - Version: {{ formatedVersion }} (Built: {{ formatBuildDate }})</span>
  </v-footer>
</template>

<script>
import { formatDate } from "@/helpers/misc.js"
export default {
  name: "Footer",
  props: {
    name: { type: String }
  },
  computed: {
    title() {
      const year = new Date().getFullYear()
      // const title = this.isDeployBuild ? "GRC WOLF" : this.name
      const title = "GRC WOLF"
      // const extention = this.isDeployBuild ? "- powered by SILVER WOLF" : ""
      const extention = "- powered by SILVER WOLF"
      return `${title} © ${year} ${extention}`
    },
    isDeployBuild() {
      return this.$config.isDeployBuild
    },
    formatBuildDate() {
      const { date, time } = formatDate(this.$buildInfo.buildDate)
      return this.isDeployBuild ? `${date}` : `${date} ${time}`
    },
    formatedVersion() {
      return this.isDeployBuild ? this.trimVersion(this.$buildInfo.version) : this.$buildInfo.version
    }
  },
  methods: {
    trimVersion(version) {
      return version.split(".").slice(0, 2).join(".")
    }
  }
}
</script>

<style scoped>
.footer-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6); /* makes the text slightly muted */
}
</style>
