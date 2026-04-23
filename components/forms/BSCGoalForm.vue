<template>
  <v-container>
    <custom-input v-model="form.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="form.code" :label="$t('form.code')" :required="true" />
    <!-- <custom-dropdown
      v-model="form.bsc_objectives_id"
      item-value="id"
      item-text="name"
      :label="$t('form.objectives')"
      :items="getObjectives"
      :required="true"
    /> -->
    <div class="d-flex w-100 justify-space-between">
      <v-btn
        text
        outlined
        :loading="loading"
        :disabled="false"
        @click="openGoalsDialogModal"
        prepend-icon="mdi-file-document-outline"
        class="pa-4"
      >
        {{ $t("form.main_goal") }}
      </v-btn>
      <span class="mx-2"></span>
      <div @click.stop="openGoalsDialogModal" class="d-flex flex-grow-1 z-index-5">
        <custom-dropdown
          :items="goalsDisplayField"
          item-value="id"
          item-text="name"
          :label="$t('table.goals')"
          v-model="form.bsc_goal_id"
          :disabled="true"
          class="flex-grow-1 mx-1 z-index-1"
        />
      </div>
    </div>
    <custom-dropdown
      v-model="form.str_mission_id"
      item-value="id"
      item-text="name"
      :label="$t('form.mission')"
      :items="getMissions"
      :required="true"
    />
    <custom-text-area v-model="form.note" :label="$t('form.notes')" />
    <v-btn color="primary" block @click="handleSubmit" class="mt-4">
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>

    <!-- goal selection dialog -->
    <custom-dialog
      v-model="openGoalsDialog"
      :title="$t('page.goals')"
      width="580px"
      @close-dialog="openGoalsDialog = false"
    >
      <UnitsTreeSelection
        :items="getGoals"
        @selection-change="handleSelectionChange"
        @send-selected="handleSendSelected"
      />
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "BSCGoalForm",
  components: {},
  props: {
    itemId: {
      type: [Number, String],
      required: true
    },
    // item: {
    //   type: Object,
    //   required: false
    // },
    editForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        code: "",
        note: "",
        bsc_goal_id: null,
        str_mission_id: null
      },
      openGoalsDialog: false,
      loading: false
    }
  },
  methods: {
    ...mapActions({
      // fetchObjectives: "bscStrategicObjectives/fetchObjectives",
      fetchMissions: "strMissions/fetchMissions",
      fetchGoalById: "bscGoals/fetchGoalById",
      addGoal: "bscGoals/addGoal",
      updateGoal: "bscGoals/updateGoal"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async getFormData() {
      // await this.fetchObjectives()
      await this.fetchMissions()
      if (this.editForm) {
        await this.fetchGoalById(this.itemId)
        this.form = { ...this.getCurrentGoal }
        delete this.form.strategic_objective
        delete this.form.mission
      }
    },

    async handleSubmit() {
      // this.form.unit_id = this.userUnit
      if (this.editForm) {
        await this.updateGoal(this.form)
      } else {
        await this.addGoal(this.form)
      }
      this.closeDrawer()
    },
    openGoalsDialogModal() {
      this.openGoalsDialog = true
    },
    handleSelectionChange(selectedIds) {
      this.form.bsc_goal_id = selectedIds
    },
    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.form.bsc_goal_id = selectedIds
      this.openGoalsDialog = false
    }
  },

  computed: {
    ...mapGetters({
      // getObjectives: "bscStrategicObjectives/getObjectives",
      getCurrentGoal: "bscGoals/getCurrentGoal",
      getMissions: "strMissions/getMissions",
      getGoals: "bscGoals/getGoals"
    }),
    goalsDisplayField() {
      const result = []

      this.getGoals.forEach((goal) => {
        // Add main goal
        result.push({
          id: goal.id,
          name: goal.name
        })

        // Add sub-goals if they exist
        if (goal.sub_goals && goal.children.length > 0) {
          goal.children.forEach((subGoal) => {
            result.push({
              id: subGoal.id,
              name: subGoal.name
            })
          })
        }
      })

      return result
    }
    // item() {
    //   return this.getObjectives.find((obj) => obj.id === this.itemId) || {}
    // }
  },
  async mounted() {
    await this.getFormData()
  }
}
</script>
