<template>
  <div class="account-container">
    <div class="icon-btns">
      <go-back :route="prevRoute" />
      <div
        class="home-icon"
        title="Back to home page"
        @click="handleNavigation"
      >
        <i class="fa-solid fa-house-chimney-window"></i>
      </div>
    </div>

    <profile-nav />

    <div class="spinner" v-if="isLoading">
      <spinner-vue :height="5" :width="5" />
    </div>

    <div class="account-form-wrapper">
      <account-form :profileInfo="profile" />
    </div>
    <delete-account />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import GoBack from "../../components/GoBack.vue";
import AccountForm from "../../components/userPages/accountView/AccountForm.vue";
import DeleteAccount from "../../components/userPages/accountView/DeleteAccount.vue";
import ProfileNav from "../../components/navigation/ProfileNav.vue";
import SpinnerVue from "../../components/Spinner.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    GoBack,
    AccountForm,
    DeleteAccount,
    SpinnerVue,
    ProfileNav,
  },
  name: "AccountView",

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const profile = computed(() => store.getters.profile);
    store.dispatch("getProfile");

    const prevRoute = computed(() => store.getters.prevRoute);

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    useHead({
      title: "Update Account",
    });

    //////// DELETE ACCOUNT ////////
    const promptKeyword = computed(() => store.getters.promptKeyword);
    const isAnswerYes = computed(() => store.getters.isAnswerYes);
    const isLoading = computed(() => store.getters.delUserLoading);
    const isSuccess = computed(() => store.getters.delUserSuccess);

    watchEffect(() => {
      if (isSuccess.value) {
        router.push({ name: "home" });
        setTimeout(() => window.location.reload(), 300);
      }
    });

    watchEffect(() => {
      if (promptKeyword.value === "deleteAccount" && isAnswerYes.value) {
        store.dispatch("delete");
      }
    });

    return {
      handleNavigation,
      profile,
      isLoading,
      prevRoute,
    };
  },
});
</script>
