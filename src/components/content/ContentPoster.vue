<template>
  <div class="poster-container">
    <div class="field-wrapper">
      <div :class="[imgError ? 'field-error' : 'field']">
        <div class="with-image" v-if="imageFile?.image">
          <img :src="imageFile?.image" :alt="imageFile?.name" />

          <div class="upload-again">
            <input
              type="file"
              id="btn"
              accept="image/*"
              hidden
              @change="handleInputFile($event)"
            />
            <button class="upload-btn">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <label for="btn">Browse Again</label>
            </button>
          </div>
        </div>
        <div class="no-image" v-else>
          <div class="text">
            <p id="err-msg" v-if="imgError">
              {{ contentType }} poster is required!
            </p>
            <p v-else>Please provide poster for the {{ contentType }}!</p>
          </div>
          <div class="upload">
            <input
              type="file"
              id="btn"
              accept="image/*"
              hidden
              @change="handleInputFile($event)"
            />
            <button class="upload-btn">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <label for="btn">Browse Image</label>
            </button>
          </div>
        </div>
      </div>
      <div class="image-info">
        <div class="col1">
          <h5 id="name">{{ imageFile?.name }}</h5>
          <h6 id="size">
            <em>{{ imageFile?.size }}</em>
          </h6>
        </div>
        <div class="col2">
          <h6 id="type">{{ imageFile?.type }}</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { partial } from "filesize";

const size = partial({ base: 2, standard: "jedec" });

export default defineComponent({
  name: "ContentPoster",
  props: ["contentType"],

  setup() {
    const store = useStore();

    const imageFile = computed(() => store.getters.getImageFile);
    const imgError = computed(() => store.getters.imgError);

    const handleInputFile = ($event: Event) => {
      const target = $event.target as HTMLInputElement;
      if (target && target.files) {
        store.commit("TOGGLE_IMG_ERROR", false);
        const file = target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          store.commit("SET_IMAGE_FILE", {
            name: file.name,
            size: size(file.size),
            type: file.type,
            image: reader.result,
          });
        };

        reader.readAsDataURL(file);
      }
    };

    return {
      handleInputFile,
      imageFile,
      imgError,
    };
  },
});
</script>
