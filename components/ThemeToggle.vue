// components/ThemeToggle.vue
<template>
  <div>
    <!-- <v-btn
      text
      @click="toggleTheme"
      :title="$vuetify.theme.dark ? $t('page.switch_to_light_mode') : $t('page.switch_to_dark_mode')"
    >
      <v-icon>
        {{ $vuetify.theme.dark ? "mdi-weather-sunny" : "mdi-weather-night" }}
      </v-icon>
    </v-btn> -->
  </div>
</template>

<script>
export default {
  name: "ThemeToggle",
  mounted() {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("pmis-theme")
    if (savedTheme) {
      this.$vuetify.theme.dark = savedTheme === "dark"
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      // Save the new theme preference
      localStorage.setItem("pmis-theme", this.$vuetify.theme.dark ? "dark" : "light")
    }
  }
}
</script>
