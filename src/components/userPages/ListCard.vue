<template>
  <div
    :class="routeName === 'lists' ? 'list-card' : 'profile-list-card'"
    @click="handleNavigation(list?._id)"
  >
    <div class="list-cover">
      <img
        src="@/assets/images/list-img.webp"
        alt="cover image"
        v-if="!list?.cover"
      />
      <img :src="list?.cover" alt="cover image" v-else />
    </div>
    <div class="list-info">
      <div class="row1">
        <h3
          id="title"
          :title="list?.title?.length >= 20 ? list?.title : undefined"
        >
          {{
            list?.title?.length <= 19
              ? list?.title
              : list?.title?.substring(0, 19) + "..."
          }}
        </h3>
        <h4 id="items-count">
          List Items: <em>( {{ list?.listItems }} )</em>
        </h4>
        <h5 id="cr-date">
          Created: <em>( {{ list?.createdAt }} ago )</em>
        </h5>
        <h5 id="upd-date">
          Updated: <em>( {{ list?.updatedAt }} )</em>
        </h5>
      </div>
      <div class="row2">
        <div
          class="edit"
          title="Edit List"
          @click.stop="handleOpenUpdListModal(list?._id, list?.title)"
        >
          <i class="fa-solid fa-pencil"></i>
        </div>
        <div
          class="delete"
          title="Delete List"
          @click.stop="handleOpenPrompt(list?._id)"
        >
          <spinner-alt
            color="#d50000"
            :size="24"
            v-if="listId === list?._id && isDelListLoading"
          />
          <i class="fa-solid fa-trash" v-else></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "ListCard",
  props: ["list"],
  components: { SpinnerAlt },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const routeName = computed(() => route.name);

    const handleOpenUpdListModal = (listId: string, listTitle: string) => {
      store.commit("SET_UPD_LIST_MODAL_DATA", {
        listId,
        listTitle,
        routeName: routeName.value,
      });
      store.commit("TOGGLE_UPD_LIST_MODAL", true);
    };

    //////// DELETE LIST ////////
    const listId = ref("");

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDelListLoading = computed(() => store.getters.delListLoading);
    const isDelListSuccess = computed(() => store.getters.delListSuccess);
    const successMsg = computed(() => store.getters.listSuccessMsg);

    watchEffect(() => {
      if (isDelListSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.commit("RESET_LIST");
          store.commit("RESET_PROMPT");
          store.dispatch("getSomeLists");
          store.dispatch("getUserLists");
        }, 2000);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "deleteListCard" && isAnswerYes.value) {
        store.dispatch("deleteList", listId.value);
      }
    });

    const handleOpenPrompt = (liId: string) => {
      listId.value = liId;
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "deleteListCard");
    };

    const handleNavigation = (liId: string) => {
      router.push({ name: "listitems", params: { listId: liId } });

      const user = computed(() => store.getters.user);
      const currentRouteName = computed(() => route.name);

      const param =
        currentRouteName.value === "profile"
          ? { name: user.value?.username }
          : {};

      store.commit("SET_PREV_ROUTE", {
        name: currentRouteName.value,
        params: param,
      });
    };

    return {
      handleOpenUpdListModal,
      isDelListLoading,
      handleOpenPrompt,
      listId,
      handleNavigation,
      routeName,
    };
  },
});
</script>
