<template>
  <v-card flat outlined class="rounded-xl">
    <v-card-title class="d-flex flex-row align-center primary white--text py-2">
      <v-tooltip bottom :disabled="!isTitleTruncated" content-class="caption">
        <template v-slot:activator="{ on, attrs }">
          <span ref="titleSpan" class="text-truncate flex-grow-1 text-subtitle-1" v-bind="attrs" v-on="on">
            {{ title }}
          </span>
        </template>
        <span>{{ title }}</span>
      </v-tooltip>
      <div class="ml-2">
        <slot name="title-right"></slot>
      </div>
    </v-card-title>
    <v-card-text class="pb-0 px-2">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "UnifiedCardWrapper",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isTitleTruncated: false
    }
  },
  mounted() {
    this.$nextTick(this.checkTitleTruncation)
    window.addEventListener("resize", this.checkTitleTruncation)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkTitleTruncation)
  },
  watch: {
    title() {
      this.$nextTick(this.checkTitleTruncation)
    }
  },
  methods: {
    checkTitleTruncation() {
      if (this.$refs.titleSpan) {
        const element = this.$refs.titleSpan
        this.isTitleTruncated = element.scrollWidth > element.clientWidth
      }
    }
  }
}
</script>
