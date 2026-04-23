// store/pmwebCommitments.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoints: {
    getAll: "CostManagement/Commitments.svc/GetCommitments",
    getById: "CostManagement/Commitments.svc/GetCommitmentById",
    create: "CostManagement/Commitments.svc/AddCommitments",
    update: "CostManagement/Commitments.svc/UpdateCommitments",
    delete: "CostManagement/Commitments.svc/DeleteCommitments"
  },
  entityName: "commitment",
  entityNamePlural: "commitments",
  numericFields: [
    "Revision",
    "Days",
    "RetentionOnServices",
    "RetentionOnStoredMaterials",
    "PercentOfLineItem",
    "PercentOfRevisedValue"
  ],
  primaryKey: "SystemId",
  // Custom transformations if needed
  transformRequest: (data) => {
    // Handle CommitmentDetail if it exists
    // if (data.CommitmentDetail && Array.isArray(data.CommitmentDetail)) {
    //   data.CommitmentDetail = data.CommitmentDetail.map((detail) => {
    //     return { ...detail }
    //   })
    // }
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
