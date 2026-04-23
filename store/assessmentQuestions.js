// assessmentQuestions.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "grc-assessment-questions",
  entityName: "question",
  entityNamePlural: "questions",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customGetters: {}
}

export default createCrudStore(config)
