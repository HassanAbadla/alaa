<template>
  <div>
    <v-app-bar app flat dark class="px-15" color="black">
      <v-spacer />
      <v-app-bar-nav-icon class="mr-4" v-if="isXs" />
      <div v-else>
        <v-btn v-if="!$auth.loggedIn" to="/register">
          <span class="mr-2">Register as a Corporate</span>
        </v-btn>
        <v-btn outlined text v-if="!$auth.loggedIn" :to="localePath('/auth/login')">
          <span class="mr-2">Log In</span>
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<style scoped>
.v-toolbar {
  transition: 0.6s;
}

.expand {
  height: 80px !important;
  padding-top: 10px;
}
</style>

<script>
export default {
  data: () => ({
    drawer: null,
    isXs: false,
    items: [
      ["mdi-home-outline", "Home", "#hero"],
      ["mdi-information-outline", "Sobre", "#features"],
      ["mdi-download-box-outline", "Download", "#download"],
      ["mdi-currency-usd", "Preços", "#pricing"],
      ["mdi-email-outline", "Contatos", "#contact"]
    ]
  }),
  props: {
    color: String,
    flat: Boolean
  },
  methods: {
    onResize() {
      this.isXs = window.innerWidth < 850
    }
  },

  watch: {
    isXs(value) {
      if (!value) {
        if (this.drawer) {
          this.drawer = false
        }
      }
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener("resize", this.onResize, { passive: true })
  }
}
</script>
