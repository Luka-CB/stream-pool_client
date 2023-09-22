<template>
  <div class="crew-container">
    <div class="director-wrapper">
      <div class="input-box">
        <label for="director">{{
          contentType === "tv" ? "Created By" : "Director(s)"
        }}</label>
        <div class="input">
          <input
            type="text"
            id="director"
            :placeholder="
              contentType === 'tv' ? 'enter tv creator' : 'enter movie director'
            "
            v-model="director"
            :required="crew.directors?.length === 0"
          />
          <button
            type="button"
            class="add-btn"
            @click="handleAddDirector"
            :disabled="!director"
          >
            Add
          </button>
        </div>
      </div>
      <div class="directors">
        <div class="director" v-for="dir in crew.directors" :key="dir._id">
          <span>{{ dir.name }}</span>
          <i
            class="fa-solid fa-circle-xmark"
            title="click to remove"
            @click="handleRemoveDirector(dir._id)"
          ></i>
        </div>
        <p id="no-directors" v-if="crew.directors?.length === 0">
          Nothing to show!
        </p>
        <p v-if="isDirectorExists" id="err-msg">Name already exists!</p>
      </div>
    </div>
    <div class="cast-wrapper">
      <div class="input-box">
        <label for="cast">Cast</label>
        <div class="input">
          <input
            type="text"
            id="cast"
            placeholder="add cast member"
            v-model="castMember"
            :required="crew.cast?.length === 0"
          />
          <button
            type="button"
            class="add-btn"
            @click="handleAddCastMember"
            :disabled="!castMember"
          >
            Add
          </button>
        </div>
      </div>

      <div class="cast-members">
        <div
          class="member"
          v-for="castMember in crew.cast"
          :key="castMember?._id"
        >
          <span>{{ castMember?.name }}</span>
          <i
            class="fa-solid fa-circle-xmark"
            title="click to remove"
            @click="handleRemoveCastMember(castMember._id)"
          ></i>
        </div>
        <p id="no-members" v-if="crew.cast?.length === 0">
          No Cast members chosen!
        </p>
        <p v-if="isMemberExists" id="err-msg">Name already exists!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "ContentCrew",
  props: ["contentType", "dbCrew"],

  setup(props) {
    const store = useStore();

    const crew = computed(() => store.getters.crew);
    const isMemberExists = computed(() => store.getters.isMemberExists);
    const isDirectorExists = computed(() => store.getters.isDirectorExists);

    const director = ref("");
    const castMember = ref("");

    const handleAddCastMember = () => {
      store.commit("SET_CAST", castMember.value);
      castMember.value = "";
    };

    const handleAddDirector = () => {
      store.commit("SET_DIRECTOR", director.value);
      director.value = "";
    };

    const handleRemoveCastMember = (id: string) =>
      store.commit("REMOVE_MEMBER", id);

    const handleRemoveDirector = (id: string) =>
      store.commit("REMOVE_DIRECTOR", id);

    watchEffect(() => {
      if (isMemberExists.value) {
        setTimeout(() => {
          store.commit("TOGGLE_MEMBER_EXISTS", false);
        }, 2000);
      }

      if (isDirectorExists.value) {
        setTimeout(() => {
          store.commit("TOGGLE_DIRECTOR_EXISTS", false);
        }, 2000);
      }
    });

    watchEffect(() => {
      if (props.dbCrew) {
        store.commit("SET_DB_CREW", props.dbCrew);
      }
    });

    return {
      director,
      castMember,
      handleAddCastMember,
      handleAddDirector,
      isMemberExists,
      isDirectorExists,
      crew,
      handleRemoveCastMember,
      handleRemoveDirector,
    };
  },
});
</script>
