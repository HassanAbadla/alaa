<template>
  <v-card flat class="pa-4">
    <v-layout>
      <v-spacer />
      <v-img max-width="128px" src="/logo.svg" />
      <v-spacer />
    </v-layout>
    <v-card-title>
      <v-spacer />
      {{ $t("auth.register") }}
      <v-spacer />
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-row>
        <v-col cols="12" md="12" sm="12" xs="12">
          <v-form v-model="valid">
            <v-text-field
              outlined
              :error-messages="errors.email"
              :label="$t('auth.email')"
              :rules="[(v) => !!v || $t('validation.required'), (v) => /.+@.+\..+/.test(v) || $t('validation.email')]"
              @change="errors.email = []"
              color="primary"
              prepend-icon="mdi-at"
              required
              type="email"
              v-model="fields.email"
              v-validate="'required'"
            />
            <v-text-field
              :error-messages="errors.name"
              :hint="$t('optional')"
              :label="$t('auth.name')"
              @change="errors.name = []"
              color="primary"
              prepend-icon="mdi-account"
              v-model="fields.name"
              outlined
            />
            <v-text-field
              outlined
              :error-messages="errors.password"
              :label="$t('auth.password')"
              :rules="[(v) => !!v || $t('validation.required')]"
              @change="errors.password = []"
              color="primary"
              prepend-icon="mdi-lock"
              type="password"
              v-model="fields.password"
            />
            <a href="/page/term-of-use" target="_blank">
              {{ $t("terms_of_use") }}
            </a>
            <v-checkbox
              :label="$t('auth.agree')"
              :rules="[(v) => !!v || $t('validation.required')]"
              color="blue"
              v-model="agree"
            />
            <v-btn :disabled="!valid" :loading="loading" @click="registerNow()" block class="white--text" color="blue">
              {{ $t("auth.register") }}
            </v-btn>
          </v-form>
          <v-divider class="mt-4 mb-2" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "RegisterCard",

  middleware: "guest",
  head() {
    return {
      title: this.$t("auth.register")
    }
  },
  data() {
    return {
      loading: false,
      valid: false,
      register: 0,
      fields: {
        code: "",
        email: "",
        name: "",
        country_code: 1,
        phone: "",
        password: "",
        password_confirmation: "",
        client_id: "2",
        client_secret: "K6Vrs6deHbwsN1Bvo2MDU00aLWIP2E4Il8Y0fCIc",
        grant_type: "password",
        username: ""
      },
      errors: {
        name: [],
        phone: [],
        country_code: [],
        email: [],
        username: [],
        password: []
      },
      flashErrors: {
        name: null,
        phone: null,
        country_code: null,
        email: null,
        username: null,
        password: null
      },
      agree: false
    }
  },
  methods: {
    sendCode() {
      this.$axios
        .post("send_code", {
          phone: this.fields.phone
        })
        .then((res) => {
          if (res.data.status == "success") this.registerCard = 1
        })
    },
    verifyCode() {
      this.$axios
        .post("verify_code", {
          phone: this.fields.phone,
          code: this.fields.code
        })
        .then((res) => {
          if (res.data.status) this.registerCard = 2
        })
    },
    getErrors() {
      if (this.flashErrors.name) {
        this.flashErrors.name.map((item) => {
          this.errors.name.push(this.$t(item))
        })
      }
      if (this.flashErrors.email) {
        this.flashErrors.email.map((item) => {
          this.errors.email.push(this.$t(item))
        })
      }
      if (this.flashErrors.username) {
        this.flashErrors.username.map((item) => {
          this.errors.username.push(this.$t(item))
        })
      }
      if (this.flashErrors.country_code) {
        this.flashErrors.country_code.map((item) => {
          this.errors.country_code.push(this.$t(item))
        })
      }
      if (this.flashErrors.phone) {
        this.flashErrors.phone.map((item) => {
          this.errors.phone.push(this.$t(item))
        })
      }
      if (this.flashErrors.password) {
        this.flashErrors.password.map((item) => {
          this.errors.password.push(this.$t(item))
        })
      }
    },
    registerNow() {
      const { name, email, password, password_confirmation, phone, country_code } = this.fields
      this.fields.username = email
      this.$axios.post("register", this.fields).then((res) => {
        console.log(res.data)
        if (res.data.status == true) {
          this.$auth
            .loginWith("local", {
              data: this.fields
            })
            .then((res) => {
              console.log(res)
              console.log(this.$auth)
              console.log(this.$auth.user)
              this.$emit("loginDialog", false)
              window.location.reload()
              //this.$router.push('/')
            })
            .catch((e) => {
              console.error(e)
              this.error = true
            })
        }
      })
    }
  }
}
</script>

<style scoped></style>
