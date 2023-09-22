<template>
  <div class="lists-container">
    <go-back :route="prevRoute" />
    <div class="home-icon" title="Back to home page" @click="handleNavigation">
      <i class="fa-solid fa-house-chimney-window"></i>
    </div>

    <div class="nav-wrapper">
      <profile-nav />
    </div>
    <div class="lists-wrapper">
      <div class="spinner" v-if="isGetListsLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <p id="no-content" v-else-if="lists?.length === 0">no lists!</p>
      <lists-config :count="listsCount" />
      <div class="cards-wrapper">
        <list-card v-for="list in lists" :key="list?._id" :list="list" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import GoBack from "../../components/GoBack.vue";
import ListCard from "../../components/userPages/ListCard.vue";
import ListsConfig from "../../components/userPages/listsView/ListsConfig.vue";
import ProfileNav from "../../components/userPages/ProfileNav.vue";
import SpinnerVue from "../../components/Spinner.vue";

export default defineComponent({
  components: { GoBack, ProfileNav, ListsConfig, ListCard, SpinnerVue },
  name: "ListsView",

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const lists = computed(() => store.getters.userLists);
    const listsCount = computed(() => store.getters.listsCount);
    const isGetListsLoading = computed(() => store.getters.getUserListsLoading);

    store.dispatch("getUserLists");

    const prevRoute = computed(() => store.getters.prevRoute);

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    return {
      handleNavigation,
      prevRoute,
      lists,
      listsCount,
      isGetListsLoading,
    };
  },
});
</script>
