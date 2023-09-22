<template>
  <div class="ratings-container">
    <go-back :route="prevRoute" />
    <div class="home-icon" title="Back to home page" @click="handleNavigation">
      <i class="fa-solid fa-house-chimney-window"></i>
    </div>
    <div class="nav-wrapper">
      <profile-nav />
    </div>
    <div class="rated-contents-wrapper">
      <div class="spinner" v-if="isGetRatedContentLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <p id="no-content" v-else-if="ratedContents?.length === 0">
        you haven't rated anything yet!
      </p>
      <rated-content-config :count="ratedContentCount" />
      <div class="cards-wrapper">
        <rated-content-card
          v-for="content in ratedContents"
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
import GoBack from "../../components/GoBack.vue";
import RatedContentCard from "../../components/userPages/ratingsView/RCCard.vue";
import RatedContentConfig from "../../components/userPages/ratingsView/RatedContentConfig.vue";
import { useStore } from "vuex";
import SpinnerVue from "../../components/Spinner.vue";
import ProfileNav from "../../components/userPages/ProfileNav.vue";

export default defineComponent({
  components: {
    GoBack,
    RatedContentConfig,
    RatedContentCard,
    SpinnerVue,
    ProfileNav,
  },
  name: "RatingsView",

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const prevRoute = computed(() => store.getters.prevRoute);

    const ratedContents = computed(() => store.getters.ratedContent);
    const ratedContentCount = computed(() => store.getters.ratedContentCount);
    const isGetRatedContentLoading = computed(
      () => store.getters.getRatedContentLoading
    );

    store.dispatch("getRatedContent", {});

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    return {
      handleNavigation,
      ratedContents,
      ratedContentCount,
      isGetRatedContentLoading,
      prevRoute,
    };
  },
});
</script>
