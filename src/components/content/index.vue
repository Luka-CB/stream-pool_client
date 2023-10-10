<template>
  <div class="content">
    <div class="spinner" v-if="isLoading">
      <spinner-vue :width="5" :height="5" />
    </div>
    <p id="notice" v-else-if="content?.length === 0">
      {{ contentType === "tv" ? "no tv shows!" : "no movies!" }}
    </p>
    <div class="cards-wrapper" v-else>
      <div class="mobile-cards" v-if="windowWidth <= 900">
        <content-card-mobile
          v-for="data in content"
          :key="data._id"
          :data="data"
        />
      </div>
      <div class="main-cards" v-else>
        <content-card v-for="data in content" :key="data._id" :data="data" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ContentCard from "./ContentCard.vue";
import ContentCardMobile from "./ContentCardMobile.vue";
import SpinnerVue from "../Spinner.vue";
import { useWindowWidth } from "../../composables/windowResize";

export default defineComponent({
  name: "MediaContent",
  components: { ContentCard, SpinnerVue, ContentCardMobile },
  props: ["content", "isLoading", "contentType"],
  setup() {
    const { windowWidth } = useWindowWidth();

    return { windowWidth };
  },
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  min-height: 50vh;
  position: relative;

  .spinner {
    width: 100%;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #notice {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    letter-spacing: 3px;
    color: red;
    text-transform: capitalize;
  }

  .cards-wrapper {
    width: 100%;
    height: 100%;

    .mobile-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      justify-items: center;
      gap: 2em 1em;
      margin: 50px 10px;
    }

    .main-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      justify-items: center;
      gap: 2em 1em;
      margin: 50px 0;

      @media (min-width: 1920px) {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      }
    }
  }
}
</style>
