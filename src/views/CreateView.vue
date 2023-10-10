<template>
  <div class="create-container">
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
    <div class="spinner" v-if="isLoading">
      <spinner-vue :width="6" :height="6" />
    </div>
    <content-poster :contentType="contentType" />
    <content-form :contentType="contentType" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ContentForm from "../components/content/CreateForm.vue";
import ContentPoster from "../components/content/ContentPoster.vue";
import GoBack from "../components/GoBack.vue";
import SpinnerVue from "../components/Spinner.vue";

export default defineComponent({
  name: "CreateView",
  components: { ContentPoster, ContentForm, GoBack, SpinnerVue },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const contentType = computed(() => route.fullPath.split("/")[2]);
    const imgError = computed(() => store.getters.imgError);
    const isLoading = computed(() => store.getters.isAddContentLoading);

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    watchEffect(() => {
      if (imgError.value) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    });

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    return {
      contentType,
      handleNavigation,
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.create-container {
  min-height: 80vh;
  padding: 50px 0;
  // margin-top: 20px;
  position: relative;
  width: 100%;

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
}
</style>
