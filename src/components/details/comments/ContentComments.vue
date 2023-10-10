<template>
  <div class="comments-container" @click="handleToggleOption('')">
    <h1 class="title">
      Comments - <i>( {{ commentsCount }} )</i>
    </h1>
    <hr />
    <section class="submit-comment">
      <textarea
        cols="30"
        rows="10"
        placeholder="Leave a Comment"
        v-model="text"
      ></textarea>
      <button
        class="btn-primary"
        @click="handleAddComment"
        :disabled="!text || isAddCommentLoading"
      >
        <spinner-alt :size="25" v-if="isAddCommentLoading" />
        <span>{{ isAddCommentLoading ? "Posting..." : "Post Comment" }}</span>
      </button>
    </section>
    <section class="comments">
      <div class="spinner" v-if="isGetCommentsLoading">
        <spinner-vue :width="5" :height="5" />
      </div>
      <div class="comment" v-for="comment in comments" :key="comment._id">
        <div class="col1">
          <div
            class="avatar"
            :style="{
              backgroundColor: `#${comment.avatarBgColor}`,
              color: comment.avatarTextColor === 'dark' ? 'black' : 'aliceblue',
            }"
          >
            <span id="letter">{{ comment?.user?.username.charAt(0) }}</span>
          </div>
          <h4 id="name">{{ comment?.user?.username }}</h4>
          <div class="icons" v-if="user?.id && user?.id === comment?.user?._id">
            <div
              class="edit"
              title="Edit Comment"
              @click="handleOpenEditCommentModal(comment?._id, comment?.text)"
            >
              <i class="fa-solid fa-pencil edit-icon"></i>
            </div>
            <div
              class="delete"
              title="Delete Comment"
              @click="handleOpenPrompt(comment?._id)"
            >
              <spinner-alt
                :size="24"
                color="#d50000"
                v-if="commentId === comment?._id && isDelCommentLoading"
              />
              <i class="fa-solid fa-trash del-icon" v-else></i>
            </div>
          </div>
          <em id="date">{{ comment?.createdAt }} ago</em>
          <button
            class="btn-primary"
            @click="handleOpenReplyModal(comment?._id, comment?.user?.username)"
            :disabled="commentIds.includes(comment?._id)"
          >
            <span>reply</span>
            <i class="fa-solid fa-reply"></i>
          </button>
          <div
            class="comment-option"
            v-if="windowWidth <= 500 && user?.id === comment?.user?._id"
            @click.stop="handleToggleOption(comment?._id)"
          >
            <div class="option-icon">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div
              class="option-wrapper"
              v-if="showCommentOption && optionCommentId === comment?._id"
            >
              <button
                class="edit"
                title="Edit Comment"
                @click="handleOpenEditCommentModal(comment?._id, comment?.text)"
              >
                <i class="fa-solid fa-pencil"></i>
                <span>edit</span>
              </button>
              <button
                class="delete"
                title="Delete Comment"
                @click="handleOpenPrompt(comment?._id)"
              >
                <spinner-alt
                  :size="24"
                  color="#d50000"
                  v-if="commentId === comment?._id && isDelCommentLoading"
                />
                <i class="fa-solid fa-trash del-icon" v-else></i>
                <span>delete</span>
              </button>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="col2">
          <p id="description">{{ comment?.text }}</p>
          <comment-replies
            :comment-id="comment?._id"
            :repliesCount="comment?.replies?.length"
            :replies="comment?.replies"
            :commentAuthor="comment?.user?.username"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "../../SpinnerAlt.vue";
import SpinnerVue from "../../Spinner.vue";
import CommentReplies from "./CommentReplies.vue";
import { useWindowWidth } from "../../../composables/windowResize";

export default defineComponent({
  name: "ContentComments",
  props: ["contentId"],
  components: { SpinnerAlt, SpinnerVue, CommentReplies },

  setup(props) {
    const store = useStore();

    const text = ref("");
    const showCommentOption = ref(false);

    const { windowWidth } = useWindowWidth();

    const comments = computed(() => store.getters.comments);
    const commentsCount = computed(() => store.getters.commentsCount);
    const user = computed(() => store.getters.user);
    const commentIds = computed(() => store.getters.commentIds);

    //////// ADD COMMENT ////////

    const isAddCommentLoading = computed(() => store.getters.addCommentLoading);
    const isAddCommentSuccess = computed(() => store.getters.addCommentSuccess);

    watchEffect(() => {
      if (isAddCommentSuccess.value) {
        store.commit("RESET_COMMENTS");
        text.value = "";
      }
    });

    const handleAddComment = () => {
      store.dispatch("addComment", {
        text: text.value,
        contentId: props.contentId,
        user: { _id: user.value?.id, username: user.value?.username },
      });
    };

    //////// GET COMMENTS ////////

    const isGetCommentsLoading = computed(
      () => store.getters.getCommentsLoading
    );

    watchEffect(() => {
      if (props.contentId) {
        store.dispatch("getComments", props.contentId);
      }
    });

    //////// DELETE COMMENT ////////
    const commentId = ref("");

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDelCommentLoading = computed(() => store.getters.delCommentLoading);
    const isDelCommentSuccess = computed(() => store.getters.delCommentSuccess);

    watchEffect(() => {
      if (isDelCommentSuccess.value) {
        store.commit("REMOVE_STORE_COMMENT", commentId.value);
        setTimeout(() => {
          store.commit("RESET_COMMENTS");
          store.commit("RESET_PROMPT");
          store.commit("RESET_PROMPT");
        }, 1000);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "contentComment" && isAnswerYes.value) {
        store.dispatch("deleteComment", commentId.value);
      }
    });

    const handleOpenPrompt = (comId: string) => {
      commentId.value = comId;
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "contentComment");
    };

    ////////////////////////////

    const handleOpenEditCommentModal = (commentId: string, text: string) => {
      store.commit("SET_EDIT_COMMENT_DATA", { commentId, text });
      store.commit("TOGGLE_EDIT_COMMENT_MODAL", true);
    };

    const handleOpenReplyModal = (commentId: string, commentAuthor: string) => {
      store.commit("TOGGLE_REPLY_MODAL", true);
      store.commit("SET_COMMENT_IDS", commentId);
      store.commit("SET_REPLY_DATA", {
        commentId,
        replier: { _id: user.value?.id, name: user.value?.username },
        replyTo: commentAuthor,
      });
    };

    const optionCommentId = ref("");

    const handleToggleOption = (commentId: string) => {
      optionCommentId.value = commentId;
      showCommentOption.value = !showCommentOption.value;
    };

    return {
      text,
      comments,
      handleAddComment,
      isAddCommentLoading,
      isGetCommentsLoading,
      commentsCount,
      handleOpenReplyModal,
      commentIds,
      user,
      handleOpenEditCommentModal,
      handleOpenPrompt,
      prompt,
      isDelCommentLoading,
      commentId,
      windowWidth,
      showCommentOption,
      handleToggleOption,
      optionCommentId,
    };
  },
});
</script>
