<template>
  <div class="auth-container">
    <div class="back-btn">
      <go-back />
    </div>
    <div class="spinner" v-if="isLoading">
      <spinner-vue width="5" height="5" />
    </div>
    <div class="form-wrapper">
      <form @submit.prevent="submitHandler">
        <h1>Sign In</h1>
        <div class="input-box">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="enter your username"
            v-model="username"
            required
          />
        </div>
        <div class="input-box">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="enter your password"
            v-model="password"
            required
          />
        </div>
        <button type="submit" class="btn-outline">Submit</button>
      </form>
      <div class="notice">
        <p>don't have an account?</p>
        <router-link :to="{ name: 'signup' }"><b>sign up</b></router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from "@vueuse/head";
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import GoBack from "../components/GoBack.vue";
import SpinnerVue from "../components/Spinner.vue";

export default defineComponent({
  name: "SigninView",
  components: { GoBack, SpinnerVue },

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const username = ref("");
    const password = ref("");

    const isLoading = computed(() => store.getters.isLoginLoading);
    const isSuccess = computed(() => store.getters.isLoginSuccess);
    const errMsg = computed(() => store.getters.loginErrMsg);

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const submitHandler = () => {
      store.dispatch("login", {
        username: username.value,
        password: password.value,
      });
    };

    watchEffect(() => {
      if (errMsg.value) {
        store.commit("TOGGLE_ERR_MSG", true);
        store.commit("SET_ERR_MSG", errMsg.value);
      }

      if (isSuccess.value) {
        router.push({ name: "home" });
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    });

    useHead({ title: "Sign in to Stream-pool" });

    return {
      username,
      password,
      submitHandler,
      isLoading,
    };
  },
});
</script>
