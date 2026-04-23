// store/pmwebApPayments.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoints: {
    getAll: "CostManagement/APPayments.svc/GetAPPayments",
    getById: "CostManagement/APPayments.svc/GetAPPaymentById",
    create: "CostManagement/APPayments.svc/AddAPPayments",
    update: "CostManagement/APPayments.svc/UpdateAPPayments",
    delete: "CostManagement/APPayments.svc/DeleteAPPayments"
  },
  entityName: "apPayment",
  entityNamePlural: "apPayments",
  numericFields: [],
  primaryKey: "SystemId",
  // Custom transformations if needed
  transformRequest: (data) => {
    // Handle ApPaymentDetail if it exists
    // if (data.ApPaymentDetail && Array.isArray(data.ApPaymentDetail)) {
    //   data.ApPaymentDetail = data.ApPaymentDetail.map((detail) => {
    //     return { ...detail }
    //   })
    // }
    return data
  },
  transformResponse: (data) => {
    // Any response transformations
    return data
  },
  // Custom getters specific to appayments
  customGetters: {
    // Override the default getApPayments getter to filter by IsActive
  }
}

export default createCrudStore(config)

// You can also export individual parts if needed
export const { state, mutations, actions, getters } = createCrudStore(config)
