<template>
  <div class="home-nav">
    <button
      class="menu-btn"
      v-if="isNavMenuIconActive"
      @click="handleToggleMobileNav"
    >
      <i class="fas fa-bars" title="Show Menu"></i>
    </button>
    <div class="page-links" v-else>
      <router-link class="link" :to="{ name: 'movies' }">Movies</router-link>
      <router-link class="link" :to="{ name: 'tvs' }">Tv Series</router-link>
      <router-link class="link" :to="{ name: 'about' }">About</router-link>
    </div>
    <div class="auth">
      <div class="signed" v-if="user?.id">
        <h5 id="username">{{ user?.username }}</h5>
        <div class="box" @click.stop="handleOpenOption">
          <div class="user-icon">
            <i class="fa-regular fa-circle-user"></i>
          </div>
          <div class="divider"></div>
          <div class="caret-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
        <options-popup />
      </div>
      <router-link v-else :to="{ name: 'signin' }">
        <div class="sign-in">
          <span>Sign In</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useStore } from "vuex";
import OptionsPopup from "../navigation/OptionsPopup.vue";

export default defineComponent({
  name: "HomeNav",
  components: { OptionsPopup },

  setup() {
    const store = useStore();

    const user = computed(() => store.getters.user);
    const isLogoutSuccess = computed(() => store.getters.isLogoutSuccess);
    const isNavMenuIconActive = computed(() => store.getters.navMenuIcon);

    watchEffect(() => {
      if (isLogoutSuccess.value) {
        window.location.reload();
      }
    });

    const handleOpenOption = () => {
      store.commit("TOGGLE_USER_OPTION", true);
    };

    const handleToggleMobileNav = () => store.commit("TOGGLE_MOBILE_NAV", true);

    return {
      handleOpenOption,
      user,
      isNavMenuIconActive,
      handleToggleMobileNav,
    };
  },
});
</script>
