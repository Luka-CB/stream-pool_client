<template>
  <div class="divider-line">
    <div class="line1"></div>
    <span id="text">{{ text }}</span>
    <div class="line2"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DividerVue",
  props: ["text"],

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.divider-line {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .line1,
  .line2 {
    width: calc(45%);
    height: 1px;
    background-color: rgba(128, 128, 128, 0.54);
  }

  #text {
    margin: 0 10px;
    min-width: 150px;
    text-align: center;
    text-transform: uppercase;
    color: gray;
    letter-spacing: 2px;
  }
}
</style>
