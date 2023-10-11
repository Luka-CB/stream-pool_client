<template>
  <div v-if="!homePage">
    <div class="navigation">
      <button
        class="menu-btn main-nav-menu-btn"
        v-if="isNavMenuIconActive"
        @click="handleToggleMobileNav"
      >
        <i class="fas fa-bars" title="Show Menu"></i>
      </button>
      <router-link :to="{ name: 'home' }" v-if="!isNavMenuIconActive">
        <img
          src="@\assets\images\stream-pool-logo-outline-light.png"
          alt="Site Logo"
          @click="handleReset"
        />
      </router-link>
      <nav v-if="!isNavMenuIconActive">
        <div class="nav-links">
          <router-link :to="{ name: 'movies' }" @click="handleReset"
            >Movies</router-link
          >
          <router-link :to="{ name: 'tvs' }" @click="handleReset"
            >Tv Series</router-link
          >
          <router-link :to="{ name: 'about' }" @click="handleReset"
            >About</router-link
          >
        </div>
      </nav>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from "vue";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import OptionsPopup from "./OptionsPopup.vue";

export default defineComponent({
  name: "MainNavigation",
  props: ["homePage"],
  components: { OptionsPopup },

  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.getters.user);
    const isLogoutSuccess = computed(() => store.getters.isLogoutSuccess);
    const isNavMenuIconActive = computed(() => store.getters.navMenuIcon);

    const handleOpenOption = () => {
      store.commit("TOGGLE_USER_OPTION", true);
    };

    watchEffect(() => {
      if (isLogoutSuccess.value) {
        router.push({ name: "home" });
        window.location.reload();
      }
    });

    const handleReset = () => {
      store.commit("RESET_SORT");
    };

    const handleToggleMobileNav = () => store.commit("TOGGLE_MOBILE_NAV", true);

    return {
      handleOpenOption,
      user,
      handleReset,
      isNavMenuIconActive,
      handleToggleMobileNav,
    };
  },
});
</script>

<style></style>
