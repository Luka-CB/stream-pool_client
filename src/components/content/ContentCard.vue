<template>
  <div class="card" @click="handleNavigation" @mouseenter="handleGetUserRating">
    <div :class="!isImgLoaded ? 'pulsing-img' : 'image'">
      <img
        v-show="isImgLoaded"
        :src="data?.posterUrl"
        :alt="`poster for ${data?.title}`"
        @load="handleImgLoad"
      />
    </div>
    <div class="content-info" v-if="isImgLoaded">
      <div class="row1">
        <div
          :class="user?.id ? 'list' : 'list-disabled'"
          :title="user?.id ? 'Add to the List' : 'You need to be logged in!'"
          @click.stop="handleOpenListModal"
        >
          <i class="fa-solid fa-square-plus add-icon"></i>
        </div>
        <div
          :class="
            !user?.id
              ? 'favorite-disabled'
              : data?.isInFavorite
              ? 'favorite-active'
              : 'favorite'
          "
          :title="
            !user?.id
              ? 'You need to be logged in!'
              : data?.isInFavorite
              ? `${data?.title.toUpperCase()}'s added to favorite'. Click to remove!`
              : 'Add to Favorite'
          "
          @click.stop="handleAddToFav"
        >
          <spinner-alt v-if="isAddToFavLoading" margin="0" />
          <div class="icons" v-else>
            <i
              class="fa-solid fa-heart fav-icon-active"
              v-if="data?.isInFavorite"
            ></i>
            <i class="fa-regular fa-heart fav-icon" v-else></i>
          </div>
        </div>
      </div>
      <div class="row2">
        <div
          class="avg-rating"
          :title="`based on ${data?.rating?.count} votes`"
        >
          <i class="fa-solid fa-star solid-star-icon"></i>
          <span id="no-rating" v-if="!data.rating?.avgRating">0.0</span>
          <b id="rating" v-else
            >{{ data.rating?.avgRating?.toFixed(1) }}<span>/10</span></b
          >
        </div>
        <div
          class="user-rating"
          title="Your Rating"
          @click.stop="handleOpenRatingModal"
        >
          <div class="rated" v-if="userRating?._id">
            <i class="fa-solid fa-star solid-star-icon"></i>
            <b id="rating">{{ userRating?.rateNum }}<span>/10</span></b>
          </div>
          <i
            :class="[
              'fa-regular',
              'fa-star',
              user?.id ? 'empty-star-icon' : 'empty-star-icon-disabled',
            ]"
            v-else
            :title="
              user?.id
                ? 'Not Rated, click to rate!'
                : 'You need to be logged in to rate!'
            "
          ></i>
        </div>
      </div>
      <div class="row3">
        <h4 id="title">{{ data.title }}</h4>
        <h5 id="year">
          {{
            data.type === "tv"
              ? `${data.startYear} - ${data.endYear}`
              : data.startYear
          }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "ContentCard",
  props: ["data"],
  components: { SpinnerAlt },

  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const isRated = ref(false);

    const user = computed(() => store.getters.user);
    const userRating = computed(() => store.getters.userRating);
    const isGetRatingLoading = computed(() => store.getters.getRatingLoading);

    const isImgLoaded = ref(false);
    const handleImgLoad = () => (isImgLoaded.value = true);

    const handleNavigation = () => {
      router.push({ name: "details", params: { id: props.data?._id } });
      store.commit("RESET_USER_RATING");
      window.scrollTo({ top: 0, left: 0 });
    };

    const handleOpenRatingModal = () => {
      if (user.value?.id) {
        store.commit("TOGGLE_RATING_MODAL", true);
        store.commit("SET_RATING_MODAL_DATA", {
          contentId: props.data?._id,
          title: props.data?.title,
        });
      }
    };

    const handleOpenListModal = () => {
      if (user.value?.id) {
        store.commit("TOGGLE_LIST_MODAL", true);
        store.commit("SET_LIST_MODAL_DATA", {
          contentId: props.data?._id,
          title: props.data?.title,
        });
      }
    };

    const handleGetUserRating = () => {
      if (user.value?.id && userRating.value) {
        store.commit("RESET_USER_RATING");
        store.dispatch("getRating", props.data?._id);
      }
    };

    const isAddToFavLoading = computed(() => store.getters.addToFavLoading);
    const isAddToFavSuccess = computed(() => store.getters.addToFavSuccess);
    const routeName = computed(() => route.name);

    watchEffect(() => {
      if (isAddToFavSuccess.value) {
        store.commit("RESET_FAV");
      }
    });

    const handleAddToFav = () => {
      if (user.value?.id) {
        store.dispatch("addToFav", props.data?._id);
        if (routeName.value === "tvs") {
          store.commit("TOGGLE_TV_FAV", props.data?._id);
        } else {
          store.commit("TOGGLE_MOVIE_FAV", props.data?._id);
        }
      }
    };

    return {
      isRated,
      handleNavigation,
      isImgLoaded,
      handleImgLoad,
      user,
      handleOpenRatingModal,
      handleOpenListModal,
      userRating,
      handleGetUserRating,
      isGetRatingLoading,
      handleAddToFav,
      isAddToFavLoading,
    };
  },
});
</script>
