<template>
  <div class="rating-bg" @click="handleCloseRatingModal">
    <div class="rating-container" @click.stop>
      <i class="fa-solid fa-circle-xmark" @click="handleCloseRatingModal"></i>
      <div class="rated-val-wrapper">
        <i class="fas fa-star" :style="starStyle"></i>
        <span class="num" :style="numStyle">{{
          rating ? rating : userRating?._id ? userRating?.rateNum : "?"
        }}</span>
      </div>
      <h2 id="title">{{ ratingModalData.title }}</h2>
      <div class="stars">
        <div v-for="(val, i) in rateVal" :key="i">
          <label>
            <input
              type="radio"
              name="rating"
              :value="i + 1"
              @click="getValue"
            />
            <div
              v-if="i + 1 <= (hover || rating || userRating?.rateNum)"
              class="star-fill"
              @mouseenter="hover = i + 1"
              @mouseleave="hover = null"
            >
              <i class="fas fa-star"></i>
            </div>
            <div
              v-else
              class="star"
              @mouseenter="hover = i + 1"
              @mouseleave="hover = null"
            >
              <i class="far fa-star"></i>
            </div>
          </label>
        </div>
      </div>
      <div class="btns">
        <button
          class="btn-outline rate-btn"
          @click="handleSubmit"
          :disabled="!rating || isCreateRatingLoading"
        >
          <spinner-alt :size="24" v-if="isCreateRatingLoading" />
          <span>{{ isCreateRatingLoading ? "Rating..." : "Rate" }}</span>
        </button>
        <button
          class="btn-outline del-btn"
          @click="handleDelRating"
          :disabled="!userRating?._id || isCreateRatingLoading"
        >
          <spinner-alt :size="24" color="red" v-if="isDelRatingLoading" />
          <span>
            {{ isDelRatingLoading ? "Deleting..." : "Delete" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerAlt from "./SpinnerAlt.vue";

export default defineComponent({
  name: "RatingModal",
  components: { SpinnerAlt },

  setup() {
    const store = useStore();

    const userRating = computed(() => store.getters.userRating);

    const rateVal = ref([...Array(10)]);
    const rating = ref<number | null>(userRating.value?.rateNum || null);
    const hover = ref<number | null>(null);
    const starStyle = ref({
      fontSize: "6rem",
    });
    const numStyle = ref({ fontSize: "2.5rem" });

    watchEffect(() => {
      if (rating.value === 1) {
        starStyle.value = { fontSize: "5rem" };
        numStyle.value = { fontSize: "2.1rem" };
      } else if (rating.value === 2) {
        starStyle.value = { fontSize: "5.4rem" };
        numStyle.value = { fontSize: "2.2rem" };
      } else if (rating.value === 3) {
        starStyle.value = { fontSize: "5.8rem" };
        numStyle.value = { fontSize: "2.3rem" };
      } else if (rating.value === 4) {
        starStyle.value = { fontSize: "6.2rem" };
        numStyle.value = { fontSize: "2.4rem" };
      } else if (rating.value === 5) {
        starStyle.value = { fontSize: "6.6rem" };
        numStyle.value = { fontSize: "2.5rem" };
      } else if (rating.value === 6) {
        starStyle.value = { fontSize: "7rem" };
        numStyle.value = { fontSize: "2.6rem" };
      } else if (rating.value === 7) {
        starStyle.value = { fontSize: "7.4rem" };
        numStyle.value = { fontSize: "2.7rem" };
      } else if (rating.value === 8) {
        starStyle.value = { fontSize: "7.8rem" };
        numStyle.value = { fontSize: "2.8rem" };
      } else if (rating.value === 9) {
        starStyle.value = { fontSize: "8.2rem" };
        numStyle.value = { fontSize: "2.9rem" };
      } else if (rating.value === 10) {
        starStyle.value = { fontSize: "8.6rem" };
        numStyle.value = { fontSize: "3rem" };
      }
    });

    const ratingModalData = computed(() => store.getters.ratingModalData);

    const isCreateRatingLoading = computed(
      () => store.getters.createRatingLoading
    );
    const isCreateRatingSuccess = computed(
      () => store.getters.createRatingSuccess
    );
    const createRatingSuccessMsg = computed(
      () => store.getters.createRatingSuccessMsg
    );

    const isDelRatingLoading = computed(() => store.getters.delRatingLoading);
    const isDelRatingSuccess = computed(() => store.getters.delRatingSuccess);
    const delRatingSuccessMsg = computed(
      () => store.getters.delRatingSuccessMsg
    );

    const getValue = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.value) {
        rating.value = +target.value;
      }
    };

    watchEffect(() => {
      if (isCreateRatingSuccess.value) {
        store.commit("SET_SUCCESS_MSG", createRatingSuccessMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          store.commit("RESET_CREATE_RATING");
          ratingModalData.value.route?.name === "movie" &&
            store.commit("UPD_MOVIE_RATING", {
              contentId: ratingModalData.value.contentId,
              value: rating.value,
            });
          ratingModalData.value.route?.name === "tv" &&
            store.commit("UPD_TV_RATING", {
              contentId: ratingModalData.value.contentId,
              value: rating.value,
            });
          ratingModalData.value.route?.name === "profile" &&
            store.dispatch("getSomeRatedContents");
          ratingModalData.value.route?.name === "ratings" &&
            store.commit("UPD_RATED_CONTENT", {
              contentId: ratingModalData.value.contentId,
              rateVal: rating.value,
            });
          ratingModalData.value.route?.name === "favorites" &&
            store.dispatch(
              "getFavContent",
              ratingModalData.value.route?.param ??
                ratingModalData.value.route?.param
            );
          ratingModalData.value.route?.name === "lists" &&
            store.dispatch(
              "getListItems",
              ratingModalData.value.route?.param ??
                ratingModalData.value.route?.param
            );
        }, 2000);
      }
    });

    watchEffect(() => {
      if (isDelRatingSuccess.value) {
        store.commit("SET_SUCCESS_MSG", delRatingSuccessMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        ratingModalData.value.route?.name === "tv" &&
          store.commit("DEL_TV_RATING", ratingModalData.value.contentId);
        ratingModalData.value.route?.name === "movie" &&
          store.commit("DEL_MOVIE_RATING", ratingModalData.value.contentId);
        ratingModalData.value.route?.name === "profile" &&
          store.dispatch("getSomeRatedContents");
        ratingModalData.value.route?.name === "ratings" &&
          store.dispatch(
            "getRatedContent",
            ratingModalData.value.route?.param ??
              ratingModalData.value.route?.param
          );
        ratingModalData.value.route?.name === "favorites" &&
          store.dispatch(
            "getFavContent",
            ratingModalData.value.route?.param ??
              ratingModalData.value.route?.param
          );
        setTimeout(() => {
          store.commit("RESET_DEL_RATING");
          store.commit("RESET_USER_RATING");
          hover.value = null;
          rating.value = null;
          store.commit("TOGGLE_RATING_MODAL", false);
        }, 2000);
      }
    });

    const handleCloseRatingModal = () =>
      store.commit("TOGGLE_RATING_MODAL", false);

    const handleSubmit = () =>
      store.dispatch("createRating", {
        rateNum: rating.value,
        contentId: ratingModalData.value.contentId,
      });

    const handleDelRating = () =>
      store.dispatch("deleteRating", userRating.value?._id);

    return {
      rateVal,
      rating,
      getValue,
      ratingModalData,
      hover,
      handleCloseRatingModal,
      handleSubmit,
      isCreateRatingLoading,
      userRating,
      isDelRatingLoading,
      handleDelRating,
      starStyle,
      numStyle,
    };
  },
});
</script>
