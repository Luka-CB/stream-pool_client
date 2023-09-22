<template>
  <div class="user-info-container">
    <div class="spinner" v-if="isGetProfileLoading">
      <spinner-vue :width="4" :height="4" />
    </div>
    <div class="user-info-wrapper" v-else>
      <div class="col1">
        <div class="user-look">
          <div class="user-icon">
            <i class="fa-regular fa-circle-user"></i>
          </div>
          <button class="btn-primary" @click="handleLogout">
            <spinner-alt :size="24" color="#d50000" v-if="isLogoutLoading" />
            <span>logout</span>
          </button>
        </div>
        <div class="user-info">
          <h2 id="username">{{ profile?.username }}</h2>
          <h4 id="email">{{ profile?.email }}</h4>
          <h4 id="date">
            Registered: <em id="date">{{ profile?.createdAt }} ago</em>
          </h4>
        </div>
      </div>
      <div class="col2">
        <button
          class="account-btn"
          title="Edit Account"
          @click="handleNavigation(profile?.username)"
        >
          <div class="edit-icon">
            <i class="fa-solid fa-pencil"></i>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerVue from "../../Spinner.vue";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "UserInfo",
  components: { SpinnerVue, SpinnerAlt },

  setup() {
    const store = useStore();
    const router = useRouter();

    const profile = computed(() => store.getters.profile);
    const isGetProfileLoading = computed(() => store.getters.getProfileLoading);
    store.dispatch("getProfile");

    const isLogoutLoading = computed(() => store.getters.isLogoutLoading);
    const isLogoutSuccess = computed(() => store.getters.isLogoutSuccess);

    watchEffect(() => {
      if (isLogoutSuccess.value) {
        router.push({ name: "home" });
        window.location.reload();
      }
    });

    const handleLogout = () => store.dispatch("logout");

    const handleNavigation = (param: string) => {
      router.push({ name: "account", params: { username: param } });

      store.commit("SET_PREV_ROUTE", {
        name: "profile",
        params: { name: param },
      });
    };

    return {
      profile,
      isGetProfileLoading,
      isLogoutLoading,
      handleLogout,
      handleNavigation,
    };
  },
});
</script>
