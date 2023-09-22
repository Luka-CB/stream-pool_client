<template>
  <div class="delete-btn" title="Delete Account" @click="handleOpenPrompt">
    <i class="fa-solid fa-trash"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeleteAccount",

  setup() {
    const store = useStore();

    const handleOpenPrompt = () => {
      store.commit("TOGGLE_PROMPT", true);
      store.commit("SET_PROMPT_KEYWORD", "deleteAccount");
    };

    return {
      handleOpenPrompt,
    };
  },
});
</script>
