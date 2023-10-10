<template>
  <div class="mobile-nav" @click="handleCloseMobileNav">
    <div class="nav-container" @click.stop>
      <div class="top">
        <button class="close-btn" @click="handleCloseMobileNav">
          <i class="fa-solid fa-circle-xmark"></i>
        </button>
        <div class="logo" @click="handleCloseMobileNav">
          <router-link :to="{ name: 'home' }">
            <img
              src="@/assets/images/stream-pool-logo-outline-light.png"
              alt="logo"
            />
          </router-link>
        </div>
      </div>
      <div class="nav-links">
        <router-link :to="{ name: 'movies' }" @click="handleCloseMobileNav"
          >Movies</router-link
        >
        <router-link :to="{ name: 'tvs' }" @click="handleCloseMobileNav"
          >Tv Shows</router-link
        >
        <router-link :to="{ name: 'about' }" @click="handleCloseMobileNav"
          >About</router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default defineComponent({
  name: "MobileNavigation",

  setup() {
    const store = useStore();

    const isNavDrawerOpen = computed(
      () => store.getters.mobileNav.isNavDrawerOpen
    );

    const handleCloseMobileNav = () => store.commit("TOGGLE_MOBILE_NAV", false);

    return {
      isNavDrawerOpen,
      handleCloseMobileNav,
    };
  },
});
</script>
