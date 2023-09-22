<template>
  <div class="listitems-config">
    <div class="marked-state" v-if="selectedListItemIds.length > 0">
      <div class="col1">
        <input
          class="checkbox"
          type="checkbox"
          :checked="selectedListItemIds.length === count"
          id="checkbox"
          @change="handleOnChange"
        />
        <label for="checkbox"
          >{{
            selectedListItemIds.length === count
              ? "unselect all"
              : "select all"
          }}!</label
        >
      </div>
      <div class="col2">
        <button
          class="del-btn"
          @click="handleOpenPrompt"
          :disabled="isDelListItemsLoading"
        >
          <spinner-alt
            :size="30"
            color="rgb(255, 155, 155)"
            v-if="isDelListItemsLoading"
            margin="0"
          />
          <i class="fa-solid fa-trash" v-else></i>
        </button>
        <span
          >delete {{ selectedListItemIds.length }}
          {{ selectedListItemIds.length > 1 ? "titles" : "title" }}!</span
        >
      </div>
    </div>

    <div class="normal-state" v-else>
      <div class="col1">
        <span
          >titles: <em>{{ count }}</em></span
        >
      </div>
      <div class="col2" @click.stop>
        <div class="search-bar">
          <input
            type="text"
            placeholder="add new title"
            v-model="searchQ"
            @keyup="handleSearch"
          />
          <div class="icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div
          class="search-result-container"
          v-if="isListItemSearchResultModalActive"
        >
          <div class="add-listitem-spinner" v-if="isAddListItemLoading">
            <spinner-alt :size="40" color="#03cca4" />
            <span>Adding...</span>
          </div>
          <div
            class="search-result-spinner"
            v-if="isGetSearchedListItemsLoading"
          >
            <spinner-alt :size="40" color="#03cca4" />
          </div>
          <p v-else-if="searchedListItems?.length === 0" id="no-result">
            no result!
          </p>
          <div
            class="search-result"
            v-for="item in searchedListItems"
            :key="item?._id"
            v-else
            @click="handleAddToList(item?._id)"
          >
            <div class="image">
              <img :src="item?.posterUrl" alt="poster" />
            </div>
            <div class="info">
              <h4 id="item-title">{{ item?.title }}</h4>
              <i id="year"
                >(
                {{
                  item?.type === "tv"
                    ? `${item?.startYear} - ${item?.endYear}`
                    : item?.startYear
                }}
                )</i
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col3">
        <div class="sort">
          <span>Sort By Date:</span>
          <div
            class="arrows"
            :title="sort === 'asc' ? 'Ascending Order' : 'Descending Order'"
            @click="handleSortArrows"
          >
            <i
              :class="[
                'fa-solid',
                'fa-up-long',
                sort === 'asc' && 'up-arrow-active',
              ]"
            ></i>
            <i
              :class="[
                'fa-solid',
                'fa-down-long',
                sort === 'desc' && 'down-arrow-active',
              ]"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "ListitemsConfig",
  props: ["count"],
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const searchQ = ref("");

    const sort = ref<string | LocationQueryValue[]>("asc");

    const qSort = computed(() => route.query.sort);
    const listId = computed(() => route.params.listId);

    const selectedListItemIds = computed(
      () => store.getters.selectedListItemIds
    );

    const listItems = computed(() => store.getters.listItems);
    const searchedListItems = computed(() => store.getters.searchedListItems);
    const isGetSearchedListItemsLoading = computed(
      () => store.getters.getSearchedListItemsLoading
    );
    const isListItemSearchResultModalActive = computed(
      () => store.getters.listItemSearchResultModal
    );

    watchEffect(() => {
      if (qSort.value) {
        sort.value = qSort.value;
      }
    });

    //////// ADD NEW ITEM TO THE LIST ////////

    watchEffect(() => {
      if (searchQ.value) {
        store.commit("TOGGLE_LISTITEM_SEARCH_RESULT_MODAL", true);
      } else {
        store.commit("TOGGLE_LISTITEM_SEARCH_RESULT_MODAL", false);
      }
    });

    const timeOut = ref<number | null>(null);

    const handleSearch = () => {
      if (timeOut.value) {
        clearTimeout(timeOut.value);
        timeOut.value = null;
      }

      timeOut.value = setTimeout(() => {
        store.dispatch("getSearchedListItems", searchQ.value);
      }, 800);
    };

    const isAddListItemLoading = computed(
      () => store.getters.isAddListItemLoading
    );
    const isAddListItemSuccess = computed(
      () => store.getters.isAddListItemSuccess
    );

    watchEffect(() => {
      if (isAddListItemSuccess.value) {
        window.location.reload();
      }
    });

    const handleAddToList = (contentId: string) => {
      if (
        listItems.value?.some((listItem: any) => listItem._id === contentId)
      ) {
        alert("already in the list");
        return;
      }
      store.dispatch("addListItem", { contentId, listId: listId.value });
    };

    ///////////////////////////////////////////////

    watchEffect(() => {
      if (sort.value) {
        router.push({
          name: "listitems",
          query: { sort: sort.value },
        });
      }

      store.dispatch("getListItems", {
        listId: listId.value,
        sort: sort.value,
      });
    });

    const handleSortArrows = () => {
      if (sort.value === "desc") {
        sort.value = "asc";
      } else {
        sort.value = "desc";
      }
    };

    const handleOnChange = () => {
      store.commit("SELECT_ALL_LISTITEMS");
    };

    //////// DELETE COMMENT ////////
    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDelListItemsLoading = computed(
      () => store.getters.delListItemsLoading
    );
    const isDelListItemsSuccess = computed(
      () => store.getters.delListItemsSuccess
    );

    watchEffect(() => {
      if (isDelListItemsSuccess.value) {
        store.commit("REMOVE_LISTITEMS", selectedListItemIds.value);
        store.commit("RESET_LISTITEM");
        store.commit("RESET_PROMPT");
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "deleteListItems" && isAnswerYes.value) {
        store.dispatch("deleteListItems", selectedListItemIds.value);
      }
    });

    const handleOpenPrompt = () => {
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "deleteListItems");
    };

    return {
      sort,
      handleSortArrows,
      selectedListItemIds,
      handleOnChange,
      handleOpenPrompt,
      isDelListItemsLoading,
      isListItemSearchResultModalActive,
      searchQ,
      handleSearch,
      searchedListItems,
      isGetSearchedListItemsLoading,
      handleAddToList,
      isAddListItemLoading,
    };
  },
});
</script>
