<template>
  <div class="listitems-container">
    <div class="icon-btns">
      <go-back :route="{ name: 'lists', params: '' }" />
      <div
        class="home-icon"
        title="Back to home page"
        @click="handleNavigation"
      >
        <i class="fa-solid fa-house-chimney-window"></i>
      </div>
    </div>

    <div class="listitems-wrapper">
      <div class="spinner" v-if="isGetListItemsLoading">
        <spinner-vue :height="4" :width="4" />
      </div>
      <p id="no-content" v-else-if="listItems?.length === 0">no list items!</p>
      <div class="list-title" title="Update List Title">
        <h1
          :title="listTitle.length > 14 ? listTitle : undefined"
          v-if="windowWidth <= 450"
        >
          {{
            listTitle.length <= 14
              ? listTitle
              : listTitle.substring(0, 14) + "..."
          }}
        </h1>
        <h1 :title="listTitle.length > 34 ? listTitle : undefined" v-else>
          {{
            listTitle.length <= 34
              ? listTitle
              : listTitle.substring(0, 34) + "..."
          }}
        </h1>
        <i class="fa-solid fa-pencil" @click="handleOpenUpdListModal"></i>
      </div>
      <listitems-config :count="listItemsCount" />
      <div class="cards-wrapper">
        <list-item
          v-for="listItem in listItems"
          :key="listItem._id"
          :listItem="listItem"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import GoBack from "../../components/GoBack.vue";
import ListitemsConfig from "../../components/userPages/listitemsView/ListitemsConfig.vue";
import ListItem from "../../components/userPages/listitemsView/Listitem.vue";
import SpinnerVue from "../../components/Spinner.vue";
import { useWindowWidth } from "../../composables/windowResize";

export default defineComponent({
  components: {
    GoBack,
    ListitemsConfig,
    ListItem,
    SpinnerVue,
  },
  name: "ListsView",

  setup() {
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const routeName = computed(() => route.name);
    watchEffect(() => {
      if (routeName.value) {
        store.commit("SET_EXCLUDE_ROUTE", routeName.value);
      }
    });

    const listId = computed(() => route.params.listId);

    const listItems = computed(() => store.getters.listItems);
    const listTitle = computed(() => store.getters.listTitle);
    const listItemsCount = computed(() => store.getters.listItemsCount);
    const isGetListItemsLoading = computed(
      () => store.getters.getListItemsLoading
    );

    store.dispatch("getListItems", { listId: listId.value, sort: "asc" });

    const prevRoute = computed(() => store.getters.prevRoute);

    const handleNavigation = () => {
      router.push({ name: "home" });
    };

    const handleOpenUpdListModal = () => {
      store.commit("SET_UPD_LIST_MODAL_DATA", {
        listId: listId.value,
        listTitle: listTitle.value,
      });
      store.commit("TOGGLE_UPD_LIST_MODAL", true);
    };

    const { windowWidth } = useWindowWidth();

    return {
      handleNavigation,
      prevRoute,
      listItems,
      listTitle,
      listItemsCount,
      isGetListItemsLoading,
      handleOpenUpdListModal,
      windowWidth,
    };
  },
});
</script>
