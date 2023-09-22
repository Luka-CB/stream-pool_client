<template>
  <div class="create-list-modal-bg" @click="handleCloseModal">
    <div class="create-list-modal-container" @click.stop>
      <input type="text" placeholder="enter list name" v-model="listName" />
      <button
        class="btn-primary cr-btn"
        :disabled="!listName || isLoading"
        @click="handleSubmit"
      >
        <spinner-alt color="#03cca4" :size="24" v-if="isLoading" />
        <span>{{ isLoading ? "Updating..." : "Update" }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "UpdateListModal",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();
    const route = useRoute();

    const listName = ref("");

    const updListModalData = computed(() => store.getters.updListModalData);

    const isLoading = computed(() => store.getters.updListLoading);
    const isSuccess = computed(() => store.getters.updListSuccess);
    const successMsg = computed(() => store.getters.listSuccessMsg);

    watchEffect(() => {
      if (updListModalData.value.listTitle) {
        listName.value = updListModalData.value.listTitle;
      }
    });

    const handleCloseModal = () => {
      store.commit("TOGGLE_UPD_LIST_MODAL", false);
      store.commit("SET_UPD_LIST_MODAL_DATA", {});
    };

    const listId = computed(() => route.params.listId);

    watchEffect(() => {
      if (isSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.commit("RESET_LIST");
          handleCloseModal();
          store.dispatch("getSomeLists");
          store.dispatch("getUserLists");
          listId.value &&
            store.dispatch("getListItems", {
              listId: listId.value,
              sort: "asc",
            });
        }, 2000);
      }
    });

    const handleSubmit = () =>
      store.dispatch("updateList", {
        title: listName.value,
        listId: updListModalData.value.listId,
      });

    return {
      listName,
      handleCloseModal,
      isLoading,
      handleSubmit,
    };
  },
});
</script>
