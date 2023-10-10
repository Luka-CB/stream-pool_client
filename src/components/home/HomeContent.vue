<template>
  <div class="home-content">
    <div class="latest-tvs">
      <h1 id="title">Latest TV Series</h1>
      <div
        class="left-handle"
        @click="handleTvsScrollLeft"
        v-if="!isGetLatestTvsLoading && tvScrollCount > 0"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <div
        class="right-handle"
        @click="handleTvsScrollRight"
        v-if="!isGetLatestTvsLoading && tvScrollCount < 2"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </div>

      <div class="spinner" v-if="isGetLatestTvsLoading">
        <SpinnerVue :height="5" :width="5" />
      </div>
      <div class="media-wrapper" v-else>
        <div
          class="media-group-mobile"
          ref="tvsScroll"
          v-if="windowWidth <= 800"
        >
          <div class="media-group">
            <content-card-mobile
              v-for="data in latestTvs?.groupOne"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group">
            <content-card-mobile
              v-for="data in latestTvs?.groupTwo"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group">
            <content-card-mobile
              v-for="data in latestTvs?.groupThree"
              :key="data?._id"
              :data="data"
            />
          </div>
        </div>
        <div class="media-group-main" ref="tvsScroll" v-else>
          <div class="media-group">
            <content-card
              v-for="data in latestTvs?.groupOne"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group">
            <content-card
              v-for="data in latestTvs?.groupTwo"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group">
            <content-card
              v-for="data in latestTvs?.groupThree"
              :key="data?._id"
              :data="data"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="latest-movies">
      <h1 id="title">Latest Movies</h1>
      <div
        class="left-handle"
        @click="handleMoviesScrollLeft"
        v-if="!isGetLatestMoviesLoading && movieScrollCount > 0"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <div
        class="right-handle"
        @click="handleMoviesScrollRight"
        v-if="!isGetLatestMoviesLoading && movieScrollCount < 2"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </div>
      <div class="spinner" v-if="isGetLatestMoviesLoading">
        <SpinnerVue :height="5" :width="5" />
      </div>
      <div class="media-wrapper">
        <div
          class="media-group-mobile"
          ref="moviesScroll"
          v-if="windowWidth <= 800"
        >
          <div class="media-group">
            <content-card-mobile
              v-for="data in latestMovies?.groupOne"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group">
            <content-card-mobile
              v-for="data in latestMovies?.groupTwo"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group">
            <content-card-mobile
              v-for="data in latestMovies?.groupThree"
              :key="data?._id"
              :data="data"
            />
          </div>
        </div>
        <div class="media-group-main" ref="moviesScroll" v-else>
          <div class="media-group media-group-movies" id="groupOne">
            <content-card
              v-for="data in latestMovies?.groupOne"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group media-group-movies" id="groupTwo">
            <content-card
              v-for="data in latestMovies?.groupTwo"
              :key="data?._id"
              :data="data"
            />
          </div>
          <div class="media-group media-group-movies" id="groupThree">
            <content-card
              v-for="data in latestMovies?.groupThree"
              :key="data?._id"
              :data="data"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import ContentCard from "../content/ContentCard.vue";
import SpinnerVue from "../Spinner.vue";
import { useWindowWidth } from "../../composables/windowResize";
import ContentCardMobile from "../content/ContentCardMobile.vue";

export default defineComponent({
  name: "HomeContent",
  components: { ContentCard, SpinnerVue, ContentCardMobile },

  setup() {
    const store = useStore();

    const tvsScroll = ref<HTMLDivElement | null>(null);
    const moviesScroll = ref<HTMLDivElement | null>(null);

    const user = computed(() => store.getters.user);
    const latestTvs = computed(() => store.getters.latestTvs);
    const isGetLatestTvsLoading = computed(
      () => store.getters.getLatestTvsLoading
    );

    const latestMovies = computed(() => store.getters.latestMovies);
    const isGetLatestMoviesLoading = computed(
      () => store.getters.getLatestMoviesLoading
    );

    store.dispatch("fetchLatestTvs", user.value?.id);
    store.dispatch("fetchLatestMovies", user.value?.id);

    const tvScrollCount = ref(0);

    const handleTvsScrollRight = () => {
      if (tvsScroll.value) {
        tvsScroll.value.scrollBy({
          top: 0,
          left: 1,
          behavior: "smooth",
        });
        tvScrollCount.value++;
      }
    };

    const handleTvsScrollLeft = () => {
      if (tvsScroll.value) {
        tvsScroll.value.scrollBy({
          top: 0,
          left: -1,
          behavior: "smooth",
        });

        tvScrollCount.value--;
      }
    };

    const movieScrollCount = ref(0);

    const handleMoviesScrollRight = () => {
      if (moviesScroll.value) {
        moviesScroll.value.scrollBy({
          top: 0,
          left: 1,
          behavior: "smooth",
        });

        movieScrollCount.value++;
      }
    };

    const handleMoviesScrollLeft = () => {
      if (moviesScroll.value) {
        moviesScroll.value.scrollBy({
          top: 0,
          left: -1,
          behavior: "smooth",
        });

        movieScrollCount.value--;
      }
    };

    const { windowWidth } = useWindowWidth();

    watchEffect(() => {
      if (windowWidth.value <= 350) {
        store.commit("UPD_LATEST_TVS", 1);
        store.commit("UPD_LATEST_MOVIES", 1);
      }

      if (windowWidth.value > 350 && windowWidth.value < 500) {
        store.commit("UPD_LATEST_TVS", 2);
        store.commit("UPD_LATEST_MOVIES", 2);
      }

      if (windowWidth.value > 500 && windowWidth.value < 700) {
        store.commit("UPD_LATEST_TVS", 3);
        store.commit("UPD_LATEST_MOVIES", 3);
      }

      if (windowWidth.value > 700 && windowWidth.value < 800) {
        store.commit("UPD_LATEST_TVS", 4);
        store.commit("UPD_LATEST_MOVIES", 4);
      }

      if (windowWidth.value > 800 && windowWidth.value < 1050) {
        store.commit("UPD_LATEST_TVS", 3);
        store.commit("UPD_LATEST_MOVIES", 3);
      }

      if (windowWidth.value > 1050 && windowWidth.value < 1300) {
        store.commit("UPD_LATEST_TVS", 4);
        store.commit("UPD_LATEST_MOVIES", 4);
      }

      if (windowWidth.value > 1300) {
        store.commit("UPD_LATEST_TVS", 5);
        store.commit("UPD_LATEST_MOVIES", 5);
      }
    });

    return {
      latestTvs,
      latestMovies,
      tvsScroll,
      moviesScroll,
      handleTvsScrollRight,
      handleTvsScrollLeft,
      handleMoviesScrollRight,
      handleMoviesScrollLeft,
      isGetLatestTvsLoading,
      isGetLatestMoviesLoading,
      windowWidth,
      tvScrollCount,
      movieScrollCount,
    };
  },
});
</script>
