<template>
  <form @submit.prevent="handleSubmit">
    <div class="col1">
      <div :class="[contentType === 'tv' ? 'input-box-tv' : 'input-box']">
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          :placeholder="`enter ${contentType} title`"
          v-model="title"
          required
        />
      </div>

      <div :class="[contentType === 'tv' ? 'input-box-tv' : 'input-box']">
        <label for="startYear">{{
          contentType === "movie" ? "Year" : "Start Year"
        }}</label>
        <input
          type="number"
          id="startYear"
          :placeholder="`enter year for ${contentType}`"
          v-model="startYear"
          required
        />
      </div>

      <div
        :class="[contentType === 'tv' ? 'input-box-tv' : 'input-box']"
        v-if="contentType === 'tv'"
      >
        <label for="endYear">End Year</label>
        <input
          type="number"
          id="endYear"
          :placeholder="`enter end year for ${contentType}`"
          v-model="endYear"
        />
      </div>

      <div :class="[contentType === 'tv' ? 'input-box-tv' : 'input-box']">
        <label for="videoUrl">Video Url</label>
        <input
          type="text"
          id="videoUrl"
          :placeholder="`enter video url for ${contentType}`"
          v-model="videoUrl"
        />
      </div>
    </div>
    <div class="col2">
      <label for="description">Description</label>
      <textarea
        id="description"
        cols="30"
        rows="10"
        :placeholder="`enter ${contentType} description`"
        v-model="description"
        required
      ></textarea>
    </div>
    <div class="col3">
      <divider-vue :text="`${contentType} crew`" />
      <content-crew :contentType="contentType" />
      <divider-vue text="Pick Genres" />
      <ContentGenres />
    </div>
    <button class="btn-outline">Submit Form</button>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import ContentGenres from "./ContentGenres.vue";
import DividerVue from "../DividerVue.vue";
import ContentCrew from "./ContentCrew.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CreateForm",
  components: { ContentGenres, DividerVue, ContentCrew },
  props: ["contentType"],

  setup(props) {
    const store = useStore();

    const contentInfo = computed(() => store.getters.info).value;

    const title = ref(contentInfo.title || "");
    const startYear = ref(contentInfo.startYear || "");
    const endYear = ref(contentInfo.endYear || "");
    const videoUrl = ref(contentInfo.videoUrl || "");
    const description = ref(contentInfo.description || "");

    const imageFile = computed(() => store.getters.getImageFile);

    watchEffect(() => {
      if (title.value) {
        store.commit("SET_TITLE", title.value);
      }

      if (startYear.value) {
        store.commit("SET_START_YEAR", startYear.value);
      }

      if (endYear.value) {
        store.commit("SET_END_YEAR", endYear.value);
      }

      if (videoUrl.value) {
        store.commit("SET_VIDEO_URL", videoUrl.value);
      }

      if (description.value) {
        store.commit("SET_DESCRIPTION", description.value);
      }
    });

    const isAddContentSuccess = computed(
      () => store.getters.isAddContentSuccess
    );
    const successMsg = computed(() => store.getters.addContentSuccessMsg);

    watchEffect(() => {
      if (isAddContentSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        store.commit("SET_IMAGE_FILE", {});
        store.commit("RESET_GENRES");
        store.commit("RESET_CREW");
        store.commit("RESET_ADD_CONTENT");
        store.commit("RESET_INFO");
        localStorage.removeItem("contentInfo");
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        title.value = "";
        startYear.value = "";
        endYear.value = "";
        videoUrl.value = "";
        description.value = "";
      }
    });

    const handleSubmit = () => {
      const crewFromStorage = computed(() => store.getters.crew);

      const crew = {
        directors: crewFromStorage.value.directors.map(
          (x: { _id: string; name: string }) => {
            return { name: x.name };
          }
        ),
        cast: crewFromStorage.value.cast.map(
          (x: { _id: string; name: string }) => {
            return { name: x.name };
          }
        ),
      };

      const genres = computed(() => store.getters.pickedGenres);

      const contentData = {
        title: title.value,
        startYear: startYear.value,
        endYear: endYear.value,
        videoUrl: videoUrl.value,
        description: description.value,
        crew,
        genres: genres.value,
        image: imageFile.value?.image,
        type: props.contentType,
      };

      if (!imageFile.value?.image) {
        store.commit("TOGGLE_IMG_ERROR", true);
        return;
      }

      store.dispatch("addContent", contentData);
    };

    return {
      title,
      startYear,
      endYear,
      videoUrl,
      description,
      handleSubmit,
    };
  },
});
</script>
