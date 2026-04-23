<template>
  <v-card flat class="pa-4">
    <v-layout>
      <v-spacer />
      <v-img max-width="128px" src="/logo.svg" />
      <v-spacer />
    </v-layout>
    <v-card-title>
      <v-spacer />
      {{ $t("auth.register_user") }}
      <v-spacer />
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-row>
        <v-col cols="12" md="12" sm="12" xs="12">
          <v-form v-model="valid">
            <v-text-field
              outlined
              :error-messages="errors.userName"
              :label="$t('auth.email')"
              :rules="[(v) => !!v || $t('validation.required')]"
              @change="errors.userName = []"
              color="primary"
              v-model="fields.userName"
              v-validate="'required'"
            />
            <v-text-field
              outlined
              :error-messages="errors.phone"
              :label="$t('auth.phone')"
              :rules="[(v) => !!v || $t('validation.required')]"
              @change="errors.phone = []"
              color="primary"
              v-model="fields.phone"
              v-validate="'required'"
            />
            <v-text-field
              outlined
              :error-messages="errors.password"
              :rules="[(v) => !!v || $t('validation.required')]"
              @change="errors.password = []"
              color="primary"
              prepend-icon="mdi-lock"
              type="password"
              v-model="fields.password"
            />
            <v-btn :disabled="!valid" :loading="loading" @click="registerUser()" block class="white--text" color="blue">
              {{ $t("auth.register_user") }}
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
  data() {
    return {
      fields: {
        userName: "",
        phone: ""
      },
      errors: {
        userName: [],
        phone: []
      },
      valid: false,
      loading: false
    }
  },
  methods: {
    registerUser() {
      // Registration logic for users goes here
      // Use this.fields to access form data
    }
  }
}
</script>
