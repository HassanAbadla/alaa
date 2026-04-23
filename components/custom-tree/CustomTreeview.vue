<template>
  <div class="custom-treeview">
    <title-banner v-if="title" :title="title" />
    <v-card class="tree-container globalBg" flat>
      <sl-vue-tree
        v-model="treeNodes"
        ref="slVueTree"
        :allow-multiselect="allowMultiselect"
        :allow-toggle-branch="true"
        :edge-size="edgeSize"
        :show-branches="showBranches"
        :allow-only-inside-drop="allowOnlyInsideDrop"
        @select="onNodeSelected"
        @toggle="onNodeToggled"
        @drop="onNodeDropped"
        @beforedrop="onBeforeDrop"
        @nodeclick="onNodeClicked"
        @nodedblclick="onNodeDoubleClicked"
        @nodecontextmenu="onNodeContextMenu"
        class="custom-sl-tree"
      >
        <!-- Title slot -->
        <template v-slot:title="{ node }">
          {{ node.title }}
          <v-divider v-if="selectedNode && selectedNode.id == node.id" vertical class="mx-4"></v-divider>
          <div v-if="selectedNode && selectedNode.id == node.id" class="edit-button-container">
            <slot name="actions" :item="getOriginalItem(node)" :node="node"></slot>
          </div>
        </template>

        <!-- Toggle slot -->
        <template v-slot:toggle="{ node }">
          <span v-if="!node.isLeaf && node.children && node.children.length > 0">
            <v-icon small v-if="node.isExpanded">mdi-chevron-down</v-icon>
            <v-icon small v-if="!node.isExpanded">mdi-chevron-right</v-icon>
          </span>
          <span v-else>
            <v-icon small>mdi-circle-small</v-icon>
          </span>
        </template>

        <!-- Sidebar slot -->
        <template v-slot:sidebar="{ node }">
          <!-- Actions are now in title slot -->
        </template>

        <!-- Drag info slot -->
        <template v-slot:draginfo>
          <div class="drag-info">
            <slot name="drag-info" :count="getDraggedItemsCount()">
              <span>Dragging {{ getDraggedItemsCount() }} item(s)</span>
            </slot>
          </div>
        </template>
      </sl-vue-tree>
    </v-card>
  </div>
</template>

<script>
import SlVueTree from "@/plugins/sl-vue-tree/sl-vue-tree.js"
import "@/plugins/sl-vue-tree/sl-vue-tree-minimal.css"
import TitleBanner from "../page-layout/TitleBanner.vue"

export default {
  name: "CustomTreeview",
  components: {
    SlVueTree,
    TitleBanner
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    displayKey: {
      type: String,
      required: true,
      default: "name"
    },
    expandAll: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    // Drag and drop props
    allowDragAndDrop: {
      type: Boolean,
      default: false
    },
    allowMultiselect: {
      type: Boolean,
      default: false
    },
    edgeSize: {
      type: Number,
      default: 3
    },
    showBranches: {
      type: Boolean,
      default: false
    },
    // NEW: Restrict drag and drop to only "inside" placement
    allowOnlyInsideDrop: {
      type: Boolean,
      default: false
    },
    dropConfig: {
      type: Object,
      default: () => {
        return { dropEndpoint: "", itemIdKey: "" }
      }
    }
  },
  data() {
    return {
      treeNodes: [],
      selectedNode: null,
      originalItemsMap: new Map(),
      // Rollback state
      treeStateSnapshot: null,
      isDragInProgress: false
    }
  },
  computed: {
    processedTreeNodes() {
      return this.transformItemsToTreeNodes(this.items)
    }
  },
  watch: {
    items: {
      handler() {
        // Only update if we're not in the middle of a drag operation
        if (!this.isDragInProgress) {
          this.updateTreeNodes()
        }
      },
      deep: true,
      immediate: true
    },
    expandAll: {
      handler() {
        if (this.expandAll) {
          this.$nextTick(() => {
            this.expandAllNodes()
          })
        }
      }
    }
  },
  methods: {
    transformItemsToTreeNodes(items, path = []) {
      this.originalItemsMap.clear()
      return this.processItems(items, path)
    },

    processItems(items, path = []) {
      return items.map((item, index) => {
        const currentPath = [...path, index]
        const nodeId = this.generateNodeId(item, currentPath)

        this.originalItemsMap.set(nodeId, item)

        const treeNode = {
          id: nodeId,
          title: item[this.displayKey] || "No Name",
          // Force all nodes to be non-leaf so they can accept drops
          isLeaf: false,
          isExpanded: this.expandAll,
          isSelected: false,
          isDraggable: this.allowDragAndDrop && item.isDraggable !== false,
          isSelectable: item.isSelectable !== false,
          data: { originalItem: item },
          children: item.children ? this.processItems(item.children, currentPath) : []
        }

        return treeNode
      })
    },

    generateNodeId(item, path) {
      return item.id ? `item_${item.id}` : `path_${path.join("_")}`
    },

    getOriginalItem(node) {
      return this.originalItemsMap.get(node.id) || node.data?.originalItem
    },

    getDraggedItemsCount() {
      if (!this.$refs.slVueTree) return 0
      return this.$refs.slVueTree.getDraggable().length
    },

    updateTreeNodes() {
      this.treeNodes = this.transformItemsToTreeNodes(this.items)

      if (this.expandAll) {
        this.$nextTick(() => {
          this.expandAllNodes()
        })
      }
    },

    expandAllNodes() {
      if (!this.$refs.slVueTree) return

      const expandNode = (nodes) => {
        nodes.forEach((node) => {
          if (!node.isLeaf) {
            this.$refs.slVueTree.updateNode(node.path, { isExpanded: true })
            if (node.children && node.children.length > 0) {
              expandNode(node.children)
            }
          }
        })
      }

      expandNode(this.treeNodes)
    },

    // NEW: Capture tree state before drop operation
    captureTreeState() {
      this.treeStateSnapshot = {
        treeNodes: JSON.parse(JSON.stringify(this.treeNodes)),
        originalItemsMap: new Map(this.originalItemsMap),
        selectedNode: this.selectedNode ? { ...this.selectedNode } : null
      }
    },

    // NEW: Restore tree state from snapshot
    restoreTreeState() {
      if (this.treeStateSnapshot) {
        this.treeNodes = this.treeStateSnapshot.treeNodes
        this.originalItemsMap = this.treeStateSnapshot.originalItemsMap
        this.selectedNode = this.treeStateSnapshot.selectedNode

        // Force Vue to re-render the tree
        this.$nextTick(() => {
          // Trigger a model update to make sure sl-vue-tree syncs
          this.$refs.slVueTree.$emit("input", this.treeNodes)
        })
      }
    },

    // NEW: Clear the snapshot
    clearTreeSnapshot() {
      this.treeStateSnapshot = null
      this.isDragInProgress = false
    },

    // Event handlers
    onNodeSelected(selectedNodes, event) {
      this.selectedNode = selectedNodes.length > 0 ? selectedNodes[0] : null

      const originalItems = selectedNodes.map((node) => this.getOriginalItem(node))
      this.$emit("node-selected", originalItems, selectedNodes[0] || null, event)
    },

    onNodeToggled(node, event) {
      const originalItem = this.getOriginalItem(node)
      this.$emit("node-toggled", originalItem, node, event)
    },

    // MODIFIED: Capture state before drop validation
    onBeforeDrop(draggedNodes, position, callback) {
      // Capture the current state before any changes
      this.captureTreeState()
      this.isDragInProgress = true

      const draggedItems = draggedNodes.map((node) => this.getOriginalItem(node))
      const targetItem = this.getOriginalItem(position.node)

      // Allow parent component to validate the drop
      this.$emit("before-drop", {
        draggedItems,
        targetItem,
        placement: position.placement,
        draggedNodes,
        position,
        callback // Call this to cancel the drop
      })
    },

    getParentNode(targetNode, nodes = null, parent = null) {
      if (!nodes) nodes = this.treeNodes

      for (const node of nodes) {
        // If we found the target node, return its parent
        if (node.id === targetNode.id) {
          return parent
        }

        // If current node has children, search recursively
        if (node.children && node.children.length > 0) {
          const foundParent = this.getParentNode(targetNode, node.children, node)
          if (foundParent !== null) {
            return foundParent
          }
        }
      }

      return null // No parent found (target is root level or not found)
    },

    // MODIFIED: Handle API call and rollback on failure
    async onNodeDropped(draggedNodes, position, event) {
      const draggedItems = draggedNodes.map((node) => this.getOriginalItem(node))
      const targetItem = this.getOriginalItem(position.node)

      // Get the parent node of the target
      const parentNode = this.getParentNode(position.node)
      const parentItem = parentNode ? this.getOriginalItem(parentNode) : null

      console.log("Target node:", position.node)
      console.log("Parent node:", parentNode)
      console.log("Parent item:", parentItem)
      console.log("position", position)
      console.log("event", event)

      // Determine parent ID based on placement
      const parentId = position.placement === "inside" ? targetItem.id : parentItem ? parentItem.id : null
      try {
        // Update parent ID via API for each dragged item
        const apiPromises = draggedItems.map((item) => {
          return this.$axios.post(this.dropConfig?.dropEndpoint, {
            // before: position.placement === "before",
            // before_id: position.node.data.originalItem.id,
            placement: position.placement,
            // level: position.node.level,
            position_node_id: position.node.data.originalItem.id,
            // current_level: draggedNodes[0].level,
            parent_id: parentId,
            [this.dropConfig.itemIdKey]: item.id
          })
        })

        // Wait for all API calls to complete
        const responses = await Promise.all(apiPromises)

        // Check if all responses are successful (status 200-299)
        const allSuccessful = responses.every((response) => response.status >= 200 && response.status < 300)

        if (allSuccessful) {
          console.log("All updates successful:", responses)
          // Clear the snapshot since everything succeeded
          this.clearTreeSnapshot()

          // Emit the drop event with structured data including parent info
          this.$emit("nodes-dropped", {
            draggedItems,
            targetItem,
            parentItem,
            parentNode,
            placement: position.placement,
            draggedNodes,
            position,
            event,
            success: true
          })
        } else {
          throw new Error("One or more API calls returned non-success status")
        }
      } catch (error) {
        console.error("Error updating node:", error)

        // Restore the tree to its previous state
        this.restoreTreeState()

        // Emit an error event
        this.$emit("nodes-dropped", {
          draggedItems,
          targetItem,
          parentItem,
          parentNode,
          placement: position.placement,
          draggedNodes,
          position,
          event,
          success: false,
          error: error
        })

        // Clear the snapshot
        this.clearTreeSnapshot()
      }
    },

    onNodeClicked(node, event) {
      const originalItem = this.getOriginalItem(node)
      this.$emit("node-clicked", originalItem, node, event)
    },

    onNodeDoubleClicked(node, event) {
      const originalItem = this.getOriginalItem(node)
      this.$emit("node-double-clicked", originalItem, node, event)
    },

    onNodeContextMenu(node, event) {
      const originalItem = this.getOriginalItem(node)
      this.$emit("node-context-menu", originalItem, node, event)
    },

    // Public methods to control the tree
    selectNode(itemId) {
      const nodeId = `item_${itemId}`
      const node = this.findNodeById(nodeId)
      if (node && this.$refs.slVueTree) {
        this.$refs.slVueTree.select(node.path)
      }
    },

    expandNode(itemId) {
      const nodeId = `item_${itemId}`
      const node = this.findNodeById(nodeId)
      if (node && this.$refs.slVueTree) {
        this.$refs.slVueTree.updateNode(node.path, { isExpanded: true })
      }
    },

    collapseNode(itemId) {
      const nodeId = `item_${itemId}`
      const node = this.findNodeById(nodeId)
      if (node && this.$refs.slVueTree) {
        this.$refs.slVueTree.updateNode(node.path, { isExpanded: false })
      }
    },

    findNodeById(nodeId, nodes = null) {
      if (!nodes) nodes = this.treeNodes

      for (const node of nodes) {
        if (node.id === nodeId) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = this.findNodeById(nodeId, node.children)
          if (found) return found
        }
      }
      return null
    },

    getSelectedItems() {
      if (!this.$refs.slVueTree) return []
      const selectedNodes = this.$refs.slVueTree.getSelected()
      return selectedNodes.map((node) => this.getOriginalItem(node))
    }
  }
}
</script>

<style scoped>
.custom-treeview {
  width: 100%;
}

.tree-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

/* Custom styles to match units component exactly */
.custom-sl-tree ::v-deep .sl-vue-tree-node-item:hover,
.custom-sl-tree ::v-deep .sl-vue-tree-node-item.sl-vue-tree-cursor-hover {
  /* color: #e8437a; */
}

.custom-sl-tree ::v-deep .sl-vue-tree.sl-vue-tree-root {
  border: transparent;
  background-color: transparent;
  flex-grow: 1;
  overflow-x: auto;
  overflow-y: auto;
  height: 100%;
  width: 100% !important;
}

.custom-sl-tree ::v-deep .sl-vue-tree-title {
  width: 100% !important;
}

.item-icon {
  display: inline-block;
  text-align: left;
  width: 20px;
  margin-right: 5px;
}

.edit-button-container {
  display: inline-flex;
  align-items: center;
  opacity: 1;
  margin-inline: auto;
  transition: opacity 0.2s;
  margin-inline: 5px;
}

.custom-sl-tree ::v-deep .sl-vue-tree-sidebar {
  margin-left: 0px !important;
}

/* Drag info styling */
.drag-info {
  background: rgba(120, 67, 232, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* Drag and drop cursor styles */
.custom-sl-tree ::v-deep .sl-vue-tree-cursor {
  background-color: #7843e8;
  height: 2px;
  margin-left: calc(var(--depth, 0) * 20px);
}

.custom-sl-tree ::v-deep .sl-vue-tree-cursor-inside {
  border: 2px dashed #7843e8;
  background-color: rgba(120, 67, 232, 0.1);
}

/* NEW: Hide before/after cursors when allowOnlyInsideDrop is true */
.custom-sl-tree.only-inside-drop ::v-deep .sl-vue-tree-cursor_before,
.custom-sl-tree.only-inside-drop ::v-deep .sl-vue-tree-cursor_after {
  display: none !important;
}
</style>
