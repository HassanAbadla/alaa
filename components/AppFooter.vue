<template>
  <v-footer padless>
    <v-card color="primary" dark width="100%" flat class="rounded-0">
      <v-sheet dark color="primary" height="auto">
        <v-row align="center" justify="center" class="fill-height px-3">
          <v-col cols="12" md="2">
            <h4>{{ $t("contact_us") }}</h4>
            <p>{{ $t("our_social_media") }}</p>
          </v-col>
          <v-col cols="12" md="3">
            <v-list-item href="https://wa.me/971542525662" target="_blank">
              <v-list-item-icon class="white pa-2 ma-2 rounded-circle">
                <v-icon color="black">mdi-whatsapp</v-icon>
              </v-list-item-icon>
              <v-list-item-content style="direction: ltr !important">
                <h4 :class="$vuetify.rtl ? 'text-right' : 'text-left'">
                  {{ $t("whatsapp") }}
                </h4>
                <p :class="$vuetify.rtl ? 'text-right' : 'text-left'">+971 542 525 662</p>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" md="3">
            <v-list-item>
              <v-list-item-icon class="white pa-2 ma-2 rounded-circle">
                <v-icon color="black">mdi-at</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <h4>{{ $t("email") }}</h4>
                <p>info@biljumla.com</p>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-sheet>
      <v-card-text>
        <v-container>
          <v-row class="mt-4">
            <v-col cols="12" md="3">
              <h2 class="text-center">بالجملة</h2>
              <div class="mt-4">
                <v-img src="/icon.png" />
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <h4 class="text-capitalize">{{ $t("informations") }}</h4>
              <div class="mt-4">
                <ul class="footer-list white--text">
                  <li class="mt-2">
                    <nuxt-link
                      class="white--text text-decoration-none text-capitalize"
                      :to="localePath('/page/about-us')"
                    >
                      {{ $t("about_us") }}
                    </nuxt-link>
                  </li>
                  <li class="mt-2">
                    <nuxt-link class="white--text text-decoration-none text-capitalize" :to="localePath('/faqs')">
                      {{ $t("faq") }}
                    </nuxt-link>
                  </li>
                  <li class="mt-2">
                    <nuxt-link class="white--text text-decoration-none text-capitalize" :to="localePath('/blog')">
                      {{ $t("news") }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <h4 class="text-capitalize">{{ $t("privacy2") }}</h4>
              <div class="mt-4">
                <ul class="footer-list">
                  <li class="mt-2">
                    <nuxt-link
                      class="white--text text-decoration-none text-capitalize"
                      :to="localePath('/page/privacy')"
                    >
                      {{ $t("privacy") }}
                    </nuxt-link>
                  </li>
                  <li class="mt-2">
                    <nuxt-link
                      class="white--text text-decoration-none text-capitalize"
                      :to="localePath('/page/refund')"
                    >
                      {{ $t("refund") }}
                    </nuxt-link>
                  </li>
                  <li class="mt-2">
                    <nuxt-link
                      class="white--text text-decoration-none text-capitalize"
                      :to="localePath('/page/term-of-use')"
                    >
                      {{ $t("term_of_use") }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <h4 class="text-capitalize">{{ $t("contact_us") }}</h4>
              <div class="mt-4">
                <ul class="footer-list">
                  <li class="mt-2">
                    <nuxt-link class="white--text text-decoration-none text-capitalize" :to="localePath('/contact')">
                      {{ $t("contact_us") }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider class="grey" />
      <v-layout class="mt-3 mb-3">
        <v-spacer />
        <nuxt-link class="white--text text-decoration-none text-capitalize mx-4" :to="localePath('/contact')">
          <h3>{{ $t("contact_us") }}</h3>
        </nuxt-link>
        <nuxt-link class="white--text text-decoration-none text-capitalize mx-4" :to="localePath('/page/about-us')">
          <h3>{{ $t("about_us") }}</h3>
        </nuxt-link>
        <v-spacer />
      </v-layout>
      <v-divider class="grey" />
      <v-layout wrap class="mt-4">
        <v-col cols="12" md="4">
          <p class="text-center mt-2">
            <span>&copy;{{ new Date().getFullYear() }}</span>
          </p>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="4">
          <v-btn href="https://www.facebook.com/biljumlastore/" target="_blank" icon color="white">
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn href="https://www.instagram.com/biljumlastore/" target="_blank" icon color="white">
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
        </v-col>
      </v-layout>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter"
}
</script>

<style scoped>
.footer-list {
  list-style-type: none;
}
</style>
