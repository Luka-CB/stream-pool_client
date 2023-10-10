<template>
  <div>
    <button
      class="profile-nav-menu-btn"
      v-if="windowWidth <= 800 && !isMobileProfileNavActive"
      @click="handleOpenDrawer"
    >
      <i class="fas fa-bars" title="Show Menu"></i>
    </button>
    <div
      class="drawer-bg"
      v-else-if="windowWidth <= 800 && isMobileProfileNavActive"
      @click="handleCloseDrawer"
    >
      <div class="drawer" @click.stop>
        <button class="close-btn" @click="handleCloseDrawer">
          <i class="fa-solid fa-circle-xmark"></i>
        </button>
        <profile-nav-items />
      </div>
    </div>
    <div class="nav-wrapper" v-else>
      <profile-nav-items />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useWindowWidth } from "../../composables/windowResize";
import ProfileNavItems from "./ProfileNavItems.vue";

export default defineComponent({
  components: { ProfileNavItems },
  name: "ProfileNav",

  setup() {
    const store = useStore();

    const isMobileProfileNavActive = computed(
      () => store.getters.profileMobileNav
    );

    const { windowWidth } = useWindowWidth();

    const handleOpenDrawer = () => {
      store.commit("TOGGLE_PROFILE_MOBILE_NAV", true);
    };

    const handleCloseDrawer = () => {
      store.commit("TOGGLE_PROFILE_MOBILE_NAV", false);
    };

    return {
      windowWidth,
      handleOpenDrawer,
      handleCloseDrawer,
      isMobileProfileNavActive,
    };
  },
});
</script>
