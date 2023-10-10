<template>
  <div class="msg-wrapper">
    <p>{{ errorMsg }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "ErrorMsg",

  setup() {
    const store = useStore();

    const errorMsg = computed(() => store.getters.errMsg);

    return { errorMsg };
  },
});
</script>

<style lang="scss" scoped>
.msg-wrapper {
  background-color: rgb(206, 70, 70);
  width: 40%;
  min-width: 240px;
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  margin-top: 15px;
  height: 50px;
  text-transform: capitalize;
  z-index: 100;
  border-radius: 10px;
  box-shadow: 0 0 8px rgb(206, 70, 70);
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
