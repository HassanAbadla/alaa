<template>
  <div>
    <form-wrapper :submitText="$t('form.save')" :loading="isLoading" @submit="handleSubmit">
      <v-card-text>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
        <v-alert v-if="error" type="error" dismissible>
          {{ error }}
        </v-alert>
        <custom-input v-model="title.en" :label="$t('form.en_title')" :required="true" />
        <custom-input v-model="title.ar" :label="$t('form.ar_title')" :required="true" />

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
              v-model="unit_id"
              :required="true"
              :disabled="true"
              class="flex-grow-1 mx-1 z-index-1"
            />
          </div>
        </div>
        <custom-dropdown
          :items="activeOptions"
          item-value="id"
          item-text="name"
          :label="$t('page.active')"
          v-model="active"
          :required="true"
        />
        <div class="d-flex align-items-center">
          <custom-dropdown
            :items="categories"
            item-value="id"
            item-text="name"
            :label="$t('table.category')"
            v-model="unit_category_id"
            :required="true"
            class="mx-1"
          />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small color="primary" class="mt-2" v-bind="attrs" v-on="on" @click="addNewCategory">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("button.add_new_category") }}</span>
          </v-tooltip>
        </div>
        <div class="d-flex align-items-center">
          <custom-dropdown
            :items="levels"
            item-value="id"
            item-text="name"
            :label="$t('table.level')"
            v-model="unit_level_id"
            :required="true"
            class="mx-1"
          />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small color="primary" class="mt-2" v-bind="attrs" v-on="on" @click="addNewLevel">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("button.add_new_level") }}</span>
          </v-tooltip>
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

    <!-- New Level Dialog -->
    <custom-dialog v-model="openNewLevelDialog" :title="$t('page.new_level')" width="580px">
      <v-container class="py-8">
        <custom-input v-model="levelForm.en_name" :label="$t('form.en_name')" :required="true" />
        <custom-input v-model="levelForm.ar_name" :label="$t('form.ar_name')" :required="true" />
        <v-btn @click="submitLevel" :loading="loading" color="primary" block>Add Position Level</v-btn>
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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import CustomDialog from "~/components/CustomDialog.vue"
import UnitsTreeSelection from "../UnitsTreeSelection.vue"
export default {
  name: "PositionsForm",
  components: { CustomDialog, UnitsTreeSelection },

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
      title: {
        en: "",
        ar: ""
      },
      openUnitDialog: false,
      active: 0,
      unit_id: null,
      unit_category_id: null,
      unit_level_id: null,
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
      isLoading: false
    }
  },

  methods: {
    ...mapActions("positions", [
      "fetchPositions",
      "addPosition",
      "positionDetails",
      "updatePosition",
      "fetchCategories",
      "addCategory",
      "fetchLevels",
      "addLevel",
      "fetchUnits"
    ]),
    ...mapActions("drawer", ["closeDrawer"]),
    async fetchLookups() {
      try {
        await this.fetchCategories()
        await this.fetchLevels()
        await this.fetchUnits()
      } catch (error) {
        this.error = error
      }
    },
    async handleSubmit() {
      this.isLoading = true
      this.error = null

      const data = {
        title: this.title,
        unit_id: this.unit_id,
        unit_category_id: this.unit_category_id,
        unit_level_id: this.unit_level_id,
        active: this.active
      }
      this.editForm ? await this.updatePosition({ id: this.itemId, payload: data }) : await this.addPosition(data)
      this.isLoading = false
      this.closeDrawer()
    },

    async loadPositionData() {
      if (this.editForm) {
        this.isLoading = true
        await this.positionDetails(this.itemId)

        if (this.selectedPosition) {
          this.title = this.selectedPosition?.title
          this.unit_id = this.selectedPosition?.unit?.id
          this.unit_category_id = this.selectedPosition?.category?.id
          this.unit_level_id = this.selectedPosition?.level?.id
          this.active = String(this.selectedPosition?.active)

          this.isLoading = false
        }
      } else {
        throw new Error("Position not found")
      }
    },
    addNewCategory() {
      this.openNewCategoryDialog = true
    },

    async submitCategory() {
      const computedCode = this.categoryForm.en_name.slice(0, 3).toLowerCase()
      const formattedData = {
        name: {
          ar: this.categoryForm.ar_name,
          en: this.categoryForm.en_name
        },
        code: computedCode,
        note: computedCode
      }

      await this.addCategory(formattedData)
      this.unit_category_id = this.categories[this.categories.length - 1].id
      this.openNewCategoryDialog = false
    },

    addNewLevel() {
      this.openNewLevelDialog = true
    },
    async submitLevel() {
      const computedCode = this.levelForm.en_name.slice(0, 3).toLowerCase()
      const formattedData = {
        name: {
          ar: this.levelForm.ar_name,
          en: this.levelForm.en_name
        },
        code: computedCode,
        note: computedCode
      }

      await this.addLevel(formattedData)
      this.unit_level_id = this.levels[this.levels.length - 1].id
      this.openNewLevelDialog = false
    },
    openUnitDialogModal() {
      this.openUnitDialog = true
    },
    handleSelectionChange(selectedIds) {
      console.log("Selection changed:", selectedIds)
      this.unit_id = selectedIds
    },

    handleSendSelected(selectedIds) {
      console.log("Sending selected ids:", selectedIds)
      this.unit_id = selectedIds
      this.openUnitDialog = false
    }
  },

  computed: {
    ...mapState("positions", ["categories", "levels", "units", "selectedPosition"]),
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
    }
  },

  mounted() {
    this.fetchLookups()
    this.loadPositionData()
  }
}
</script>
