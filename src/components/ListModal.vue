<template>
  <div class="list-modal-bg" @click="handleCloseListModal">
    <div class="list-modal-container" @click.stop>
      <i class="fa-solid fa-circle-xmark" @click="handleCloseListModal"></i>
      <div class="header">
        <h3>
          add " <span>{{ listModalData.title }}</span> " to the list
        </h3>
      </div>
      <div class="body">
        <p id="err-msg" v-if="errorMsg">{{ errorMsg }}</p>
        <p id="success-msg" v-if="successMsg">{{ successMsg }}</p>
        <div class="spinner" v-if="isGetListsLoading">
          <spinner-vue :width="4" :height="4" />
        </div>
        <p id="no-lists" v-else-if="lists.length === 0">
          no lists! create new list
        </p>
        <div
          v-else
          v-for="list in lists"
          :key="list._id"
          :title="
            list.isInTheList
              ? `${listModalData.title.toUpperCase()} is in the list. Click to remove!`
              : `Click to add ${listModalData.title.toUpperCase()} to the list!`
          "
          :class="
            editListState.listId === list._id
              ? 'list-edit-state'
              : list.isInTheList
              ? 'list-active'
              : 'list'
          "
          @click="handleAddItemToTheList(list._id)"
        >
          <div class="col1">
            <div class="icon">
              <spinner-alt v-if="isAddListItemLoading && list._id === lid" />
              <div class="folder" v-else>
                <i class="fa-solid fa-folder-open" v-if="list.isInTheList"></i>
                <i class="fa-regular fa-folder" v-else></i>
              </div>
            </div>
            <h3 id="list-name">{{ list.title }}</h3>
          </div>
          <div class="col2">
            <div
              class="edit"
              title="Edit List"
              @click.stop="handleEditState(list._id, list.title)"
            >
              <i class="fa-solid fa-pencil edit-icon"></i>
            </div>
            <div
              class="delete"
              title="Delete List"
              @click.stop="handleDeleteList(list._id)"
            >
              <spinner-alt
                margin="0"
                color="#ff1111"
                v-if="listId === list._id && isDelListLoading"
              />
              <i class="fa-solid fa-trash del-icon" v-else></i>
            </div>
          </div>
        </div>
      </div>
      <div :class="editListState.mode ? 'edit-state-footer' : 'footer'">
        <div class="edit-list" v-if="editListState.mode">
          <input
            type="text"
            placeholder="update list name"
            v-model="editListName"
            @keyup.enter="handleEditList"
          />
          <button
            class="btn-outline upd-btn"
            @click="handleEditList"
            :disabled="isUpdListLoading"
          >
            <spinner-alt v-if="isUpdListLoading" :size="22" color="#edc531" />
            <span>{{ isUpdListLoading ? "updating..." : "update" }}</span>
          </button>
          <button
            class="btn-outline cancel-btn"
            @click="handleCancelEditState"
            :disabled="isUpdListLoading"
          >
            cancel
          </button>
        </div>
        <div class="create-list" v-else>
          <input
            type="text"
            placeholder="enter name for the list"
            v-model="listName"
            @keyup.enter="handleAddList"
          />
          <button
            class="btn-outline create-btn"
            @click="handleAddList"
            :disabled="!listName || isCreateLoading"
          >
            <spinner-alt
              v-if="isCreateLoading"
              :size="22"
              color="rgb(2, 132, 54)"
            />
            <span>{{ isCreateLoading ? "creating..." : "create" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "./SpinnerAlt.vue";
import SpinnerVue from "./Spinner.vue";

export default defineComponent({
  name: "ListModal",
  components: { SpinnerAlt, SpinnerVue },

  setup() {
    const store = useStore();

    const listName = ref("");

    const editListName = ref("");
    const editListState = ref({ mode: false, listId: "" });

    const listModalData = computed(() => store.getters.listModalData);

    const lists = computed(() => store.getters.lists);
    const errorMsg = computed(() => store.getters.listErrorMsg);
    const successMsg = computed(() => store.getters.listSuccessMsg);

    watchEffect(() => {
      if (errorMsg.value) {
        setTimeout(() => store.commit("SET_LIST_ERROR_MSG", ""), 1500);
      }

      if (successMsg.value) {
        setTimeout(() => store.commit("SET_LIST_SUCCESS_MSG", ""), 1500);
      }
    });

    ////////// CREATE LIST //////////

    const isCreateLoading = computed(() => store.getters.createListLoading);
    const isCreateSuccess = computed(() => store.getters.createListSuccess);

    watchEffect(() => {
      if (isCreateSuccess.value) {
        setTimeout(() => {
          store.commit("RESET_LIST");
          store.dispatch("getLists", listModalData.value.contentId);
        }, 1500);
      }
    });

    const handleAddList = () => {
      store.dispatch("createList", listName.value);
      listName.value = "";
    };

    ////////// GET LISTS //////////

    const isGetListsLoading = computed(() => store.getters.getListsLoading);

    store.dispatch("getLists", listModalData.value.contentId);

    ////////// ADD LIST ITEM //////////
    const lid = ref("");

    const isAddListItemLoading = computed(
      () => store.getters.isAddListItemLoading
    );
    const isAddListItemSuccess = computed(
      () => store.getters.isAddListItemSuccess
    );

    watchEffect(() => {
      if (isAddListItemSuccess.value) {
        store.commit("CHANGE_LIST_ITEM_STATUS", lid.value);
        store.commit("RESET_LISTITEM");
      }
    });

    const handleAddItemToTheList = (listId: string) => {
      lid.value = listId;

      store.dispatch("addListItem", {
        contentId: listModalData.value.contentId,
        listId,
      });
    };

    ////////// UPDATE LIST //////////

    const isUpdListLoading = computed(() => store.getters.updListLoading);
    const isUpdListSuccess = computed(() => store.getters.updListSuccess);

    watchEffect(() => {
      if (isUpdListSuccess.value) {
        setTimeout(() => {
          store.commit("RESET_LIST");
          store.dispatch("getLists", listModalData.value.contentId);
          editListState.value = {
            mode: false,
            listId: "",
          };
        }, 1500);
      }
    });

    const handleEditState = (listId: string, listName: string) => {
      editListName.value = listName;
      editListState.value = {
        mode: true,
        listId,
      };
    };

    const handleCancelEditState = () => {
      editListState.value = { mode: false, listId: "" };
    };

    const handleEditList = () => {
      store.dispatch("updateList", {
        title: editListName.value,
        listId: editListState.value.listId,
      });
    };

    ////////// DELETE LIST //////////
    const listId = ref("");

    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isDelListLoading = computed(() => store.getters.delListLoading);
    const isDelListSuccess = computed(() => store.getters.delListSuccess);

    watchEffect(() => {
      if (isDelListSuccess.value) {
        setTimeout(() => {
          store.commit("RESET_LIST");
          store.dispatch("getLists", listModalData.value.contentId);
          store.commit("RESET_PROMPT");
        }, 1500);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "listModal" && isAnswerYes.value) {
        store.dispatch("deleteList", listId.value);
      }
    });

    const handleDeleteList = (liId: string) => {
      if (!editListState.value.mode) {
        listId.value = liId;
        store.commit("TOGGLE_PROMPT", true);
        store.commit("SET_PROMPT_KEYWORD", "listModal");
      }
    };

    //////////////////////////////////

    const handleCloseListModal = () => {
      store.commit("TOGGLE_LIST_MODAL", false);
      store.commit("SET_LIST_MODAL_DATA", {});
      store.commit("RESET_PROMPT");
    };

    return {
      listName,
      handleAddList,
      lists,
      errorMsg,
      successMsg,
      isCreateLoading,
      isGetListsLoading,
      handleCloseListModal,
      listModalData,
      isAddListItemLoading,
      handleAddItemToTheList,
      lid,
      editListName,
      handleEditState,
      handleCancelEditState,
      handleEditList,
      isUpdListLoading,
      editListState,
      handleDeleteList,
      isDelListLoading,
      listId,
    };
  },
});
</script>
