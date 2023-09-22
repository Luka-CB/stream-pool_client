<template>
  <div class="content-info-container">
    <div class="spinner" v-if="isLoading">
      <spinner-vue :width="5" :height="5" />
    </div>
    <div class="content-info" v-else>
      <div class="col1">
        <div class="poster">
          <div :class="!isImgLoaded ? 'pulsing-img' : 'image'">
            <img
              v-show="isImgLoaded"
              :src="data?.posterUrl"
              :alt="`poster for ${data?.title}`"
              @load="handleImgLoad"
            />
            <div
              class="edit-icon"
              title="Change Poster"
              v-if="isImgLoaded && user?.isAdmin"
              @click="handleOpenPosterModal"
            >
              <i class="fa-solid fa-arrows-spin"></i>
            </div>
          </div>
          <div class="btns">
            <button
              class="btn-outline"
              :title="!user?.id ? 'You need to be logged in' : undefined"
              @click="handleOpenListModal"
              :disabled="!user?.id"
            >
              <i class="fa-solid fa-folder-plus folder-icon"></i>
              <span>Add to List</span>
            </button>
            <button
              :class="
                data?.isInFavorite
                  ? 'btn-outline fav-btn-active'
                  : 'fav-btn btn-outline'
              "
              :title="
                !user?.id
                  ? 'You need to be logged in'
                  : data?.isInFavorite
                  ? 'Click to remove from favorite!'
                  : undefined
              "
              @click="handleAddToFavorite"
              :disabled="!user?.id"
            >
              <spinner-alt
                :size="24"
                color="#07d1cd"
                margin="20"
                v-if="isAddToFavLoading"
              />
              <i
                class="fa-solid fa-heart fav-icon-active"
                v-if="data?.isInFavorite"
              ></i>
              <i class="fa-regular fa-heart fav-icon" v-else></i>
              <span>{{
                data?.isInFavorite ? "Added to Favorite" : "Add to Favorite"
              }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="col2">
        <div class="info">
          <h1 id="title">{{ data?.title }}</h1>
          <h3 id="year">
            {{
              data.type === "tv"
                ? `${data.startYear} - ${data.endYear}`
                : data.startYear
            }}
          </h3>
          <div class="genres">
            <span id="genre" v-for="genre in data?.genres" :key="genre">{{
              genre
            }}</span>
          </div>
          <p id="description">{{ data?.description }}</p>
          <div class="cast">
            <b>Cast:</b>
            <div class="cast-members">
              <h5
                id="member"
                v-for="castMember in data.crew?.cast"
                :key="castMember._id"
              >
                {{ castMember.name }}
              </h5>
            </div>
          </div>
          <div class="director">
            <b>{{ data.type === "tv" ? "Created By: " : "Director: " }}</b>
            <div class="directors">
              <h5 id="name" v-for="dir in data.crew?.directors" :key="dir._id">
                {{ dir.name }}
              </h5>
            </div>
          </div>

          <div class="rating">
            <div class="avg-rating">
              <i class="fa-solid fa-star solid-star-icon"></i>
              <span id="no-rating" v-if="!data?.rating?.avgRating">0.0</span>
              <div class="avg-rating-num" v-else>
                <b id="num"
                  >{{ data?.rating?.avgRating?.toFixed(1) }}<span>/10</span></b
                >
                <em id="votes">({{ data?.rating?.count }} votes)</em>
              </div>
            </div>
            <spinner-alt v-if="isGetRatingLoading" />
            <div
              class="user-rating"
              v-else
              title="Your Rating. Click to Change"
            >
              <div
                class="rated"
                v-if="userRating?._id"
                @click="handleOpenRatingModal"
              >
                <i class="fa-solid fa-star solid-star-icon"></i>
                <b id="num">{{ userRating?.rateNum }}<span>/10</span></b>
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
                    ? 'Not Rated. Click to Rate'
                    : 'You need to be logged in to rate!'
                "
                @click="handleOpenRatingModal"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerVue from "../Spinner.vue";
import SpinnerAlt from "../SpinnerAlt.vue";

export default defineComponent({
  name: "ContentInfo",
  components: { SpinnerVue, SpinnerAlt },
  props: ["data", "isLoading"],

  setup(props) {
    const store = useStore();

    const isImgLoaded = ref(false);

    const user = computed(() => store.getters.user);
    const userRating = computed(() => store.getters.userRating);
    const isGetRatingLoading = computed(() => store.getters.ratingModal);

    const handleImgLoad = () => (isImgLoaded.value = true);

    const handleOpenPosterModal = () =>
      store.commit("TOGGLE_POSTER_MODAL", true);

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
      store.commit("TOGGLE_LIST_MODAL", true);
      store.commit("SET_LIST_MODAL_DATA", {
        contentId: props.data?._id,
        title: props.data?.title,
      });
    };

    const isAddToFavLoading = computed(() => store.getters.addToFavLoading);
    const isAddToFavSuccess = computed(() => store.getters.addToFavSuccess);

    watchEffect(() => {
      if (isAddToFavSuccess.value) {
        store.commit("TOGGLE_FAVORITE");
        store.commit("RESET_FAV");
      }
    });

    const handleAddToFavorite = () => {
      store.dispatch("addToFav", props.data?._id);
    };

    return {
      handleImgLoad,
      isImgLoaded,
      user,
      handleOpenPosterModal,
      handleOpenRatingModal,
      userRating,
      isGetRatingLoading,
      handleOpenListModal,
      handleAddToFavorite,
      isAddToFavLoading,
    };
  },
});
</script>
