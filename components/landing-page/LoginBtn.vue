<template>
  <div>
    <v-btn
      class="text-capitalize mx-2 py-0"
      v-if="!$auth.loggedIn"
      :color="color"
      @click.stop="openDialog('login')"
      :disabled="disabled"
    >
      {{ btnText }}
    </v-btn>
    <custom-dialog v-model="dialog['login']" :title="btnText">
      <login-form />
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from "../CustomDialog.vue"
import LoginForm from "../forms/LoginForm.vue"
export default {
  name: "LoginBtn",
  components: { CustomDialog, LoginForm },
  data() {
    return {
      dialog: {
        login: false
      }
    }
  },
  props: {
    text: { type: String },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    btnText() {
      return this.text || this.$t("auth.login")
    },
    color() {
      return this.text ? "primary" : "secondary"
    }
  },
  methods: {
    openDialog(name) {
      this.dialog[name] = true
    }
  }
}
</script>

<style></style>
