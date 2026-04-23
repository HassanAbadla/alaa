<template>
  <v-stepper flat v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Step 1</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Step 2</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Confirmation</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card color="transparent" flat class="pa-4">
          <v-card-text>
            <v-form v-model="validStep1">
              <v-text-field
                :error-messages="errors.name"
                :label="$t('auth.company_name')"
                :rules="[(v) => !!v || $t('validation.required')]"
                @change="errors.companyName = []"
                color="primary"
                prepend-inner-icon="mdi-domain"
                v-model="fields.companyName"
                outlined
              />
              <v-text-field
                outlined
                :error-messages="errors.email"
                :label="$t('auth.email')"
                :rules="[(v) => !!v || $t('validation.required'), (v) => /.+@.+\..+/.test(v) || $t('validation.email')]"
                @change="errors.email = []"
                color="primary"
                required
                type="email"
                v-model="fields.email"
                v-validate="'required'"
                prepend-inner-icon="mdi-at"
              />
              <v-text-field
                outlined
                name="phone"
                :error-messages="errors.phone"
                :label="$t('auth.phone')"
                :rules="[(v) => !!v || $t('validation.required')]"
                @change="errors.phone = []"
                v-model="fields.phone"
                color="primary"
                prepend-inner-icon="mdi-phone"
              />
              <v-btn :disabled="!validStep1" color="primary" @click="e1 = 2">Continue</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card color="transparent" flat class="pa-4">
          <v-card-text>
            <v-form lazy-validation v-model="validStep2">
              <v-text-field
                outlined
                name="fullName"
                :error-messages="errors.phone"
                :label="$t('auth.name')"
                :rules="[(v) => !!v || $t('validation.required')]"
                @change="errors.fullName = []"
                v-model="fields.fullName"
                color="primary"
                prepend-inner-icon="mdi-account-tie"
              />
              <v-select
                :items="items"
                :error-messages="errors.city"
                :label="$t('auth.city')"
                :rules="[(v) => !!v || $t('validation.required')]"
                @change="errors.city = []"
                v-model="fields.city"
                prepend-inner-icon="mdi-map-marker"
                outlined
              ></v-select>
              <v-text-field
                outlined
                name="password"
                :error-messages="errors.password"
                :label="$t('auth.password')"
                :rules="[(v) => !!v || $t('validation.required')]"
                @change="errors.password = []"
                type="password"
                color="primary"
                prepend-inner-icon="mdi-key-variant"
              />
              <v-btn :disabled="!validStep2" color="primary" @click="e1 = 3">Continue</v-btn>
              <v-btn text @click="e1 = 1">Back</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card color="transparent" flat>
          <v-card-title>Please Check Your Information and Confirm</v-card-title>
          <v-list-item v-for="(value, key) in filteredFields" :key="key">{{ key }} : {{ value }}</v-list-item>
          <br />
        </v-card>
        <v-btn color="primary" @click="e1 = 1">Confirm</v-btn>

        <v-btn text @click="e1 = 2">Back</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data() {
    return {
      e1: 1,
      validStep1: false,
      validStep2: false,
      fields: {
        email: "",
        fullName: "",
        city: "",
        companyName: "",
        phone: "",
        password: ""
      },
      errors: {
        companyName: [],
        fullName: [],
        phone: [],
        email: [],
        password: []
      },
      items: ["foo", "Bar", "Fizz", "Buzz"]
    }
  },
  computed: {
    filteredFields() {
      return Object.fromEntries(Object.entries(this.fields).filter(([key]) => key !== "password"))
    }
  }
}
</script>
