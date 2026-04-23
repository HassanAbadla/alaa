<template>
  <div>
    <h3>{{ $t("general_information") }}:</h3>
    <div v-if="!edit">
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("country") }}
        </span>
        <span class="text--secondary mx-3">{{ fields.country }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("city") }}
        </span>
        <span class="text--secondary mx-3">{{ fields.city }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("address.address") }}
        </span>
        <span class="text--secondary mx-3">{{ fields.address }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
    </div>
    <div v-else class="mt-4">
      <v-autocomplete
        :items="countries"
        item-value="id"
        item-text="nicename"
        v-model="fields.country"
        outlined
        :label="$t('country')"
      />
      <v-text-field v-model="fields.city" outlined :label="$t('city')" />
      <v-text-field v-model="fields.address" outlined :label="$t('address.address')" />
      <v-btn color="primary" @click="save">{{ $t("save") }}</v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "ProfileInformations",
  data() {
    return {
      edit: false,
      fields: {
        country: null,
        city: null,
        address: null
      }
    }
  },
  computed: {
    ...mapGetters({
      countries: "countries/getData"
    })
  },
  mounted() {
    this.getCountries()
    if (this.$auth.user) {
      if (this.$auth.user.information) {
        this.fields.country = this.$auth.user.information.country
        this.fields.city = this.$auth.user.information.city
        this.fields.address = this.$auth.user.information.address
      }
    }
  },
  methods: {
    ...mapActions({
      getCountries: "countries/fetchData"
    }),
    save() {
      this.$axios.post("profile/information", this.fields).then((res) => {
        this.edit = false
      })
    }
  }
}
</script>

<style scoped></style>
