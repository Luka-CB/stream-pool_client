<template>
  <div class="options" v-show="isUserOptionOpen" @click.stop>
    <p class="option-value" @click="handleNavigation('profile')">
      your profile
    </p>
    <p class="option-value" @click="handleNavigation('account')">
      your account
    </p>
    <p class="option-value" @click="handleNavigation('lists')">your lists</p>
    <p class="option-value" @click="handleNavigation('favorites')">
      favorite titles
    </p>
    <p class="option-value" @click="handleNavigation('ratings')">
      your ratings
    </p>
    <p class="option-value" @click="handleNavigation('comments')">
      your comments
    </p>
    <hr />
    <div class="logout">
      <spinner-alt color="gray" margin="0" v-if="isLogoutLoading" />
      <p @click="handleLogout">logout</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "OptionsPopup",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const user = computed(() => store.getters.user);
    const currentRouteName = computed(() => route.name);

    const isUserOptionOpen = computed(() => store.getters.isUserOptionOpen);
    const isLogoutLoading = computed(() => store.getters.isLogoutLoading);

    const handleLogout = () => store.dispatch("logout");

    const handleNavigation = (navRoute: string) => {
      const params =
        navRoute === "profile"
          ? { name: user.value?.username }
          : navRoute === "account"
          ? { username: user.value?.username }
          : {};
      router.push({ name: navRoute, params });

      const detailParamName = computed(() => route.params.id);
      const routeName = computed(() => route.name);

      const prevRouteParams =
        routeName.value === "details" ? { id: detailParamName.value } : {};

      store.commit("TOGGLE_USER_OPTION", false);
      store.commit("SET_PREV_ROUTE", {
        name: currentRouteName.value,
        params: prevRouteParams,
      });
    };

    return {
      isUserOptionOpen,
      isLogoutLoading,
      handleLogout,
      handleNavigation,
    };
  },
});
</script>

<style lang="scss" scoped>
.options {
  position: absolute;
  top: 100%;
  right: 5%;
  width: 150px;
  background-color: aliceblue;
  margin-top: 5px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.529);
  z-index: 11;
  animation: fade 0.1s ease-in;

  .option-value {
    padding: 10px;
    color: black;
    font-size: medium;
    cursor: pointer;
    text-transform: capitalize;

    &:hover {
      background-color: rgba(0, 0, 0, 0.108);
      font-weight: 600;
    }
  }

  .logout {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    color: black;
    font-size: medium;
    cursor: pointer;
    text-transform: capitalize;

    p {
      margin-left: 10px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.108);
      font-weight: 600;
    }
  }

  @media (min-width: 1920px) {
    width: 200px;

    .option-value {
      font-size: 1.3rem;
    }

    .logout {
      font-size: 1.3rem;
    }
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
