<template>
  <div class="rated-content-container">
    <h2 id="title">titles you've rated</h2>
    <div class="divider"></div>
    <div class="rated-contents" :style="contentWrapperStyle">
      <div class="spinner" v-if="isGetRatedContentLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <div class="warning" v-else-if="ratedContents?.length === 0">
        <p>you have not rated any titles yet!</p>
      </div>
      <div
        class="content"
        v-for="content in ratedContents"
        :key="content?._id"
        v-else
      >
        <div
          :class="!isImgLoaded ? 'pulsing-img' : 'image'"
          @click="handleNavigation(`/details/${content?._id}`)"
        >
          <img
            v-show="isImgLoaded"
            :src="content?.posterUrl"
            :alt="content?.title"
            @load="handleImgLoad"
          />
        </div>
        <div class="info">
          <div
            class="content-title"
            @click="handleNavigation(`/details/${content?._id}`)"
          >
            <h4
              id="name"
              :title="content?.title?.length > 15 ? content?.title : undefined"
            >
              {{
                content?.title?.length <= 15
                  ? content?.title
                  : `${content?.title?.substring(0, 15)}...`
              }}
            </h4>
            <em id="year">{{
              content?.type === "tv"
                ? `( ${content?.startYear} - ${content?.endYear} )`
                : `( ${content?.startYear} )`
            }}</em>
          </div>
          <div class="rating">
            <div class="avg-rating">
              <i class="fas fa-star star-solid"></i>
              <span
                >{{ content?.rating?.avgRating?.toFixed(1) }}<em>/10</em></span
              >
            </div>
            <div
              class="user-rating"
              title="Your rating. Click to remove or change!"
              @click="
                handleOpenRatingModal(
                  content?._id,
                  content?.userRating,
                  content?.title
                )
              "
            >
              <i class="fas fa-star star-rated"></i>
              <span>{{ content?.userRating?.value }}<em>/10</em></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-link" v-if="ratedContents?.length > 0">
      <h4 id="link-text" @click="handleNavigateToRatings">
        see all
        <em>{{ ratedContentCount }}</em>
        titles
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerVue from "../../Spinner.vue";

export default defineComponent({
  name: "RatedContent",
  components: { SpinnerVue },

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const isImgLoaded = ref(false);
    const handleImgLoad = () => (isImgLoaded.value = true);

    const ratedContents = computed(() => store.getters.someRatedContents);
    const ratedContentCount = computed(
      () => store.getters.profileRatedContentCount
    );
    const isGetRatedContentLoading = computed(
      () => store.getters.getSomeRatedContentLoading
    );

    store.dispatch("getSomeRatedContents");

    const handleOpenRatingModal = (
      contentId: string,
      userRating: { _id: string; value: number },
      title: string
    ) => {
      store.commit("TOGGLE_RATING_MODAL", true);
      store.commit("SET_USER_RATING", {
        _id: userRating._id,
        rateNum: userRating.value,
      });
      store.commit("SET_RATING_MODAL_DATA", {
        contentId,
        title,
        route: { name: "profile", param: "" },
      });
    };

    const contentWrapperStyle = ref({});

    watchEffect(() => {
      if (ratedContents.value?.length <= 4) {
        contentWrapperStyle.value = { justifyContent: "flex-start" };
      } else {
        contentWrapperStyle.value = { justifyContent: "space-between" };
      }
    });

    const handleNavigation = (route: string) => router.push(route);

    const paramName = computed(() => route.params.name);

    const handleNavigateToRatings = () => {
      router.push({ name: "ratings" });

      store.commit("SET_PREV_ROUTE", {
        name: "profile",
        params: { name: paramName.value },
      });
    };

    return {
      ratedContents,
      contentWrapperStyle,
      ratedContentCount,
      isGetRatedContentLoading,
      handleImgLoad,
      isImgLoaded,
      handleOpenRatingModal,
      handleNavigation,
      handleNavigateToRatings,
    };
  },
});
</script>
