<template>
  <div class="fav-content-config">
    <div class="col1">
      <span
        >Favorite Titles: <em>{{ count }}</em></span
      >
    </div>
    <div class="col2">
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
  name: "FavContentConfig",
  props: ["count"],

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const sort = ref<string | LocationQueryValue[]>("asc");

    const qSort = computed(() => route.query.sort);

    watchEffect(() => {
      if (qSort.value) {
        sort.value = qSort.value;
      }
    });

    watchEffect(() => {
      if (sort.value) {
        router.push({
          name: "favorites",
          query: { sort: sort.value },
        });
      }

      store.dispatch("getFavContent", sort.value);
    });

    const handleSortArrows = () => {
      if (sort.value === "desc") {
        sort.value = "asc";
      } else {
        sort.value = "desc";
      }
    };

    return {
      sort,
      handleSortArrows,
    };
  },
});
</script>
