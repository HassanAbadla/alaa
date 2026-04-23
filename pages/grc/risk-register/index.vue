<template>
  <v-can show-message :permission="'access_risk'">
    <div class="table-page-wrapper">
      <div class="px-4">
        <custom-table-wrapper>
          <custom-table
            :title="$t('page.risk_register')"
            :headers="headers"
            :tableConfig="tableConfig"
            :propItems="risks"
            :propLoading="loading.risks"
            hideView
            hideHeaders
            showFilter
            :filters.sync="filters"
            @clear-filters="fetchRisks"
            :sortOnLoad="false"
            show-column-control
            class="table-fill"
            :tableHeight="600"
          >
            <template v-slot:header="{ props: { headers } }">
              <thead>
                <tr>
                  <th v-for="(header, i) in headers" :key="i">
                    <v-tooltip v-if="header.tooltip" top>
                      <template v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                          <v-icon small v-if="header.icon">{{ header.icon }}</v-icon>
                          <span v-if="header.text">
                            {{ header.text }}
                          </span>
                        </div>
                      </template>
                      <span>{{ header.tooltip }}</span>
                    </v-tooltip>
                    <span v-else>{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:btns>
              <!-- <v-btn small outlined @click="showPrintDialog = true" class="mr-2">
            <v-icon left>mdi-printer</v-icon>
            {{ $t("action.print_report") }}
          </v-btn> -->
              <v-can :permission="'view_risk_heatmap'">
                <v-btn small outlined @click="showHeatmap = true">
                  <v-icon left>mdi-grid</v-icon>
                  {{ $t("page.heatmap") }}
                </v-btn>
              </v-can>
              <v-can :permission="'create_risk'">
                <!-- ! UPDATED: Changed to use new ExcelImporter component -->
                <v-btn small outlined class="ml-2" @click="showImportDialog = true">
                  <v-icon left>mdi-file-excel-outline</v-icon>
                  {{ $t("action.import_from_excel") }}
                </v-btn>
              </v-can>
            </template>
            <template v-slot:level-filters>
              <custom-dropdown
                :items="riskCategories"
                item-value="id"
                item-text="name"
                :label="$t('table.risk_area')"
                v-model="filters.risk_category_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskCategories"
              />
              <custom-dropdown
                :items="users"
                item-value="id"
                item-text="name"
                :label="$t('form.owner')"
                v-model="filters.owner_id"
                @input="applyFilters"
                clearable
                :loading="loading.users"
              />
              <custom-dropdown
                :items="assets"
                item-value="id"
                item-text="name"
                :label="$t('table.asset')"
                v-model="filters.grc_asset_id"
                @input="applyFilters"
                clearable
              />

              <custom-dropdown
                :items="impacts"
                item-value="id"
                item-text="name"
                :label="$t('form.impact')"
                v-model="filters.impact_id"
                @input="applyFilters"
                clearable
                :loading="loadingImpacts"
              />
              <custom-dropdown
                :items="likelihoods"
                item-value="id"
                item-text="name"
                :label="$t('form.likelihood')"
                v-model="filters.likely_hood_id"
                @input="applyFilters"
                clearable
                :loading="loadingLikelihoods"
              />
              <custom-dropdown
                :items="riskPriorities"
                item-value="id"
                item-text="name"
                :label="$t('table.overall_inherent_risk_rating')"
                v-model="filters.inherent_risk_rating_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskPriorities"
              />
              <custom-dropdown
                :items="riskPriorities"
                item-value="id"
                item-text="name"
                :label="$t('table.overall_residual_risk_rating')"
                v-model="filters.residual_risk_rating_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskPriorities"
              />
              <custom-dropdown
                :items="riskTypes"
                item-value="id"
                item-text="name"
                :label="$t('table.threat')"
                v-model="filters.risk_type_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskTypes"
              />

              <custom-dropdown
                :items="riskStatuses"
                item-value="id"
                item-text="name"
                :label="$t('form.risk_status')"
                v-model="filters.risk_status_id"
                @input="applyFilters"
                clearable
                :loading="loadingRiskStatuses"
              />
              <custom-dropdown
                :items="onsetSpeeds"
                item-value="id"
                item-text="name"
                :label="$t('form.onset_speed')"
                v-model="filters.onset_speed_id"
                @input="applyFilters"
                clearable
                :loading="loadingOnsetSpeeds"
              />
            </template>
            <template v-slot:progress-bars>
              <div v-if="stats">
                <!-- Main row: 3 charts on left, 1 metrics box on right -->
                <v-row class="mb-2">
                  <!-- Left side: 3 chart boxes (75% width) -->
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-card
                          flat
                          outlined
                          class="d-flex justify-center align-center rounded-lg"
                          style="height: 100%"
                        >
                          <progress-box
                            :title="$t('table.overall_inherent_risk_rating')"
                            chart
                            :stats="stats?.inherent"
                            filter-type="inherent_risk_rating_id"
                            :selected-filter-id="filters.inherent_risk_rating_id"
                            class="w-100"
                            @filter-change="handleProgressBoxFilter"
                            showChartInstructions
                          />
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-card
                          flat
                          outlined
                          class="d-flex justify-center align-center rounded-lg"
                          style="height: 100%"
                        >
                          <progress-box
                            :title="$t('table.overall_residual_risk_rating')"
                            chart
                            :stats="stats?.residual"
                            filter-type="residual_risk_rating_id"
                            :selected-filter-id="filters.residual_risk_rating_id"
                            class="w-100"
                            @filter-change="handleProgressBoxFilter"
                            showChartInstructions
                          />
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-card
                          flat
                          outlined
                          class="d-flex justify-center align-center rounded-lg"
                          style="height: 100%"
                        >
                          <progress-box
                            :title="$t('table.status')"
                            chart
                            :stats="stats?.status"
                            filter-type="risk_status_id"
                            :selected-filter-id="filters.risk_status_id"
                            class="w-100"
                            @filter-change="handleProgressBoxFilter"
                            showChartInstructions
                          />
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- Right side: Key Risk Metrics box (25% width) -->
                  <v-col cols="12" md="3">
                    <v-card flat outlined class="rounded-lg pa-3" style="height: 100%">
                      <v-card-text class="pa-0">
                        <!-- 2x2 grid of metrics -->
                        <v-row>
                          <!-- Top row -->
                          <v-col cols="6" class="pa-1">
                            <div class="text-center">
                              <progress-box :title="$t('page.total_risk')" :content="stats?.risks_count" />
                            </div>
                          </v-col>
                          <v-col cols="6" class="pa-1">
                            <div class="text-center">
                              <progress-box :title="$t('page.activities')" :content="stats?.activities" />
                            </div>
                          </v-col>
                          <!-- Bottom row -->
                          <v-col cols="6" class="pa-1">
                            <div class="text-center">
                              <progress-box
                                :title="$t('page.progress')"
                                :content="formatPercentage(stats?.progress, false)"
                                :info="$t('page.risk_progress_info')"
                              />
                            </div>
                          </v-col>
                          <v-col cols="6" class="pa-1">
                            <div class="text-center">
                              <progress-box
                                :title="$t('page.exposure')"
                                :content="formatCurrency(stats?.risk_exposure, false, 'suffix', $i18n)"
                                :info="$t('page.risk_exposure_info')"
                              />
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </template>
            <template v-slot:item.notes="{ item }">
              <editable-note-form
                :note="item.note"
                :title="item?.name"
                :item-id="item.id"
                :loading="item.isUpdating"
                :disable-edit="true"
                :disable-icon="false"
                iconSize="large"
              />
            </template>
            <template v-slot:item.risk_description="{ item }">
              <div class="d-flex justify-space-between" :style="{ cursor: 'pointer' }" @click="routeTo(`/${item.id}`)">
                <div>{{ item?.name }}</div>
                <v-icon right x-small :color="'blue'">mdi-open-in-new</v-icon>
              </div>
            </template>

            <template v-slot:item.likely_hood="{ item }">
              <color-label :text="item?.likely_hood?.code" :color="item.likely_hood?.color" />
            </template>
            <template v-slot:item.impact="{ item }">
              <color-label :text="item?.impact?.code" :color="item?.impact?.color" />
            </template>
            <template v-slot:item.asset="{ item }">
              <div>{{ item.asset?.name }}</div>
            </template>
            <template v-slot:item.rating="{ item }">
              <color-label :text="item?.risk_rating?.name" :color="item?.risk_rating?.color" />
            </template>
            <template v-slot:item.overall_rating="{ item }">
              <color-label :text="item?.overall_residual_rating?.name" :color="item?.overall_residual_rating?.color" />
            </template>
            <template v-slot:item.onset_speed="{ item }">
              <color-label :text="item?.onset_speed?.name" :color="item?.onset_speed?.color" />
            </template>

            <template v-slot:item.consequences="{ item }">
              <clickable-chip
                :permission="'access_risk_consequences'"
                :value="item?.risk_consequences_count"
                @click="routeTo(`/${item.id}/consequences`)"
              />
            </template>
            <template v-slot:item.causes="{ item }">
              <clickable-chip
                :permission="'access_risk_causes'"
                :value="item?.risk_causes_count"
                @click="routeTo(`/${item.id}/causes`)"
              />
            </template>
            <template v-slot:item.control="{ item }">
              <clickable-chip
                :permission="'access_risk_controls'"
                :value="item?.risk_controls_count"
                @click="routeTo(`/${item.id}/controls`)"
              />
            </template>
            <template v-slot:item.treatment="{ item }">
              <clickable-chip
                :permission="'access_risk_treatments'"
                :value="item?.treatments_count"
                @click="routeTo(`/${item.id}/treatments`)"
              />
            </template>
            <template v-slot:item.attachments="{ item }">
              <attachment-actions-cell
                :permissions="{ add: 'add_risk_document', view: 'access_risk_documents' }"
                :attachmentCount="item?.risk_attachments_count || 0"
                @open-attachment-list="openAttachmentListDialog(item)"
                @open-attachment-form="openAttachmentFormDialog(item)"
              />
            </template>
            <template v-slot:item.owner="{ item }">
              <v-can disable-only :permission="'edit_risk'">
                <template #default="{ disabled }">
                  <button-dropdown-picker
                    :value="item.owner?.id"
                    :options="users"
                    :selectedText="item.owner?.full_name || $t('page.select_owner')"
                    :loading="loading.users"
                    btnColor="primary"
                    :btn-disabled="disabled"
                    @change="(option) => updateOwner(item, option)"
                  />
                </template>
              </v-can>
            </template>
            <template v-slot:item.risk_status="{ item }">
              <v-can disable-only :permission="'edit_risk'">
                <template #default="{ disabled }">
                  <button-dropdown-picker
                    :value="item.risk_status?.id"
                    :options="riskStatuses"
                    :selectedText="item?.risk_status?.name || $t('page.select_status')"
                    :loading="loading.riskStatuses"
                    :btnColor="item.risk_status?.color"
                    :btn-disabled="disabled"
                    @change="(option) => updateStatus(item, option)"
                  />
                </template>
              </v-can>
            </template>
            <template v-slot:item.identification_date="{ item }">
              <formated-date-time hide-time :date="item.identification_date" />
            </template>
            <template v-slot:item.analysis_evaluation_date="{ item }">
              <v-can disable-only :permission="'edit_risk'">
                <template #default="{ disabled }">
                  <clickable-date-cell
                    :date="item.analysis_evaluation_date"
                    :itemId="item.id"
                    field="analysis_evaluation_date"
                    :disabled="disabled"
                    @date-updated="handleDateUpdate"
                  />
                </template>
              </v-can>
            </template>
            <template v-slot:item.associated_threats="{ item }">
              <associated-items
                :title="{
                  title: 'page.threats_associated_with',
                  parentName: item.name
                }"
                :items="{
                  fetchItems: () => {
                    fetchThreats({ risk_id: item.id })
                  },
                  items: associatedThreats,
                  nameKey: 'threat_name'
                }"
                :loadingItems="isLoadingThreats"
              />
            </template>
            <!-- probability_loss template -->
            <template v-slot:item.asset_probability_loss="{ item }">
              <div>{{ item?.asset_probability_loss }}%</div>
            </template>

            <!-- tasks templte -->
            <template v-slot:[`item.tasks`]="{ item }">
              <v-btn small icon text @click="viewTaskDialog(item)" class="d-flex align-center justify-start">
                <v-icon size="large">mdi-calendar-check-outline</v-icon>
                <span>
                  {{ item?.tasks?.length || 0 }}
                </span>
              </v-btn>
            </template>
          </custom-table>
        </custom-table-wrapper>
      </div>
    </div>
    <custom-dialog
      v-model="attachmentListDialog.show"
      :title="$t('page.attachments') + ' - ' + attachmentListDialog?.item?.code"
    >
      <attachment-list
        :permissions="{ edit: 'edit_risk_document', delete: 'delete_risk_document', viewNote: 'view_risk_document' }"
        :attachments="riskAttachments"
        :loading="loading.riskAttachments"
        :showNotes="true"
        :getAttachmentUrl="getAttachmentUrl"
        @delete-attachment="handleDeleteAttachment"
        @update-attachment="UpdateAttachment"
        @error="handleError"
      />
    </custom-dialog>
    <custom-dialog v-model="attachmentFormDialog.show" :title="$t('form.add_attachment')">
      <risk-register-attachment-form
        v-if="attachmentFormDialog.show"
        :itemId="attachmentFormDialog.itemId"
        @attachment-added="handleAttachmentAdded"
      />
    </custom-dialog>
    <custom-dialog
      v-model="showHeatmap"
      :title="$t('page.heatmap')"
      :width="displayCount ? '1500px' : '1000px'"
      :maxHeight="'100vh'"
    >
      <risk-heatmap
        :risks="risks"
        :impacts="impacts"
        :likelihoods="likelihoods"
        :onsetSpeeds="onsetSpeeds"
        :priorities="riskPriorities"
      />
    </custom-dialog>

    <excel-importer
      v-model="showImportDialog"
      :field-mappings="riskFieldMappings"
      :api-methods="riskApiMethods"
      :translations="riskTranslations"
      :entity-config="riskEntityConfig"
      :use-bulk-import="true"
      @import-completed="handleImportCompleted"
      @error="handleImportError"
    />

    <!-- TPS Task View Dialog -->
    <custom-dialog
      v-model="tpsTaskViewDialog"
      :title="$t('table.assigned_tasks')"
      width="580px"
      @close-dialog="handleCloseDialog"
    >
      <TPSTaskView :selectedItemTask="selectedItemTask" />
    </custom-dialog>

    <!-- Paginated report print dialog -->
    <custom-dialog v-model="showPrintDialog" :title="$t('page.print_risk_register')" width="600px">
      <risk-register-print-dialog :risks="risks" :headers="headers" @close="showPrintDialog = false" />
      <!-- <printable-table-dialog
        :items="risks"
        :headers="headers"
        :title="$t('page.print_risk_register')"
        :report-title="$t('page.risk_register')"
        :default-columns="['tenant_risk_id', 'risk_description', 'risk_category.name', 'risk_status']"
        :cell-formatter="formatRiskCell"
        @close="closeDialog"
      > -->
      <!-- Custom cell formatting using slots if needed -->
      <!-- <template #cell-note="{ value }">
          {{ stripHtml(value) }}
        </template>
      </printable-table-dialog> -->
    </custom-dialog>
  </v-can>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import { formatCurrency, formatPercentage } from "@/helpers/formatters"
import FilterBtn from "@/components/custom-table/FilterBtn.vue"
import ProgressBox from "@/components/custom-table/ProgressBox.vue"
import EditableNoteForm from "@/components/forms/EditableNoteForm.vue"
import UnderConstuction from "@/components/UnderConstuction.vue"
import AttachmentActionsCell from "@/components/custom-table/AttachmentActionsCell.vue"
import RiskRegisterAttachmentForm from "@/components/forms/RiskRegisterAttachmentForm.vue"
import ClickableChip from "@/components/custom-table/ClickableChip.vue"
import AttachmentList from "@/components/audit/AttachmentList.vue"
import ClearFilterBtn from "../../../components/custom-table/ClearFilterBtn.vue"
import { getUsers } from "@/api/tenent-api"
import VCan from "../../../components/VCan.vue"
import RiskHeatmap from "../../../components/charts/RiskHeatmap.vue"
import CustomDialog from "../../../components/CustomDialog.vue"
import HeatmapTwo from "../../../components/charts/HeatmapTwo.vue"
import ColorLabel from "../../../components/custom-table/ColorLabel.vue"
import ButtonDropdownPicker from "@/components/custom-table/ButtonDropdownPicker.vue"
import FormatedDateTime from "../../../components/FormatedDateTime.vue"
import ClickableDateCell from "../../../components/custom-table/ClickableDateCell.vue"
import ExcelImporter from "../../../components/importers/ExcelImporter.vue"
import AssociatedItems from "../../../components/custom-table/AssociatedItems.vue"
import CustomTableWrapper from "../../../components/custom-table/CustomTableWrapper.vue"
// import PrintableTableDialog from "@/components/PrintableTableDialog.vue"

export default {
  name: "RiskRegisterPage",
  layout: "dashboard-layout",
  middleware: ["auth", "is-grc"],
  components: {
    FilterBtn,
    UnderConstuction,
    ProgressBox,
    EditableNoteForm,
    AttachmentActionsCell,
    RiskRegisterAttachmentForm,
    ClickableChip,
    AttachmentList,
    ClearFilterBtn,
    VCan,
    RiskHeatmap,
    CustomDialog,
    HeatmapTwo,
    ColorLabel,
    ButtonDropdownPicker,
    FormatedDateTime,
    ClickableDateCell,
    ExcelImporter,
    AssociatedItems,
    CustomTableWrapper
    // PrintableTableDialog
  },
  data() {
    return {
      showImportDialog: false,
      tableConfig: {
        delete: this.deleteRisk,
        itemPath: "/grc/risk-register",
        createForm: {
          componentPath: "forms/RiskRegisterForm"
        },
        editForm: {
          componentPath: "forms/RiskRegisterForm",
          props: { editForm: true }
        },
        CANS: {
          props: {
            postableType: "risk",
            usersApi: () => this.getUsers(this.$axios),
            updateCount: (riskId) => {
              this.updateMessageCount(riskId)
            }
          }
        },
        attachments: {
          componentPath: "attachments/RiskAttachments",
          props: { deleteConfig: { deleteFunc: this.deleteRiskAttachment, parentKey: "risk" } }
        },
        permissions: {
          documentManagement: "access_risk_document_management",
          create: "create_risk",
          edit: "edit_risk",
          delete: "delete_risk"
        }
      },
      headers: [
        { text: "table.id", value: "tenant_risk_id", sortable: false },
        {
          text: "table.risk_description",
          value: "risk_description",
          sortable: false,
          cellClass: ["no-wrap"]
        },

        {
          text: "table.risk_area",
          value: "risk_category.name",
          sortable: false,
          cellClass: ["no-wrap"],
          uncenterBody: true
        },
        { text: "table.threat", value: "risk_type.name", sortable: false, cellClass: ["no-wrap"], uncenterBody: true },
        { text: "table.likelihood", value: "likely_hood", sortable: false },
        { text: "table.impact", value: "impact", sortable: false },
        { text: "table.overall_inherent_risk_rating", value: "rating", sortable: false },
        { text: "table.overall_residual_risk_rating", value: "overall_rating", sortable: false },
        { text: "table.onset_speed", value: "onset_speed", sortable: false },
        { text: "table.identification_date", value: "identification_date", sortable: false, cellClass: ["no-wrap"] },
        {
          text: "table.analysis_evaluation_date",
          value: "analysis_evaluation_date",
          sortable: false,
          cellClass: ["no-wrap"]
        },
        { text: "table.owner", value: "owner", sortable: false },
        { text: "table.asset", value: "asset", sortable: false, cellClass: ["no-wrap"], uncenterBody: true },
        { text: "table.cost", value: "asset_cost", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.probability_loss", value: "asset_probability_loss", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.loss_value", value: "asset_loss_value", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.bcm_threat", value: "bcm_threat.threat_name", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.compliance_reference", value: "compliance_ref", sortable: false, cellClass: ["no-wrap"] },
        { text: "table.status", value: "risk_status", sortable: false },
        { text: "table.notes", value: "notes", sortable: false },
        { text: "table.unit", value: "unit.name", sortable: false },
        { text: "table.attachments", value: "attachments", sortable: false },
        { text: "", icon: "mdi-arrow-expand-all", value: "consequences", tooltip: "table.consequences" },
        { text: "", icon: "mdi-source-branch", value: "causes", tooltip: "table.causes" },
        { text: "", icon: "mdi-shield-outline", value: "control", tooltip: "table.controls" },
        { text: "", icon: "mdi-flask", value: "treatment", tooltip: "table.treatments" },
        { text: "table.associated_threats", value: "associated_threats", uncenterBody: false },
        { text: "table.tasks", value: "tasks", tooltip: "table.tasks" },
        { text: "table.actions", value: "actions", sortable: false }
      ],
      showHeatmap: false,
      dialog: { filter: false },
      attachmentListDialog: {
        show: false,
        attachments: [],
        title: "",
        item: null
      },
      attachmentFormDialog: {
        show: false,
        itemId: null
      },
      filters: {
        risk_priority_id: null,
        risk_type_id: null,
        risk_category_id: this.$route.query.risk_category_id || null,
        risk_status_id: this.$route.query.risk_status_id || null,
        impact_id: this.$route.query.impact_id || null,
        likely_hood_id: this.$route.query.likelihood_id || null,
        inherent_risk_rating_id: this.$route.query.treatment_id || null,
        residual_risk_rating_id: this.$route.query.treatment_id || null,
        onset_speed_id: null,
        owner_id: this.$route.query.owner_id || null,
        grc_asset_id: null
      },
      selectedItemTask: [],
      tpsTaskViewDialog: false,
      showPrintDialog: false
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    ...mapState("heatmap", ["displayCount"]),
    ...mapState("assets", ["assets"]),
    ...mapState("risk", [
      "risks",
      "stats",
      "riskPriorities",
      "riskTypes",
      "riskCategories",
      "riskStatuses",
      "impacts",
      "likelihoods",
      "onsetSpeeds",
      "loading",
      "errors",
      "riskAttachments"
    ]),
    ...mapGetters("risk", ["users"]),
    ...mapGetters({ associatedThreats: "threats/getThreats", isLoadingThreats: "threats/isLoading" }),

    risks() {
      return this.$store.state.risk.risks.map((risk) => ({
        ...risk,
        CANSTitle: risk?.name
      }))
    },

    riskFieldMappings() {
      return [
        {
          field: "name",
          label: this.$t("form.risk_description"),
          required: true,
          example: "Risk of cybersecurity breach"
        },
        {
          field: "code",
          label: this.$t("form.short_name"),
          required: true,
          example: "RISK001",
          // ! Custom validation for code field
          validate: (value) => {
            if (!value || value.length < 3) {
              return "Code must be at least 3 characters"
            }
            return true
          }
        },
        {
          field: "owner_id",
          label: this.$t("form.owner"),
          required: true,

          entityMapping: "users"
        },
        {
          field: "grc_asset_id",
          label: this.$t("table.asset"),
          required: true,

          entityMapping: "assets"
        },
        {
          field: "impact_id",
          label: this.$t("form.impact"),
          required: true,

          entityMapping: "impacts"
        },
        {
          field: "likely_hood_id",
          label: this.$t("form.likelihood"),
          required: true,

          entityMapping: "likelihoods"
        },
        {
          field: "onset_speed_id",
          label: this.$t("form.onset_speed"),
          required: true,

          entityMapping: "onsetSpeeds"
        },
        {
          field: "risk_type_id",
          label: this.$t("table.threat"),
          required: true,

          entityMapping: "riskTypes"
        },
        {
          field: "risk_category_id",
          label: this.$t("table.risk_area"),
          required: true,

          entityMapping: "riskCategories"
        },
        {
          field: "risk_status_id",
          label: this.$t("form.risk_status"),
          required: true,

          entityMapping: "riskStatuses"
        },
        {
          field: "identification_date",
          label: this.$t("form.identification_date"),
          required: true,
          example: "2023-01-01"
        }
      ]
    },

    riskApiMethods() {
      return {
        create: this.createRisk,
        fetchAll: () => this.fetchRisks(),
        bulkCreate: (records) => this.bulkCreateRisks(records),

        reference: {
          users: async () => {
            await this.fetchUsers()
            return this.users
          },
          assets: async () => {
            await this.fetchAssets()
            return this.assets
          },
          impacts: async () => {
            await this.fetchImpacts()
            return this.impacts
          },
          likelihoods: async () => {
            await this.fetchLikelihoods()
            return this.likelihoods
          },
          onsetSpeeds: async () => {
            await this.fetchOnsetSpeeds()
            return this.onsetSpeeds
          },
          riskTypes: async () => {
            await this.fetchRiskTypes()
            return this.riskTypes
          },
          riskCategories: async () => {
            await this.fetchRiskCategories()
            return this.riskCategories
          },
          riskStatuses: async () => {
            await this.fetchRiskStatuses()
            return this.riskStatuses
          }
        }
      }
    },

    riskTranslations() {
      return {
        dialogTitle: this.$t("page.import_risks"),
        uploadInstructions: this.$t("message.import_excel_instructions")
      }
    },

    riskEntityConfig() {
      return {
        templateFilename: "risk_register_template.xlsx",
        entityName: "risk",
        entityNamePlural: "risks"
      }
    }
  },
  methods: {
    formatCurrency,
    formatPercentage,
    ...mapActions({ fetchThreats: "threats/fetchThreats" }),
    ...mapActions("drawer", ["openDrawer"]),
    ...mapActions("assets", ["fetchAssets"]),
    ...mapActions("risk", [
      "fetchRisks",
      "deleteRisk",
      "fetchRiskPriorities",
      "fetchRiskTypes",
      "fetchRiskCategories",
      "fetchRiskStatuses",
      "fetchImpacts",
      "fetchLikelihoods",
      "fetchRiskAttachments",
      "updateRiskAttachment",
      "deleteRiskAttachment",
      "fetchOnsetSpeeds",
      "updateMessageCount",
      "fetchUsers",
      "updateRisk",
      "createRisk", // ! Added createRisk action for the importer
      "bulkCreateRisks"
    ]),
    getUsers,
    openSingleRiskDrawer(risk) {
      console.log({ risk })
      this.openDrawer({
        component: "risk/RiskDetails",
        props: { risk },
        title: this.$t("page.risk_details"),
        width: "100vw"
      })
    },
    handleProgressBoxFilter({ filterType, filterId, statName }) {
      // Update the filter
      this.filters[filterType] = filterId

      // Apply filters
      this.applyFilters()
    },
    routeTo(path) {
      const baseUrl = "/grc/risk-register"
      this.$router.push(this.localePath(baseUrl + path))
    },
    openAttachmentListDialog(item) {
      this.attachmentListDialog.item = item
      this.attachmentListDialog.title = item.description
      this.fetchAttachments(item.id)
    },
    openAttachmentFormDialog(item) {
      this.attachmentFormDialog.itemId = item.id
      this.attachmentFormDialog.show = true
    },
    fetchAttachments(itemId) {
      this.attachmentListDialog.show = true
      this.fetchRiskAttachments(itemId)
        .then(() => {
          // this.attachmentListDialog.attachments = this.riskAttachments
        })
        .catch((error) => {
          console.error("Error fetching attachments:", error)
          this.$toast.showMessage({
            message: error?.message,
            status: "error"
          })
        })
    },
    handleAttachmentAdded({ attachment, riskId }) {
      this.attachmentFormDialog.show = false
      // this.updateAttachmentCount(riskId, 1)
      // this.attachmentListDialog.attachments.push(attachment)
    },
    updateAttachmentCount(riskId, change) {
      const risk = this.risks.find((r) => r.id === riskId)
      if (risk) {
        risk.risk_attachments_count = (risk.risk_attachments_count || 0) + change
      }
    },
    async UpdateAttachment(attachmentId, payload) {
      try {
        const updatedAttachment = await this.updateRiskAttachment({
          id: attachmentId,
          payload,
          parentId: this.attachmentListDialog.item.id
        })
        const index = this.attachmentListDialog.attachments.findIndex((a) => a.id === attachmentId)
        if (index !== -1) {
          this.attachmentListDialog.attachments.splice(index, 1, updatedAttachment)
        }
        // this.$toast.success("Note updated successfully")
      } catch (error) {
        console.error("Error updating attachment note:", error)
        // this.$toast.error("Failed to update note")
      }
    },
    async handleDeleteAttachment(attachmentId) {
      try {
        await this.deleteRiskAttachment({ attachmentId, parentId: this.attachmentListDialog.item.id })
      } catch (error) {
        console.error("Error deleting attachment:", error)
      }
    },
    getAttachmentUrl(attachment) {
      return `https://api.ordonsoft.com/storage/${attachment.path}`
    },
    handleError(message) {
      console.error(message)
      this.$toast.showMessage({
        message: message,
        status: "error"
      })
    },
    applyFilters() {
      this.fetchRisks(this.filters)
    },
    async fetchAllDropdownData() {
      try {
        await Promise.all([
          this.fetchRiskPriorities(),
          this.fetchRiskTypes(),
          this.fetchRiskCategories(),
          this.fetchRiskStatuses(),
          this.fetchImpacts(),
          this.fetchLikelihoods(),
          this.fetchOnsetSpeeds(),
          this.fetchUsers(),
          this.fetchAssets()
        ])
      } catch (err) {
        console.log("Error fetching dropdown data:", err)
        this.handleError(err?.message || "Failed to fetch dropdown data")
      }
    },
    async handleDateUpdate({ itemId, field, value }) {
      try {
        const item = this.risks.find((r) => r.id === itemId)
        if (!item) return

        const payload = {
          ...item,
          risk_priority_id: item.risk_priority?.id,
          risk_type_id: item.risk_type?.id,
          risk_category_id: item.risk_category?.id,
          risk_status_id: item.risk_status?.id,
          impact_id: item.impact?.id,
          likely_hood_id: item.likely_hood?.id,
          onset_speed_id: item.onset_speed?.id,
          owner_id: item.owner?.id,
          [field]: value
        }

        await this.updateRisk({ id: itemId, payload })

        // Optional: Show success message
        this.$toast.showMessage({
          message: this.$t("message.date_updated_successfully"),
          status: "success"
        })
      } catch (error) {
        console.error(`Error updating ${field}:`, error)
        this.$toast.showMessage({
          message: error?.message || this.$t("error.update_failed"),
          status: "error"
        })
      }
    },
    async updateOwner(item, newOwner) {
      try {
        const payload = {
          ...item,
          risk_priority_id: item.risk_priority?.id,
          risk_type_id: item.risk_type?.id,
          risk_category_id: item.risk_category?.id,
          risk_status_id: item.risk_status?.id,
          impact_id: item.impact?.id,
          likely_hood_id: item.likely_hood?.id,
          onset_speed_id: item.onset_speed?.id,
          owner_id: newOwner.id
        }

        await this.updateRisk({ id: item.id, payload })
        item.owner = newOwner
      } catch (error) {
        console.error("Error updating owner:", error)
      }
    },
    async updateStatus(item, newStatus) {
      try {
        const payload = {
          ...item,
          risk_priority_id: item.risk_priority?.id,
          risk_type_id: item.risk_type?.id,
          risk_category_id: item.risk_category?.id,
          risk_status_id: newStatus.id,
          impact_id: item.impact?.id,
          likely_hood_id: item.likely_hood?.id,
          onset_speed_id: item.onset_speed?.id,
          owner_id: item.owner?.id
        }

        await this.updateRisk({ id: item.id, payload })
        item.risk_status = newStatus
      } catch (error) {
        console.error("Error updating status:", error)
      }
    },

    // ! NEW: Event handlers for the ExcelImporter component
    handleImportCompleted({ imported, errors }) {
      this.showImportDialog = false

      // Show success message
      this.$toast.showMessage({
        message: this.$t("message.import_completed_successfully", {
          imported,
          errors
        }),
        status: imported > 0 ? "success" : "warning"
      })

      // Optionally refresh stats or other data
      // this.fetchStats()
    },

    // ! NEW: Handle import errors from ExcelImporter
    handleImportError(errorMessage) {
      this.$toast.showMessage({
        message: errorMessage,
        status: "error"
      })
    },
    viewTaskDialog(item) {
      this.selectedItemTask = item?.tasks
      this.tpsTaskViewDialog = true
    },
    formatDate(dateString) {
      if (!dateString) return ""

      // Customize date formatting based on your locale
      const date = new Date(dateString)
      return date.toLocaleDateString(this.$i18n.locale, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }
  },
  async mounted() {
    await this.applyFilters()
    await this.fetchAllDropdownData()
  }
}
</script>

<style scoped>
.table-fill {
  border-radius: 16px;
  overflow: hidden;
}

::v-deep(.table-fill .v-data-table) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: none !important;
  border: 1px solid #eaeaea;
}

::v-deep(.table-fill .v-data-table-header th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}

::v-deep(.table-fill thead tr th) {
  background-color: #fafafa !important;
  font-weight: 600;
  font-size: 12px;
  color: #9e9e9e;
  border-bottom: 1px solid #eee;
}

::v-deep(.table-fill .v-data-table__wrapper tr) {
  height: 48px !important;
}

::v-deep(.table-fill .v-data-table__wrapper tr:hover) {
  background-color: #fafafa !important;
}

::v-deep(.table-fill td) {
  font-size: 13px;
}
/* Force the button container to center all items */
::v-deep .btns-container-default,
::v-deep .btns-container-grid {
  display: flex !important;
  justify-content: center !important;
  flex-wrap: wrap;
}

/* Merge the left slot buttons into the center flow */
::v-deep .btns-left {
  display: contents;
}

/* Optional: remove extra spacing if needed */
::v-deep .btns-center {
  margin-left: 0;
}

/* Hide the empty right spacer */
::v-deep .btns-right {
  display: none;
}
</style>
