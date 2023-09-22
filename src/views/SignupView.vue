<template>
  <div class="auth-container">
    <go-back />
    <div class="spinner" v-if="isLoading">
      <spinner-vue width="5" height="5" />
    </div>
    <div class="form-wrapper">
      <form @submit.prevent="submitHandler">
        <h1>Sign Up</h1>
        <div class="input-box">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="enter username"
            v-model="username"
            required
          />
        </div>
        <div class="input-box">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="enter valid email"
            v-model="email"
            required
          />
        </div>
        <div class="input-box">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="enter password"
            v-model="password"
            required
          />
        </div>
        <div class="input-box">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="retype password"
            v-model="confirmPassword"
            required
          />
        </div>
        <button type="submit" class="btn-outline">Submit</button>
      </form>
      <div class="notice">
        <p>already have an account?</p>
        <router-link :to="{ name: 'signin' }"><b>sign in</b></router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import GoBack from "../components/GoBack.vue";
import SpinnerVue from "../components/Spinner.vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "SignupView",
  components: { GoBack, SpinnerVue },

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const errMsg = computed(() => store.getters.regErrMsg);
    const isLoading = computed(() => store.getters.isRegLoading);
    const isSuccess = computed(() => store.getters.isRegSuccess);

    const submitHandler = () => {
      if (password.value !== confirmPassword.value) {
        store.commit("SET_ERR_MSG", "Passwords don't match!");
        store.commit("TOGGLE_ERR_MSG", true);
        return;
      }

      store.dispatch("register", {
        username: username.value,
        email: email.value,
        password: password.value,
      });
    };

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

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

    return {
      username,
      email,
      password,
      confirmPassword,
      submitHandler,
      isLoading,
    };
  },
});
</script>
