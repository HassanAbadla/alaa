// store/threatCategories.js

import { createCrudStore } from "~/utils/storeFactory"
import { flattenedToNested, nestedToFlattened, transformSingleItem, TRANSFORM_CONFIGS } from "~/utils/transformUtils"

const config = {
  endpoint: "life-threat-categories", // adjust to your actual endpoint
  entityName: "category",
  entityNamePlural: "categories",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],

  // Transform flattened form data to nested API format (for requests)
  transformRequest: (data) => {
    return flattenedToNested(data, TRANSFORM_CONFIGS.NAME_FIELD.fields)
  },

  // Transform nested API response to flattened form format (for responses)
  transformResponse: (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => transformSingleItem(item, TRANSFORM_CONFIGS.NAME_FIELD.fields))
    }
    return transformSingleItem(data, TRANSFORM_CONFIGS.NAME_FIELD.fields)
  }
}

export default createCrudStore(config)
