<template>
  <v-container class="py-8">
    <custom-input v-model="formData.title" :label="$t('form.title')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-TextArea v-model="formData.description" :label="$t('form.notes')" :required="false" />
    <custom-date-picker v-model="formData.sign_date" :label="$t('form.sign_date')" :required="true" />
    <custom-date-picker v-model="formData.start_date" :label="$t('form.start_date')" :required="true" />
    <custom-date-picker v-model="formData.end_date" :label="$t('form.end_date')" :required="true" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "TenantContractForm",
  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        title: "",
        code: "",
        description: "",
        sign_date: null,
        start_date: null,
        end_date: null,
        tenant_id: this.$route.params.id
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getTeams: "srvTeams/getTeams",
      loadingTeams: "srvTeams/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addTenantContract: "tenantContracts/addTenantContract",
      updateTeam: "srvTeams/updateTeam",
      getTeamById: "srvTeams/getTeamById",
      fetchTenantById: "srvTenants/fetchTenantById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.title.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingTeams = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateTeam(this.formData)
      } else {
        await this.addTenantContract(this.formData)
      }
      await this.fetchTenantById(this.formData.tenant_id)
      this.loadingTeams = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.getTeamById(this.itemId)
      this.formData.title = this.getTeams.title
      this.formData.description = this.getTeams.description
    }
  }
}
</script>

<style scoped></style>
