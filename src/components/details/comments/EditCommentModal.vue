<template>
  <div class="edit-comment-modal-bg" @click="handleCloseModal">
    <div class="edit-comment-modal-container" @click.stop>
      <i class="fa-solid fa-circle-xmark" @click="handleCloseModal"></i>
      <h2 id="title">Edit Comment</h2>
      <textarea
        cols="30"
        rows="10"
        placeholder="update comment"
        v-model="commentText"
      ></textarea>
      <button
        class="btn-outline"
        @click="handleSubmit"
        :disabled="editCommentData.text === commentText || isLoading"
      >
        <spinner-alt :size="24" color="#07d1cd" v-if="isLoading" />
        <span>{{ isLoading ? "submitting..." : "submit" }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "EditCommentModal",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const commentText = ref("");

    const editCommentData = computed(() => store.getters.editCommentData);
    const isLoading = computed(() => store.getters.editCommentLoading);
    const isSuccess = computed(() => store.getters.editCommentSuccess);

    watchEffect(() => {
      if (editCommentData.value.text) {
        commentText.value = editCommentData.value.text;
      }
    });

    const handleCloseModal = () => {
      store.commit("TOGGLE_EDIT_COMMENT_MODAL", false);
      store.commit("SET_EDIT_COMMENT_DATA", {});
    };

    watchEffect(() => {
      if (isSuccess.value) {
        editCommentData.value.routeName === "profile" &&
          store.dispatch("getSomeUserComments");
        editCommentData.value.routeName === "comments" &&
          store.dispatch("getUserComments");
        store.commit("SET_EDITED_COMMENT", {
          commentId: editCommentData.value.commentId,
          text: commentText.value,
        });
        handleCloseModal();
        store.commit("RESET_COMMENTS");
      }
    });

    const handleSubmit = () => {
      store.dispatch("editComment", {
        commentId: editCommentData.value.commentId,
        text: commentText.value,
      });
    };

    return {
      commentText,
      handleCloseModal,
      handleSubmit,
      isLoading,
      editCommentData,
    };
  },
});
</script>
