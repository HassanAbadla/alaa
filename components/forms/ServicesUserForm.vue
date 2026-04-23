<template>
  <v-container class="py-8">
    <custom-dropdown
      :items="getTenants"
      item-value="id"
      item-text="company_name"
      :label="$t('form.tenant')"
      v-model="formData.receiver_tenant_id"
      :loading="loadingTenants"
      :required="true"
    />
    <custom-input v-model="formData.full_name" :label="$t('form.full_name')" :required="true" />
    <custom-input v-model="formData.email" :label="$t('form.email')" :required="true" />
    <custom-input v-model="formData.phone" :label="$t('form.phone')" :required="false" />
    <custom-input v-model="formData.password" :label="$t('form.password')" :type="'password'" :required="false" />
    <custom-dropdown
      :items="userStatuses"
      item-value="value"
      item-text="text"
      :label="$t('form.status')"
      v-model="formData.status"
      :required="false"
    />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "ServicesUserForm",
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
        full_name: "",
        email: "",
        phone: "",
        receiver_tenant_id: Number(this.$route.query.receiver_tenant_id) || null,
        status: "pendding",
        password: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentUser: "srvUsers/getCurrentUser",
      loadingUsers: "srvUsers/isLoading",
      getTenants: "srvTenants/getTenants",
      loadingTenants: "srvTenants/isLoading"
    }),
    userStatuses() {
      return [
        { text: this.$t("table.accepted"), value: "accepted" },
        { text: this.$t("table.refused"), value: "refused" },
        { text: this.$t("table.pending"), value: "pending" }
      ]
    }
  },

  methods: {
    ...mapActions({
      addUser: "srvUsers/addUser",
      updateUser: "srvUsers/updateUser",
      fetchUserById: "srvUsers/fetchUserById",
      fetchTenants: "srvTenants/fetchTenants"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      this.loadingUsers = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateUser(this.formData)
      } else {
        await this.addUser(this.formData)
      }
      this.loadingUsers = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchTenants()
    if (this.editForm) {
      await this.fetchUserById(this.itemId)
      this.formData.full_name = this.getCurrentUser.full_name
      this.formData.email = this.getCurrentUser.email
      this.formData.phone = this.getCurrentUser.phone
      this.formData.receiver_tenant_id = Number(this.getCurrentUser.tenant.id)
      this.formData.status = this.getCurrentUser.status
      this.formData.password = this.getCurrentUser.password
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
