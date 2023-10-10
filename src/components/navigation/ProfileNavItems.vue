<template>
  <nav class="profile-nav">
    <div
      :class="routeName === 'profile' ? 'nav-item-active' : 'nav-item'"
      @click="handleNavigation('profile')"
    >
      <span id="nav-link">profile</span>
    </div>
    <div
      :class="routeName === 'account' ? 'nav-item-active' : 'nav-item'"
      @click="handleNavigation('account')"
    >
      <span id="nav-link">account</span>
    </div>
    <div
      :class="routeName === 'lists' ? 'nav-item-active' : 'nav-item'"
      @click="handleNavigation('lists')"
    >
      <span id="nav-link">lists</span>
    </div>
    <div
      :class="routeName === 'favorites' ? 'nav-item-active' : 'nav-item'"
      @click="handleNavigation('favorites')"
    >
      <span id="nav-link">favorites</span>
    </div>
    <div
      :class="routeName === 'ratings' ? 'nav-item-active' : 'nav-item'"
      @click="handleNavigation('ratings')"
    >
      <span id="nav-link">ratings</span>
    </div>
    <div
      :class="routeName === 'comments' ? 'nav-item-active' : 'nav-item'"
      @click="handleNavigation('comments')"
    >
      <span id="nav-link">comments</span>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "ProfileNavItems",

  setup() {
    const store = useStore();

    const router = useRouter();
    const route = useRoute();

    const user = computed(() => store.getters.user);
    const routeName = computed(() => route.name);

    const handleNavigation = (linkName: string) => {
      if (linkName === routeName.value) {
        return;
      }

      const param =
        linkName === "account"
          ? { username: user.value?.username }
          : linkName === "profile"
          ? { name: user.value?.username }
          : {};

      router.push({ name: linkName, params: param });

      const currentRouteName = computed(() => route.name);
      const prevRouteParams =
        currentRouteName.value === "account"
          ? { username: user.value?.username }
          : currentRouteName.value === "profile"
          ? { name: user.value?.username }
          : {};

      store.commit("SET_PREV_ROUTE", {
        name: currentRouteName.value,
        params: prevRouteParams,
      });

      store.commit("TOGGLE_PROFILE_MOBILE_NAV", false);
    };

    return {
      routeName,
      handleNavigation,
    };
  },
});
</script>
