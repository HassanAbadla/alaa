<template>
  <div v-if="$auth.loggedIn">
    <div v-if="can(permission) || disableOnly">
      <slot :disabled="disableOnly && !can(permission)" />
    </div>
    <div v-if="!can(permission) && showMessage && !disableOnly">
      <v-container fill-height class="no-permission-container">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-icon size="64" color="grey darken-1" class="mb-4">mdi-shield-lock-outline</v-icon>
            <h1 class="text-h4 font-weight-medium grey--text text--darken-2 mb-3">
              {{ $t("page.no_permission_message") }}
            </h1>
            <p class="text-subtitle-1 grey--text text--darken-1 mb-6">
              {{ $t("page.contact_admin_message") }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "vCan",
  props: {
    permission: {
      type: [String, Array],
      required: true
    },
    showMessage: {
      type: Boolean
    },
    disableOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permissions: []
    }
  },
  mounted() {
    this.permissions = this.$auth.user.permissions
  },
  methods: {
    can(permission) {
      // If permission is a string, use the original logic
      if (typeof permission === "string") {
        return this.permissions.includes(permission)
      }

      // If permission is an array, check if any permission matches
      if (Array.isArray(permission)) {
        return permission.some((perm) => this.permissions.includes(perm))
      }

      return false
    }
  }
}
</script>

<style scoped>
.no-permission-container {
  min-height: calc(100vh - 200px); /* Adjusted to account for header and padding */
  max-width: 100%;
}

/* Add a subtle animation for the icon */
.v-icon {
  transition: transform 0.3s ease;
}

.v-icon:hover {
  transform: scale(1.1);
}
</style>
