<template>
  <div class="genres-container">
    <div
      v-for="genre in genres"
      :key="genre?._id"
      :class="[pickedGenres.includes(genre?.genre) ? 'genre-active' : 'genre']"
      :title="
        pickedGenres.includes(genre?.genre)
          ? `Unpick ${genre?.genre}`
          : `Pick ${genre?.genre}`
      "
      @click="handlePickGenre(genre?.genre)"
    >
      <span>{{ genre?.genre }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "ContentGenres",
  props: ["dbGenres"],

  setup(props) {
    const store = useStore();

    const genres = computed(() => store.getters.genres);
    const pickedGenres = computed(() => store.getters.pickedGenres);

    store.dispatch("fetchGenres");

    const handlePickGenre = (genre: string) =>
      store.commit("SET_GENRES", genre);

    watchEffect(() => {
      if (props.dbGenres) {
        store.commit("SET_DB_GENRES", props.dbGenres);
      }
    });
    return {
      genres,
      handlePickGenre,
      pickedGenres,
    };
  },
});
</script>
