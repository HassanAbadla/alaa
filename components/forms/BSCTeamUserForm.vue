<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.user_id"
      :label="$t('form.user')"
      :items="users"
      item-text="full_name"
      item-value="id"
      :required="true"
      :loading="loadingUsers"
    />
    <custom-input v-model="formData.role" :label="$t('table.role')" :required="true" />

    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "BSCTeamUsersForm",
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
      loadingUsers: false,
      formData: {
        user_id: null,
        bsc_team_id: Number(this.$route.params.id),
        role: ""
      },
      loading: false
    }
  },

  computed: {
    ...mapState("users", ["users"]),
    ...mapGetters({
      getUsers: "users/getUsers",
      loadingUsers: "users/isLoading",
      getCurrentUser: "bscTeamUsers/getCurrentUser"
    })
  },

  methods: {
    ...mapActions("users", ["fetchUsers"]),
    ...mapActions({
      addUser: "bscTeamUsers/addUser",
      updateUser: "bscTeamUsers/updateUser",
      getUserById: "bscTeamUsers/getUserById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateUser(this.formData)
        // this.fetchStatuses()
      } else {
        await this.addUser(this.formData)
        // this.fetchStatuses()
      }
      this.closeDrawer()
    }
  },
  async mounted() {
    this.loadingUsers = true
    await this.fetchUsers()
    this.loadingUsers = false
    if (this.editForm) {
      await this.getUserById(this.itemId)
      this.formData.name = this.getCurrentUser.name
      this.formData.bsc_team_id = this.getCurrentUser.bsc_team_id
      this.formData.user_id = this.getCurrentUser.user_id
    }
  }
}
</script>
