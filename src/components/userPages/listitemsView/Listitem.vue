<template>
  <div
    :class="
      selectedListItemIds.includes(listItem?.listItemId)
        ? 'listitem-selected'
        : 'listitem'
    "
  >
    <div class="col1">
      <input
        type="checkbox"
        class="checkbox"
        :checked="selectedListItemIds.includes(listItem?.listItemId)"
        @change="handleOnChange(listItem?.listItemId)"
      />
    </div>
    <div class="col2">
      <div :class="!isImgLoaded ? 'pulsing-img' : 'image'">
        <img
          v-show="isImgLoaded"
          :src="listItem?.posterUrl"
          alt="poster"
          @load="handleImgLoad"
        />
      </div>
    </div>
    <div class="col3">
      <div class="row1">
        <div class="row1-col1">
          <router-link :to="{ name: 'details', params: { id: listItem?._id } }">
            <h2 id="title">{{ listItem?.title }}</h2>
          </router-link>
          <em id="year"
            >(
            {{
              listItem?.type === "tv"
                ? `${listItem?.startYear} - ${listItem?.endYear}`
                : listItem?.startYear
            }}
            )</em
          >
        </div>
        <div class="row1-col2">
          <span id="type">{{ listItem?.type }}</span>
        </div>
      </div>
      <div class="row2">
        <span id="genre" v-for="genre in listItem?.genres" :key="genre">{{
          genre
        }}</span>
      </div>
      <div class="row3">
        <div
          class="user-rating"
          @click="
            handleOpenRatingModal(
              listItem?._id,
              listItem?.userRating,
              listItem?.title
            )
          "
        >
          <div class="rated" v-if="listItem?.userRating">
            <i class="fa-solid fa-star user-star"></i>
            <b id="value">{{ listItem?.userRating?.value }}<span>/10</span></b>
          </div>
          <div class="unrated" title="Rate this" v-else>
            <i class="fa-regular fa-star unrated-star"></i>
          </div>
        </div>
        <div class="avg-rating" :title="`${listItem?.rating?.count} votes`">
          <i class="fa-solid fa-star avg-star"></i>
          <b id="value"
            >{{ listItem?.rating?.avgRating?.toFixed(1) }}<span>/10</span></b
          >
        </div>
      </div>
      <div class="row4">
        <span id="date">added on {{ listItem?.addedOn }}</span>
      </div>
      <div class="row5">
        <p id="description">
          {{
            listItem?.description?.length <= 710
              ? listItem?.description
              : listItem?.description?.substring(0, 710) + "..."
          }}
        </p>
      </div>
      <div class="row6">
        <div class="directors">
          <b>{{ listItem?.type === "tv" ? "Created By:" : "Director(s):" }}</b>
          <span
            id="name"
            v-for="director in listItem?.crew?.directors"
            :key="director?._id"
            >{{ director?.name }}</span
          >
        </div>
        <div class="stars">
          <b>Stars:</b>
          <div class="names">
            <span
              id="name"
              v-for="star in listItem?.crew?.cast"
              :key="star?._id"
              >{{ star?.name }}</span
            >
          </div>
        </div>
      </div>
      <div class="row7">
        <div class="fav-icon" @click="handleFavIcon(listItem?._id)">
          <i
            :class="[
              'fa-regular',
              'fav-icon',
              isAddToFavLoading && listItemId === listItem?._id
                ? 'fa-heart heart-beat'
                : 'fa-heart',
            ]"
            v-if="!listItem?.isInFav"
          ></i>
          <i
            v-else
            title="Click to remove from the list"
            :class="[
              'fa-solid',
              isAddToFavLoading && listItemId === listItem?._id
                ? 'fa-heart heart-beat'
                : 'fa-heart',
            ]"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "FavContentCard",
  props: ["listItem"],

  setup() {
    const store = useStore();
    const route = useRoute();

    const handleOnChange = (liId: string) => {
      store.commit("SET_SELECTED_LISTITEM_IDS", liId);
    };

    const isImgLoaded = ref(false);
    const handleImgLoad = () => (isImgLoaded.value = true);

    const listId = computed(() => route.params.listId);
    const qSort = computed(() => route.query.sort);

    const selectedListItemIds = computed(
      () => store.getters.selectedListItemIds
    );

    const handleOpenRatingModal = (
      contentId: string,
      userRating: { _id: string; value: number } | null,
      title: string
    ) => {
      store.commit("TOGGLE_RATING_MODAL", true);
      userRating
        ? store.commit("SET_USER_RATING", {
            _id: userRating._id,
            rateNum: userRating.value,
          })
        : store.commit("SET_USER_RATING", {});
      store.commit("SET_RATING_MODAL_DATA", {
        contentId,
        title,
        route: {
          name: "lists",
          param: { listId: listId.value, sort: qSort.value },
        },
      });
    };

    //////// ADD OR REMOVE FROM FAVORITE ////////
    const listItemId = ref("");

    const isAddToFavLoading = ref(false);
    const isAddToFavSuccess = computed(() => store.getters.addToFavSuccess);

    watchEffect(() => {
      if (isAddToFavSuccess.value) {
        store.commit("RESET_FAV");
      }
    });

    const handleFavIcon = (liId: string) => {
      isAddToFavLoading.value = true;
      listItemId.value = liId;

      setTimeout(() => {
        store.commit("UPDATE_LISTITEM_FAV", liId);
        isAddToFavLoading.value = false;
      }, 1500);
      store.dispatch("addToFav", liId);
    };

    return {
      isImgLoaded,
      handleImgLoad,
      handleFavIcon,
      isAddToFavSuccess,
      listItemId,
      isAddToFavLoading,
      handleOpenRatingModal,
      handleOnChange,
      selectedListItemIds,
    };
  },
});
</script>
