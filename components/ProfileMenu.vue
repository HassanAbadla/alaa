<!--
  - Copyright (c) 2020.
  - Author:  Belgacemi mohamed seddik
  - github:  http://github.com/seddik32
  - facebook: https://www.facebook.com/Qsd5k
  - email: sed75dik@gmail.com
  - Last modified: 6/12/20, 1:21 PM
  -->

<template>
  <div>
    <v-menu :nudge-width="200" offset-y open-on-hover v-if="auth">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" icon v-on="on">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :alt="user.name" :src="user.avatar" v-if="/(https?:\/\/[^\s]+)/.test(user.avatar)" />
              <v-img :alt="user.name" :src="'/storage/' + user.avatar" v-else />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle v-if="user.verified">
                <b>{{ $t("wallet") }} :</b>
                {{ $t("s.r") }}
                {{ user.wallet.balance }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                {{ $t("unverified") }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon nuxt :to="localePath('/setting')">
                <v-icon>mdi-cog</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider />

          <v-list-item :to="localePath('link.link')" dense nuxt v-for="link in links" :key="link.name">
            <v-list-item-icon>
              <v-icon>mdi-{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("link.name") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="logout()" color="red" dark text>
            <v-icon>mdi-power</v-icon>
            {{ $t("auth.logout") }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-menu>
    <div v-else>
      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" icon v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-btn class="white--text" color="orange" nuxt :to="localePath('/auth/login')">
                  {{ $t("login") }}
                </v-btn>
                <v-btn class="white--text mt-4 mb-2" color="blue" nuxt :to="localePath('/auth/register')">
                  {{ $t("auth.register") }}
                </v-btn>
              </v-list-item-content>
            </v-list-item>

            <v-divider />
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileMenu",
  data() {
    return {
      verification: 33,
      links: [
        {
          icon: "account",
          link: "/account",
          name: "profile"
        },
        {
          icon: "map-marker",
          link: "/account",
          name: "address.address"
        },
        {
          icon: "shield-edit",
          link: "/setting/password",
          name: "auth.change_password"
        },
        {
          icon: "heart",
          link: "/favorit",
          name: "favorit"
        },
        {
          icon: "clipboard",
          link: "/orders",
          name: "orders"
        }
      ]
    }
  },
  computed: {
    auth() {
      return this.$auth.loggedIn
    },
    user() {
      return this.$auth.user
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      this.$router.push("/auth/login")
    }
  }
}
</script>

<style scoped></style>
