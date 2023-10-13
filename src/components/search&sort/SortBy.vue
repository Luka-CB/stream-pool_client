<template>
  <div class="sort-container">
    <div class="box by-year">
      <div class="title">
        <span>Year</span>
      </div>
      <div class="sort select">
        <select @change="handleSelectedYear($event)" v-model="defaultYear">
          <option value="">All</option>
          <option
            v-for="range in yearRange(1950, 2024).reverse()"
            :key="range"
            :value="range"
          >
            {{ range }}
          </option>
        </select>
      </div>
    </div>
    <div class="box by-genre">
      <div class="title">
        <span>Genre</span>
      </div>
      <div class="sort select">
        <select @change="handleSelectedGenre($event)" v-model="defaultGenre">
          <option value="">All</option>
          <option
            v-for="genre in genres"
            :key="genre._id"
            :value="genre?.genre"
          >
            {{ genre?.genre }}
          </option>
        </select>
      </div>
    </div>
    <div class="box by-rating">
      <div class="title"><span>Rating</span></div>
      <div
        class="sort asc-desc"
        @click="handleRatingSort"
        :title="ratingSort === 'asc' ? 'Ascending' : 'Descending'"
      >
        <i
          :class="[
            'fa-solid',
            'fa-up-long',
            ratingSort === 'asc' ? 'asc-active' : 'asc',
          ]"
        ></i>
        <i
          :class="[
            'fa-solid',
            'fa-down-long',
            ratingSort === 'desc' ? 'desc-active' : 'desc',
          ]"
        ></i>
      </div>
    </div>
    <div class="box by-date">
      <div class="title"><span>By Year</span></div>
      <div
        class="sort asc-desc"
        @click="handleDateSort"
        :title="byYearSort === 'asc' ? 'Ascending' : 'Descending'"
      >
        <i
          :class="[
            'fa-solid',
            'fa-up-long',
            byYearSort === 'asc' ? 'asc-active' : 'asc',
          ]"
        ></i>
        <i
          :class="[
            'fa-solid',
            'fa-down-long',
            byYearSort === 'desc' ? 'desc-active' : 'desc',
          ]"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "SortBy",
  props: ["contentType"],

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const ratingSort = ref(route.query.rating ?? "");
    const byYearSort = ref(route.query?.byYear ?? "");
    const defaultGenre = ref(route.query?.genre ?? "");
    const defaultYear = ref(route.query?.year ?? "");

    const user = computed(() => store.getters.user);

    const genres = computed(() => store.getters.genres);
    store.dispatch("fetchGenres");

    const yearRange = (start: number, end: number) => {
      const length = end - start;
      return Array.from({ length }, (_, i) => start + i);
    };

    const routeName = props.contentType === "tv" ? "fetchTvs" : "fetchMovies";

    const handleSelectedYear = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      router.push({
        name: route.name || "",
        query: { ...route.query, year: target.value, page: 1 },
      });
      store.dispatch(routeName, {
        ...route.query,
        year: target.value,
        page: 1,
        userId: user.value?.id,
      });
    };

    const handleSelectedGenre = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      router.push({
        name: route.name || "",
        query: { ...route.query, genre: target.value, page: 1 },
      });
      store.dispatch(routeName, {
        ...route.query,
        genre: target.value,
        page: 1,
        userId: user.value?.id,
      });
    };

    const handleRatingSort = () => {
      if (ratingSort.value === "asc") {
        ratingSort.value = "desc";
        byYearSort.value = "";
      } else if (ratingSort.value === "desc") {
        ratingSort.value = "asc";
        byYearSort.value = "";
      } else {
        ratingSort.value = "asc";
      }

      router.push({
        name: route.name || "",
        query: { ...route.query, rating: ratingSort.value, byYear: "" },
      });
      store.dispatch(routeName, {
        ...route.query,
        rating: ratingSort.value,
        byYear: "",
        userId: user.value?.id,
      });
    };

    const handleDateSort = () => {
      if (byYearSort.value === "asc") {
        byYearSort.value = "desc";
        ratingSort.value = "";
      } else if (byYearSort.value === "desc") {
        byYearSort.value = "asc";
        ratingSort.value = "";
      } else {
        byYearSort.value = "asc";
      }

      router.push({
        name: route.name || "",
        query: { ...route.query, rating: "", byYear: byYearSort.value },
      });
      store.dispatch(routeName, {
        ...route.query,
        rating: "",
        byYear: byYearSort.value,
        userId: user.value?.id,
      });
    };

    return {
      yearRange,
      ratingSort,
      byYearSort,
      handleRatingSort,
      handleDateSort,
      handleSelectedYear,
      handleSelectedGenre,
      defaultGenre,
      defaultYear,
      genres,
    };
  },
});
</script>
