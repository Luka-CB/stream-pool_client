<template>
  <div class="update-container">
    <div class="icon-btns">
      <go-back />
      <div
        class="home-icon"
        title="Back to home page"
        @click="handleNavigation"
      >
        <i class="fa-solid fa-house-chimney-window"></i>
      </div>
    </div>
    <div class="spinner" v-if="isUpdateContentLoading">
      <spinner-vue :width="6" :height="6" />
    </div>
    <div class="form">
      <update-form :contentType="content?.type" :content="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from "@vueuse/head";
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import UpdateForm from "../components/content/UpdateForm.vue";
import GoBack from "../components/GoBack.vue";
import SpinnerVue from "../components/Spinner.vue";

export default defineComponent({
  name: "UpdateContentView",
  components: { GoBack, UpdateForm, SpinnerVue },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const contentId = computed(() => route.params.id);
    const content = computed(() => store.getters.fetchContent);
    const isUpdateContentLoading = computed(
      () => store.getters.isUpdateContentLoading
    );
    const isUpdateContentSuccess = computed(
      () => store.getters.isUpdateContentSuccess
    );
    const updateContentSuccessMsg = computed(
      () => store.getters.updateContentSuccessMsg
    );

    store.dispatch("fetchContent", contentId.value);

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    watchEffect(() => {
      if (isUpdateContentSuccess.value) {
        store.commit("SET_SUCCESS_MSG", updateContentSuccessMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.commit("RESET_UPDATE_CONTENT");
        }, 2000);
      }
    });

    useHead({
      title: "Update " + content.value?.title,
    });

    return {
      handleNavigation,
      content,
      isUpdateContentLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.update-container {
  min-height: 80vh;
  padding: 50px 0;
  margin-top: 20px;
  position: relative;
  transition: all 0.2s ease-in-out;

  .spinner {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.729);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .form {
    margin: 50px 0;
  }
}
</style>
