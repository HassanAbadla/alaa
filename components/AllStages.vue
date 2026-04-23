<template>
  <div>
    <v-treeview class="treeview" color="primary" :items="items">
      <template v-slot:prepend="{ item }">
        <v-switch
          v-if="item.description"
          v-model="selectedItems"
          :value="item.id"
          @change="handleCheckboxChange(item)"
        />
      </template>

      <template v-slot:label="{ item }">
        <span v-if="item.title">{{ item.title }}</span>
        <span v-if="item.description">{{ item.description }}</span>
      </template>
    </v-treeview>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [], // Fetched from the API
      selectedItems: [] // Array to store selected items
    }
  },

  methods: {
    fetchStagesCheck() {
      this.$axios
        .get("stages/checklist")
        .then((res) => {
          this.items = res.data.data
        })
        .catch((error) => {
          console.error("Error fetching stages:", error)
        })
    },
    handleCheckboxChange(item) {
      // Recursively select/deselect children
      this.handleChildrenSelection(item)
    },
    handleChildrenSelection(parentItem) {
      if (parentItem.children && parentItem.children.length > 0) {
        parentItem.children.forEach((child) => {
          // Update the selected state for each child
          if (this.selectedItems.includes(parentItem.id)) {
            // If the parent is selected, select the child
            this.selectedItems.push(child.id)
          } else {
            // If the parent is deselected, deselect the child
            this.selectedItems = this.selectedItems.filter((id) => id !== child.id)
          }

          // Recursively handle children of the child
          this.handleChildrenSelection(child)
        })
      }
    }
  },
  mounted() {
    this.fetchStagesCheck()
  }
}
</script>
<style></style>
