<template>
  <v-container>
    <v-list v-if="!isLoadingPosts && posts.length > 0">
      <v-list-item v-for="(message, index) in posts" :key="message.id" class="message-item">
        <v-list-item-content>
          <div class="d-flex align-center">
            <v-list-item-avatar size="48" class="mr-3 mt-0">
              <custom-avatar
                :name="message.user?.full_name"
                :image="message.user?.avatar"
                :borderColor="'primary'"
                :bgColor="'primary'"
              />
            </v-list-item-avatar>
            <div>
              <v-list-item-subtitle class="text-caption">
                {{ message.user?.full_name }} - {{ formatDate(message.created_at) }}
              </v-list-item-subtitle>
              <v-list-item-title class="font-weight-medium">{{ message.title }}</v-list-item-title>
            </div>
            <v-spacer></v-spacer>
            <!-- ! Edit and delete are completed - But are not required -->
            <!-- <div class="d-flex flex-column">
              <v-tooltip top>
                <template v-if="isOwnerOfItem(message.user.id)" v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" @click="openEditForm(message)">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("page.edit") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-if="isOwnerOfItem(message.user.id)" v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on" @click="openDeleteDialog(message)">
                    <v-icon small color="error">mdi-delete-forever-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("page.delete") }}</span>
              </v-tooltip>
            </div> -->

            <v-btn icon @click="toggleExpand(index)">
              <v-icon>{{ message.expanded ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
            </v-btn>
          </div>

          <v-expand-transition>
            <div v-show="message.expanded">
              <v-card-text class="pt-3">{{ message.body }}</v-card-text>
              <v-btn small text color="primary" @click="showReplies(index)" class="mr-2">
                {{
                  message.showReplies
                    ? $t("page.hide_replies")
                    : `${$t("page.view_replies")} (${message.comments?.length})`
                }}
              </v-btn>
              <v-btn small text color="secondary" @click="toggleReplyInput(index)">
                {{ message.showReplyInput ? $t("page.cancel_reply") : $t("page.reply") }}
              </v-btn>
              <tagged-users :users="message?.users" class="mt-2"></tagged-users>
              <v-expand-transition>
                <div v-if="message.showReplies">
                  <v-list-item
                    v-for="(reply, replyIndex) in message.comments"
                    :key="replyIndex"
                    class="reply-item ml-4"
                  >
                    <v-list-item-avatar size="32" class="mr-3 mt-0">
                      <custom-avatar
                        :size="32"
                        :name="reply.user?.full_name"
                        :image="reply.user?.avatar"
                        :borderColor="'secondary'"
                        :bgColor="'secondary'"
                      />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-subtitle class="text-caption">
                        {{ reply.user?.full_name }} - {{ formatDate(reply.created_at) }}
                      </v-list-item-subtitle>
                      <v-list-item-text v-if="true">{{ reply.body }}</v-list-item-text>
                      <custom-input
                        v-else
                        :value="reply.editBody"
                        :outlined="false"
                        @input="updateCommentText(index, replyIndex, $event)"
                        :label="$t('page.edit')"
                        @keyup.enter="saveReplyEdit(message.id, reply)"
                      ></custom-input>
                    </v-list-item-content>
                    <!-- ! Edit and delete aren't needed and aren't completed -->
                    <!-- <v-tooltip bottom>
                      <template v-if="isOwnerOfItem(reply.user.id)" v-slot:activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on" @click="openCommentForm(reply)">
                          <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("page.edit") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-if="isOwnerOfItem(reply.user.id)" v-slot:activator="{ on, attrs }">
                        <v-btn small icon v-bind="attrs" v-on="on" @click="openDeleteCommentDialog(reply)">
                          <v-icon small color="error">mdi-delete-forever-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("page.delete") }}</span>
                    </v-tooltip> -->
                  </v-list-item>
                </div>
              </v-expand-transition>
              <v-expand-transition>
                <div v-if="message.showReplyInput" class="mt-2">
                  <custom-input
                    :value="message.replyText"
                    @input="updateReplyText(index, $event)"
                    :label="$t('page.reply')"
                    :required="true"
                    class="pb-0 mb-0"
                  ></custom-input>
                  <v-btn
                    small
                    color="primary"
                    @click="createComment(index)"
                    :loading="message.isSubmitting"
                    :disabled="!message.replyText"
                  >
                    {{ $t("auth.submit") }}
                  </v-btn>
                </div>
              </v-expand-transition>
            </div>
          </v-expand-transition>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <no-posts-message
      v-else-if="!isLoadingPosts && posts.length === 0"
      :title="$t('page.no_posts_title')"
      :subtitle="$t('page.no_posts_subtitle')"
    />
    <div v-else>
      <v-skeleton-loader v-for="n in 8" :key="n" v-bind="attrs" type="list-item-avatar-three-line"></v-skeleton-loader>
    </div>
    <confirm-dialog
      v-model="showDeleteDialog"
      :title="$t('page.confirm_delete')"
      :message="$t('page.confirm_delete_message', { itemName: selectedPost?.title })"
      :confirm-button-text="$t('page.delete')"
      confirm-button-color="error"
      :loading="isDeletingPost"
      @confirm="deletePost"
    />
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { getInitials } from "../../helpers/misc"
import CustomAvatar from "../profile/CustomAvatar.vue"
import NoPostsMessage from "./NoPostsMessage.vue"
import TaggedUsers from "./TaggedUsers.vue"

export default {
  components: { NoPostsMessage, TaggedUsers, CustomAvatar },
  name: "CANSMessages",

  props: {
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      attrs: {
        class: "mb-6",
        boilerplate: true,
        elevation: 2
      },
      showDeleteDialog: false
    }
  },

  computed: {
    ...mapState("posts", ["posts", "isLoadingPosts", "selectedPost", "isDeletingPost"])
  },
  methods: {
    ...mapActions("posts", [
      "toggleExpand",
      "showReplies",
      "toggleReplyInput",
      "submitReply",
      "toggleShowMessageForm",
      "setEditFormValue",
      "setSelectedPost",
      "deletePost",
      "setReplyText",
      "setCommentText",
      "createComment",
      "updateComment"
    ]),
    getInitials,
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    isOwnerOfItem(userId) {
      return userId === this.$auth.user.id
    },
    openEditForm(post) {
      this.toggleShowMessageForm()
      this.setEditFormValue(true)
      this.setSelectedPost(post)
    },
    openDeleteDialog(post) {
      this.setSelectedPost(post)
      this.showDeleteDialog = true
    },
    updateReplyText(index, text) {
      this.setReplyText({ index, text })
    },
    updateCommentText(index, commentIndex, text) {
      this.setCommentText({ index, commentIndex, text })
    }
  }
}
</script>

<style scoped>
.message-item {
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}
.reply-item {
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 4px;
}
</style>
