<template>
  <div class="language-selector">
    <v-menu v-model="menu" :close-on-content-click="true" offset-y transition="scale-transition" min-width="100">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="tertiary"
          text
          small
          v-bind="attrs"
          v-on="on"
          class="text-uppercase font-weight-medium px-2"
          :class="$store.state.language === activeLang ? 'primary--text' : ''"
        >
          {{ $store.state.language }}
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          v-for="locale in $i18n.locales"
          :key="locale.code"
          @click="changeLanguage(locale.code)"
          :class="$store.state.language === locale.code ? 'primary--text' : ''"
        >
          <v-list-item-title class="text-uppercase">{{ locale.code }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "ChangeLanguage",
  data() {
    return {
      menu: false
    }
  },
  computed: {
    activeLang() {
      return this.$store.state.language
    }
  },
  methods: {
    changeLanguage(lang) {
      if (lang === this.$store.state.language) return
      this.$store.dispatch("updateLanguage", lang)
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.language-selector {
  display: inline-block;
}
</style>
