<template>
  <v-can show-message :permission="'access_risk_causes'">
    <v-container fluid>
      <v-card flat>
        <v-card-text class="pt-0">
          <custom-table
            :title="title"
            :propItems="riskCauses"
            :propLoading="loading"
            :headers="headers"
            :tableConfig="tableConfig"
            hideView
            :sortOnLoad="false"
            show-back-btn
            :back-btn-tooltip="backBtnTooltip"
            :back-btn-path="backBtnPath"
          >
            <template v-slot:item.notes="{ item }">
              <editable-note-form
                :note="item.note"
                :title="item?.code"
                :item-id="item.id"
                :loading="item.isUpdating"
                :disable-edit="true"
                :disable-icon="false"
                iconSize="large"
              />
            </template>
          </custom-table>
        </v-card-text>
      </v-card>
    </v-container>
  </v-can>
</template>

<script>
import { mapState, mapActions } from "vuex"
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import DynamicBackNavigation from "@/mixins/dynamicBackNavigation"

export default {
  components: { EditableNoteForm },
  name: "RiskCausesPage",
  mixins: [DynamicBackNavigation],
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  data() {
    return {
      headers: [
        { text: "table.name", value: "code", sortable: false },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.actions", value: "actions", sortable: false }
      ],
      tableConfig: {
        delete: this.deleteCause,
        itemPath: `/grc/risk-register/${this.riskId()}/causes`,
        createForm: {
          componentPath: "forms/RiskCauseForm"
        },
        editForm: {
          componentPath: "forms/RiskCauseForm",
          props: { editForm: true }
        },
        permissions: {
          create: "create_risk_cause",
          edit: "edit_risk_cause",
          delete: "delete_risk_cause"
        }
      }
    }
  },
  computed: {
    ...mapState("riskCauses", ["riskCauses", "loading", "error", "currentRisk"]),
    entityType() {
      return "causes"
    },
    title() {
      if (this.currentRisk) {
        return `${this.$t("form.risk_cause")} - ${this.currentRisk?.name}`
      }
      return this.$t("form.risk_cause")
    }
  },
  methods: {
    ...mapActions("riskCauses", ["fetchRiskCauses", "deleteRiskCause"]),
    riskId() {
      return this.$route.params.id
    },
    deleteCause(id) {
      return this.deleteRiskCause(id)
    }
  },
  async mounted() {
    await this.fetchRiskCauses(this.riskId())
  }
}
</script>
