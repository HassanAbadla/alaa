<template>
  <v-app>
    <!-- <logged-in-nav-bar>
      <EduSideBar />
    </logged-in-nav-bar> -->
    <logged-in-nav-bar>
      <EduSideBar />
    </logged-in-nav-bar>
    <v-main>
      <toast-notification />
      <!-- <breadcrumbs /> -->
      <Nuxt />
    </v-main>
    <custom-drawer />

    <Footer :name="'Education'" />
  </v-app>
</template>

<script>
import languageHandler from "~/mixins/languageHandler";
import CustomDrawer from "../components/CustomDrawer.vue";
import Footer from "@/components/Footer.vue";
import layoutHandler from "../mixins/layoutHandler";

export default {
  components: { CustomDrawer, Footer },
  name: "education",
  mixins: [languageHandler, layoutHandler],
};
</script>
