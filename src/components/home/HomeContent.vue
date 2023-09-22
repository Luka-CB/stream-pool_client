<template>
  <div class="home-content">
    <div class="latest-tvs">
      <h1 id="title">Latest TV Series</h1>
      <div class="left-handle" @click="handleTvsScrollLeft">
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <div class="media-wrapper" ref="tvsScroll">
        <div class="media-group">
          <div class="media-card" v-for="tv in latestTvs.groupOne" :key="tv">
            <img src="@/assets/images/dummy-poster.jpg" alt="poster" />
          </div>
        </div>
        <div class="media-group">
          <div class="media-card" v-for="tv in latestTvs.groupTwo" :key="tv">
            <img src="@/assets/images/dummy-poster.jpg" alt="poster" />
          </div>
        </div>
        <div class="media-group">
          <div class="media-card" v-for="tv in latestTvs.groupThree" :key="tv">
            <img src="@/assets/images/dummy-poster.jpg" alt="poster" />
          </div>
        </div>
      </div>
      <div class="right-handle" @click="handleTvsScrollRight">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    </div>
    <div class="latest-movies">
      <h1 id="title">Latest Movies</h1>
      <div class="left-handle" @click="handleMoviesScrollLeft">
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <div class="media-wrapper" ref="moviesScroll">
        <div class="media-group">
          <div
            class="media-card"
            v-for="movie in latestMovies.groupOne"
            :key="movie"
          >
            <img src="@/assets/images/dummy-poster.jpg" alt="poster" />
          </div>
        </div>
        <div class="media-group">
          <div
            class="media-card"
            v-for="movie in latestMovies.groupTwo"
            :key="movie"
          >
            <img src="@/assets/images/dummy-poster.jpg" alt="poster" />
          </div>
        </div>
        <div class="media-group">
          <div
            class="media-card"
            v-for="movie in latestMovies.groupThree"
            :key="movie"
          >
            <img src="@/assets/images/dummy-poster.jpg" alt="poster" />
          </div>
        </div>
      </div>
      <div class="right-handle" @click="handleMoviesScrollRight">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "HomeContent",
  setup() {
    const tvsScroll = ref<HTMLDivElement | null>(null);
    const moviesScroll = ref<HTMLDivElement | null>(null);

    const latestTvs = ref({
      groupOne: [1, 2, 3, 4, 5],
      groupTwo: [6, 7, 8, 9, 10],
      groupThree: [11, 12, 13, 14, 15],
    });
    const latestMovies = ref({
      groupOne: [1, 2, 3, 4, 5],
      groupTwo: [6, 7, 8, 9, 10],
      groupThree: [11, 12, 13, 14, 15],
    });

    const handleTvsScrollRight = () => {
      if (tvsScroll.value) {
        tvsScroll.value.scrollBy({
          top: 0,
          left: 1,
          behavior: "smooth",
        });
      }
    };

    const handleTvsScrollLeft = () => {
      if (tvsScroll.value) {
        tvsScroll.value.scrollBy({
          top: 0,
          left: -1,
          behavior: "smooth",
        });
      }
    };

    const handleMoviesScrollRight = () => {
      if (moviesScroll.value) {
        moviesScroll.value.scrollBy({
          top: 0,
          left: 1,
          behavior: "smooth",
        });
      }
    };

    const handleMoviesScrollLeft = () => {
      if (moviesScroll.value) {
        moviesScroll.value.scrollBy({
          top: 0,
          left: -1,
          behavior: "smooth",
        });
      }
    };

    return {
      latestTvs,
      latestMovies,
      tvsScroll,
      moviesScroll,
      handleTvsScrollRight,
      handleTvsScrollLeft,
      handleMoviesScrollRight,
      handleMoviesScrollLeft,
    };
  },
});
</script>
