<template>
  <div>
    <v-card flat>
      <v-card-title>
        Categories

        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-btn right color="primary" dark class="mx-2" @click="showCategoryForm">
          <v-icon left>mdi-plus</v-icon>
          Create Category
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="categoriesList"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.parent_id="{ item }">
          {{ getParentName(item.parent_id) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="openDeleteConfirmationDialog(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <custom-dialog v-model="dialog" :title="$t('new_category')">
      <v-container>
        <custom-input v-model="editedItem.name" :label="$t('name')" :required="true" />
        <custom-input v-model="editedItem.slug" :label="$t('slug')" :required="true" />
        <custom-dropdown
          :items="categoriesList"
          item-value="id"
          item-text="name"
          :label="$t('parent_category')"
          v-model="editedItem.parent_id"
          :required="true"
          :disabled="false"
        />
        <custom-input v-model.number="editedItem.order" :label="$t('order')" :type="number" :required="true" />
        <v-btn :loading="loading" color="primary" block @click="save">
          {{ $t("add") }}
        </v-btn>
      </v-container>
    </custom-dialog>

    <!-- delete confirmation dialog -->
    <confirm-dialog
      v-model="deleteConfirmationDialog"
      :title="$t('delete')"
      :message="
        $t('confirm_delete_message', {
          itemName: this.itemToDelete.name
        })
      "
      :confirm-button-color="'red'"
      @confirm="deleteItem"
    ></confirm-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import CustomDialog from "~/components/CustomDialog.vue"
export default {
  name: "CategoriesTable",
  components: {
    CustomDialog
  },

  data() {
    return {
      search: "",
      dialog: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Parent", value: "parent_id" },
        { text: "Order", value: "order" },
        { text: "Name", value: "name" },
        { text: "Slug", value: "slug" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      // categories: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        parent_id: null,
        order: 0,
        name: "",
        slug: ""
      },
      defaultItem: {
        id: null,
        parent_id: null,
        order: 0,
        name: "",
        slug: ""
      },
      deleteConfirmationDialog: false,
      itemToDelete: {}
    }
  },

  computed: {
    ...mapState("settings", ["categories"]),
    categoriesList() {
      return this.categories
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Category" : "Edit Category"
    }

    // parentCategories() {
    //   // Filter out the current item (when editing) to prevent self-reference
    //   return this.categories.filter((cat) => cat.id !== this.editedItem.id);
    // },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    // Auto-generate slug from name
    "editedItem.name": function (val) {
      if (this.editedIndex === -1) {
        // Only for new items
        this.editedItem.slug = this.slugify(val)
      }
    }
  },

  created() {
    this.getCategories()
    this.initialize()
  },

  methods: {
    ...mapActions("settings", ["getCategories", "addCategory", "updateCategory", "deleteCategory"]),
    showCategoryForm() {
      this.dialog = true
    },
    initialize() {
      // Fetch categories from API
      // This is just sample data - replace with your API call
      this.categories = [
        {
          id: 1,
          parent_id: null,
          order: 1,
          name: "Electronics",
          slug: "electronics"
        },
        {
          id: 2,
          parent_id: 1,
          order: 1,
          name: "Smartphones",
          slug: "smartphones"
        },
        {
          id: 3,
          parent_id: 1,
          order: 2,
          name: "Laptops",
          slug: "laptops"
        },
        {
          id: 4,
          parent_id: null,
          order: 2,
          name: "Clothing",
          slug: "clothing"
        },
        {
          id: 5,
          parent_id: 4,
          order: 1,
          name: "Men",
          slug: "men"
        }
      ]
    },

    getParentName(parentId) {
      if (!parentId) return "None"
      const parent = this.categories.find((cat) => cat.id === parentId)
      return parent ? parent.name : "Unknown"
    },

    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
    },

    editItem(item) {
      // this.editedIndex = this.categories.indexOf(item);
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    openDeleteConfirmationDialog(item) {
      this.itemToDelete = item
      this.deleteConfirmationDialog = true
    },

    async deleteItem() {
      await this.deleteCategory(this.itemToDelete.id)
      await this.getCategories()
      this.deleteConfirmationDialog = false
    },

    // deleteItem(item) {
    //   // const index = this.categories.indexOf(item);
    //   if (confirm("Are you sure you want to delete this item?")) {
    //     // this.categories.splice(index, 1);
    //     // Add API call to delete the item here
    //     this.deleteCategory(item.id);
    //   }
    // },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save(item = {}) {
      if (this.editedIndex > -1) {
        // Update existing item
        // Object.assign(this.categories[this.editedIndex], this.editedItem);
        // Add API call to update the item here
        // this.updateCategory(this.editedItem);
        this.updateCategory({ id: this.editedIndex, payload: this.editedItem })
      } else {
        // Create new item
        // In real application, the ID would be generated by backend
        // const newId = Math.max(...this.categories.map((c) => c.id)) + 1;
        // this.editedItem.id = newId;
        // this.categories.push(this.editedItem);
        // Add API call to create the item here
        this.addCategory(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
