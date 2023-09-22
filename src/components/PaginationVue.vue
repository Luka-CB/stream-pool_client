<template>
  <div class="pagination-container">
    <button
      class="first-btn"
      :title="data?.hasPrevPage ? 'First Page' : undefined"
      :disabled="!data?.hasPrevPage"
      @click="handleFirstPage"
    >
      <i class="fa-solid fa-angles-left icon"></i>
    </button>
    <button
      class="left-btn"
      :title="data?.hasPrevPage ? 'Previous Page' : undefined"
      :disabled="!data?.hasPrevPage"
      @click="handlePrevPage"
    >
      <i class="fa-solid fa-chevron-left icon"></i>
    </button>
    <div class="middle">
      <span>{{ data?.page }}</span>
      <i>of</i>
      <b
        ><i>{{ data?.totalPages }}</i></b
      >
    </div>
    <button
      class="right-btn"
      :title="data?.hasNextPage ? 'Next Page' : undefined"
      :disabled="!data?.hasNextPage"
      @click="handleNextPage"
    >
      <i class="fa-solid fa-chevron-right icon"></i>
    </button>
    <button
      class="last-btn"
      :title="data?.hasNextPage ? 'Last Page' : undefined"
      :disabled="!data?.hasNextPage"
      @click="handleLastPage"
    >
      <i class="fa-solid fa-angles-right icon"></i>
    </button>
    <div class="total">
      <h5>Total Titles:</h5>
      <div class="circle">
        <span>{{ data?.totalDocs }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { LocationQuery, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "PaginationVue",
  props: ["data"],

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const handleFirstPage = () => {
      router.push({
        name: route.name || "",
        query: { ...route.query, page: 1 },
      });
      store.dispatch("fetchMovies", { ...route.query, page: 1 });
    };

    const handlePrevPage = () => {
      router.push({
        name: route.name || "",
        query: { ...route.query, page: props.data?.prevPage },
      });
      store.dispatch("fetchMovies", {
        ...route.query,
        page: props.data?.prevPage,
      });
    };

    const handleNextPage = () => {
      router.push({
        name: route.name || "",
        query: { ...route.query, page: props.data?.nextPage },
      });
      store.dispatch("fetchMovies", {
        ...route.query,
        page: props.data?.nextPage,
      });
    };

    const handleLastPage = () => {
      router.push({
        name: route.name || "",
        query: { ...route.query, page: props.data?.totalPages },
      });
      store.dispatch("fetchMovies", {
        ...route.query,
        page: props.data?.totalPages,
      });
    };

    return {
      handleFirstPage,
      handlePrevPage,
      handleNextPage,
      handleLastPage,
    };
  },
});
</script>
