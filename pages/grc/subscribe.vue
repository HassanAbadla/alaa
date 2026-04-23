<template>
  <form-wrapper
    :title="$t('page.contract_and_packages')"
    submit-text="Subscribe"
    @submit="submit"
    :loading="submitting"
  >
    <custom-input v-model="title" :label="$t('form.title')" :required="true" />

    <custom-input v-model="code" :label="$t('form.code')" :required="true" />

    <quill-editor v-model="note" />

    <v-card-text>{{ $t("page.select_package_msg") }}:</v-card-text>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

    <v-alert v-if="error" type="error" dismissible>
      {{ error }}
    </v-alert>

    <template v-if="!loading && !error">
      <custom-checkbox
        v-for="subscriptionPackage in subscriptionPackages"
        :key="subscriptionPackage.id"
        :label="subscriptionPackage.name"
        v-model="selectedPackages[subscriptionPackage.id]"
        @input="updateSelectedIds"
      />
    </template>

    <v-alert v-if="!loading && subscriptionPackages.length === 0" type="info">
      {{ $t("error.no_packages_available") }}
    </v-alert>
  </form-wrapper>
</template>

<script>
import { getAllSubcriptions, subscribe } from "@/api/subscriptions-api"

export default {
  name: "SubscribePage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  data() {
    return {
      subscriptionPackages: [],
      selectedPackages: {},
      selectedIds: [],
      loading: false,
      submitting: false,
      note: "",
      error: null,
      code: "", // New field for code
      title: "" // New field for title
    }
  },

  mounted() {
    this.fetchSubscriptionPackages()
  },

  methods: {
    async fetchSubscriptionPackages() {
      this.loading = true
      this.error = null
      try {
        const response = await getAllSubcriptions(this.$axios)
        this.subscriptionPackages = response.data.data
        // Initialize selectedPackages
        this.subscriptionPackages.forEach((pkg) => {
          this.$set(this.selectedPackages, pkg.id, false)
        })
      } catch (err) {
        this.error = "Failed to fetch compliance packages. Please try again later."
        console.error("Error fetching compliance packages:", err)
      } finally {
        this.loading = false
      }
    },

    updateSelectedIds() {
      this.selectedIds = Object.keys(this.selectedPackages)
        .filter((id) => this.selectedPackages[id])
        .map((id) => parseInt(id))
    },

    async submit() {
      if (this.selectedIds.length === 0) {
        this.error = "Please select at least one compliance package."
        return
      }
      if (!this.code || !this.title) {
        this.error = "Please enter both Code and Title."
        return
      }
      this.submitting = true
      this.error = null
      try {
        await subscribe(
          {
            compliance_package_ids: this.selectedIds,
            note: this.note,
            code: this.code,
            title: this.title
          },
          this.$axios
        )

        this.$router.push(this.localePath("/grc/contracts"))
        this.$emit("subscription-success")
      } catch (err) {
        this.error = err.response.data.message
        console.log("Error subscribing:", err)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem auto;
  display: block;
}
</style>
