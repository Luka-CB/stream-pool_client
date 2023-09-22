<template>
  <div class="user-comment">
    <div class="card-header">
      <router-link
        :to="{ name: 'details', params: { id: comment?.contentId?._id } }"
      >
        <h3 id="card-title">
          {{
            comment?.contentId?.title?.length <= 25
              ? comment?.contentId?.title
              : `${comment?.contentId?.title?.substring(0, 25)}...`
          }}
        </h3>
      </router-link>
    </div>
    <div class="card-body">
      <p id="body-content">
        {{
          comment?.text?.length <= 666
            ? comment?.text
            : `${comment?.text?.substring(0, 666)}...`
        }}
      </p>
    </div>
    <div class="card-footer">
      <div class="col1">
        <h5 id="date">
          Created: <em>{{ comment?.createdAt }} ago</em>
        </h5>
        <h5 id="date">
          Updated:
          <em>{{ comment?.updatedAt }}</em>
        </h5>
        <h5
          id="replies"
          @click="handleOpenRepliesModal(comment?._id, comment?.text)"
        >
          Replies: <em>( {{ comment?.replies }} )</em>
        </h5>
      </div>
      <div class="col2">
        <div
          class="edit"
          title="Edit Comment"
          @click="handleOpenEditCommentModal(comment?._id, comment?.text)"
        >
          <i class="fa-solid fa-pencil"></i>
        </div>
        <div
          class="delete"
          title="Delete Comment"
          @click="handleOpenPrompt(comment?._id)"
        >
          <spinner-alt
            :size="26"
            color="#d50000"
            margin="0"
            v-if="commentId === comment?._id && isDelCommentLoading"
          />
          <i class="fa-solid fa-trash" v-else></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "ProfileCommentCard",
  components: { SpinnerAlt },
  props: ["comment"],

  setup() {
    const store = useStore();

    //////// DELETE COMMENT ////////
    const commentId = ref("");

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDelCommentLoading = computed(() => store.getters.delCommentLoading);
    const isDelCommentSuccess = computed(() => store.getters.delCommentSuccess);

    watchEffect(() => {
      if (isDelCommentSuccess.value) {
        store.dispatch("getSomeUserComments");
        store.commit("RESET_COMMENTS");
        store.commit("RESET_PROMPT");
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "profileCommentCard" && isAnswerYes.value) {
        store.dispatch("deleteComment", commentId.value);
      }
    });

    const handleOpenPrompt = (comId: string) => {
      commentId.value = comId;
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "profileCommentCard");
    };

    ////////////////////////////////////////

    const handleOpenEditCommentModal = (
      commentId: string,
      commentText: string
    ) => {
      store.commit("SET_EDIT_COMMENT_DATA", {
        routeName: "profile",
        commentId,
        text: commentText,
      });
      store.commit("TOGGLE_EDIT_COMMENT_MODAL", true);
    };

    const handleOpenRepliesModal = (commentId: string, text: string) => {
      store.commit("SET_REPLIES_MODAL_DATA", {
        commentId,
        comment: text.substring(0, 379),
      });
      store.commit("TOGGLE_USER_COMMENT_REPLIES_MODAL", true);
    };

    return {
      handleOpenEditCommentModal,
      handleOpenRepliesModal,
      isDelCommentLoading,
      handleOpenPrompt,
      commentId,
    };
  },
});
</script>
