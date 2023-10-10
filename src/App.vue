<template>
  <div class="app-container" @click="handleCloseModals">
    <error-msg v-if="isErrMsgActive" />
    <success-msg v-if="isSuccessMsgActive" />
    <main-navigation
      :home-page="isHomePage"
      v-if="excludeRoute !== routeName"
    />
    <mobile-navigation v-if="isMobileNavActive" />
    <router-view />

    <rating-modal v-if="isRatingModalActive" />
    <list-modal v-if="isListModalActive" />
    <reply-modal v-if="isReplyModalActive" />
    <edit-comment-modal v-if="isEditCommentModalActive" />
    <edit-reply-modal v-if="isEditReplyModalActive" />
    <user-comment-replies v-if="isUserCommentRepliesModalActive" />
    <create-list-modal v-if="isCreateListModalActive" />
    <update-list-modal v-if="isUpdListModalActive" />
    <prompt-modal v-if="isPromptOpen" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "@vue/reactivity";
import { computed, watchEffect } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import MainNavigation from "./components/navigation/MainNavigation.vue";
import MobileNavigation from "./components/navigation/MobileNavigation.vue";
import { useStore } from "vuex";
import ErrorMsg from "./components/ErrorMsg.vue";
import SuccessMsg from "./components/SuccessMsg.vue";
import RatingModal from "./components/RatingModal.vue";
import ListModal from "./components/ListModal.vue";
import ReplyModal from "./components/details/comments/ReplyModal.vue";
import EditCommentModal from "./components/details/comments/EditCommentModal.vue";
import EditReplyModal from "./components/details/comments/EditReplyModal.vue";
import UserCommentReplies from "./components/userPages/UserCommentReplies.vue";
import CreateListModal from "./components/userPages/CreateListModal.vue";
import UpdateListModal from "./components/userPages/UpdateListModal.vue";
import PromptModal from "./components/PromptModal.vue";
import { useWindowWidth } from "./composables/windowResize";

export default defineComponent({
  name: "App",
  components: {
    MainNavigation,
    MobileNavigation,
    ErrorMsg,
    SuccessMsg,
    RatingModal,
    ListModal,
    ReplyModal,
    EditCommentModal,
    EditReplyModal,
    UserCommentReplies,
    CreateListModal,
    UpdateListModal,
    PromptModal,
  },

  setup() {
    const isHomePage = ref(false);

    const route = useRoute();
    const store = useStore();

    const isErrMsgActive = computed(() => store.getters.isErrMsgActive);
    const isSuccessMsgActive = computed(() => store.getters.isSuccessMsgActive);
    const isUrlModalActive = computed(() => store.getters.urlModal);
    const isPosterModalActive = computed(() => store.getters.posterModal);
    const isRatingModalActive = computed(() => store.getters.ratingModal);
    const isListModalActive = computed(() => store.getters.listModal);
    const isReplyModalActive = computed(() => store.getters.replyModal);
    const isEditCommentModalActive = computed(
      () => store.getters.editCommentModal
    );
    const isEditReplyModalActive = computed(() => store.getters.editReplyModal);
    const isUserCommentRepliesModalActive = computed(
      () => store.getters.userCommentRepliesModal
    );
    const isCreateListModalActive = computed(
      () => store.getters.createListModal
    );
    const isUpdListModalActive = computed(() => store.getters.updListModal);
    const isPromptOpen = computed(() => store.getters.isPromptOpen);
    const isMobileNavActive = computed(() => store.getters.mobileNav);
    const isMobileProfileNavActive = computed(
      () => store.getters.profileMobileNav
    );

    watchEffect(() => {
      if (isErrMsgActive.value) {
        setTimeout(() => store.commit("TOGGLE_ERR_MSG", false), 2000);
      }

      if (isSuccessMsgActive.value) {
        setTimeout(() => store.commit("TOGGLE_SUCCESS_MSG", false), 2000);
      }
    });

    watchEffect(() => {
      if (
        isUrlModalActive.value ||
        isPosterModalActive.value ||
        isRatingModalActive.value ||
        isListModalActive.value ||
        isReplyModalActive.value ||
        isEditCommentModalActive.value ||
        isEditReplyModalActive.value ||
        isUserCommentRepliesModalActive.value ||
        isCreateListModalActive.value ||
        isUpdListModalActive.value ||
        isPromptOpen.value ||
        isMobileNavActive.value ||
        isMobileProfileNavActive.value
      ) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    });

    const routeName = computed(() => route.name);
    const excludeRoute = computed(() => store.getters.excludeRoute);

    watchEffect(() => {
      if (route.name === "home") {
        isHomePage.value = true;
      } else {
        isHomePage.value = false;
      }
    });

    const handleCloseModals = () => {
      store.commit("TOGGLE_USER_OPTION", false);
      store.commit("TOGGLE_SEARCH_RESULT", false);
      store.commit("TOGGLE_LISTITEM_SEARCH_RESULT_MODAL", false);
    };

    const { windowWidth } = useWindowWidth();

    watchEffect(() => {
      if (route.name !== "home" && windowWidth.value <= 900) {
        store.commit("TOGGLE_NAV_MENU_ICON", true);
      } else {
        store.commit("TOGGLE_NAV_MENU_ICON", false);
        store.commit("TOGGLE_MOBILE_NAV", false);
      }
    });

    watchEffect(() => {
      if (route.name === "home" && windowWidth.value <= 600) {
        store.commit("TOGGLE_NAV_MENU_ICON", true);
      } else {
        store.commit("TOGGLE_NAV_MENU_ICON", false);
        store.commit("TOGGLE_MOBILE_NAV", false);
      }
    });

    return {
      isHomePage,
      handleCloseModals,
      excludeRoute,
      routeName,
      isErrMsgActive,
      isSuccessMsgActive,
      isRatingModalActive,
      isListModalActive,
      isReplyModalActive,
      isEditCommentModalActive,
      isEditReplyModalActive,
      isUserCommentRepliesModalActive,
      isCreateListModalActive,
      isUpdListModalActive,
      isPromptOpen,
      isMobileNavActive,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
