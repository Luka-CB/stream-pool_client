<template>
  <div class="favorites-container">
    <div class="icon-btns">
      <go-back :route="prevRoute" />
      <div
        class="home-icon"
        title="Back to home page"
        @click="handleNavigation"
      >
        <i class="fa-solid fa-house-chimney-window"></i>
      </div>
    </div>
    <profile-nav />
    <div class="fav-contents-wrapper">
      <div class="spinner" v-if="isGetFavContentLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <p id="no-content" v-else-if="favContent?.length === 0">
        no favorite content!
      </p>
      <fav-content-config :count="favContentCount" />
      <div class="cards-wrapper">
        <fav-content-card
          v-for="content in favContent"
          :key="content"
          :content="content"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import GoBack from "../../components/GoBack.vue";
import FavContentConfig from "../../components/userPages/favsView/FavContentConfig.vue";
import FavContentCard from "../../components/userPages/favsView/FCCard.vue";
import ProfileNav from "../../components/navigation/ProfileNav.vue";
import SpinnerVue from "../../components/Spinner.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    GoBack,
    FavContentConfig,
    FavContentCard,
    SpinnerVue,
    ProfileNav,
  },
  name: "FavoritesView",

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const prevRoute = computed(() => store.getters.prevRoute);

    const favContent = computed(() => store.getters.favContent);
    const favContentCount = computed(() => store.getters.favContentCount);
    const isGetFavContentLoading = computed(
      () => store.getters.getFavContentLoading
    );

    store.dispatch("getFavContent");

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    useHead({
      title: computed(() => `Favorite titles | ${favContentCount.value ?? 0}`),
    });

    return {
      handleNavigation,
      favContent,
      favContentCount,
      isGetFavContentLoading,
      prevRoute,
    };
  },
});
</script>
