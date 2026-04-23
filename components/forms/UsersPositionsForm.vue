<template>
  <div>
    <form-wrapper :submitText="$t('form.save')" :loading="isLoading" @submit="handleSubmit">
      <v-card-text>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
        <v-alert v-if="error" type="error" dismissible>
          {{ error }}
        </v-alert>

        <div class="mb-4">
          <custom-dropdown
            :items="users"
            item-value="id"
            item-text="full_name"
            :label="$t('table.user')"
            v-model="formData.user_id"
            :disabled="!editForm && !isPositionPath"
            :required="true"
          />
        </div>

        <v-row>
          <v-col cols="12" class="py-0">
            <custom-input v-model="formData.title" :label="$t('form.title')" :required="true" />
          </v-col>
          <v-col cols="12" class="py-0">
            <!-- <custom-dropdown
              :items="allUnits"
              item-value="id"
              item-text="name"
              :label="$t('table.unit')"
              v-model="formData.unit_id"
              @input="getPositions"
              :required="true"
            /> -->
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
                  class="flex-grow-1 mx-1 z-index-1"
                />
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" class="py-0">
            <custom-dropdown
              :items="activeOptions"
              item-value="id"
              item-text="name"
              :label="$t('page.active')"
              v-model="formData.active"
              :required="true"
            />
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <custom-dropdown
              :items="unitPositions"
              item-value="id"
              item-text="title"
              :label="$t('table.position')"
              v-model="formData.units_positions_id"
              :required="true"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" class="py-0">
            <custom-input v-model="formData.start_date" type="date" :label="$t('form.start_date')" :required="true" />
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <custom-input v-model="formData.end_date" type="date" :label="$t('form.end_date')" :required="true" />
          </v-col>
        </v-row>
        <div class="my-4">
          <CustomTextArea v-model="formData.note" :label="$t('form.notes')" :required="true" />
        </div>
      </v-card-text>
    </form-wrapper>
    <!-- New Category Dialog -->
    <custom-dialog v-model="openNewCategoryDialog" :title="$t('page.new_category')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="categoryForm.en_name" :label="$t('form.en_name')" :required="true" />
        <custom-input v-model="categoryForm.ar_name" :label="$t('form.ar_name')" :required="true" />
        <v-btn @click="submitCategory" :loading="loading" color="primary" block>Add Position Category</v-btn>
      </v-container>
    </custom-dialog>

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

    <!-- New Level Dialog -->
    <!-- <custom-dialog v-model="openNewLevelDialog" :title="$t('page.new_level')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="levelForm.en_name" :label="$t('form.en_name')" :required="true" />
        <custom-input v-model="levelForm.ar_name" :label="$t('form.ar_name')" :required="true" />
        <v-btn @click="submitLevel" :loading="loading" color="primary" block>Add Position Level</v-btn>
      </v-container>
    </custom-dialog> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { getUsers } from "@/api/tenent-api"
import CustomDialog from "~/components/CustomDialog.vue"
import CustomTextArea from "../custom-form/CustomTextArea.vue"
import UnitsTreeSelection from "../UnitsTreeSelection.vue"
export default {
  name: "UsersPositionsForm",
  components: { CustomDialog, CustomTextArea, UnitsTreeSelection },

  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    item: { type: Object, default: null },
    itemId: { type: Number }
  },

  data() {
    return {
      formData: {
        user_id: this.itemId
        // title: "",
        // unit_id: null,
        // active: "",
        // unit_position_id: null
      },
      unitPositions: [],
      isSubmitting: false,
      error: null,
      activeOptions: [
        { id: "1", name: "Active" },
        { id: "0", name: "Inactive" }
      ],
      openNewCategoryDialog: false,
      categoryForm: {
        en_name: "",
        ar_name: ""
      },
      openNewLevelDialog: false,
      levelForm: {
        en_name: "",
        ar_name: ""
      },
      isLoading: false,
      openUnitDialog: false
    }
  },

  methods: {
    ...mapActions("positions", ["fetchUnits", "addUserPosition"]),
    ...mapActions("users", ["fetchUsers"]),
    ...mapActions("userPositions", ["fetchUserPositions", "addUserPosition", "updateUserPosition"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async fetchLookups() {
      try {
        await this.fetchUnits()
        if (Object.keys(this.users).length === 0) {
          await this.fetchUsers()
        }
      } catch (error) {
        this.error = error
      }
    },
    async handleSubmit() {
      this.isLoading = true
      this.error = null
      // if editing from users View
      if (this.item?.UserUnitPosition?.length) {
        let positionId = this.item.UserUnitPosition[0]?.id
        await this.updateUserPosition({ id: positionId, payload: this.formData })
        await this.fetchUsers()

        // editing from user Positions View
      } else if (this.editForm) {
        await this.updateUserPosition({ id: this.itemId, payload: this.formData })
        await this.fetchUserPositions()
      } else {
        await this.addUserPosition(this.formData)
        await this.fetchUserPositions()
        await this.fetchUsers()
      }
      this.isLoading = false
      this.closeDrawer()
    },

    async loadPositionData() {
      // if editing from users View
      if (this.item?.UserUnitPosition?.length) {
        this.formData.title = this.item?.UserUnitPosition[0]?.title
        this.formData.unit_id = this.item?.UserUnitPosition[0]?.unit?.id
        this.formData.active = String(this.item?.UserUnitPosition[0]?.active)
        this.formData.start_date = this.item?.UserUnitPosition[0]?.start_date
        this.formData.end_date = this.item?.UserUnitPosition[0]?.end_date
        this.formData.note = this.item?.UserUnitPosition[0]?.note
        this.formData.unit_id = this.item?.UserUnitPosition[0]?.position?.unit?.id
        this.getPositions().then((this.formData.units_positions_id = this.item?.UserUnitPosition[0]?.position?.id))

        // If editing from user Positions View
      } else if (this.editForm) {
        const selectedItem = this.userPositions.find((item) => item.id === this.itemId)
        console.log("selectedItem", selectedItem)

        this.formData.user_id = selectedItem?.user?.id
        this.formData.title = selectedItem?.title
        this.formData.unit_id = selectedItem?.unit?.id
        this.formData.active = String(selectedItem?.active)
        this.formData.start_date = selectedItem?.start_date
        this.formData.end_date = selectedItem?.end_date
        this.formData.note = selectedItem?.note
        this.formData.unit_id = selectedItem?.position?.unit?.id
        this.getPositions().then((this.formData.units_positions_id = selectedItem?.position?.id))
      } else {
        return
      }
    },
    async getPositions() {
      const response = await this.$axios.get(`/positions-ByUnit/${this.formData.unit_id}`)
      this.unitPositions = response.data.data
    },
    openUnitDialogModal() {
      this.openUnitDialog = true
    },
    handleSelectionChange(selectedIds) {
      console.log("Selection changed:", selectedIds)
      this.formData.unit_id = selectedIds
      this.getPositions()
    },

    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.formData.unit_id = selectedIds
      this.getPositions()
      this.openUnitDialog = false
    }
  },

  computed: {
    ...mapState("positions", ["units", "selectedPosition"]),
    ...mapState("userPositions", ["userPositions"]),
    ...mapState("users", ["users"]),
    // allUnits() {
    //   const flattenChildren = (units) => {
    //     if (!units || !Array.isArray(units)) return []

    //     return units.reduce((acc, unit) => {
    //       if (unit.children && unit.children.length > 0) {
    //         // Add current unit's children to accumulator
    //         acc.push(...unit.children)
    //         // Recursively get children of children
    //         acc.push(...flattenChildren(unit.children))
    //       }
    //       return acc
    //     }, [])
    //   }

    //   return this.units ? flattenChildren(this.units) : []
    // },
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
    isPositionPath() {
      return this.$route.name === "positions-users-positions"
    }
  },

  mounted() {
    this.fetchLookups()
    this.loadPositionData()
  }
}
</script>
