<template>
  <div class="tvs-container">
    <top-panel :contentType="contentType" />
    <media-content
      :content="tvs"
      :isLoading="isLoading"
      :contentType="contentType"
    />
    <pagination-vue :data="paginationData" :contentType="contentType" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useStore } from "vuex";
import TopPanel from "../components/search&sort/TopPanel.vue";
import MediaContent from "../components/content/index.vue";
import PaginationVue from "../components/PaginationVue.vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";

export default defineComponent({
  name: "TvsView",
  components: { MediaContent, TopPanel, PaginationVue },

  setup() {
    const store = useStore();
    const route = useRoute();

    const tvs = computed(() => store.getters.fetchTvs);
    const paginationData = computed(() => store.getters.tvPagination);
    const isLoading = computed(() => store.getters.tvsLoading);

    const user = computed(() => store.getters.user);

    const contentType = computed(() => {
      const type = route.name?.toString();
      return type?.substring(0, type.length - 1);
    });

    const routeQuery = computed(() => route.query);

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
        store.dispatch("fetchTvs", data);
      } else {
        store.dispatch("fetchTvs", { userId: user.value?.id });
      }
    });

    useHead({
      title: "Tv Series",
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
