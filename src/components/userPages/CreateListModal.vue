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
        <span>{{ isLoading ? "Creating..." : "Create" }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "CreateListModal",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const listName = ref("");

    const isLoading = computed(() => store.getters.createListLoading);
    const isSuccess = computed(() => store.getters.createListSuccess);
    const successMsg = computed(() => store.getters.listSuccessMsg);

    const handleCloseModal = () =>
      store.commit("TOGGLE_CREATE_LIST_MODAL", false);

    watchEffect(() => {
      if (isSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.commit("RESET_LIST");
          handleCloseModal();
          store.dispatch("getSomeLists");
          store.dispatch("getUserLists");
        }, 2000);
      }
    });

    const handleSubmit = () => store.dispatch("createList", listName.value);

    return {
      listName,
      handleCloseModal,
      isLoading,
      handleSubmit,
    };
  },
});
</script>
