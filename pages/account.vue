<template>
  <v-container fluid>
    <v-card>
      <v-tabs color="secondary" centered :vertical="$vuetify.breakpoint.mdAndUp">
        <v-tab>
          <v-icon>mdi-account</v-icon>
          {{ $t("edit_profile") }}
        </v-tab>
        <v-tab>
          <v-icon>mdi-lock</v-icon>
          {{ $t("change_password") }}
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <edit-profile />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <password />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import EditProfile from "@/components/profile/editProfile.vue"
import Password from "@/pages/setting/password.vue"

export default {
  name: "account",
  components: { Password, EditProfile },
  middleware: "auth"
}
</script>

<style>
.v-slide-group__content {
  align-items: flex-start !important;
}
</style>
