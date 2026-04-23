<template>
  <div>
    <!-- Loading overlay with better animation -->
    <circular-loading :show="editForm && loading" :message="$t('page.loading')" />

    <div v-if="!(editForm && loading)">
      <!-- Error message display -->
      <v-alert v-if="error" type="error" dismissible class="mb-4">
        {{ error }}
      </v-alert>

      <form-wrapper @submit="createOrUpdate" :loading="isAddingOrUpdating">
        <!-- Rating field -->
        <div class="d-flex align-center mb-3">
          <star-rating :rating="fields.Rating" class="mr-4" />
          <custom-dropdown
            :label="$t('table.rating')"
            :items="ratingOptions"
            item-value="value"
            item-text="text"
            v-model="fields.Rating"
            :loading="loading"
            :disabled="loading"
            required
            class="flex-grow-1"
          />
        </div>

        <!-- Date field -->
        <custom-date-picker :label="$t('table.date')" v-model="fields.Date" required />

        <!-- User field -->
        <custom-dropdown
          :label="$t('page.user')"
          :items="usersList"
          item-value="Id"
          item-text="FullName"
          v-model="fields.UserId"
          :loading="isLoadingUsers"
          :disabled="isLoadingUsers"
          required
        />

        <!-- Comment field -->
        <custom-input
          :label="$t('table.comment')"
          v-model="fields.Comment"
          :loading="loading"
          :disabled="loading"
          required
        />
      </form-wrapper>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import CircularLoading from "../common/CircularLoading.vue"
import StarRating from "../common/StarRating.vue"
import FormWrapper from "../custom-form/FormWrapper.vue"

export default {
  components: { StarRating, FormWrapper, CircularLoading },
  name: "PMWebInitiativeRatingsForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: Number }
  },
  data() {
    return {
      fields: {
        Rating: null,
        Date: null,
        UserId: null,
        Comment: "",
        Use: 1
      },
      ratingOptions: [
        { text: "1", value: 1.0 },
        { text: "1.5", value: 1.5 },
        { text: "2", value: 2.0 },
        { text: "2.5", value: 2.5 },
        { text: "3", value: 3.0 },
        { text: "3.5", value: 3.5 },
        { text: "4", value: 4.0 },
        { text: "4.5", value: 4.5 },
        { text: "5", value: 5.0 }
      ]
    }
  },
  computed: {
    ...mapGetters({
      initiativeRating: "pmwebInitiativeRatings/getCurrentInitiativeRating",
      loading: "pmwebInitiativeRatings/isLoading",
      error: "pmwebInitiativeRatings/hasError",
      isCreating: "pmwebInitiativeRatings/isAddingInitiativeRating",
      isUpdating: "pmwebInitiativeRatings/isUpdatingInitiativeRating",
      usersList: "pmwebUsersList/fetchUsers",
      isLoadingUsers: "pmwebUsersList/isLoading",
      currentInitiativeBudget: "pmwebInitiativeBudgets/getCurrentInitiativeBudget"
    }),
    isAddingOrUpdating() {
      return this.editForm ? this.isUpdating : this.isCreating
    }
  },
  methods: {
    ...mapActions({
      fetchInitiativeRatingById: "pmwebInitiativeRatings/fetchInitiativeRatingById",
      createInitiativeRating: "pmwebInitiativeRatings/addInitiativeRating",
      updateInitiativeRating: "pmwebInitiativeRatings/updateInitiativeRating",
      fetchUsersList: "pmwebUsersList/fetchUsers",
      closeDrawer: "drawer/closeDrawer"
    }),
    async createOrUpdate() {
      const func = this.editForm ? this.updateInitiativeRating : this.createInitiativeRating
      if (!this.editForm) {
      }
      const result = await func({ ...this.fields, InitiativeBudgetId: this.currentInitiativeBudget?.Id }, this.itemId)
      console.log("RESULT", result)
      if (result.success) {
        this.closeDrawer()
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.fetchInitiativeRatingById(this.itemId)
    }
    await Promise.all([this.fetchUsersList()])
  },
  watch: {
    initiativeRating: {
      immediate: true,
      handler(newValue) {
        if (newValue && this.editForm) {
          // Only update existing keys in this.fields with values from newRecord
          Object.keys(this.fields).forEach((key) => {
            if (newValue.hasOwnProperty(key)) {
              this.$set(this.fields, key, newValue[key])
            }
          })

          // Always add the Id from newRecord
          if (newValue.hasOwnProperty("Id")) {
            this.$set(this.fields, "Id", newValue.Id)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/* Component-specific styles can go here */
</style>
