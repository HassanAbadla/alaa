<template>
  <v-container class="py-8">
    <!-- <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" /> -->
    <custom-dropdown
      v-model="formData.srv_team_id"
      :label="$t('table.team')"
      :items="getTeams"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingTeams"
      :disabled="!editForm && this.$route.query.srv_team_id ? true : false"
    />
    <custom-dropdown
      v-model="formData.user_id"
      :label="$t('form.user')"
      :items="usersList"
      item-value="id"
      item-text="value"
      :required="true"
      :loading="loadingUsers"
    />
    <!-- <v-menu bottom origin="center center" transition="scale-transition" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <div class="color_field">
          <p class="my-0">Color:</p>
          <p class="mx-2 my-0">{{ formData.color || "" }}</p>
          <div :style="swatchStyle" v-bind="attrs" v-on="on"></div>
        </div>
      </template>
      <v-card>
        <v-card-text>
          <v-color-picker
            value="#1976D2"
            v-model="formData.color"
            mode="hexa"
            hide-sliders
            show-swatches
            class="mx-auto"
          ></v-color-picker>
        </v-card-text>
      </v-card>
    </v-menu> -->
    <!-- <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { getUsers } from "@/api/tenent-api"

export default {
  name: "SrvTeamUsersForm",
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
      users: [],
      formData: {
        user_id: null,
        srv_team_id: Number(this.$route.query.srv_team_id) || null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentTeamUser: "srvTeamUsers/getCurrentTeamUser",
      loadingTeamUsers: "srvTeamUsers/isLoading",
      getTeams: "srvTeams/getTeams",
      loadingTeams: "srvTeams/isLoading"
    }),
    usersList() {
      return this.users.map((user) => {
        return {
          value: user.full_name,
          id: user.id
        }
      })
    },
    swatchStyle() {
      return {
        backgroundColor: this.formData.color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        border: "1px solid #929292",
        borderRadius: "4px"
      }
    }
  },

  methods: {
    ...mapActions({
      addTeamUser: "srvTeamUsers/addTeamUser",
      updateTeamUser: "srvTeamUsers/updateTeamUser",
      fetchTeamUserById: "srvTeamUsers/fetchTeamUserById",
      fetchTeams: "srvTeams/fetchTeams"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    getUsers,
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingTeamUsers = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateTeamUser(this.formData)
      } else {
        await this.addTeamUser(this.formData)
      }
      this.loadingTeamUsers = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchTeams()
    const users = await this.getUsers(this.$axios)
    this.users = users.data.data
    if (this.editForm) {
      await this.fetchTeamUserById(this.itemId)
      this.formData.user_id = this.getCurrentTeamUser.user_id
      this.formData.srv_team_id = this.getCurrentTeamUser.srv_team_id
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
