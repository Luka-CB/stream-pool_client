<template>
  <div class="replies-wrapper">
    <div class="show-replies-btn-wrapper">
      <div class="show-replies-btn" @click="handleAddId">
        <i
          class="fa-solid fa-caret-down"
          v-if="commentIds.includes(commentId)"
        ></i>
        <i class="fa-solid fa-caret-right" v-else></i>
        <span>{{
          repliesCount === 0
            ? "no replies"
            : commentIds.includes(commentId)
            ? "hide replies"
            : repliesCount === 1
            ? "show 1 reply"
            : `show ${repliesCount} replies`
        }}</span>
        <i class="fa-solid fa-reply"></i>
      </div>
      <div class="replies-count" v-if="commentIds.includes(commentId)">
        <em>{{ repliesCount }}</em>
        <span>{{ repliesCount === 1 ? "reply" : "replies" }}</span>
      </div>
    </div>
    <div class="replies" v-if="isRepliesActive">
      <div class="input-wrapper">
        <textarea
          cols="30"
          rows="2"
          placeholder="write your reply here"
          v-model="replyText"
        ></textarea>
        <button
          id="add-reply-btn"
          :disabled="!replyText"
          @click="handleAddReply"
        >
          <spinner-alt :size="24" color="#07d1cd" v-if="isAddReplyLoading" />
          <span>{{ isAddReplyLoading ? "adding reply..." : "add reply" }}</span>
        </button>
      </div>
      <div class="reply" v-for="reply in replies" :key="reply?._id">
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
              title="Edit Comment"
              @click="handleOpenEditReplyModal(reply?._id, reply?.text)"
            >
              <i class="fa-solid fa-pencil edit-icon"></i>
            </div>
            <div
              class="delete"
              title="Delete Comment"
              @click="
                commentId === reply?.commentId && handleOpenPrompt(reply?._id)
              "
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
              reply?.replyTo !== commentAuthor
                ? `@${reply?.replyTo}`
                : undefined
            }}</em
            >{{ reply?.text }}
          </p>
          <div
            class="btn-primary"
            @click="
              handleOpenReplyModal(reply?.commentId, reply?.replier?.name)
            "
          >
            <span>reply</span>
            <i class="fa-solid fa-reply"></i>
          </div>
        </div>
        <div
          class="prompt-bg"
          @click="handleNo"
          v-if="replyId === reply?._id && isPromptActive"
        >
          <div class="prompt-body" @click.stop>
            <p>Are you sure?</p>
            <div class="btns">
              <button id="yes" @click="handleYes">yes</button>
              <button id="no" @click="handleNo">no</button>
            </div>
          </div>
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
  name: "CommentReplies",
  props: ["commentId", "repliesCount", "replies", "commentAuthor"],
  components: { SpinnerAlt },

  setup(props) {
    const store = useStore();

    const replyText = ref("");
    const isPromptActive = ref(false);

    const commentIds = computed(() => store.getters.commentIds);
    const user = computed(() => store.getters.user);

    const handleAddId = () => {
      store.commit("SET_COMMENT_IDS", props.commentId);
    };

    const isRepliesActive = computed(() =>
      commentIds.value.includes(props.commentId) ? true : false
    );

    //////// ADD REPLY ////////

    const isAddReplyLoading = computed(() => store.getters.addReplyLoading);
    const isAddReplySuccess = computed(() => store.getters.addReplySuccess);
    const reply = computed(() => store.getters.reply);

    watchEffect(() => {
      if (isAddReplySuccess.value) {
        store.commit("TOGGLE_REPLY_MODAL", false);
        store.commit("SET_REPLY_DATA", {});
        store.commit("ADD_REPLY", reply.value);
        store.commit("RESET_REPLY");
      }
    });

    const handleAddReply = () => {
      store.dispatch("addReply", {
        text: replyText.value,
        commentId: props.commentId,
        replier: { _id: user.value?.id, name: user.value?.username },
        replyTo: props.commentAuthor,
      });
      replyText.value = "";
    };

    const handleOpenReplyModal = (commentId: string, replyTo: string) => {
      store.commit("SET_REPLY_DATA", {
        commentId,
        replier: { _id: user.value?.id, name: user.value?.username },
        replyTo,
      });
      store.commit("TOGGLE_REPLY_MODAL", true);
    };

    //////// DELETE REPLY ////////
    const replyId = ref("");

    const isDelReplyLoading = computed(() => store.getters.delReplyLoading);
    const isDelReplySuccess = computed(() => store.getters.delReplySuccess);

    watchEffect(() => {
      if (isDelReplySuccess.value) {
        store.commit("REMOVE_STORE_REPLY", {
          commentId: props.commentId,
          replyId: replyId.value,
        });
        store.commit("RESET_REPLY");
      }
    });

    const handleOpenPrompt = (repId: string) => {
      replyId.value = repId;
      isPromptActive.value = true;
    };

    const handleYes = () => {
      store.dispatch("deleteReply", {
        commentId: props.commentId,
        replyId: replyId.value,
      });
      isPromptActive.value = false;
    };

    const handleNo = () => {
      isPromptActive.value = false;
    };

    //////////////////////////////////////

    const handleOpenEditReplyModal = (replyId: string, text: string) => {
      store.commit("TOGGLE_EDIT_REPLY_MODAL", true);
      store.commit("SET_EDIT_REPLY_DATA", {
        commentId: props.commentId,
        replyId,
        text,
      });
    };

    return {
      handleAddId,
      commentIds,
      replyText,
      handleAddReply,
      isAddReplyLoading,
      handleOpenReplyModal,
      isRepliesActive,
      user,
      handleOpenEditReplyModal,
      handleOpenPrompt,
      isDelReplyLoading,
      replyId,
      isPromptActive,
      handleYes,
      handleNo,
    };
  },
});
</script>
