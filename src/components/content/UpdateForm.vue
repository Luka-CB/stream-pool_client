<template>
  <form @submit.prevent="submitHandler">
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
      <content-crew :dbCrew="content?.crew" />
      <divider-vue text="pick genres" />
      <content-genres :dbGenres="content?.genres" />
    </div>
    <button class="btn-outline">Submit Form</button>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import DividerVue from "../DividerVue.vue";
import ContentCrew from "./ContentCrew.vue";
import ContentGenres from "./ContentGenres.vue";

export default defineComponent({
  name: "UpdateForm",
  components: { DividerVue, ContentCrew, ContentGenres },
  props: ["contentType", "content"],

  setup(props) {
    const store = useStore();
    const route = useRoute();

    const title = ref("");
    const startYear = ref("");
    const endYear = ref("");
    const videoUrl = ref("");
    const description = ref("");

    watchEffect(() => {
      if (props.content && props.content._id) {
        title.value = props.content.title;
        startYear.value = props.content.startYear;
        endYear.value = props.content.endYear;
        videoUrl.value = props.content.videoUrl;
        description.value = props.content.description;
      }
    });

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const submitHandler = () => {
      const crewFromStorage = computed(() => store.getters.crew);

      const crew = {
        directors: crewFromStorage.value.directors.map((x: any) => {
          return { name: x.name };
        }),
        cast: crewFromStorage.value.cast.map((x: any) => {
          return { name: x.name };
        }),
      };

      const genres = computed(() => store.getters.pickedGenres);

      store.dispatch("updateContent", {
        _id: props.content?._id,
        title: title.value,
        startYear: startYear.value,
        endYear: endYear.value,
        videoUrl: videoUrl.value,
        description: description.value,
        crew,
        genres: genres.value,
      });
    };

    return {
      title,
      startYear,
      endYear,
      videoUrl,
      description,
      submitHandler,
    };
  },
});
</script>
