<template>
  <form-template
    ref="formTemplate"
    :editForm="editForm"
    :itemId="itemId"
    :fields="computedFields"
    store="bcmPlans"
    singlularEntityName="Plan"
    pluralEntityName="Plans"
  >
    <template #default="{ formData, updateField, getFieldError }">
      <custom-input :label="$t('table.name')" v-model="formData.name" :errors="getFieldError('name')" required />
      <custom-input :label="$t('table.code')" v-model="formData.code" :errors="getFieldError('code')" required />

      <!-- Use the filtered parent items from the mixin -->
      <custom-dropdown
        :label="$t('table.plan')"
        v-model="formData.bcm_plan_id"
        :items="availableParentItems"
        item-value="id"
        item-text="name"
        :loading="loadingPlans"
        :disabled="loadingPlans"
        :errors="getFieldError('bcm_plan_id')"
        @change="handleParentPlanChange"
      />

      <custom-dropdown
        :label="$t('table.person_role')"
        v-model="formData.bcm_person_role_id"
        :items="roles"
        item-value="id"
        item-text="name"
        :loading="loadingRoles"
        :disabled="loadingRoles"
        :errors="getFieldError('bcm_person_role_id')"
        required
      />
      <!-- 
      <custom-dropdown
        :label="$t('table.unit')"
        v-model="formData.selectedUnit"
        :items="units"
        item-value="id"
        item-text="name"
        :loading="loadingUnits"
        :disabled="loadingUnits"
        @change="handleUnitChange"
      /> -->

      <custom-dropdown
        :label="$t('table.position')"
        v-model="formData.user_position_id"
        :items="userPositions"
        item-value="id"
        item-text="title"
        :loading="loadingUserPositions"
        :disabled="loadingUserPositions"
        :errors="getFieldError('user_position_id')"
      />

      <!-- Active checkbox - disabled for child plans -->
      <div class="mb-2">
        <custom-checkbox
          :label="$t('table.active')"
          :value="formData.active"
          :disabled="isChildPlan"
          @input="updateField('active', $event)"
        />
        <div v-if="isChildPlan" class="text-caption text--secondary mt-1">
          {{ $t("page.active_disabled_for_sub_plans") }}
        </div>
      </div>

      <quill-editor v-model="formData.note" class="mb-4" />
    </template>
  </form-template>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "../QuillEditor.vue"
import FormTemplate from "./FormTemplate.vue"
import { treeValidationMixin } from "@/mixins/treeValidationMixin"

export default {
  components: {
    FormTemplate,
    QuillEditor
  },
  name: "BCMPlanForm",
  mixins: [treeValidationMixin],

  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number },
    // New props for parent relationship
    bcm_plan_id: { type: Number, default: null },
    bcm_threat_id: { type: Number, default: null }
  },

  data() {
    return {
      selectedUnit: null,
      baseFields: {
        name: "",
        code: "",
        note: "",
        bcm_plan_id: null,
        bcm_person_role_id: null,
        bcm_threat_id: null,
        active: false,
        user_position_id: null,
        selectedUnit: null
      }
    }
  },

  computed: {
    ...mapGetters({
      units: "positions/getUnits",
      loadingUnits: "positions/isLoadingUnits",
      userPositions: "userPositions/getUserPositions",
      loadingUserPositions: "userPositions/isLoadingUserPositions",
      plans: "bcmPlans/getPlans",
      loadingPlans: "bcmPlans/isLoading",
      roles: "bcmPersonRoles/getRoles",
      loadingRoles: "bcmPersonRoles/isLoading"
    }),

    // Configure the tree validation for BCM Plans (treeValidationMixin)
    treeConfig() {
      return {
        parentField: "bcm_plan_id",
        childrenField: "children",
        itemsGetter: "bcmPlans/getPlans",
        primaryKey: "id"
      }
    },

    computedFields() {
      return {
        ...this.baseFields,
        // Override with props if provided
        bcm_plan_id: this.bcm_plan_id ?? this.baseFields.bcm_plan_id,
        bcm_threat_id: this.bcm_threat_id ?? this.$route.params.id
      }
    },

    // Check if this is a child plan (has a parent)
    isChildPlan() {
      return !!(this.bcm_plan_id || (this.computedFields && this.computedFields.bcm_plan_id))
    }
  },

  methods: {
    ...mapActions({
      fetchUnits: "positions/fetchUnits",
      fetchUserPositions: "userPositions/fetchUserPositions",
      fetchPlans: "bcmPlans/fetchPlans",
      fetchRoles: "bcmPersonRoles/fetchRoles"
    }),

    // Custom handler for bcm_plan_id changes from the dropdown
    handleParentPlanChange(value) {
      this.validateParent()

      // If a parent plan is selected, set active to false
      if (value) {
        this.$nextTick(() => {
          if (this.$refs.formTemplate && this.$refs.formTemplate.updateField) {
            this.$refs.formTemplate.updateField("active", false)
          }
        })
      }
    },

    // Handle unit selection change to filter positions
    async handleUnitChange(unitId) {
      if (unitId) {
        // Fetch positions filtered by selected unit
        await this.fetchUserPositions({ unit_id: unitId })

        // Clear the selected position since the list has changed
        if (this.$refs.formTemplate && this.$refs.formTemplate.updateField) {
          this.$refs.formTemplate.updateField("user_position_id", null)
        }
      } else {
        // If no unit selected, fetch all positions
        await this.fetchUserPositions()

        // Clear the selected position
        if (this.$refs.formTemplate && this.$refs.formTemplate.updateField) {
          this.$refs.formTemplate.updateField("user_position_id", null)
        }
      }
    }
  },

  async mounted() {
    await Promise.all([
      // this.fetchPlans(),
      this.fetchRoles(),
      this.fetchUnits(),
      this.fetchUserPositions() // Fetch all positions initially
    ])

    // Debug logging to verify data
    console.log("Units loaded:", this.units)
    console.log("User positions loaded:", this.userPositions)
    console.log("Loading states:", {
      units: this.loadingUnits,
      positions: this.loadingUserPositions
    })
  }
}
</script>
