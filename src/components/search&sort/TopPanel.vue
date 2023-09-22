<template>
  <div class="search-sort-container">
    <div class="row1">
      <search-bar />
      <div
        class="add-btn"
        :title="`Add ${contentType}`"
        @click="handleNavigation"
        v-if="user?.isAdmin"
      >
        <i class="fa-solid fa-circle-plus add-icon"></i>
      </div>
    </div>
    <div class="row2">
      <sort-by :contentType="contentType" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import SearchBar from "./SearchBar.vue";
import SortBy from "./SortBy.vue";

export default defineComponent({
  name: "TopPanel",
  components: { SearchBar, SortBy },
  props: ["contentType"],

  setup(props) {
    const router = useRouter();
    const store = useStore();

    const user = computed(() => store.getters.user);

    const handleNavigation = () => {
      router.push({
        name: "create",
        params: { type: props.contentType },
      });

      store.commit("RESET_GENRES");
      store.commit("RESET_CREW");
      store.commit("RESET_INFO");
    };

    return { handleNavigation, user };
  },
});
</script>

<style lang="scss" scoped>
.search-sort-container {
  width: 100%;
  height: 200px;
  margin-top: 30px;
  padding: 10px 0;
  background: rgb(21, 41, 38);
  background: linear-gradient(
    147deg,
    rgba(21, 41, 38, 1) 0%,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 69, 69, 1) 100%
  );
  box-shadow: 0 15px 12px -4px rgba(0, 0, 0, 0.197);

  .row1 {
    display: flex;
    align-items: center;

    .add-btn {
      border: 2px solid rgb(200, 200, 200);
      width: 58px;
      height: 55px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;

      .add-icon {
        font-size: 2.8rem;
      }

      &:hover {
        border-color: aliceblue;
        .add-icon {
          font-size: 3.3rem;
          color: aliceblue;
        }
      }
    }
  }
}
</style>
