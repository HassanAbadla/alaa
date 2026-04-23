<template>
  <v-container class="py-8">
    <custom-input v-model="formData.company_name" :label="$t('form.company_name')" :required="true" />
    <custom-input v-model="formData.company_domain" :label="$t('table.company_domain')" :required="true" />
    <!-- <custom-TextArea v-model="formData.company_domain" :label="$t('form.company_domain')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvTenantsForm",
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
        company_name: "",
        company_domain: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentTenant: "srvTenants/getCurrentTenant",
      loadingTenants: "srvTenants/isLoading"
    })
  },

  methods: {
    ...mapActions({
      addTenant: "srvTenants/addTenant",
      updateTenant: "srvTenants/updateTenant",
      fetchTenantById: "srvTenants/fetchTenantById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingTenants = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateTenant(this.formData)
      } else {
        await this.addTenant(this.formData)
      }
      this.loadingTenants = false
      this.closeDrawer()
    }
  },
  async mounted() {
    if (this.editForm) {
      await this.fetchTenantById(this.itemId)
      this.formData.company_name = this.getCurrentTenant.company_name
      this.formData.company_domain = this.getCurrentTenant.company_domain
    }
  }
}
</script>

<style scoped>
.color_field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  margin-bottom: 1.8rem;
  border: 1px solid #929292;
  border-radius: 4px;
}
</style>
