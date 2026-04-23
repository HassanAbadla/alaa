<template>
  <v-container class="py-8">
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.code" :label="$t('form.code')" :required="true" />
    <custom-date-picker v-model="formData.target_date" :label="$t('table.target_date')" />
    <custom-date-picker v-model="formData.finish_date" :label="$t('table.finish_date')" />
    <custom-date-picker v-model="formData.progress_date" :label="$t('table.progress_date')" />
    <custom-TextArea v-model="formData.progress_note" :label="$t('table.progress_note')" :required="false" />

    <custom-dropdown
      v-model="formData.bsc_initiative_status_id"
      :label="$t('form.status')"
      :items="getStatuses"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingStatuses"
    />
    <custom-dropdown
      v-model="formData.bsc_objectives_id"
      :label="$t('form.objectives')"
      :items="getObjectives"
      item-text="name"
      item-value="id"
      :required="true"
      :loading="loadingObjectives"
    />

    <v-card class="pa-4 my-2" outlined rounded="sm">
      <!-- Toggle Buttons -->
      <div class="d-flex justify-center">
        <v-btn-toggle v-model="assignmentType" mandatory class="mb-4">
          <v-btn small value="team">
            <v-icon left>mdi-account-group</v-icon>
            {{ $t("table.team") }}
          </v-btn>
          <v-btn small value="user">
            <v-icon left>mdi-account</v-icon>
            {{ $t("form.user") }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Team Fields -->
      <template v-if="assignmentType === 'team'">
        <custom-dropdown
          v-model="formData.bsc_team_id"
          :label="$t('table.team')"
          :items="getTeams"
          item-text="name"
          item-value="id"
          :required="true"
          :loading="loadingTeams"
        />
        <custom-TextArea v-model="formData.team_note" :label="$t('table.team_note')" :required="false" />
      </template>

      <!-- User Fields -->
      <template v-if="assignmentType === 'user'">
        <custom-dropdown
          v-model="formData.user_id"
          :label="$t('form.user')"
          :items="users"
          item-text="full_name"
          item-value="id"
          :required="true"
          :loading="loadingUsers"
        />
        <custom-TextArea v-model="formData.user_note" :label="$t('table.user_note')" :required="false" />
      </template>
      <!-- <custom-dropdown
        v-model="formData.bsc_team_id"
        :label="$t('form.team')"
        :items="getTeams"
        item-text="name"
        item-value="id"
        :required="true"
        :loading="loadingTeams"
      />
      <custom-TextArea v-model="formData.team_note" :label="$t('form.team_notes')" :required="false" />
      <custom-dropdown
        v-model="formData.user_id"
        :label="$t('form.user')"
        :items="users"
        item-text="full_name"
        item-value="id"
        :required="true"
        :loading="loadingUsers"
      />
      <custom-TextArea v-model="formData.user_note" :label="$t('form.user_notes')" :required="false" /> -->
    </v-card>

    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "BSCInitiativeForm",
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
      assignmentType: "team",
      loadingUsers: false,
      formData: {
        name: "",
        code: "",
        target_date: null,
        finish_date: null,
        progress_date: null,
        progress_note: "",
        team_note: "",
        user_note: "",
        user_id: null,
        bsc_initiative_status_id: null,
        bsc_objectives_id: null,
        bsc_team_id: null,
        note: ""
      },
      loading: false
    }
  },
  watch: {
    // Clear the other fields when switching
    assignmentType(newType) {
      if (newType === "team") {
        this.formData.user_id = null
        this.formData.user_note = ""
      } else {
        this.formData.bsc_team_id = null
        this.formData.team_note = ""
      }
    }
  },

  computed: {
    ...mapState("users", ["users"]),
    ...mapGetters({
      getObjectives: "bscStrategicObjectives/getObjectives",
      loadingObjectives: "bscStrategicObjectives/isLoading",
      getTeams: "bscTeams/getTeams",
      loadingTeams: "bscTeams/isLoading",
      getStatuses: "bscInitiativeStatuses/getStatuses",
      loadingStatuses: "bscInitiativeStatuses/isLoading",
      getCurrentInitiative: "bscInitiatives/getCurrentInitiative"
    })
  },

  methods: {
    ...mapActions("users", ["fetchUsers"]),
    ...mapActions({
      fetchObjectives: "bscStrategicObjectives/fetchObjectives",
      fetchTeams: "bscTeams/fetchTeams",
      fetchStatuses: "bscInitiativeStatuses/fetchStatuses",
      fetchInitiativeById: "bscInitiatives/fetchInitiativeById",
      addInitiative: "bscInitiatives/addInitiative",
      updateInitiative: "bscInitiatives/updateInitiative"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateInitiative(this.formData)
        // this.fetchStatuses()
      } else {
        await this.addInitiative(this.formData)
        // this.fetchStatuses()
      }
      this.closeDrawer()
    }
  },
  async mounted() {
    this.loadingUsers = true
    await this.fetchUsers()
    this.loadingUsers = false
    this.fetchObjectives()
    this.fetchTeams()
    this.fetchStatuses()
    if (this.editForm) {
      await this.fetchInitiativeById(this.itemId)

      this.formData.name = this.getCurrentInitiative.name
      this.formData.code = this.getCurrentInitiative.code
      this.formData.target_date = this.getCurrentInitiative.target_date
      this.formData.finish_date = this.getCurrentInitiative.finish_date
      this.formData.progress_date = this.getCurrentInitiative.progress_date
      this.formData.progress_note = this.getCurrentInitiative.progress_note
      this.formData.team_note = this.getCurrentInitiative.team_note
      this.formData.user_note = this.getCurrentInitiative.user_note
      this.formData.bsc_initiative_status_id = this.getCurrentInitiative.bsc_initiative_status_id
      this.formData.bsc_objectives_id = this.getCurrentInitiative.bsc_objectives_id
      this.formData.bsc_team_id = this.getCurrentInitiative.bsc_team_id
      this.formData.user_id = this.getCurrentInitiative.user_id
      this.formData.note = this.getCurrentInitiative.note
    }
  }
}
</script>
