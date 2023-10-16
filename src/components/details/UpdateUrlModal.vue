<template>
  <div class="modal-bg" @click="handleCloseModal">
    <div class="modal-body" @click.stop>
      <div class="spinner" v-if="isLoading">
        <spinner-vue :width="4" :height="4" />
      </div>
      <h2>Update URL</h2>
      <input type="text" placeholder="enter url" v-model="inputUrl" />
      <button class="btn-primary" @click="handleSubmit">Submit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import SpinnerVue from "../Spinner.vue";

export default defineComponent({
  name: "UpdateUrlModal",
  props: ["url", "contentId"],
  components: { SpinnerVue },

  setup(props) {
    const store = useStore();

    const inputUrl = ref("");

    const isLoading = computed(() => store.getters.isUpdVideoUrlLoading);
    const isSuccess = computed(() => store.getters.isUpdVideoUrlSuccess);
    const successMsg = computed(() => store.getters.updVideoUrlMsg);

    watchEffect(() => {
      if (props.url) {
        inputUrl.value = props.url;
      }
    });

    const handleCloseModal = () => store.commit("TOGGLE_URL_MODAL", false);

    watchEffect(() => {
      if (isSuccess.value) {
        store.commit("SET_SUCCESS_MSG", successMsg.value);
        store.commit("TOGGLE_SUCCESS_MSG", true);
        setTimeout(() => {
          handleCloseModal();
          store.commit("RESET_UPD_VIDEO_URL");
          window.location.reload();
        }, 1000);
      }
    });

    const handleSubmit = () =>
      store.dispatch("updateVideoUrl", {
        contentId: props.contentId,
        url: inputUrl.value,
      });

    return {
      handleCloseModal,
      inputUrl,
      handleSubmit,
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.652);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade 0.2s ease-in;

  .modal-body {
    position: relative;
    width: 30%;
    min-width: 250px;
    background-color: rgb(11, 71, 70);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 0 42px rgba(9, 119, 117, 0.311);
    border: 3px solid rgb(0, 91, 89);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: zoom 0.2s ease-in;

    .spinner {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.748);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
    }

    input {
      width: 100%;
      height: 60px;
      font-size: small;
      margin-top: 20px;
    }

    .btn-primary {
      margin-top: 30px;
      width: 150px;
      height: 40px;
      border: none;
      box-shadow: 0 6px 6px -4px rgb(0, 0, 0);

      &:hover {
        box-shadow: 0 9px 9px -4px rgb(0, 0, 0);
      }

      &:active {
        box-shadow: 0 3px 3px -4px rgb(0, 0, 0);
      }
    }
  }
}
</style>
