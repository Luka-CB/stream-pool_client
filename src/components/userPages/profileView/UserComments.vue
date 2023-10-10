<template>
  <div class="user-comments-container">
    <h2 id="title">your comments</h2>
    <div class="divider"></div>
    <div class="user-comments" :style="commentsWrapperStyle">
      <div class="spinner" v-if="isGetSomeUserCommentsLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <div class="warning" v-else-if="userComments?.length === 0">
        <p>you have not left any comment yet!</p>
      </div>
      <profile-comment-card
        v-for="comment in userComments"
        :key="comment?._id"
        :comment="comment"
        v-else
      />
    </div>
    <div class="profile-link" v-if="userComments?.length > 0">
      <h4 id="link-text" @click="handleNavigateToComments">
        see all
        <em>{{ someUserCommentsCount }}</em>
        comments
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerVue from "../../Spinner.vue";
import ProfileCommentCard from "./ProfileCommentCard.vue";

export default defineComponent({
  name: "UserComments",
  components: { SpinnerVue, ProfileCommentCard },

  setup() {
    const store = useStore();

    const router = useRouter();
    const route = useRoute();

    //////// GET COMMENTS ////////

    const userComments = computed(() => store.getters.someUserComments);
    const someUserCommentsCount = computed(
      () => store.getters.someUserCommentsCount
    );
    const isGetSomeUserCommentsLoading = computed(
      () => store.getters.getSomeUserCommentsLoading
    );

    store.dispatch("getSomeUserComments");

    //////////////////////////////////////
    const commentsWrapperStyle = ref({});

    watchEffect(() => {
      if (userComments.value?.length <= 2) {
        commentsWrapperStyle.value = { justifyContent: "flex-start" };
      } else {
        commentsWrapperStyle.value = { justifyContent: "space-between" };
      }
    });

    const handleNavigateToComments = () => {
      router.push({ name: "comments" });

      const paramName = computed(() => route.params.name);
      store.commit("SET_PREV_ROUTE", {
        name: "profile",
        params: { name: paramName.value },
      });
    };

    //////// DELETE COMMENT ////////

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const promptId = computed(() => store.getters.promptId);
    const isDelCommentSuccess = computed(() => store.getters.delCommentSuccess);

    watchEffect(() => {
      if (isDelCommentSuccess.value) {
        store.commit("SET_SUCCESS_MSG", "Deleted Successfully!");
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.dispatch("getSomeUserComments");
          store.commit("RESET_COMMENTS");
          store.commit("RESET_PROMPT");
        }, 2000);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "profileCommentCard" && isAnswerYes.value) {
        store.dispatch("deleteComment", promptId.value);
      }
    });

    return {
      userComments,
      commentsWrapperStyle,
      someUserCommentsCount,
      isGetSomeUserCommentsLoading,
      handleNavigateToComments,
    };
  },
});
</script>
