<!--
  - Copyright (c) 2020.
  - Author:  Belgacemi mohamed seddik
  - github:  http://github.com/seddik32
  - facebook: https://www.facebook.com/Qsd5k
  - email: sed75dik@gmail.com
  - Last modified: 4/16/20, 11:38 PM
  -->

<template>
  <v-container>
    <v-alert :type="message.type" border="right" elevation="2" text v-model="message.show">
      {{ $t(message.text) }}
    </v-alert>

    <v-card>
      <v-card-title>{{ $t("change_password") }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            :label="$t('auth.current_password')"
            :rules="[(v) => !!v || $t('validation.required')]"
            prepend-inner-icon="mdi-security"
            type="password"
            outlined
            v-model="fields.current_password"
          />
          <v-divider />
          <v-text-field
            :label="$t('auth.password')"
            :rules="[(v) => !!v || $t('validation.required')]"
            color="primary"
            prepend-inner-icon="mdi-lock"
            type="password"
            outlined
            v-model="fields.password"
          />

          <v-text-field
            :label="$t('auth.confirm_password')"
            :rules="[
              (v) => !!v || $t('validation.required'),
              (v) => this.fields.password === this.fields.password_confirmation || $t('validation.confirm_password')
            ]"
            color="primary"
            outlined
            prepend-inner-icon="mdi-lock"
            type="password"
            v-model="fields.password_confirmation"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!valid" @click="save" block class="white--text" color="cyan">
          {{ $t("save") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Password",

  middleware: "auth",
  head() {
    return {
      title: this.$t("auth.change_password")
    }
  },
  data() {
    return {
      valid: false,
      fields: {
        current_password: "",
        password: "",
        password_confirmation: ""
      },
      message: {
        show: false,
        type: "",
        text: ""
      }
    }
  },
  methods: {
    save() {
      const { current_password, password, password_confirmation } = this.fields

      this.$axios
        .post("profile/change-password", {
          current_password,
          password,
          password_confirmation
        })
        .then((res) => {
          this.message = {
            show: true,
            type: "success",
            text: "alert.save_success"
          }
        })
        .catch((e) => {
          this.message = {
            show: true,
            type: "error",
            text: "alerts.save_error"
          }
        })
    }
  }
}
</script>

<style scoped></style>
