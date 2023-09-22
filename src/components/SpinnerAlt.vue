<template>
  <span class="loader" :style="styles"></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SpinnerAlt",
  props: ["size", "color", "margin"],

  setup(props) {
    const styles = {
      width: props.size ? `${props.size}px` : "28px",
      height: props.size ? `${props.size}px` : "28px",
      borderColor: props.color ? props.color : "#fff",
      marginRight: props.margin ? `${props.margin}px` : "10px",
    };

    return { styles };
  },
});
</script>

<style scoped>
.loader {
  border: 2px solid;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1.1s linear infinite;
}
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 0;
  background: #ff3d00;
  width: 2px;
  height: 14px;
  transform: translateX(-50%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
