<template>
  <div class="upd-poster-bg" @click="handleCloseModal">
    <div class="upd-poster-body" @click.stop>
      <div class="spinner" v-if="isLoading">
        <spinner-vue :width="5" :height="5" />
      </div>
      <div class="poster-wrapper">
        <div class="field">
          <button class="label-btn">
            <label for="poster"></label>
          </button>
          <div class="field-text" v-if="!imageFile.image">
            <span>Choose File</span>
            <div class="icons">
              <i class="fa-solid fa-plus"></i>
              <i class="fa-regular fa-image"></i>
            </div>
          </div>
          <div class="image" v-else>
            <img :src="imageFile.image" :alt="imageFile.name" />
          </div>
          <input
            type="file"
            id="poster"
            accept="image/*"
            hidden
            @change="handleInputFile($event)"
          />
        </div>
        <div class="img-info">
          <div class="col1">
            <h5 id="name">{{ imageFile.name }}</h5>
            <em id="size">{{ imageFile.size }}</em>
          </div>
          <div class="col2">
            <h6 id="img-type">{{ imageFile.type }}</h6>
          </div>
        </div>
      </div>
      <div class="btns">
        <button
          class="btn-outline upload-btn"
          @click="handleUpload"
          :disabled="!imageFile.image"
        >
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <span>{{ isLoading ? "uploading..." : "upload" }}</span>
        </button>
        <button
          class="btn-outline cancel-btn"
          @click="handleCloseModal"
          :disabled="isLoading"
        >
          <i class="fa-solid fa-xmark"></i>
          <span>cancel</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useStore } from "vuex";
import { partial } from "filesize";
import SpinnerVue from "../Spinner.vue";

const size = partial({ base: 2, standard: "jedec" });

export default defineComponent({
  name: "UpdatePoster",
  components: { SpinnerVue },
  props: ["contentId"],

  setup(props) {
    const store = useStore();

    const imageFile = computed(() => store.getters.getImageFile);
    const isLoading = computed(() => store.getters.isUpdPosterLoading);
    const isSuccess = computed(() => store.getters.isUpdPosterSuccess);
    const successMsg = computed(() => store.getters.updPosterMsg);

    const handleInputFile = (event: Event) => {
      const target = event.target as HTMLInputElement;

      if (target && target.files) {
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

        file && reader.readAsDataURL(file);
      }
    };

    const handleCloseModal = () => {
      store.commit("TOGGLE_POSTER_MODAL", false);
      store.commit("SET_IMAGE_FILE", {});
    };

    watchEffect(() => {
      if (isSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          handleCloseModal();
          store.commit("RESET_UPD_POSTER");
          window.location.reload();
        }, 2000);
      }
    });

    const handleUpload = () =>
      store.dispatch("updatePoster", {
        contentId: props.contentId,
        image: imageFile.value.image,
      });

    return {
      handleInputFile,
      imageFile,
      handleCloseModal,
      isLoading,
      handleUpload,
    };
  },
});
</script>
