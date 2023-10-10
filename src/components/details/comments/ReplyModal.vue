<template>
  <div class="reply-modal-bg" @click="handleCloseReplyModal">
    <div class="reply-modal-container" @click.stop>
      <i class="fa-solid fa-circle-xmark" @click="handleCloseReplyModal"></i>
      <h2 id="title">
        Reply to <i>@{{ replyData.replyTo }}</i>
      </h2>
      <textarea
        cols="30"
        rows="10"
        placeholder="write your reply here"
        v-model="replyText"
      ></textarea>
      <button
        class="btn-outline"
        :disabled="!replyText"
        @click="handleAddReply"
      >
        <spinner-alt size="24" color="#07d1cd" v-if="isAddReplyLoading" />
        <span>{{ isAddReplyLoading ? "submitting..." : "submit reply" }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "ReplyModal",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const replyText = ref("");

    const replyData = computed(() => store.getters.replyData);
    const isAddReplyLoading = computed(() => store.getters.addReplyLoading);

    const handleAddReply = () => {
      store.dispatch("addReply", {
        text: replyText.value,
        commentId: replyData.value.commentId,
        replier: replyData.value.replier,
        replyTo: replyData.value.replyTo,
      });
    };

    const handleCloseReplyModal = () => {
      store.commit("TOGGLE_REPLY_MODAL", false);
      store.commit("SET_REPLY_DATA", {});
    };

    return {
      replyText,
      replyData,
      handleCloseReplyModal,
      isAddReplyLoading,
      handleAddReply,
    };
  },
});
</script>
