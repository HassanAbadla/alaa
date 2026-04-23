// store/invProducts.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
    endpoint: "inv-products",
    entityName: "product",
    entityNamePlural: "products",
    apiPlugin: "$axios",
    primaryKey: "id",
    numericFields: ["inv_products_type_id", "inv_products_category_id", "inv_unit_price", "inv_reorder_level", "inv_qty_total", "design_capacity", "power", "asset_original_value", "annual_maintenance_labor_cost", "spares_cost", "annual_maintenance_cost", "consumables_cost"],
    transformRequest: (data) => data,
    transformResponse: (data) => data,

    customActions: {
        async fetchLowStockProducts({ commit }) {
            try {
                commit("setLoading", true)
                const response = await this.$axios.$get("inv-products-low-stock")
                commit("setItems", response.data || response)
                return response
            } catch (error) {
                console.error("Error fetching low stock products:", error)
                throw error
            } finally {
                commit("setLoading", false)
            }
        }
    }
}

export default createCrudStore(config)
