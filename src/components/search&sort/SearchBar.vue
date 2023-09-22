<template>
  <div class="search">
    <div class="search-input" @click.stop>
      <input
        type="text"
        placeholder="search movies or tv shows"
        v-model="searchText"
        @keyup="handleSearch"
      />
      <div class="icon">
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <div
        class="search-result-wrapper"
        :style="searchResWrapperStyle"
        v-if="isSearchResultActive"
      >
        <div class="search-res-header">
          <h3 id="title">
            Found:
            <em>{{
              searchedContentCount === 1
                ? "1 title"
                : `${searchedContentCount} titles`
            }}</em>
          </h3>
          <i class="fa-solid fa-circle-xmark" @click="handleCloseSearchRes"></i>
        </div>
        <div class="search-res-body" :style="searchResBodyStyle">
          <div class="spinner" v-if="isLoading">
            <spinner-vue :width="4" :height="4" />
          </div>
          <p id="err-text" v-else-if="searchedContentCount === 0">
            nothing found!
          </p>
          <div
            class="content"
            v-for="content in searchedContent"
            :key="content?._id"
            v-else
            @click="handleNavigation(content?._id)"
          >
            <div class="col1">
              <img :src="content?.posterUrl" :alt="content?.title" />
            </div>
            <div class="col2">
              <div class="row1">
                <h4 id="content-title">{{ content?.title }}</h4>
                <h5 id="content-year">
                  <em
                    >(
                    {{
                      content?.type === "movie"
                        ? content?.startYear
                        : `${content?.startYear} - ${content?.endYear}`
                    }}
                    )</em
                  >
                </h5>
              </div>
              <div class="row2">
                <span v-for="genre in content?.genres" :key="genre">{{
                  genre
                }}</span>
              </div>
              <div class="row3">
                <p>
                  {{
                    content?.description?.length <= 680
                      ? content?.description
                      : `${content?.description?.substring(1, 680)}...`
                  }}
                </p>
              </div>
            </div>
            <div class="col3">
              <div class="rating">
                <i class="fa-solid fa-star"></i>
                <span id="rating-num"
                  >{{ content?.rating?.avgRating?.toFixed(1)
                  }}<em>/10</em></span
                >
              </div>
              <div class="type">
                <span>{{ content?.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerVue from "../Spinner.vue";

export default defineComponent({
  name: "SearchBar",
  components: { SpinnerVue },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const searchText = ref("");

    const searchResWrapperStyle = {
      height: route.name === "home" ? "75vh" : "90vh",
    };
    const searchResBodyStyle = {
      height: route.name === "home" ? "68vh" : "83vh",
    };

    const isSearchResultActive = computed(
      () => store.getters.searchResultActive
    );

    const searchedContent = computed(() => store.getters.searchedContent);
    const searchedContentCount = computed(
      () => store.getters.searchedContentCount
    );
    const isLoading = computed(() => store.getters.getSearchedContentLoading);

    watchEffect(() => {
      if (searchText.value) {
        store.commit("TOGGLE_SEARCH_RESULT", true);
      } else {
        store.commit("TOGGLE_SEARCH_RESULT", false);
      }
    });

    const timeOut = ref<number | null>(null);

    const handleSearch = () => {
      if (timeOut.value) {
        clearTimeout(timeOut.value);
        timeOut.value = null;
      }

      timeOut.value = setTimeout(() => {
        store.dispatch("getSearchedContent", searchText.value);
      }, 800);
    };

    const handleCloseSearchRes = () => {
      searchText.value = "";
      store.commit("TOGGLE_SEARCH_RESULT", false);
    };

    const handleNavigation = (contentId: string) => {
      if (route.name === "details") {
        router.push({ name: "details", params: { id: contentId } });
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }

      router.push({ name: "details", params: { id: contentId } });
      handleCloseSearchRes();
    };

    return {
      isSearchResultActive,
      searchText,
      handleCloseSearchRes,
      searchResWrapperStyle,
      searchResBodyStyle,
      searchedContent,
      isLoading,
      handleSearch,
      searchedContentCount,
      handleNavigation,
    };
  },
});
</script>
