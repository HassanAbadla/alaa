<template>
  <v-container class="py-8">
    <!-- <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" /> -->
    <custom-dropdown
      v-model="formData.srv_visit_id"
      :label="$t('table.visit')"
      :items="getVisits"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingVisits"
      :disabled="!editForm && this.$route.query.srv_visit_id ? true : false"
    />
    <custom-dropdown
      v-model="formData.srv_consumed_type_id"
      :label="$t('form.type')"
      :items="getConsumedTypes"
      item-value="id"
      item-text="name"
      :required="true"
      :loading="loadingConsumedTypes"
    />
    <!-- <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" /> -->
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  name: "SrvVisitsConsumptionsForm",
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
        srv_consumed_type_id: null,
        srv_visit_id: Number(this.$route.query.srv_visit_id) || null
      },
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentVisitsConsumption: "srvVisitsConsumptions/getCurrentVisitsConsumption",
      loadingVisitsConsumptions: "srvVisitsConsumptions/isLoading",
      //
      getConsumedTypes: "srvConsumedTypes/getConsumedTypes",
      loadingConsumedTypes: "srvConsumedTypes/isLoading",
      getVisits: "srvVisits/getVisits",
      loadingVisits: "srvVisits/isLoading"
    }),
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
      addVisitsConsumption: "srvVisitsConsumptions/addVisitsConsumption",
      updateVisitConsumption: "srvVisitsConsumptions/updateVisitConsumption",
      fetchVisitsConsumptionById: "srvVisitsConsumptions/fetchVisitsConsumptionById",
      //
      fetchConsumedTypes: "srvConsumedTypes/fetchConsumedTypes",
      fetchVisits: "srvVisits/fetchVisits"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.loadingVisitsConsumptions = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateVisitConsumption(this.formData)
      } else {
        await this.addVisitsConsumption(this.formData)
      }
      this.loadingVisitsConsumptions = false
      this.closeDrawer()
    }
  },
  async mounted() {
    this.fetchConsumedTypes()
    this.fetchVisits()
    if (this.editForm) {
      await this.fetchVisitsConsumptionById(this.itemId)
      this.formData = { ...this.getCurrentVisitsConsumption }
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
