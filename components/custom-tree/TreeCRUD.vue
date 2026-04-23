<template>
  <div class="tree-crud d-flex align-center">
    <v-can :permission="permissions.create">
      <v-btn icon small class="crud-btn" @click.stop="handleCreate">
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
    </v-can>

    <v-can :permission="permissions.edit">
      <v-btn icon small class="crud-btn" @click.stop="handleEdit">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
    </v-can>

    <v-can :permission="permissions.delete">
      <v-btn icon small class="crud-btn" @click.stop="handleDelete">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </v-can>

    <!-- Delete Confirmation Modal -->
    <custom-dialog
      v-model="showDeleteModal"
      :title="formConfig.deleteTitle || 'Delete Item'"
      width="500px"
      @close-dialog="showDeleteModal = false"
    >
      <delete-items-modal
        :value="showDeleteModal"
        :items="[item]"
        :config="deleteModalConfig"
        @items-deleted="onItemsDeleted"
        @input="showDeleteModal = $event"
        @close="showDeleteModal = false"
      />
    </custom-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import CustomDialog from "../CustomDialog.vue"
import DeleteItemsModal from "../custom-table/DeleteItemsModal.vue"

export default {
  name: "TreeCRUD",
  components: {
    CustomDialog,
    DeleteItemsModal
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    permissions: {
      type: Object,
      required: true,
      default: () => ({
        create: "",
        edit: "",
        delete: ""
      })
    },
    formConfig: {
      type: Object,
      required: true,
      default: () => ({
        component: "",
        parentField: null,
        staticFields: {},
        createTitle: "Create Item",
        editTitle: "Edit Item",
        deleteTitle: "Delete Item",
        itemNameKey: "name",
        store: "",
        entityName: ""
      })
    }
  },
  data() {
    return {
      showDeleteModal: false
    }
  },
  computed: {
    deleteModalConfig() {
      return {
        itemNameKey: this.formConfig.itemNameKey || "name",
        delete: this.deleteItem
      }
    }
  },
  methods: {
    ...mapActions("drawer", ["openDrawer"]),

    handleCreate() {
      const props = {
        editForm: false
      }

      // Add parent field if specified
      if (this.formConfig.parentField && this.item.id) {
        props[this.formConfig.parentField] = this.item.id
      }

      // Add any static fields
      if (this.formConfig.staticFields) {
        Object.assign(props, this.formConfig.staticFields)
      }

      this.openDrawer({
        component: this.formConfig.component,
        props,
        title: this.formConfig.createTitle || "Create Item"
      })

      this.$emit("create", this.item)
    },

    handleEdit() {
      this.openDrawer({
        component: this.formConfig.component,
        props: {
          editForm: true,
          itemId: this.item.id
        },
        title: this.formConfig.editTitle || "Edit Item"
      })

      this.$emit("edit", this.item)
    },

    handleDelete() {
      this.showDeleteModal = true
      this.$emit("delete", this.item)
    },

    async deleteItem(itemId) {
      if (!this.formConfig.store || !this.formConfig.entityName) {
        throw new Error("Store and entityName must be specified in formConfig for delete functionality")
      }

      const actionName = `${this.formConfig.store}/delete${this.formConfig.entityName}`
      return await this.$store.dispatch(actionName, itemId)
    },

    onItemsDeleted(deletedIds) {
      // The store action already removed the item from the tree
      // Close the modal and emit event for any additional parent logic
      this.showDeleteModal = false
      this.$emit("item-deleted", deletedIds)
    }
  }
}
</script>

<style scoped>
.tree-crud {
  gap: 2px;
}

.crud-btn {
  transition: all 0.2s ease;
}

.crud-btn:hover {
  transform: scale(1.1);
}
</style>
