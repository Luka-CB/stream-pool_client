<template>
  <div class="details-container">
    <div class="spinner" v-if="isDeleteContentLoading">
      <spinner-vue :height="5" :width="5" />
      <span
        ><b>"{{ content?.title }}"</b> is Deleting...</span
      >
    </div>
    <div class="search">
      <search-bar />
    </div>
    <div class="btns" v-if="user?.isAdmin">
      <div
        class="add-btn"
        :title="`Add ${content?.type}`"
        @click="handleAddBtn"
      >
        <i class="fa-solid fa-circle-plus"></i>
      </div>
      <div
        class="edit-btn"
        :title="`Edit info for ''${content?.title
          ?.charAt(0)
          .toUpperCase()}${content?.title?.slice(1, content?.title?.length)}''`"
        @click="handleEditBtn"
      >
        <div class="edit-icon">
          <i class="fa-solid fa-pencil"></i>
        </div>
      </div>
      <div
        class="del-btn"
        :title="`Delete ''${content?.title
          ?.charAt(0)
          .toUpperCase()}${content?.title?.slice(1, content?.title?.length)}''`"
        @click="handleOpenPrompt"
      >
        <div class="del-icon">
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>
    </div>
    <content-info :data="content" :isLoading="isFetchContentLoading" />
    <video-player :url="content?.videoUrl" />
    <content-comments :contentId="content?._id" />
    <update-url-modal
      v-if="isUrlModalActive"
      :url="content?.videoUrl"
      :contentId="content?._id"
    />
    <update-poster v-if="isPosterModalActive" :contentId="content?._id" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ContentComments from "../components/details/comments/ContentComments.vue";
import ContentInfo from "../components/details/ContentInfo.vue";
import VideoPlayer from "../components/details/VideoPlayer.vue";
import SearchBar from "../components/search&sort/SearchBar.vue";
import UpdateUrlModal from "../components/details/UpdateUrlModal.vue";
import UpdatePoster from "../components/details/UpdatePoster.vue";
import SpinnerVue from "../components/Spinner.vue";

export default defineComponent({
  name: "DetailsView",
  components: {
    ContentComments,
    ContentInfo,
    VideoPlayer,
    SearchBar,
    UpdateUrlModal,
    UpdatePoster,
    SpinnerVue,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const contentId = computed(() => route.params.id);
    const content = computed(() => store.getters.fetchContent);
    const isFetchContentLoading = computed(
      () => store.getters.isFetchContentLoading
    );
    const user = computed(() => store.getters.user);
    const isUrlModalActive = computed(() => store.getters.urlModal);
    const isPosterModalActive = computed(() => store.getters.posterModal);

    store.dispatch("fetchContent", {
      contentId: contentId.value,
      userId: user.value?.id ?? "",
    });
    store.dispatch("getRating", contentId.value);

    const handleAddBtn = () =>
      router.push({ name: "create", params: { type: content.value?.type } });

    const handleEditBtn = () =>
      router.push({
        name: "updateContent",
        params: { id: contentId.value },
      });

    //////// DELETE CONTENT ////////
    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDeleteContentLoading = computed(
      () => store.getters.deleteContentLoading
    );
    const isDeleteContentSuccess = computed(
      () => store.getters.deleteContentSuccess
    );
    const deleteContentSuccessMsg = computed(
      () => store.getters.deleteContentSuccessMsg
    );

    watchEffect(() => {
      if (isDeleteContentSuccess.value) {
        store.commit("SET_SUCCESS_MSG", deleteContentSuccessMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          const routeName = content.value?.type === "tv" ? "tvs" : "movies";
          router.push({ name: routeName });
          store.commit("RESET_DELETE_CONTENT");
          store.commit("RESET_PROMPT");
        }, 2000);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "deleteContent" && isAnswerYes.value) {
        store.dispatch("deleteContent", contentId.value);
      }
    });

    const handleOpenPrompt = () => {
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "deleteContent");
    };

    return {
      content,
      isFetchContentLoading,
      handleAddBtn,
      handleEditBtn,
      user,
      isUrlModalActive,
      isPosterModalActive,
      handleOpenPrompt,
      isDeleteContentLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.details-container {
  width: 100%;
  min-height: 100vh;
  margin: 50px 0;

  .spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.56);
    z-index: 11;
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;

    span {
      margin-top: 10px;

      b {
        color: #03cca4;
        text-transform: uppercase;
        font-style: italic;
        margin-right: 10px;
      }
    }
  }

  .search {
    margin-bottom: 70px;
  }

  .btns {
    margin-bottom: 100px;
    margin-right: 40px;
    display: flex;
    justify-content: flex-end;

    .add-btn,
    .edit-btn,
    .del-btn {
      border: 2px solid rgb(200, 200, 200);
      width: 55px;
      height: 55px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;

      .fa-circle-plus {
        font-size: 2.8rem;
      }
      .edit-icon,
      .del-icon {
        background-color: rgb(200, 200, 200);
        width: 45px;
        height: 45px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .fa-pencil,
        .fa-trash {
          font-size: 1.4rem;
          color: black;
        }
      }

      &:hover {
        border-color: aliceblue;
        .fa-circle-plus {
          font-size: 3.3rem;
          color: aliceblue;
        }
        .edit-icon,
        .del-icon {
          width: 55px;
          height: 55px;
          background-color: aliceblue;

          .fa-pencil,
          .fa-trash {
            font-size: 1.6rem;
            color: black;
          }
        }
      }
    }
  }
}
</style>
