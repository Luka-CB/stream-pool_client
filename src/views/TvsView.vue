<template>
  <div class="tvs-container">
    <top-panel :contentType="contentType" />
    <media-content
      :content="tvs"
      :isLoading="isLoading"
      :contentType="contentType"
    />
    <pagination-vue :data="paginationData" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import TopPanel from "../components/search&sort/TopPanel.vue";
import MediaContent from "../components/content/index.vue";
import PaginationVue from "../components/PaginationVue.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "TvsView",
  components: { MediaContent, TopPanel, PaginationVue },

  setup() {
    const store = useStore();
    const route = useRoute();

    const tvs = computed(() => store.getters.fetchTvs);
    const paginationData = computed(() => store.getters.tvPagination);
    const isLoading = computed(() => store.getters.tvsLoading);

    const storeGenre = computed(() => store.getters.genre);
    const storeYear = computed(() => store.getters.year);
    const storeRatingSort = computed(() => store.getters.ratingSort);
    const storeDateSort = computed(() => store.getters.dateSort);
    const storePage = computed(() => store.getters.page);
    const user = computed(() => store.getters.user);

    const contentType = computed(() => {
      const type = route.name?.toString();
      return type?.substring(0, type.length - 1);
    });

    const data = {
      genre: storeGenre.value,
      year: storeYear.value,
      sort:
        storeRatingSort.value === "asc"
          ? "r_asc"
          : storeRatingSort.value === "desc"
          ? "r_desc"
          : storeDateSort.value === "asc"
          ? "d_asc"
          : storeDateSort.value === "desc"
          ? "d_desc"
          : "",
      page: storePage.value,
      userId: user.value?.id,
    };

    watchEffect(() => {
      if (
        storeGenre.value ||
        storeYear.value ||
        storeRatingSort.value ||
        storeDateSort.value ||
        storePage.value
      ) {
        store.dispatch("fetchTvs", {
          ...data,
        });
      } else {
        store.dispatch("fetchTvs", {});
      }
    });

    return {
      tvs,
      isLoading,
      paginationData,
      contentType,
    };
  },
});
</script>

<style lang="scss" scoped>
.tvs-container {
  min-height: 80vh;
}
</style>
