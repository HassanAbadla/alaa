<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-dropdown
      v-model="formData.bsc_goal_id"
      :label="$t('form.goal')"
      :items="flatGoals"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingGoals"
    />
    <custom-dropdown
      v-model="formData.bsc_team_status_id"
      :label="$t('form.status')"
      :items="getStatuses"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingStatus"
    />

    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "BSCTeamForm",
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
        name: "",
        note: "",
        bsc_goal_id: null,
        bsc_team_status_id: null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getStatuses: "bscTeamStatuses/getStatuses",
      loadingStatus: "bscTeamStatuses/isLoading",
      getGoals: "bscGoals/getGoals",
      getCurrentTeam: "bscTeams/getCurrentTeam",
      loadingGoals: "bscGoals/isLoading"
    }),
    flatGoals() {
      // Helper function to recursively flatten goals
      const flatten = (goals) => {
        let result = []
        for (const goal of goals) {
          result.push({ id: goal.id, name: goal.name })
          if (goal.children && Array.isArray(goal.children) && goal.children.length) {
            result = result.concat(flatten(goal.children))
          }
        }
        return result
      }
      return Array.isArray(this.getGoals) ? flatten(this.getGoals) : []
    }
  },

  methods: {
    ...mapActions({
      fetchStatuses: "bscTeamStatuses/fetchStatuses",
      fetchGoals: "bscGoals/fetchGoals",
      fetchTeams: "bscTeams/fetchTeams",
      addTeam: "bscTeams/addTeam",
      updateTeam: "bscTeams/updateTeam",
      fetchTeamById: "bscTeams/fetchTeamById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      this.formData.code = computedCode
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateTeam(this.formData)
        // this.fetchStatuses()
      } else {
        await this.addTeam(this.formData)
        // this.fetchStatuses()
      }
      this.closeDrawer()
    }
  },
  async mounted() {
    await this.fetchStatuses()
    await this.fetchGoals()
    if (this.editForm) {
      await this.fetchTeamById(this.itemId)
      this.formData.name = this.getCurrentTeam.name
      this.formData.bsc_goal_id = this.getCurrentTeam.bsc_goal_id
      this.formData.bsc_team_status_id = this.getCurrentTeam.bsc_team_status_id
      this.formData.note = this.getCurrentTeam.note
    }
  }
}
</script>
