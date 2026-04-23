<template>
  <div>
    <!-- Clickable icon -->
    <v-btn icon @click="openDialog" :disabled="loadingItems">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>

    <!-- Dialog with items list -->
    <custom-dialog v-model="dialogOpen" :title="dialogTitle" width="600px">
      <!-- Loading state -->
      <div v-if="loadingItems" class="loading-container">
        <div class="text-center py-8">
          <v-progress-circular indeterminate size="64" width="4" color="primary"></v-progress-circular>
          <h3 class="mt-4">{{ $t("page.loading") }}</h3>
        </div>
      </div>

      <!-- Items list -->
      <div v-else-if="items.items.length > 0">
        <v-list>
          <v-list-item
            v-for="item in items.items"
            :key="item[items.idKey]"
            @click="navigateToItem(item)"
            class="item-link"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item[items.nameKey] }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>{{ isRTL ? "mdi-chevron-left" : "mdi-chevron-right" }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>

      <!-- No items message -->
      <no-posts-message
        v-else
        :title="$t('page.no_items_found')"
        :subtitle="$t('page.no_associated_risks')"
        :show-button="false"
      />
    </custom-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex"
import NoPostsMessage from "../CANS/NoPostsMessage.vue"
import CustomDialog from "../CustomDialog.vue"

export default {
  name: "AssociatedItems",

  components: {
    CustomDialog,
    NoPostsMessage
  },

  props: {
    title: {
      type: Object,
      default: () => ({ parentName: "", title: "page.associated_with" })
    },
    icon: {
      type: String,
      default: "mdi-list-box-outline"
    },
    items: {
      type: Object,
      default: () => ({
        fetchItems: () => {},
        items: [],
        nameKey: "",
        idKey: "",
        link: ""
      })
    },
    loadingItems: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogOpen: false
    }
  },

  computed: {
    ...mapState(["isRTL"]),
    dialogTitle() {
      return this.$t(this.title.title, { itemName: this.title.parentName })
    }
  },

  methods: {
    async openDialog() {
      this.dialogOpen = true
      console.log(this.items)
      // Fetch items when dialog opens
      try {
        await this.items.fetchItems()
      } catch (error) {
        console.error("Error fetching items:", error)
        this.itemsList = []
      }
    },

    navigateToItem(item) {
      if (!this.items?.link) return
      const itemId = item[this.items.idKey]
      const url = this.items?.idKey ? `${this.items.link}/${itemId}` : this.items.link
      this.$router.push(url)
      this.dialogOpen = false
    }
  }
}
</script>

<style scoped>
.item-link {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.item-link:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.loading-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
