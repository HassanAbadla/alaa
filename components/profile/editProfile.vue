<template>
  <div>
    <h3>{{ $t("general_information") }}:</h3>
    <div v-if="!edit">
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("auth.name") }}
        </span>
        <span class="text--secondary mx-3">{{ fields.name }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("auth.email") }}
        </span>
        <span class="text--secondary mx-3">{{ fields.email }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("auth.phone") }}
        </span>
        <span class="text--secondary mx-3">{{ fields.phone }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
    </div>
    <div v-else class="mt-4">
      <v-text-field v-model="fields.name" outlined :label="$t('auth.name')" />
      <v-text-field v-model="fields.email" outlined :label="$t('auth.email')" />
      <v-text-field v-model="fields.phone" outlined :label="$t('auth.phone')" />
      <v-btn color="primary" @click="editProfile">{{ $t("save") }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditProfile",
  data() {
    return {
      edit: false,
      fields: {
        name: null,
        email: null,
        phone: null
      }
    }
  },
  mounted() {
    if (this.$auth.user) {
      this.fields.name = this.$auth.user.name
      this.fields.email = this.$auth.user.email
      this.fields.phone = this.$auth.user.phone
    }
  },
  methods: {
    editProfile() {
      this.$axios.post("profile/update", this.fields).then((res) => {
        this.edit = false
      })
    }
  }
}
</script>

<style scoped></style>
