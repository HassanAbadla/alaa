import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "bcm-plans",
  entityName: "plan",
  entityNamePlural: "plans",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data,
  treeConfig: {
    parentField: "bcm_plan_id",
    childrenField: "children"
  },
  customGetters: {
    getPlansWithNoParents: (state) => {
      return state.plans.filter((plan) => {
        return !plan.bcm_plan
      })
    }
  }
}

export default createCrudStore(config)
