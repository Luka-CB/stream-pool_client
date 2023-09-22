<template>
  <div class="fav-content-container">
    <h2 id="title">you're favorite titles</h2>
    <div class="divider"></div>
    <div class="fav-contents" :style="contentWrapperStyle">
      <div class="spinner" v-if="isGetFavContentLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <div class="warning" v-else-if="favContents?.length === 0">
        <p>no favorite title!</p>
      </div>
      <div
        v-else
        class="content"
        v-for="content in favContents"
        :key="content?.id"
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
          <div class="fav-icon">
            <i
              title="Click to remove from favorite"
              :class="[
                'fa-solid',
                heartBeat && favContentId === content?._id
                  ? 'fa-heart heart-beat'
                  : 'fa-heart',
              ]"
              @click="handleDeleteFromFav(content?._id)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-link" v-if="favContents?.length > 0">
      <h4 id="link-text" @click="handleNavigateToFavorites">
        see all
        <em>{{ favContentCount }}</em>
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
  name: "FavContent",
  components: { SpinnerVue },

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const isImgLoaded = ref(false);
    const handleImgLoad = () => (isImgLoaded.value = true);

    const favContents = computed(() => store.getters.someFavContents);
    const favContentCount = computed(
      () => store.getters.profileFavContentCount
    );
    const isGetFavContentLoading = computed(
      () => store.getters.getSomeFavContentLoading
    );

    store.dispatch("getSomeFavContents");

    //////// DELETE FROM FAVORITE ////////
    const heartBeat = ref(false);
    const favContentId = ref("");

    const isDelFavLoading = computed(() => store.getters.delFavLoading);
    const isDelFavSuccess = computed(() => store.getters.delFavSuccess);

    watchEffect(() => {
      if (isDelFavLoading.value) {
        heartBeat.value = true;
      }

      if (isDelFavSuccess.value) {
        store.commit("DELETE_FAV_CONTENT", favContentId.value);
        store.commit("RESET_FAV");
        heartBeat.value = false;
      }
    });

    const handleDeleteFromFav = (contentId: string) => {
      favContentId.value = contentId;
      store.dispatch("delFav", contentId);
    };

    //////////////////////////////////////////////
    const contentWrapperStyle = ref({});

    watchEffect(() => {
      if (favContents.value?.length <= 4) {
        contentWrapperStyle.value = { justifyContent: "flex-start" };
      } else {
        contentWrapperStyle.value = { justifyContent: "space-between" };
      }
    });

    const handleNavigation = (route: string) => router.push(route);

    const paramName = computed(() => route.params.name);

    const handleNavigateToFavorites = () => {
      router.push({ name: "favorites" });

      store.commit("SET_PREV_ROUTE", {
        name: "profile",
        params: { name: paramName.value },
      });
    };

    return {
      favContents,
      contentWrapperStyle,
      heartBeat,
      favContentCount,
      isGetFavContentLoading,
      isImgLoaded,
      handleImgLoad,
      handleNavigation,
      handleDeleteFromFav,
      favContentId,
      handleNavigateToFavorites,
    };
  },
});
</script>
