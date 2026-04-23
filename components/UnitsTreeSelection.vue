<template>
  <div v-if="treeData.length" class="pa-4">
    <v-treeview :items="treeData" :open="openItems" activatable dense transition class="pa-4 ma-4 tree-container">
      <template v-slot:prepend="{ item, open }">
        <v-icon @click="toggleSelection(item)" :color="selected === item.id ? 'primary' : ''" class="radio-icon">
          {{ selected === item.id ? "mdi-radiobox-marked" : "mdi-radiobox-blank" }}
        </v-icon>
      </template>
    </v-treeview>

    <v-btn block color="primary" class="mt-4" style="text-transform: uppercase" @click="sendSelectedId">
      Send Selected Item
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "TreeSelect",

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      selected: null,
      treeData: [],
      flattenedItems: {},
      openItems: []
    }
  },

  created() {
    this.treeData = this.processItems(this.items)
    this.flattenItems(this.items)
  },

  methods: {
    processItems(items) {
      return items.map((item) => ({
        id: item.id,
        name: item.title || item.name,
        children: item.children ? this.processItems(item.children) : undefined
      }))
    },

    flattenItems(items, parent = null) {
      items.forEach((item) => {
        this.flattenedItems[item.id] = {
          ...item,
          parent
        }
        if (item.children) {
          this.flattenItems(item.children, item)
        }
      })
    },

    toggleSelection(item) {
      // For single selection, we just set the selected value
      this.selected = item.id
      this.$emit("selection-change", this.selected)
    },

    sendSelectedId() {
      this.$emit("send-selected", this.selected)
    }
  }
}
</script>

<style scoped>
.tree-container {
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}
.v-treeview >>> .v-treeview-node__root {
  min-height: 32px;
  padding-block: 8px;
}

.v-treeview >>> .v-treeview-node {
  margin-top: -8px;
  margin-bottom: -8px;
}

.radio-icon {
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-icon:hover {
  transform: scale(1.1);
}
</style>
