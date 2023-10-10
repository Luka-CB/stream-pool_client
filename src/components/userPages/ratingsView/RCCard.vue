<template>
  <div class="rated-content-card">
    <div class="col1">
      <div :class="!isImgLoaded ? 'pulsing-img' : 'image'">
        <img
          v-show="isImgLoaded"
          :src="content?.posterUrl"
          alt="poster"
          @load="handleImgLoad"
        />
      </div>
    </div>
    <div class="col2">
      <div class="row1">
        <div class="row1-col1">
          <router-link :to="{ name: 'details', params: { id: content?._id } }">
            <h2 id="title">{{ content?.title }}</h2>
          </router-link>
          <em id="year"
            >(
            {{
              content?.type === "tv"
                ? `${content?.startYear} - ${content?.endYear}`
                : content?.startYear
            }}
            )</em
          >
        </div>
        <div class="row1-col2">
          <span id="type">{{
            content?.type === "tv" ? "tv series" : "movie"
          }}</span>
        </div>
      </div>
      <div class="row2">
        <span id="genre" v-for="genre in content?.genres" :key="genre">{{
          genre
        }}</span>
      </div>
      <div class="row3">
        <div
          class="user-rating"
          @click="
            handleOpenRatingModal(
              content?._id,
              content?.userRating,
              content?.title
            )
          "
        >
          <i class="fa-solid fa-star user-star"></i>
          <b id="value">{{ content?.userRating?.value }}<span>/10</span></b>
        </div>
        <div class="avg-rating">
          <i class="fa-solid fa-star avg-star"></i>
          <b id="value"
            >{{ content?.rating?.avgRating?.toFixed(1) }}<span>/10</span></b
          >
        </div>
      </div>
      <div class="row4">
        <span id="date">rated on {{ content?.userRating?.createdAt }}</span>
      </div>
      <div class="row5">
        <p id="description">
          {{
            content?.description?.length <= 710
              ? content?.description
              : content?.description?.substring(0, 710) + "..."
          }}
        </p>
      </div>
      <div class="row6">
        <div class="directors">
          <b>{{ content?.type === "tv" ? "Created By:" : "Director(s):" }}</b>
          <span
            id="name"
            v-for="director in content?.crew?.directors"
            :key="director?._id"
            >{{ director?.name }}</span
          >
        </div>
        <div class="stars">
          <b>Stars:</b>
          <div class="names">
            <span
              id="name"
              v-for="star in content?.crew?.cast"
              :key="star?._id"
              >{{ star?.name }}</span
            >
          </div>
        </div>
      </div>
      <div class="row7">
        <span id="vote">Votes: {{ content?.rating?.count }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "RatedContentCard",
  props: ["content"],

  setup() {
    const store = useStore();

    const isImgLoaded = ref(false);
    const handleImgLoad = () => (isImgLoaded.value = true);

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
        route: { name: "ratings", param: "" },
      });
    };

    return {
      handleOpenRatingModal,
      isImgLoaded,
      handleImgLoad,
    };
  },
});
</script>
