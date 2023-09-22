<template>
  <div class="comments-view-container">
    <go-back :route="prevRoute" />
    <div class="home-icon" title="Back to home page" @click="handleNavigation">
      <i class="fa-solid fa-house-chimney-window"></i>
    </div>

    <div class="nav-wrapper">
      <profile-nav />
    </div>
    <div class="comments-wrapper">
      <div class="spinner" v-if="isGetUserCommentsLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <p id="no-content" v-else-if="userComments?.length === 0">
        no favorite content!
      </p>
      <comments-config :count="userCommentsCount" />
      <div class="cards-wrapper">
        <com-card
          v-for="comment in userComments"
          :key="comment?._id"
          :comment="comment"
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
import CommentsConfig from "../../components/userPages/commentsView/CommentsConfig.vue";
import ProfileNav from "../../components/userPages/ProfileNav.vue";
import ComCard from "../../components/userPages/commentsView/ComCard.vue";
import SpinnerVue from "../../components/Spinner.vue";

export default defineComponent({
  components: { GoBack, ProfileNav, CommentsConfig, ComCard, SpinnerVue },
  name: "CommentsView",

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const userComments = computed(() => store.getters.userComments);
    const userCommentsCount = computed(() => store.getters.userCommentsCount);
    const isGetUserCommentsLoading = computed(
      () => store.getters.getUserCommentsLoading
    );

    store.dispatch("getUserComments");

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const prevRoute = computed(() => store.getters.prevRoute);

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    return {
      handleNavigation,
      prevRoute,
      userComments,
      userCommentsCount,
      isGetUserCommentsLoading,
    };
  },
});
</script>
