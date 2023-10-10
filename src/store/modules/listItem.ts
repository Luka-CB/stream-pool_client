import { ActionContext } from "vuex";
import { StateIface } from "..";
import axios from "@/utils/axios";
import { format } from "date-fns";

export interface listitemIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  posterUrl: string;
  type: string;
  genres: string[];
  description: string;
  rating: {
    avgRating: number;
    count: number;
  };
  crew: {
    directors: {
      _id: string;
      name: string;
    }[];
    cast: {
      _id: string;
      name: string;
    }[];
  };
  userRating: {
    _id: string;
    value: number;
  } | null;
  listItemId: string;
  isInFav: boolean;
  addedOn: string;
}

interface searchedListItemsIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  posterUrl: string;
  type: string;
}

export interface ListItemStateIFace {
  listItems: listitemIFace[];
  listTitle: string;
  listItemsCount: number;
  searchedListItems: searchedListItemsIFace[];
  selectedListItemIds: string[];
  isAddListItemLoading: boolean;
  isAddListItemSuccess: boolean;
  isGetListitemsLoading: boolean;
  isDelListItemsLoading: boolean;
  isDelListItemsSuccess: boolean;
  isGetSearchedListItemsLoading: boolean;
}

const state: ListItemStateIFace = {
  listItems: [],
  listTitle: "",
  listItemsCount: 0,
  searchedListItems: [],
  selectedListItemIds: [],
  isAddListItemLoading: false,
  isAddListItemSuccess: false,
  isGetListitemsLoading: false,
  isDelListItemsLoading: false,
  isDelListItemsSuccess: false,
  isGetSearchedListItemsLoading: false,
};

const getters = {
  listItems: (state: ListItemStateIFace) => state.listItems,
  listTitle: (state: ListItemStateIFace) => state.listTitle,
  listItemsCount: (state: ListItemStateIFace) => state.listItemsCount,
  searchedListItems: (state: ListItemStateIFace) => state.searchedListItems,
  selectedListItemIds: (state: ListItemStateIFace) => state.selectedListItemIds,
  isAddListItemLoading: (state: ListItemStateIFace) =>
    state.isAddListItemLoading,
  isAddListItemSuccess: (state: ListItemStateIFace) =>
    state.isAddListItemSuccess,
  getListItemsLoading: (state: ListItemStateIFace) =>
    state.isGetListitemsLoading,
  delListItemsLoading: (state: ListItemStateIFace) =>
    state.isDelListItemsLoading,
  delListItemsSuccess: (state: ListItemStateIFace) =>
    state.isDelListItemsSuccess,
  getSearchedListItemsLoading: (state: ListItemStateIFace) =>
    state.isGetSearchedListItemsLoading,
};

const mutations = {
  SET_LISTITEMS(
    state: ListItemStateIFace,
    payload: { listTitle: string; listitems: listitemIFace[]; count: number }
  ) {
    state.listItems = payload.listitems.map((listitem) => {
      const addedOn = format(new Date(listitem.addedOn), "d MMM yyyy");
      return { ...listitem, addedOn };
    });
    state.listTitle = payload.listTitle;
    state.listItemsCount = payload.count;
  },

  UPDATE_LISTITEM_FAV(state: ListItemStateIFace, payload: string) {
    state.listItems = state.listItems.map((li) => {
      if (li._id === payload) {
        li.isInFav = li.isInFav ? false : true;
      }

      return li;
    });
  },

  SET_SELECTED_LISTITEM_IDS(state: ListItemStateIFace, payload: string) {
    if (state.selectedListItemIds.some((sli) => sli === payload)) {
      state.selectedListItemIds = state.selectedListItemIds.filter(
        (sli) => sli !== payload
      );
    } else {
      state.selectedListItemIds.push(payload);
    }
  },

  SELECT_ALL_LISTITEMS(state: ListItemStateIFace) {
    if (state.selectedListItemIds.length === state.listItems.length) {
      state.selectedListItemIds = [];
    } else {
      state.selectedListItemIds = state.listItems.map(
        (listItem) => listItem.listItemId
      );
    }
  },

  REMOVE_LISTITEMS(state: ListItemStateIFace, payload: string[]) {
    state.listItems = state.listItems.filter(
      (listItem) => !payload.includes(listItem.listItemId)
    );
    state.listItemsCount = state.listItemsCount - payload.length;
    state.selectedListItemIds = [];
  },

  SET_SEARCHED_LISTITEMS(
    state: ListItemStateIFace,
    payload: searchedListItemsIFace[]
  ) {
    state.searchedListItems = payload;
  },

  RESET_LISTITEM(state: ListItemStateIFace) {
    if (state.isAddListItemSuccess) state.isAddListItemSuccess = false;
    if (state.isAddListItemSuccess) state.isDelListItemsSuccess = false;
  },
};

const actions = {
  async addListItem(
    { state }: ActionContext<ListItemStateIFace, StateIface>,
    listItemData: { contentId: string; listId: string }
  ) {
    state.isAddListItemLoading = true;
    state.isAddListItemSuccess = false;

    try {
      const { data } = await axios.post("/api/listitem/create", listItemData);

      if (data) {
        state.isAddListItemLoading = false;
        state.isAddListItemSuccess = true;
      }
    } catch (error) {
      state.isAddListItemLoading = false;
      console.log(error);
    }
  },

  async getListItems(
    { commit, state }: ActionContext<ListItemStateIFace, StateIface>,
    query: { listId: string; sort: string }
  ) {
    state.isGetListitemsLoading = true;

    try {
      const { data } = await axios.get(
        `/api/content/listitem/fetch-all?listId=${query.listId}&sort=${query.sort}`
      );

      if (data) {
        state.isGetListitemsLoading = false;
        commit("SET_LISTITEMS", data);
      }
    } catch (error) {
      state.isGetListitemsLoading = false;
      console.log(error);
    }
  },

  async getSearchedListItems(
    { commit, state }: ActionContext<ListItemStateIFace, StateIface>,
    q = ""
  ) {
    state.isGetSearchedListItemsLoading = true;

    try {
      const { data } = await axios.get(`/api/content/listitem/search?q=${q}`);

      if (data) {
        state.isGetSearchedListItemsLoading = false;
        commit("SET_SEARCHED_LISTITEMS", data);
      }
    } catch (error) {
      state.isGetSearchedListItemsLoading = false;
      console.log(error);
    }
  },

  async deleteListItems(
    { state }: ActionContext<ListItemStateIFace, StateIface>,
    listItemIds: string[]
  ) {
    state.isDelListItemsLoading = true;

    try {
      const { data } = await axios.delete(`/api/listitem/delete`, {
        data: { listItemIds },
      });

      if (data) {
        state.isDelListItemsLoading = false;
        state.isDelListItemsSuccess = true;
      }
    } catch (error) {
      state.isDelListItemsLoading = false;
      console.log(error);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
