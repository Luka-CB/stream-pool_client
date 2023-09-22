<template>
  <div class="home-container" @click="handleCloseModals">
    <home-nav />
    <home-landing :showLandingContent="showLandingContent" />
    <div class="home-content-wrapper">
      <div class="search">
        <search-bar />
      </div>
      <home-content />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import HomeNav from "../components/home/HomeNav.vue";
import HomeLanding from "../components/home/HomeLanding.vue";
import SearchBar from "../components/search&sort/SearchBar.vue";
import HomeContent from "../components/home/HomeContent.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "HomeView",
  components: { HomeNav, HomeLanding, SearchBar, HomeContent },
  setup() {
    const store = useStore();

    const showLandingContent = ref(true);

    watchEffect(() => {
      window.addEventListener("scroll", () => {
        const scrollTop = Math.trunc(window.scrollY);
        if (scrollTop >= 60) {
          showLandingContent.value = false;
        } else {
          showLandingContent.value = true;
        }
      });
    });

    const handleCloseModals = () => {
      store.commit("TOGGLE_USER_OPTION", false);
    };

    return {
      showLandingContent,
      handleCloseModals,
    };
  },
});
</script>

<style lang="scss" scoped>
.home-container {
  background-image: url("@/assets/images/landing-img.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  .home-content-wrapper {
    height: calc(100vh - 100px);
    overflow-y: hidden;

    .search {
      height: 150px;
    }
  }
}
</style>
