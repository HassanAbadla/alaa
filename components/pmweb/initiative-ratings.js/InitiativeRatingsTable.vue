<template>
  <!-- !Think about path being passed as a prop -->
  <p-m-web-table-template
    :title="$t('page.initiative_ratings')"
    :headers="computedHeaders"
    show-edit
    :config="tableConfig"
    item-path="/pm-web/initiative-ratings"
    permission="access_pmweb_initiative_ratings"
    store-name="pmwebInitiativeRatings"
    items-getter-name="getInitiativeRatings"
    current-item-getter-name="getCurrentInitiativeRating"
    fetch-action-name="fetchInitiativeRatings"
    delete-action-name="deleteInitiativeRating"
    add-action-name="addInitiativeRating"
    create-permission="create_pmweb_initiative_rating"
    delete-permission="delete_pmweb_initiative_rating"
    hide-filter
    :prop-filters="{ ...filters, ...propFilters }"
    @clear-filters="clearLocalFilters"
  >
    <!--  Rating -->
    <template v-slot:item.Rating="{ item }">
      <star-rating :rating="item.Rating" />
    </template>

    <!-- Auto-formatted slots for date and currency -->
    <template v-for="header in formattedHeaders" v-slot:[`item.${header.value}`]="{ item }">
      <span :key="header.value">{{ formatCellValue(item[header.value], header.type, item) }}</span>
    </template>
  </p-m-web-table-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import PMWebTableTemplate from "@/components/pmweb/PMWebTableTemplate.vue"

import { tableFormattingMixin } from "@/mixins/tableFormattingMixin"
import StarRating from "@/components/common/StarRating.vue"

export default {
  components: { PMWebTableTemplate, StarRating },
  mixins: [tableFormattingMixin],
  name: "PMWEBinitiativeRatingsTable",

  props: {
    propFilters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      filters: {
        // type: null,
        // priority: null,
        // program: null
      },
      headers: [
        {
          text: "table.rating",
          value: "Rating"
        },
        {
          text: "table.date",
          value: "Date",
          type: "date"
        },
        {
          text: "table.user",
          value: "user.FullName"
        },
        {
          text: "table.comment",
          value: "Comment"
        },
        {
          text: "table.use",
          value: "Use",
          type: "boolean"
        },
        {
          text: "table.actions",
          value: "actions",
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      // programsList: "pmwebProgramsList/getPrograms",
      // loadingProgramsList: "pmwebProgramsList/isLoading",
      // projectTypes: "pmwebProjectTypes/getProjectTypes",
      // loadingProjectTypes: "pmwebProjectTypes/isLoading",
      // priorities: "pmwebPriorities/getPriorities",
      // loadingPriorities: "pmwebPriorities/isLoading"
    }),
    tableConfig() {
      return {
        editPermission: "update_pmweb_initiative_rating",
        createForm: {
          componentPath: "forms/PMWebInitiativeRatingsForm"
        },
        editForm: {
          componentPath: "forms/PMWebInitiativeRatingsForm",
          props: { editForm: true }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      // fetchProgramsList: "pmwebProgramsList/fetchPrograms",
      // fetchProjectTypes: "pmwebProjectTypes/fetchProjectTypes",
      // fetchPriorities: "pmwebPriorities/fetchPriorities"
    }),
    clearLocalFilters() {
      this.filters = {
        // type: null,
        // priority: null,
        // program: null
      }
    }
  },
  async mounted() {
    // Fetch initial data
    // await Promise.all([this.fetchProgramsList(), this.fetchProjectTypes(), this.fetchPriorities()])
  }

  // All computed properties and methods are now provided by the mixin!
  // No need to define:
  // - computedHeaders
  // - formattedHeaders
  // - formatDate
  // - currencyFormatter
  // - formatCellValue
}
</script>
