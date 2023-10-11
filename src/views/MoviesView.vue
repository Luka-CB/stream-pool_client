<template>
  <div class="movies-container">
    <top-panel :contentType="contentType" />
    <media-content
      :content="movies"
      :isLoading="isLoading"
      :contentType="contentType"
    />
    <pagination-vue :data="paginationData" :contentType="contentType" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import TopPanel from "../components/search&sort/TopPanel.vue";
import { useStore } from "vuex";
import MediaContent from "../components/content/index.vue";
import { useRoute } from "vue-router";
import PaginationVue from "../components/PaginationVue.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  name: "MoviesView",
  components: { TopPanel, MediaContent, PaginationVue },
  setup() {
    const store = useStore();
    const route = useRoute();

    const movies = computed(() => store.getters.fetchMovies);
    const paginationData = computed(() => store.getters.moviePagination);
    const isLoading = computed(() => store.getters.moviesLoading);

    const user = computed(() => store.getters.user);
    const routeQuery = computed(() => route.query);

    const contentType = computed(() => {
      const type = route.name?.toString();
      return type?.substring(0, type.length - 1);
    });

    const data = {
      genre: routeQuery.value?.genre,
      year: routeQuery.value?.year,
      rating: routeQuery.value?.rating,
      date: routeQuery.value?.date,
      page: routeQuery.value?.page,
      userId: user.value?.id,
    };

    watchEffect(() => {
      if (data.genre || data.year || data.rating || data.date || data.page) {
        store.dispatch("fetchMovies", data);
      } else {
        store.dispatch("fetchMovies", { userId: user.value?.id });
      }
    });

    useHead({ title: "Movies" });

    return {
      movies,
      isLoading,
      contentType,
      paginationData,
    };
  },
});
</script>

<style lang="scss" scoped>
.movies-container {
  min-height: 80vh;
}
</style>
