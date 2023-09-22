<template>
  <form @submit.prevent="handleSubmit" autocomplete="off">
    <div class="input-box">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        placeholder="enter username"
        v-model="username"
      />
    </div>
    <div class="input-box">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        placeholder="enter email"
        v-model="email"
      />
    </div>
    <div class="input-box">
      <label for="password">New Password</label>
      <input
        type="password"
        id="password"
        placeholder="enter new password"
        v-model="password"
      />
    </div>

    <button class="btn-primary submit-btn" :disabled="buttonDisabled">
      <spinner-alt color="#edc531" :size="25" v-if="isLoading" />
      <span>{{ isLoading ? "Submitting..." : "Submit" }}</span>
    </button>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "../../SpinnerAlt.vue";

export default defineComponent({
  name: "AccountForm",
  props: ["profileInfo"],
  components: { SpinnerAlt },

  setup(props) {
    const store = useStore();

    const username = ref("");
    const email = ref("");
    const password = ref("");

    watchEffect(() => {
      if (props.profileInfo?._id) {
        username.value = props.profileInfo?.username;
        email.value = props.profileInfo?.email;
      }
    });

    const isLoading = computed(() => store.getters.updUserLoading);
    const isSuccess = computed(() => store.getters.updUserSuccess);
    const successMsg = computed(() => store.getters.updUserSuccessMsg);

    watchEffect(() => {
      if (isSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.commit("RESET_AUTH");
          store.dispatch("getProfile");
        }, 2000);
      }
    });

    const buttonDisabled = ref(false);

    watchEffect(() => {
      if (
        isLoading.value ||
        (username.value === props.profileInfo?.username &&
          email.value === props.profileInfo?.email &&
          !password.value)
      ) {
        buttonDisabled.value = true;
      } else {
        buttonDisabled.value = false;
      }
    });

    const handleSubmit = () =>
      store.dispatch("update", {
        username: username.value,
        email: email.value,
        password: password.value,
      });

    return {
      username,
      email,
      password,
      buttonDisabled,
      isLoading,
      handleSubmit,
    };
  },
});
</script>
