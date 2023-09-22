<template>
  <div class="update-container">
    <go-back />
    <div class="home" title="Back to home page" @click="handleNavigation">
      <i class="fa-solid fa-house-chimney-window"></i>
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

  .home {
    position: absolute;
    top: 0;
    left: 5%;
    margin-top: 5px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.1s ease-in-out;
    cursor: pointer;

    .fa-house-chimney-window {
      color: #018d8a;
      font-size: 2rem;
      transition: 0.2s ease-in-out;
    }

    &:hover {
      background: #01555489;

      .fa-house-chimney-window {
        color: #01cbc7;
      }
    }
  }

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
