<template>
  <v-container>
    <custom-input v-model="form.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="form.code" :label="$t('form.code')" :required="true" />
    <custom-dropdown
      v-model="form.bsc_perspective_id"
      item-value="id"
      item-text="name"
      :label="$t('form.perspective')"
      :items="getPerspectives"
      :required="true"
    />
    <custom-dropdown
      v-model="form.bsc_goal_id"
      item-value="id"
      item-text="name"
      :label="$t('form.goal')"
      :items="getGoals"
      :required="true"
    />
    <div class="d-flex w-100 justify-space-between">
      <v-btn
        text
        outlined
        :loading="loading"
        :disabled="false"
        @click="openUnitDialogModal"
        prepend-icon="mdi-file-document-outline"
        class="pa-4"
      >
        {{ $t("form.select_unit") }}
      </v-btn>
      <span class="mx-2"></span>
      <div @click.stop="openUnitDialogModal" class="d-flex flex-grow-1 z-index-5">
        <custom-dropdown
          :items="unitDisplayfield"
          item-value="id"
          item-text="name"
          :label="$t('table.unit')"
          v-model="form.unit_id"
          :required="true"
          :disabled="true"
          class="flex-grow-1 mx-1 z-index-1"
        />
      </div>
    </div>
    <custom-checkbox v-model="form.bsc_specific" :label="$t('form.specific')" />
    <custom-checkbox v-model="form.bsc_achievable" :label="$t('form.achievable')" />
    <custom-checkbox v-model="form.bsc_measurable" :label="$t('form.measurable')" />
    <custom-checkbox v-model="form.bsc_relevant" :label="$t('form.relevant')" />
    <custom-checkbox v-model="form.bsc_time_bound" :label="$t('form.time_bound')" />
    <custom-text-area v-model="form.note" :label="$t('form.notes')" />
    <v-btn color="primary" block @click="handleSubmit" class="mt-4">
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>

    <custom-dialog
      v-model="openUnitDialog"
      :title="$t('page.units')"
      width="580px"
      @close-dialog="openUnitDialog = false"
    >
      <UnitsTreeSelection
        :items="units"
        @selection-change="handleSelectionChange"
        @send-selected="handleSendSelected"
      />
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"
import UnitsTreeSelection from "@/components/UnitsTreeSelection.vue"
export default {
  name: "BscObjectiveForm",
  components: {
    UnitsTreeSelection
  },
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
      openUnitDialog: false,
      form: {
        name: "",
        code: "",
        unit_id: null,
        bsc_perspective_id: "",
        bsc_goal_id: null,
        bsc_specific: false,
        bsc_achievable: false,
        bsc_measurable: false,
        bsc_relevant: false,
        bsc_time_bound: false,
        note: ""
      }
    }
  },
  methods: {
    ...mapActions({
      fetchPerspectives: "bscPerspectives/fetchPerspectives",
      fetchGoals: "bscGoals/fetchGoals",
      addObjective: "bscStrategicObjectives/addObjective",
      updateObjective: "bscStrategicObjectives/updateObjective"
    }),
    ...mapActions("positions", ["fetchUnits"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async getFormData() {
      await this.fetchPerspectives()
      await this.fetchUnits()
      await this.fetchGoals()
      if (this.editForm) {
        const objective = this.getObjectives.find((obj) => obj.id === this.itemId)
        if (objective) {
          this.form = { ...objective }
          this.form.bsc_perspective_id = objective.bsc_perspective.id
          this.form.unit_id = objective.unit.id
          // remove bsc_perspective from form
          delete this.form.bsc_perspective
          delete this.form.unit
          delete this.form.tenant
        }
      }
    },

    async handleSubmit() {
      // this.form.unit_id = this.userUnit
      if (this.editForm) {
        await this.updateObjective(this.form)
      } else {
        await this.addObjective(this.form)
      }
      this.closeDrawer()
    },
    openUnitDialogModal() {
      this.openUnitDialog = true
    },
    handleSelectionChange(selectedIds) {
      this.form.unit_id = selectedIds
    },
    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.form.unit_id = selectedIds
      this.openUnitDialog = false
    }
  },

  computed: {
    ...mapGetters({
      getPerspectives: "bscPerspectives/getPerspectives",
      loadingPerspectives: "bscPerspectives/isLoading",
      getObjectives: "bscStrategicObjectives/getObjectives",
      getGoals: "bscGoals/getGoals"
    }),
    ...mapState("positions", ["units"]),
    userUnit() {
      return this.$auth.user.UserUnitPosition[0].position.unit.id
    },
    item() {
      return this.getObjectives.find((obj) => obj.id === this.itemId) || {}
    },
    unitDisplayfield() {
      const getAllUnits = (units) => {
        let allUnits = []
        for (const unit of units) {
          allUnits.push({
            id: unit.id,
            name: unit.name
          })
          if (unit.children && unit.children.length) {
            allUnits = allUnits.concat(getAllUnits(unit.children))
          }
        }
        return allUnits
      }

      return getAllUnits(this.units)
    }
  },
  async mounted() {
    await this.getFormData()
    console.log("user unit:", this.$auth.user.UserUnitPosition[0].position.unit.id)
  }
}
</script>
