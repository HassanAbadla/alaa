<template>
  <div>
    <div v-if="!edit">
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("notifications") }}
        </span>
        <span class="text--secondary mx-3">{{ $t("allowed") }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("location") }}
        </span>
        <span class="text--secondary mx-3">{{ $t("allowed") }}</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
      <v-layout class="mt-3 pa-3" row wrap align-center>
        <span style="width: 80px" class="font-weight-bold mx-3">
          {{ $t("language") }}
        </span>
        <span class="text--secondary mx-3">English</span>
        <v-spacer />
        <v-btn text color="primary mx-3" @click="edit = true">
          {{ $t("edit") }}
        </v-btn>
      </v-layout>
    </div>
    <div v-else class="mt-4 pa-3">
      <v-switch v-model="fields.notifications" outlined :label="$t('notifications')" />
      <span class="text--secondary">
        By allowing push notifications you will receive reminders about upcoming trips and more
      </span>
      <v-switch v-model="fields.location" outlined :label="$t('location')" />
      <span class="text--secondary">
        By allowing access to location you will be able to filter trips based on their distance from you
      </span>
      <change-language />
    </div>
  </div>
</template>

<script>
import ChangeLanguage from "../changeLanguage.vue"
export default {
  name: "SettingsProfile",
  components: { ChangeLanguage },
  data() {
    return {
      edit: false,
      fields: {
        notifications: true,
        location: true,
        language: "English"
      }
    }
  }
}
</script>

<style scoped></style>
