<template>
  <div class="video-player">
    <div class="error" v-if="!url">
      <i class="fa-solid fa-video-slash"></i>
      <div class="text">
        <p>video not found!</p>
        <button
          class="btn-primary"
          v-if="user?.isAdmin"
          @click="handleShowModal"
        >
          <i class="fa-solid fa-plus"></i>
          <span>add video</span>
        </button>
      </div>
    </div>
    <iframe
      :src="url"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      v-else
    ></iframe>
    <button
      class="btn-primary"
      v-if="user?.isAdmin && url"
      @click="handleShowModal"
    >
      <i class="fa-solid fa-plus"></i>
      <span>update video</span>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "VideoPlayer",
  props: ["url"],

  setup() {
    const store = useStore();

    const user = computed(() => store.getters.user);

    const handleShowModal = () => store.commit("TOGGLE_URL_MODAL", true);

    return { user, handleShowModal };
  },
});
</script>

<style lang="scss" scoped>
.video-player {
  width: 80%;
  height: 80vh;
  margin: 100px auto;
  box-shadow: 0 0 100px rgba(1, 54, 6, 0.644), 0 12px 12px -4px black;
  position: relative;
  transition: all 0.2s ease-in-out;

  @media (min-width: 1920px) {
    margin: 200px auto;
    width: 80%;
    height: 90vh;
  }

  @media (max-width: 1000px) {
    width: 90%;
    height: 70vh;
  }

  @media (max-width: 800px) {
    height: 60vh;
  }

  @media (max-width: 600px) {
    height: 50vh;
  }

  @media (max-width: 500px) {
    height: 40vh;
  }

  @media (max-width: 350px) {
    height: 30vh;
  }

  @media (max-width: 270px) {
    height: 25vh;
  }

  .error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: all 0.2s ease-in-out;

    .fa-video-slash {
      font-size: 4rem;
      color: gray;
    }

    .text {
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        margin-top: 20px;
        font-size: large;
        text-transform: capitalize;
      }
    }
  }

  iframe {
    width: 100%;
    height: 100%;
    transition: all 0.2s ease-in-out;
  }

  .btn-primary {
    width: 150px;
    margin-top: 10px;
    height: 30px;
    transition: all 0.2s ease-in-out;

    .fa-plus {
      font-size: 1.5rem;
      color: #1a7c7b;
      transition: all 0.2s ease-in-out;
    }

    span {
      font-size: medium;
      margin-left: 10px;
      text-transform: capitalize;
      color: #1a7c7b;
      transition: all 0.2s ease-in-out;
    }

    @media (min-width: 1920px) {
      width: 250px;
      height: 50px;
      margin-top: 40px;

      .fa-plus {
        font-size: 2.5rem;
      }

      span {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 500px) {
      width: 100%;
      margin-top: 20px;
    }

    &:hover {
      background-color: #0afffb;
      .fa-plus {
        color: #0c4b4a;
      }

      span {
        color: #0c4b4a;
      }
    }

    &:active {
      transform: scale(0.97);
      background-color: gray;
      .fa-plus {
        color: rgb(210, 210, 210);
      }

      span {
        color: rgb(209, 209, 209);
      }
    }
  }

  .add-btn2 {
    margin-top: 30px;
  }
}
</style>
