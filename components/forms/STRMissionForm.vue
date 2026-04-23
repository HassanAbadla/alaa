<template>
  <v-container>
    <custom-input
      v-model="form.name"
      :label="$t('form.name')"
      :required="true"
      :error-messages="errors.name ? [errors.name] : []"
    />
    <custom-input
      v-model="form.code"
      :label="$t('form.code')"
      :required="true"
      :error-messages="errors.code ? [errors.code] : []"
    />
    <custom-dropdown
      v-model="form.global_status_id"
      item-value="id"
      item-text="name"
      :label="$t('form.status')"
      :items="globalStatuses"
      :required="true"
      :error-messages="errors.global_status_id ? [errors.global_status_id] : []"
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
          :error-messages="errors.unit_id ? [errors.unit_id] : []"
        />
      </div>
    </div>
    <custom-date-picker v-model="form.date_reviewed" :label="$t('form.date_reviewed')" />
    <custom-date-picker v-model="form.date_approved" :label="$t('form.date_approved')" />
    <custom-date-picker v-model="form.date_life" :label="$t('form.date_life')" />
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
      globalStatuses: [],
      form: {
        name: "",
        code: "",
        unit_id: null,
        global_status_id: null,
        date_reviewed: null,
        date_approved: null,
        date_life: null,
        note: ""
      },
      errors: {}
    }
  },
  methods: {
    ...mapActions({
      fetchMissionsById: "strMissions/fetchMissionsById",
      addMission: "strMissions/addMission",
      updateMission: "strMissions/updateMission"
    }),
    ...mapActions("positions", ["fetchUnits"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async getFormData() {
      const response = await this.$axios.get("bsc-global-statuses")
      this.globalStatuses = response.data.data
      await this.fetchUnits()
      if (this.editForm) {
        const mission = this.getMissions.find((obj) => obj.id === this.itemId)
        if (mission) {
          this.form = { ...mission }
          this.form.unit_id = mission.unit.id
          // remove bsc_perspective from form
          delete this.form.unit
          delete this.form.tenant
        }
      }
    },

    async handleSubmit() {
      // this.form.unit_id = this.userUnit
      if (!this.validateForm()) return
      if (this.editForm) {
        await this.updateMission(this.form)
      } else {
        await this.addMission(this.form)
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
    },
    validateForm() {
      this.errors = {}
      if (!this.form.name) this.errors.name = this.$t("validation.required")
      if (!this.form.code) this.errors.code = this.$t("validation.required")
      if (!this.form.global_status_id) this.errors.global_status_id = this.$t("validation.required")
      if (!this.form.unit_id) this.errors.unit_id = this.$t("validation.required")
      return Object.keys(this.errors).length === 0
    }
  },

  computed: {
    ...mapGetters({
      getMissions: "strMissions/getMissions",
      loadingMissions: "strMissions/isLoading"
    }),
    ...mapState("positions", ["units"]),
    userUnit() {
      return this.$auth.user.UserUnitPosition[0].position.unit.id
    },
    item() {
      return this.getMissions.find((obj) => obj.id === this.itemId) || {}
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
