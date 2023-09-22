<template>
  <div class="profile-container">
    <go-back :route="prevRoute" />
    <div class="home-icon" title="Back to home page" @click="handleNavigation">
      <i class="fa-solid fa-house-chimney-window"></i>
    </div>

    <user-info />
    <rated-content />
    <fav-content />
    <user-comments />
    <user-lists />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import GoBack from "../../components/GoBack.vue";
import UserInfo from "../../components/userPages/profileView/UserInfo.vue";
import RatedContent from "../../components/userPages/profileView/RatedContent.vue";
import FavContent from "../../components/userPages/profileView/FavContent.vue";
import UserComments from "../../components/userPages/profileView/UserComments.vue";
import UserLists from "../../components/userPages/profileView/UserLists.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "ProfileView",
  components: {
    GoBack,
    UserInfo,
    RatedContent,
    FavContent,
    UserComments,
    UserLists,
  },

  setup() {
    const store = useStore();

    const router = useRouter();
    const route = useRoute();

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
    };
  },
});
</script>
