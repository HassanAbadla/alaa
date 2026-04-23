<template>
  <v-layout column align-center justify-center fill-height>
    <slot name="title">
      <h1>{{ $t("error.wrong") }}</h1>
    </slot>
    
    <slot name="message">
      <p>{{ message }}</p>
    </slot>
    
    <slot name="code">
      <p>
        {{ $t("error.code") }}
        <span>{{ statusCode }}</span>
      </p>
    </slot>

    <slot name="action">
      <v-btn color="primary" :to="localePath('/')">{{ $t("error.home") }}</v-btn>
    </slot>
    
    <slot />
  </v-layout>
</template>

<script>
export default {
  name: "ErrorLayout",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    statusCode() {
      return this.error?.statusCode || this.$t("error.unknown")
    },
    message() {
      return this.error?.message || ""
    }
  }
}
</script>
