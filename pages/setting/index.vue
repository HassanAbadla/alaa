<!--
  - Copyright (c) 2020.
  - Author:  Belgacemi mohamed seddik
  - github:  http://github.com/seddik32
  - facebook: https://www.facebook.com/Qsd5k
  - email: sed75dik@gmail.com
  - Last modified: 4/16/20, 10:44 PM
  -->

<template>
  <v-container>
    <v-alert :type="message.type" border="right" elevation="2" text v-model="message.show">
      {{ $t("message.text") }}
    </v-alert>
    <v-row>
      <v-col cols="12" md="8">
        <v-card :loading="loading">
          <v-card-title>{{ $t("account") }}</v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                outlined
                :error-messages="errors.email"
                :label="$t('auth.email')"
                :rules="[(v) => !!v || $t('validation.required'), (v) => /.+@.+\..+/.test(v) || $t('validation.email')]"
                @change="errors.email = null"
                prepend-inner-icon="mdi-email"
                v-model="user.email"
              />
              <v-text-field
                outlined
                prepend-inner-icon="mdi-phone"
                :error-messages="errors.phone"
                :label="$t('auth.phone')"
                :rules="[
                  (v) => !!v || $t('validation.required'),
                  (v) =>
                    /^(([{1}[0-9]{1,2}[\ ]{1}[0-9]{4}[\ ]{1}[0-9]{4})|([0]{1}[0-9]{1}[\ ]{1}[0-9]{4}[\ ]{1}[0-9]{4})|([0]{1}[0-9]{1}[\-]{1}[0-9]{4}[\-]{1}[0-9]{4})|([\(]{1}[0]{1}[0-9]{1}[\)]{1}[\ ]{1}[0-9]{4}([\ ]|[\-]){1}[0-9]{4})|([0-9]{4}([\ ]|[\-])?[0-9,3}[\ ]]{4})|([0]{1}[0-9]{3}[\ ]{1}[0-9]{3}[\ ]{1}[0-9]{3})|([0]{1}[0-9]{9})|([\(]{1}[0-9]{3}[\)]{1}[\ ]{1}[0-9]{3}[\-]{1}[0-9]{4})|([0-9]{3}([\/]|[\-]){1}[0-9]{3}[\-]{1}[0-9]{4})|([1]{1}[\-]?[0-9]{3}([\/]|[\-]){1}[0-9]{3}[\-]{1}[0-9]{4})|([1]{1}[0-9]{9}[0-9]?)|([0-9]{3}[\.]{1}[0-9]{3}[\.]{1}[0-9]{4})|([\(]{1}[0-9]{3}[\)]{1}[0-9]{3}([\.]|[\-]){1}[0-9]{4}(([\ ]?(x|ext|extension)?)([\ ]?[0-9]{3,4}))?)|([1]{1}[\(]{1}[0-9]{3}[\)]{1}[0-9]{3}([\-]){1}[0-9]{4})|([\+]{1}[1]{1}[\ ]{1}[0-9]{3}[\.]{1}[0-9]{3}[\-]{1}[0-9]{4})|([\+]{1}[1]{1}[\ ]?[\(]{1}[0-9]{3}[\)]{1}[0-9]{3}[\-]{1}[0-9]{4}))$/.test(
                      v
                    ) || $t('validation.phone')
                ]"
                @change="errors.phone = null"
                color="primary"
                v-model="user.phone"
              />
              <v-text-field
                outlined
                :error-messages="errors.name"
                :label="$t('auth.name')"
                :rules="[(v) => !!v || $t('validation.required')]"
                @change="errors.name = null"
                prepend-inner-icon="mdi-account"
                v-model="user.name"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn :disabled="!valid" @click="saveData()" class="white--text" color="cyan" block>
              {{ $t("save") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <div class="v-card-profile">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-avatar class="mx-auto d-block elevation-6" size="130" slot="offset">
                <v-img
                  :alt="$auth.user.name"
                  :src="$auth.user.avatar"
                  v-if="/(https?:\/\/[^\s]+)/.test($auth.user.avatar)"
                />
                <v-img :alt="$auth.user.name" :src="'/storage/' + $auth.user.avatar" v-else />
                <v-fade-transition>
                  <v-overlay absolute v-if="hover">
                    <v-btn @click="editAvatar = true" color="white" icon>
                      <v-icon>mdi-camera</v-icon>
                    </v-btn>
                  </v-overlay>
                </v-fade-transition>
              </v-avatar>
            </template>
          </v-hover>
          <v-form v-if="editAvatar" style="width: 100%" v-model="validAvatar">
            <v-file-input
              :label="$t('auth.avatar')"
              :rules="[(v) => !!v || $t('validation.required')]"
              accept="image/png, image/jpeg, image/bmp"
              dense
              prepend-icon="mdi-camera"
              ref="avatar"
              v-model="user.avatar"
            >
              <template slot="append">
                <v-btn :disabled="!validAvatar" @click="saveAvatar()" color="cyan" text>
                  {{ $t("save") }}
                </v-btn>
              </template>
            </v-file-input>
          </v-form>
          <v-card-text class="text-center">
            <h6 class="overline mb-3">
              {{ $auth.user.name }}
            </h6>
          </v-card-text>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Index",

  middleware: "auth",

  head() {
    return {
      title: this.$t("setting")
    }
  },
  data() {
    return {
      menu: false,
      valid: false,
      validAvatar: false,
      user: {
        name: this.$auth.user.name,
        phone: this.$auth.user.phone,
        country_code: this.$auth.user.country_code,
        email: this.$auth.user.email,
        username: this.$auth.user.username,
        birthday: this.$auth.user.birthday,
        avatar: undefined
      },
      errors: {
        name: null,
        phone: null,
        country_code: null,
        email: null,
        username: null,
        birthday: null,
        avatar: null
      },
      flashErrors: {
        name: null,
        phone: null,
        country_code: null,
        email: null,
        birthday: null,
        username: null,
        avatar: null
      },
      message: {
        show: false,
        type: "",
        text: ""
      },
      editAvatar: false,
      loading: false
    }
  },
  methods: {
    getErrors() {
      const errors = {
        name: [],
        phone: [],
        country_code: [],
        email: [],
        username: [],
        birthday: [],
        avatar: []
      }
      if (this.flashErrors.name) {
        this.flashErrors.name.map((item) => {
          errors.name.push(this.$t(item))
        })
      }
      if (this.flashErrors.email) {
        this.flashErrors.email.map((item) => {
          errors.email.push(this.$t(item))
        })
      }
      if (this.flashErrors.birthday) {
        this.flashErrors.birthday.map((item) => {
          errors.birthday.push(this.$t(item))
        })
      }
      if (this.flashErrors.username) {
        this.flashErrors.username.map((item) => {
          errors.username.push(this.$t(item))
        })
      }
      if (this.flashErrors.country_code) {
        this.flashErrors.country_code.map((item) => {
          errors.country_code.push(this.$t(item))
        })
      }
      if (this.flashErrors.phone) {
        this.flashErrors.phone.map((item) => {
          errors.phone.push(this.$t(item))
        })
      }
      this.errors = errors
    },
    saveData() {
      this.loading = true
      const { email, name, phone, username, country_code, birthday } = this.user
      const id = this.$auth.user.id
      this.$axios
        .post("profile/update", {
          id,
          email,
          name,
          phone,
          username,
          country_code,
          birthday
        })
        .then((res) => {
          this.$auth.setUser(res.data.data)
        })
        .catch((e) => {
          const { graphQLErrors } = e
          if (graphQLErrors[0].extensions.category === "validation") {
            this.flashErrors = graphQLErrors[0].extensions.validation
          }
          this.getErrors()
          this.message = {
            show: true,
            type: "error",
            text: "alerts.save_error"
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    saveAvatar() {
      let formData = new FormData()
      formData.append("avatar", this.user.avatar)

      this.$axios
        .post("profile/avatar", formData)
        .then((res) => {
          //this.$auth.setUser(res.data)
          this.message = {
            show: true,
            type: "success",
            text: "alerts.save_success"
          }
        })
        .catch((res) => {
          this.message = {
            show: true,
            type: "error",
            text: "alerts.save_error"
          }
        })
    },

    pickAvatar() {
      this.$refs.avatar.click()
    },
    save(date) {
      this.$refs.menu.save(date)
    }
  }
}
</script>

<style scoped></style>
