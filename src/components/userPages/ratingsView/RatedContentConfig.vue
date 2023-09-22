<template>
  <div class="rated-content-config">
    <div class="col1">
      <span
        >Rated Titles: <em>{{ count }}</em></span
      >
    </div>
    <div class="col2">
      <div class="filter">
        <span>Filter By:</span>
        <select v-model="filter">
          <option value="">Show All</option>
          <option v-for="num in numbers" :key="num" :value="num">
            {{ "Rated " + num + " Star" }}
          </option>
        </select>
      </div>
      <div class="sort">
        <span>Sort By Date:</span>
        <div
          class="arrows"
          :title="sort === 'asc' ? 'Ascending Order' : 'Descending Order'"
          @click="handleSortArrows"
        >
          <i
            :class="[
              'fa-solid',
              'fa-up-long',
              sort === 'asc' && 'up-arrow-active',
            ]"
          ></i>
          <i
            :class="[
              'fa-solid',
              'fa-down-long',
              sort === 'desc' && 'down-arrow-active',
            ]"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "RatedContentConfig",
  props: ["count"],

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const sort = ref<string | LocationQueryValue[]>("asc");
    const filter = ref<string | LocationQueryValue[]>("");

    const qFilter = computed(() => route.query.filter);
    const qSort = computed(() => route.query.sort);

    watchEffect(() => {
      if (qFilter.value) {
        filter.value = qFilter.value;
      }

      if (qSort.value) {
        sort.value = qSort.value;
      }
    });

    watchEffect(() => {
      if (filter.value) {
        router.push({
          name: "ratings",
          query: { filter: filter.value, sort: sort.value },
        });
      }

      if (sort.value) {
        router.push({
          name: "ratings",
          query: { filter: filter.value, sort: sort.value },
        });
      }

      store.dispatch("getRatedContent", {
        filter: filter.value,
        sort: sort.value,
      });
    });

    const handleSortArrows = () => {
      if (sort.value === "desc") {
        sort.value = "asc";
      } else {
        sort.value = "desc";
      }
    };

    return {
      numbers,
      sort,
      filter,
      handleSortArrows,
    };
  },
});
</script>
