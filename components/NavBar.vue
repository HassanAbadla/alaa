<template>
  <div>
    <nav-bar-wrapper flat app>
      <v-toolbar-title class="pa-0 ma-0">
        <!-- <logo /> -->
      </v-toolbar-title>
      <v-spacer />
      <change-language />

      <!-- Show maintenance message if under maintenance -->
      <v-chip v-if="$config.isUnderMaintenance" color="warning" text-color="black" class="mx-2" small>
        <v-icon small left>mdi-wrench</v-icon>
        {{ $t("maintenance.under_maintenance") }}
      </v-chip>

      <!-- Disable login/register buttons when under maintenance -->
      <login-btn :disabled="$config.isUnderMaintenance" />
      <v-btn
        class="text-capitalize mx-2 py-0"
        color="tertiary"
        v-if="!$auth.loggedIn"
        :disabled="$config.isUnderMaintenance"
        @click="openDialog('register')"
      >
        {{ $t("auth.register") }}
      </v-btn>

      <div v-else>
        <v-btn class="text-capitalize" text outlined color="tertiary" :to="localePath('/main')">
          {{ $t("page.modules") }}
        </v-btn>
        <logout-btn />
      </div>
    </nav-bar-wrapper>
    <custom-dialog v-model="dialog['register']" :title="$t('auth.register')">
      <register-form />
    </custom-dialog>
  </div>
</template>

<script>
import LoginBtn from "./landing-page/LoginBtn.vue"
import Logo from "./landing-page/Logo.vue"
import NavBarWrapper from "./landing-page/NavBarWrapper.vue"
import CustomDialog from "./CustomDialog.vue"
import RegisterForm from "./forms/RegisterForm.vue"
import LogoutBtn from "./LogoutBtn.vue"
import ChangeLanguage from "./changeLanguage.vue"

export default {
  components: { Logo, NavBarWrapper, LoginBtn, CustomDialog, RegisterForm, LogoutBtn, ChangeLanguage },
  data() {
    return {
      drawer: false,
      dialog: { register: false }
    }
  },
  computed: {},
  methods: {
    openDialog(name) {
      // Don't open dialog if under maintenance
      if (this.$config.isUnderMaintenance) {
        return
      }
      this.dialog[name] = true
    }
  }
}
</script>

<style scoped>
.v-toolbar__title {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
