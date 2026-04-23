<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn dense icon v-bind="attrs" v-on="on" @click="click">
        <v-icon :color="computedAttrs.color">{{ computedAttrs.icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ computedAttrs.text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "AccessIcon",
  props: {
    accessType: { type: String, default: null }
  },
  computed: {
    computedAttrs() {
      if (this.accessType === "full") {
        return { icon: "mdi-circle-slice-8", color: "green", text: this.$t("page.give_full_access") }
      }
      if (this.accessType === "partial") {
        return { icon: "mdi-circle-slice-3", color: "orange", text: this.$t("page.give_partial_access") }
      }

      return { icon: "mdi-close-circle", color: "red", text: this.$t("page.deny_access") }
    }
  },
  methods: {
    click() {
      this.$emit("click")
    }
  }
}
</script>

<style></style>
