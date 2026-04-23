<template>
  <v-container class="py-8">
    <custom-dropdown
      v-if="isService"
      v-model="formData.tenant_id"
      :items="getTenants"
      item-text="company_name"
      item-value="id"
      :label="$t('table.company')"
      :required="true"
      :loading="loadingTenants"
      :disabled="disableTenantSelection"
      @input="getTenantBuildings"
    />
    <custom-dropdown
      v-model="formData.building_id"
      :items="getBuildings"
      item-text="name"
      item-value="id"
      :label="$t('table.buildings')"
      :required="false"
      :loading="loadingBuildings"
      :disabled="disableBuildingsSelection"
    />
    <custom-dropdown
      v-model="formData.floor_id"
      :items="getFloors"
      item-text="name"
      item-value="id"
      :label="$t('table.floor')"
      :required="false"
      :loading="loadingFloors"
    />
    <custom-dropdown
      v-model="formData.space_id"
      :items="getSpaces"
      item-text="name"
      item-value="id"
      :label="$t('table.space')"
      :required="false"
      :loading="loadingSpaces"
    />
    <custom-input v-model="formData.name" :label="$t('form.name')" :required="true" />
    <custom-input v-model="formData.label" :label="$t('form.room_label')" :required="false" />
    <!-- <custom-input v-model="formData.unit_id" :label="$t('form.unit')" :required="false" /> -->
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
          v-model="formData.unit_id"
          :required="true"
          :disabled="true"
          :field-info-text="$t('field_info.asset_unit')"
          class="flex-grow-1 mx-1 z-index-1"
        />
      </div>
    </div>
    <custom-input v-model="formData.user_id" :label="$t('form.user')" :required="false" />
    <custom-input v-model="formData.no" :label="$t('table.room_no')" :required="false" />
    <custom-input v-model="formData.meters" :label="$t('form.floor_meters')" :required="false" type="number" />
    <custom-dropdown
      v-model="formData.room_use_id"
      :items="getRoomUses"
      item-text="name"
      item-value="id"
      :label="$t('table.room_use')"
      :required="false"
      :loading="loadingRoomUses"
    />
    <custom-input v-model="formData.room_area" :label="$t('table.room_area')" :required="false" type="number" />
    <custom-input
      v-model="formData.room_no_readings"
      :label="$t('table.room_no_readings')"
      :required="false"
      type="number"
      :disabled="true"
    />
    <custom-input v-model="formData.room_no" :label="$t('form.room_no')" :required="false" type="number" />
    <custom-input v-model="formData.room_height" :label="$t('table.room_height')" :required="false" type="number" />
    <custom-input
      v-model="formData.room_raised_height"
      :label="$t('table.room_raised_height')"
      :required="false"
      type="number"
    />
    <custom-input
      v-model="formData.room_ceiling_height"
      :label="$t('table.room_ceiling_height')"
      :required="false"
      type="number"
    />
    <custom-input v-model="formData.room_width" :label="$t('table.room_width')" :required="false" type="number" />
    <custom-input v-model="formData.room_lenght" :label="$t('table.room_lenght')" :required="false" type="number" />
    <custom-input
      v-model="formData.room_ac_outlet_no"
      :label="$t('table.room_ac_outlet_no')"
      :required="false"
      type="number"
    />
    <custom-input v-model="formData.room_net_area" :label="$t('table.room_net_area')" :required="false" type="number" />

    <custom-TextArea v-model="formData.note" :label="$t('form.notes')" :required="false" />

    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>

    <!-- unit dialog -->
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
  name: "SrvRoomBuildingsForm",
  components: { UnitsTreeSelection },
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
    },
    isService: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      formData: {
        name: "",
        note: "",
        floor_id: null,
        building_id: null,
        space_id: null,
        unit_id: null,
        user_id: null,
        no: null,
        meters: null,
        room_use_id: null,
        room_area: null,
        room_no_readings: null,
        room_no: null,
        room_height: null,
        room_raised_height: null,
        room_ceiling_height: null,
        room_width: null,
        room_lenght: null,
        room_ac_outlet_no: null,
        room_net_area: null,
        label: null,
        tenant_id: null
      },
      filters: {
        tenant_id: this.$route.params.id,
        receiver_tenant_id: this.$route.params.id
      },
      loading: false,
      openUnitDialog: false,
      disableBuildingsSelection: false
    }
  },

  computed: {
    ...mapGetters({
      getCurrentRoomBuilding: "srvRoomsBuildings/getCurrentRoomBuilding",
      loadingRoomsBuildings: "srvRoomsBuildings/isLoading",
      getBuildings: "buildings/getBuildings",
      loadingBuildings: "buildings/isLoading",
      getRoomUses: "roomUses/getRoomUses",
      loadingRoomUses: "roomUses/isLoading",
      getTenants: "srvTenants/getTenants",
      loadingTenants: "srvTenants/isLoading"
    }),
    ...mapState("positions", ["units"]),
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
    },
    // disableBuildingsSelection() {
    //   // !formData.tenant_id ||
    // },
    disableTenantSelection() {
      return (!this.editForm && this.$route.query.rooms_id) || this.$route.params.id
    }
  },

  methods: {
    ...mapActions({
      addRoomBuilding: "srvRoomsBuildings/addRoomBuilding",
      updateRoomBuilding: "srvRoomsBuildings/updateRoomBuilding",
      fetchRoomBuildingById: "srvRoomsBuildings/fetchRoomBuildingById",
      //
      fetchBuildings: "buildings/fetchBuildings",
      fetchRoomUses: "roomUses/fetchRoomUses",
      fetchTenants: "srvTenants/fetchTenants"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapActions("positions", ["fetchUnits"]),
    async handleSubmit() {
      this.loading = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updateRoomBuilding(this.formData)
      } else {
        await this.addRoomBuilding(this.formData)
      }
      this.loading = false
      this.closeDrawer()
    },
    async getTenantBuildings() {
      await this.fetchBuildings(this.filters)
      this.disableBuildingsSelection = true
    },
    openUnitDialogModal() {
      this.openUnitDialog = true
    },
    handleSelectionChange(selectedIds) {
      console.log("Selection changed:", selectedIds)
      this.formData.unit_id = selectedIds
    },

    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.formData.unit_id = selectedIds
      this.openUnitDialog = false
    }
  },
  async mounted() {
    // Set tenant_id based on isService prop
    this.formData.tenant_id = !this.isService
      ? this.$auth.user.tenant.id
      : this.$route.query.receiver_tenant_id || Number(this.$route.params.id) || null
    await this.fetchTenants()
    this.fetchUnits()
    await this.fetchBuildings(this.filters)
    await this.fetchRoomUses({ tenant_id: this.$route.query.receiver_tenant_id })
    if (this.editForm) {
      await this.fetchRoomBuildingById(this.itemId)
      await this.fetchBuildings({ tenant_id: this.getCurrentRoomBuilding.tenant_id })
      this.formData = { ...this.getCurrentRoomBuilding }
      // this.formData.building_id = this.getCurrentRoomBuilding.building_id || null
    }
  }
}
</script>
