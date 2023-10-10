<template>
  <div class="msg-wrapper">
    <p>{{ successMsg }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "SuccessMsg",

  setup() {
    const store = useStore();

    const successMsg = computed(() => store.getters.succMsg);

    return { successMsg };
  },
});
</script>

<style lang="scss" scoped>
.msg-wrapper {
  background-color: rgb(53, 153, 57);
  width: 40%;
  min-width: 250px;
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  margin-top: 15px;
  height: 50px;
  z-index: 100;
  border-radius: 10px;
  box-shadow: 0 0 8px rgb(53, 153, 57);
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  text-align: center;
  padding: 0 10px;
  transition: all 0.2s ease;

  @media (min-width: 1920px) {
    height: 70px;
    font-size: 1.5rem;
  }
}
</style>
