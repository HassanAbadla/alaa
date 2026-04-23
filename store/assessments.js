// assessments.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "grc-assessments",
  entityName: "assessment",
  entityNamePlural: "assessments",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customGetters: {},

  customActions: {
    async calculateAssessmentScore({ commit, state, getters }, assessmentId) {
      try {
        const response = await this.$axios.$post(`grc-assessments/${assessmentId}/calculate-score`)

        const updatedAssessment = response.data

        const currentAssessments = state.assessments || []

        const itemIndex = currentAssessments.findIndex((item) => item.id === assessmentId)

        if (itemIndex !== -1) {
          const updatedAssessments = [...currentAssessments]
          updatedAssessments[itemIndex] = updatedAssessment

          commit("SET_ASSESSMENTS", updatedAssessments)
        }

        if (state.currentAssessment && state.currentAssessment.id === assessmentId) {
          commit("SET_CURRENT_ASSESSMENT", updatedAssessment)
        }

        return { success: true, data: updatedAssessment }
      } catch (error) {
        console.error("Error calculating assessment score:", error)
        return { success: false, error }
      }
    }
  }
}

export default createCrudStore(config)
