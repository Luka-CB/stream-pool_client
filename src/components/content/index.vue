<template>
  <div class="content">
    <div class="spinner" v-if="isLoading">
      <spinner-vue :width="5" :height="5" />
    </div>
    <p id="notice" v-else-if="content?.length === 0">
      {{ contentType === "tv" ? "no tv shows!" : "no movies!" }}
    </p>
    <content-card v-for="data in content" :key="data._id" :data="data" v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContentCard from "./ContentCard.vue";
import SpinnerVue from "../Spinner.vue";

export default defineComponent({
  name: "MediaContent",
  components: { ContentCard, SpinnerVue },
  props: ["content", "isLoading", "contentType"],
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
  gap: 2em 1em;
  margin: 50px 0;
  min-height: 40vh;

  .spinner {
    width: 100%;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #notice {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    letter-spacing: 3px;
    color: red;
    text-transform: capitalize;
  }
}
</style>
