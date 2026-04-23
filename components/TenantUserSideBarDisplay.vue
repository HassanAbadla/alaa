<template>
  <div class="d-felx flex-column">
    <!-- Tenant logo and name -->

    <div :class="`d-flex  primary  pa-4 align-center justify-center`">
      <!-- Tenant logo and name -->
      <nuxt-link class="text-decoration-none d-flex align-center" to="">
        <custom-avatar :name="$auth.user.tenant.company_name" :image="$auth.user.tenant.logo" :size="52" class="mx-2" />
        <span class="white--text text-capitalize">
          {{ $auth.user.tenant.company_name }}
        </span>
      </nuxt-link>
    </div>
    <!-- User avatar and name -->
    <div class="d-flex dlex-row align-center justify-space-between">
      <div class="d-flex flex-row align-center pa-4">
        <nuxt-link to="/settings">
          <custom-avatar :name="this.$auth.user.full_name" :image="this.$auth.user.avatar" />
        </nuxt-link>
        <div class="d-flex flex-column">
          <span class="white--text h6 px-2 justify-self-center font-weight-bold text--darken-2 word-wrap">
            {{ this.$auth.user.full_name }}
          </span>
          <small v-if="this.$auth.user.type" class="white--text px-2 justify-self-center text-capitalize no-wrap">
            ({{ this.$auth.user.type?.title }})
          </small>
        </div>
      </div>

      <slot name="right"></slot>
    </div>

    <!-- User avatar and name -->
  </div>
</template>

<script>
import { mapState } from "vuex"
import CustomAvatar from "./profile/CustomAvatar.vue"
export default {
  name: "TenantUserSideBarDisplay",
  components: { CustomAvatar },

  computed: {
    ...mapState(["isRTL"]),
    capitalizedInitials() {
      const words = this.$auth.user?.tenant?.company_name.split(" ") ?? ""
      const initials = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase())
      return initials.join("")
    },
    test() {
      console.log(this.$auth.user.avatar)
    }
  }
}
</script>

<style scoped>
.word-wrap {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
</style>
