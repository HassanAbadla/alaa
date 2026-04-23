<template>
  <v-layout dense column class="pa-4">
    <h2 v-if="computedTitle" class="title pb-4">{{ computedTitle }}</h2>
    <v-form @submit.prevent="handleSubmit" v-model="valid">
      <slot></slot>
      <v-btn type="submit" :disabled="!valid" :loading="loading" color="primary" block>
        {{ computedSubmitText }}
      </v-btn>
    </v-form>
  </v-layout>
</template>

<script>
export default {
  name: "FormWrapper",
  props: {
    title: {
      type: String,
      default: null
    },
    submitText: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: false
    }
  },
  computed: {
    computedTitle() {
      return this.title || ""
    },
    computedSubmitText() {
      return this.submitText || this.$t("auth.submit")
    }
  },
  methods: {
    handleSubmit() {
      this.$emit("submit")
    }
  }
}
</script>

<style scoped></style>
