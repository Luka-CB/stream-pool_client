<template>
  <div class="user-comment">
    <div class="card-header">
      <router-link
        :to="{ name: 'details', params: { id: comment?.contentId?._id } }"
      >
        <h3 id="card-title">
          {{
            comment?.contentId?.title?.length <= 33
              ? comment?.contentId?.title
              : `${comment?.contentId?.title?.substring(0, 33)}...`
          }}
        </h3>
      </router-link>
    </div>
    <div class="card-body">
      <p id="body-content" v-if="windowWidth >= 1920">
        {{
          comment?.text?.length <= 800
            ? comment?.text
            : `${comment?.text?.substring(0, 800)}...`
        }}
      </p>
      <p id="body-content" v-else-if="windowWidth <= 800">
        {{
          comment?.text?.length <= 300
            ? comment?.text
            : `${comment?.text?.substring(0, 300)}...`
        }}
      </p>
      <p id="body-content" v-else>
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
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useWindowWidth } from "../../../composables/windowResize";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "ProfileCommentCard",
  components: { SpinnerAlt },
  props: ["comment"],

  setup() {
    const store = useStore();

    //////// DELETE COMMENT ////////
    const commentId = ref("");

    const isDelCommentLoading = computed(() => store.getters.delCommentLoading);

    const handleOpenPrompt = (comId: string) => {
      commentId.value = comId;
      store.commit("SET_PROMPT_ID", comId);
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

    const { windowWidth } = useWindowWidth();

    return {
      handleOpenEditCommentModal,
      handleOpenRepliesModal,
      isDelCommentLoading,
      handleOpenPrompt,
      commentId,
      windowWidth,
    };
  },
});
</script>
