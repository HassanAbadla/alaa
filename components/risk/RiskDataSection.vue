<!-- RiskDataSection.vue -->
<template>
  <v-card flat outlined class="pa-0 ma-0 risk-data-section">
    <custom-table
      :title="title"
      :propItems="items"
      :propLoading="loading"
      :headers="formatHeaders(columns)"
      :tableConfig="tableConfigWithPath"
      hideFooter
      hideSearch
      :hideDelete="hideDelete"
      :hideCreate="hideCreate"
      :hideView="hideView"
      :sortOnLoad="false"
      dense
      :full-page-table="false"
    >
      <!-- Move buttons to title-end slot -->
      <template v-slot:title-end>
        <div class="d-flex align-center">
          <!-- Create button (plus icon) -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                :color="'primary'"
                :style="{
                  backgroundColor: getTextColorForBackground('primary'),
                  color: getTextColorForBackground('primary')
                }"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="openCreateDrawer"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("page.create") }}</span>
          </v-tooltip>

          <!-- View All button (arrow) -->
          <v-tooltip bottom v-if="config.itemPath">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                :color="'primary'"
                :style="{
                  backgroundColor: getTextColorForBackground('primary'),
                  color: getTextColorForBackground('primary')
                }"
                v-bind="attrs"
                v-on="on"
                :to="config.itemPath"
              >
                <v-icon>{{ isRTL ? "mdi-arrow-left" : "mdi-arrow-right" }}</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("page.view_all") }}</span>
          </v-tooltip>
        </div>
      </template>

      <!-- Forward all slots to allow for custom cell rendering -->
      <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData"></slot>
      </template>

      <!-- Add specific slot handling for common columns -->
      <template v-slot:item.treatment_status="{ item }">
        <color-label
          v-if="item.treatment_status"
          :text="item.treatment_status.name"
          :color="item.treatment_status.color"
        />
        <span v-else>-</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex flex-row justify-center">
          <v-can disable-only :permission="tableConfig.permissions?.view">
            <template #default="{ disabled }">
              <v-btn
                v-if="!hideView"
                :disabled="disabled || !tableConfig.itemPath"
                icon
                small
                @click="routeTo(`${tableConfig.itemPath}/${itemId(item)}`)"
              >
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-can>
          <v-can disable-only :permission="tableConfig.permissions?.edit">
            <template #default="{ disabled }">
              <v-btn
                v-if="!hideEdit"
                icon
                small
                :disabled="disabled"
                @click="
                  useEditDrawer ? openDrawerForm(true, item) : routeTo(`${tableConfig.itemPath}/${itemId(item)}/edit`)
                "
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-can>
          <v-can disable-only :permission="tableConfig.permissions?.delete">
            <template #default="{ disabled }">
              <v-btn v-if="!hideDelete" icon small @click.stop="openDeleteModal([item])" :disabled="disabled">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-can>

          <v-can disable-only :permission="tableConfig.permissions?.manageStage">
            <template #default="{ disabled }">
              <v-btn v-if="showStageEdit" :disabled="disabled" icon small @click="openStageForm(item)">
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
            </template>
          </v-can>
        </div>
      </template>

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

      <template v-slot:item.likely_hood="{ item }">
        <color-label v-if="item.likely_hood" :text="item.likely_hood.name" :color="item.likely_hood.color" />
        <span v-else>-</span>
      </template>

      <template v-slot:item.impact="{ item }">
        <color-label v-if="item.impact" :text="item.impact.name" :color="item.impact.color" />
        <span v-else>-</span>
      </template>

      <template v-slot:item.rating="{ item }">
        <color-label
          v-if="item.treatment_rating"
          :text="item.treatment_rating.name"
          :color="item.treatment_rating.color"
        />
        <span v-else>-</span>
      </template>

      <template v-slot:item.owner="{ item }">
        <span>{{ item.owner ? item.owner.full_name : "-" }}</span>
      </template>

      <template v-slot:item.budget="{ item }">
        <span>{{ formatCurrency(item.budget, false, "suffix", $i18n) }}</span>
      </template>

      <template v-slot:item.progress="{ item }">
        <span>{{ formatPercentage(item.progress, false) }}</span>
      </template>

      <template v-slot:item.start_date="{ item }">
        <formated-date-time v-if="item.start_date" hide-time :date="item.start_date" />
        <span v-else>-</span>
      </template>

      <template v-slot:item.end_date="{ item }">
        <formated-date-time v-if="item.end_date" hide-time :date="item.end_date" />
        <span v-else>-</span>
      </template>
    </custom-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { colorUtils } from "@/mixins/colorUtils"
import CustomTable from "@/components/custom-table/CustomTable.vue"
import ColorLabel from "@/components/custom-table/ColorLabel.vue"
import FormatedDateTime from "@/components/FormatedDateTime.vue"
import { formatCurrency, formatPercentage } from "@/helpers/formatters"
import EditableNoteForm from "../forms/EditableNoteForm.vue"

export default {
  name: "RiskDataSection",
  components: {
    CustomTable,
    ColorLabel,
    FormatedDateTime,
    EditableNoteForm
  },
  mixins: [colorUtils],
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(
          (column) =>
            typeof column === "object" &&
            ((column.title !== undefined && column.key !== undefined) ||
              (column.text !== undefined && column.value !== undefined))
        )
      },
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      required: true
    },
    hideEdit: { type: Boolean, default: false },
    hideView: { type: Boolean, default: true },
    hideDelete: { type: Boolean, default: true },
    hideCreate: { type: Boolean, default: true }
  },
  computed: {
    ...mapState(["isRTL"]),
    tableConfigWithPath() {
      return {
        ...this.config,
        itemPath: this.config.itemPath || "",
        permissions: this.config.permissions || {}
      }
    }
  },
  methods: {
    formatCurrency,
    formatPercentage,
    ...mapActions("drawer", ["openDrawer"]),
    openCreateDrawer() {
      if (this.config.createForm) {
        const { componentPath, props, title, width } = this.config.createForm
        this.openDrawer({
          component: componentPath,
          props: props || {},
          title: this.$t("page.create"),
          width: width || 700
        })
      }
    },
    formatHeaders(columns) {
      // Convert from either format to CustomTable header format
      return columns.map((column) => {
        return {
          text: column.title || column.text || "",
          value: column.value || column.key || "",
          sortable: false,
          align: "center"
        }
      })
    }
  }
}
</script>

<style scoped>
.risk-data-section {
  height: 300px;
  display: flex;
  flex-direction: column;
}

::v-deep .v-data-table {
  max-height: 298px;
  overflow-y: auto;
}

/* Override some CustomTable styles to fit in this smaller container */
::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

::v-deep .v-card__text {
  padding: 8px 16px;
}

::v-deep .v-data-table__wrapper {
  overflow-y: auto;
}
</style>
