<template>
  <div class="user-lists-container">
    <div class="user-lists-header">
      <h2 id="title">your lists</h2>
      <div class="add-btn" @click="handleOpenCreateListModal">
        <i class="fa-solid fa-circle-plus"></i>
        <span>add new list</span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="user-lists" :style="userListsWrapperStyle">
      <div class="spinner" v-if="isGetSomeListsLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <div class="warning" v-else-if="lists?.length === 0">
        <p>no lists to show!</p>
      </div>
      <list-card v-for="list in lists" :key="list" :list="list" v-else />
    </div>
    <div class="profile-link" v-if="lists?.length > 0">
      <h4 id="link-text" @click="handleNavigateToLists">
        see all
        <em>{{ listsCount }}</em>
        lists
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import ListCard from "../ListCard.vue";
import SpinnerVue from "../../Spinner.vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "UserLists",
  components: { ListCard, SpinnerVue },

  setup() {
    const store = useStore();

    const router = useRouter();
    const route = useRoute();

    const lists = computed(() => store.getters.someLists);
    const listsCount = computed(() => store.getters.listsCount);
    const isGetSomeListsLoading = computed(
      () => store.getters.getSomeListsLoading
    );

    store.dispatch("getSomeLists");

    const userListsWrapperStyle = ref({});

    watchEffect(() => {
      if (lists.value?.length <= 2) {
        userListsWrapperStyle.value = { justifyContent: "flex-start" };
      } else {
        userListsWrapperStyle.value = { justifyContent: "space-between" };
      }
    });

    const handleOpenCreateListModal = () =>
      store.commit("TOGGLE_CREATE_LIST_MODAL", true);

    const handleNavigateToLists = () => {
      router.push({ name: "lists" });

      const paramName = computed(() => route.params.name);
      store.commit("SET_PREV_ROUTE", {
        name: "profile",
        params: { name: paramName.value },
      });
    };

    //////// DELETE LIST ////////

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const promptId = computed(() => store.getters.promptId);
    const isDelListSuccess = computed(() => store.getters.delListSuccess);
    const successMsg = computed(() => store.getters.listSuccessMsg);

    watchEffect(() => {
      if (isDelListSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.dispatch("getSomeLists");
          store.commit("RESET_LIST");
          store.commit("RESET_PROMPT");
        }, 2000);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "deleteListCard" && isAnswerYes.value) {
        store.dispatch("deleteList", promptId.value);
      }
    });

    return {
      userListsWrapperStyle,
      lists,
      listsCount,
      isGetSomeListsLoading,
      handleOpenCreateListModal,
      handleNavigateToLists,
    };
  },
});
</script>
