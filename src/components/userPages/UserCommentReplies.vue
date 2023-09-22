<template>
  <div class="replies-modal-bg" @click="handleCloseRepliesModal">
    <div class="replies-modal-container" @click.stop>
      <div class="replies-header">
        <p id="comment">{{ repliesModalData.comment }}...</p>
        <div class="close-icon">
          <i
            class="fa-solid fa-circle-xmark"
            @click="handleCloseRepliesModal"
          ></i>
        </div>
      </div>
      <div class="replies-body">
        <div class="spinner" v-if="isGetRepliesLoading">
          <spinner-vue :height="4" :width="4" />
        </div>
        <div class="no-replies" v-else-if="replies?.length === 0">
          <p>no replies for this comment!</p>
        </div>
        <div class="reply" v-for="reply in replies" :key="reply" v-else>
          <div class="header">
            <div class="header-col1">
              <div class="avatar">
                <span id="letter">{{ reply?.replier?.name?.charAt(0) }}</span>
              </div>
              <div class="inner-wrapper">
                <h4 id="name">{{ reply?.replier?.name }}</h4>
                <h6 id="date">( {{ reply?.createdAt }} ago )</h6>
              </div>
            </div>
            <div
              class="header-col2"
              v-if="user?.id && user?.id === reply?.replier?._id"
            >
              <div
                class="edit"
                title="Edit Reply"
                @click="
                  handleOpenEditReplyModal(
                    reply?.commentId,
                    reply?._id,
                    reply?.text
                  )
                "
              >
                <i class="fa-solid fa-pencil edit-icon"></i>
              </div>
              <div
                class="delete"
                title="Delete Reply"
                @click="handleOpenPrompt(reply?.commentId, reply?._id)"
              >
                <spinner-alt
                  :size="24"
                  color="#d50000"
                  v-if="replyId === reply?._id && isDelReplyLoading"
                />
                <i class="fa-solid fa-trash del-icon" v-else></i>
              </div>
            </div>
          </div>
          <hr />
          <div class="body">
            <p id="reply-text">
              <em>{{
                reply?.replyTo !== user?.username
                  ? `@${reply?.replyTo}`
                  : undefined
              }}</em
              >{{ reply?.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerVue from "../Spinner.vue";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "UserCommentReplies",
  components: { SpinnerVue, SpinnerAlt },

  setup() {
    const store = useStore();

    const user = computed(() => store.getters.user);

    const replies = computed(() => store.getters.replies);
    const repliesModalData = computed(() => store.getters.repliesModalData);
    const isGetRepliesLoading = computed(() => store.getters.getRepliesLoading);

    store.dispatch("getReplies", repliesModalData.value.commentId);

    const handleCloseRepliesModal = () => {
      store.commit("TOGGLE_USER_COMMENT_REPLIES_MODAL", false);
      store.commit("SET_REPLIES_MODAL_DATA", {});
    };

    const handleOpenEditReplyModal = (
      commentId: string,
      replyId: string,
      text: string
    ) => {
      store.commit("TOGGLE_EDIT_REPLY_MODAL", true);
      store.commit("SET_EDIT_REPLY_DATA", {
        routeName: "profile",
        commentId,
        replyId,
        text,
      });
    };

    //////// DELETE REPLY ////////
    const commentId = ref("");
    const replyId = ref("");

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDelReplyLoading = computed(() => store.getters.delReplyLoading);
    const isDelReplySuccess = computed(() => store.getters.delReplySuccess);

    watchEffect(() => {
      if (isDelReplySuccess.value) {
        store.commit("REMOVE_REPLY", replyId.value);
        store.commit("RESET_REPLY");
        store.commit("RESET_PROMPT");
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "userCommentReplies" && isAnswerYes.value) {
        store.dispatch("deleteReply", {
          commentId: commentId.value,
          replyId: replyId.value,
        });
      }
    });

    const handleOpenPrompt = (comId: string, repId: string) => {
      commentId.value = comId;
      replyId.value = repId;
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "userCommentReplies");
    };

    return {
      handleCloseRepliesModal,
      replies,
      repliesModalData,
      isGetRepliesLoading,
      user,
      handleOpenEditReplyModal,
      handleOpenPrompt,
      isDelReplyLoading,
      replyId,
    };
  },
});
</script>
