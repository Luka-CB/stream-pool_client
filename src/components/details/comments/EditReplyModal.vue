<template>
  <div class="edit-comment-modal-bg" @click="handleCloseModal">
    <div class="edit-comment-modal-container" @click.stop>
      <i class="fa-solid fa-circle-xmark" @click="handleCloseModal"></i>
      <h2 id="title">Edit Reply</h2>
      <textarea
        cols="30"
        rows="10"
        placeholder="update reply"
        v-model="replyText"
      ></textarea>
      <button
        class="btn-outline"
        @click="handleSubmit"
        :disabled="editReplyData.text === replyText || isLoading"
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
  name: "EditReplyModal",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const replyText = ref("");

    const editReplyData = computed(() => store.getters.editReplyData);
    const isLoading = computed(() => store.getters.editReplyLoading);
    const isSuccess = computed(() => store.getters.editReplySuccess);

    watchEffect(() => {
      if (editReplyData.value.text) {
        replyText.value = editReplyData.value.text;
      }
    });

    const handleCloseModal = () => {
      store.commit("TOGGLE_EDIT_REPLY_MODAL", false);
      store.commit("SET_EDIT_REPLY_DATA", {});
    };

    watchEffect(() => {
      if (isSuccess.value) {
        editReplyData.value.routeName === "profile" &&
          store.commit("SET_EDITED_USER_REPLY", {
            replyId: editReplyData.value.replyId,
            text: replyText.value,
          });
        store.commit("SET_EDITED_REPLY", {
          commentId: editReplyData.value.commentId,
          replyId: editReplyData.value.replyId,
          text: replyText.value,
        });
        handleCloseModal();
        store.commit("RESET_REPLY");
      }
    });

    const handleSubmit = () => {
      store.dispatch("editReply", {
        replyId: editReplyData.value.replyId,
        text: replyText.value,
      });
    };

    return {
      replyText,
      editReplyData,
      handleCloseModal,
      handleSubmit,
      isLoading,
    };
  },
});
</script>
