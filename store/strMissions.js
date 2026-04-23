// store/strMissions.js

import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "str-missions",
  entityName: "mission",
  entityNamePlural: "missions",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: [],
  transformRequest: (data) => data,
  transformResponse: (data) => data

  // customGetters: {
  //   // Override the default getProjects getter to filter by IsActive
  //   getPerspectives: (state) =>
  //     state.perspectives.map((perspective) => {
  //       return { id: perspective.id, name: perspective.name }
  //     })
  // }
}
export default createCrudStore(config)
