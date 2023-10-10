<template>
  <div class="go-back" title="Go Back" @click="handleGoBack">
    <i class="fa-solid fa-circle-left"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "GoBack",
  props: ["route"],

  setup(props) {
    const router = useRouter();

    const handleGoBack = () => {
      props.route?.name
        ? router.push({ name: props.route.name, params: props.route.params })
        : router.go(-1);
    };

    return {
      handleGoBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.go-back {
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease-in;

  .fa-circle-left {
    font-size: 2.5rem;
    transition: all 0.2s ease-in;
    color: #018d8a;
  }

  &:hover {
    background-color: aliceblue;
    .fa-circle-left {
      color: #01b6b3;
    }
  }

  @media (min-width: 1920px) {
    .fa-circle-left {
      font-size: 3.5rem;
    }
  }

  @media (max-width: 800px) {
    .fa-circle-left {
      font-size: 1.8rem;
    }
  }
}
</style>
