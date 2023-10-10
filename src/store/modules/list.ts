import { ActionContext } from "vuex";
import { StateIface } from "..";
import axios from "@/utils/axios";
import { formatDistanceToNow } from "date-fns";
import { AxiosError } from "axios";

interface listsIFace {
  _id: string;
  title: string;
  userId: string;
  listItems: { _id: string; contentId: string }[];
  cover: string;
  isInTheList: boolean;
  createdAt: string;
  updatedAt: string;
}

interface userListsIFace {
  _id: string;
  title: string;
  listItems: number;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListIFace {
  listModalData: { contentId: string; title: string };
  updListModalData: { listId: string; listTitle: string };
  lists: listsIFace[];
  someLists: userListsIFace[];
  userLists: userListsIFace[];
  listsCount: number | null;
  listErrorMsg: string;
  listSuccessMsg: string;
  isCreateListLoading: boolean;
  isCreateListSuccess: boolean;
  isGetListsLoading: boolean;
  isUpdListLoading: boolean;
  isUpdListSuccess: boolean;
  isDelListLoading: boolean;
  isDelListSuccess: boolean;
  isGetSomeListsLoading: boolean;
  isGetUserListsLoading: boolean;
}

const state: ListIFace = {
  listModalData: { contentId: "", title: "" },
  updListModalData: { listId: "", listTitle: "" },
  lists: [],
  someLists: [],
  userLists: [],
  listsCount: null,
  listErrorMsg: "",
  listSuccessMsg: "",
  isCreateListLoading: false,
  isCreateListSuccess: false,
  isGetListsLoading: false,
  isUpdListLoading: false,
  isUpdListSuccess: false,
  isDelListLoading: false,
  isDelListSuccess: false,
  isGetSomeListsLoading: false,
  isGetUserListsLoading: false,
};

const getters = {
  listModalData: (state: ListIFace) => state.listModalData,
  updListModalData: (state: ListIFace) => state.updListModalData,
  lists: (state: ListIFace) => state.lists,
  someLists: (state: ListIFace) => state.someLists,
  userLists: (state: ListIFace) => state.userLists,
  listsCount: (state: ListIFace) => state.listsCount,
  listErrorMsg: (state: ListIFace) => state.listErrorMsg,
  listSuccessMsg: (state: ListIFace) => state.listSuccessMsg,
  createListLoading: (state: ListIFace) => state.isCreateListLoading,
  createListSuccess: (state: ListIFace) => state.isCreateListSuccess,
  getListsLoading: (state: ListIFace) => state.isGetListsLoading,
  updListLoading: (state: ListIFace) => state.isUpdListLoading,
  updListSuccess: (state: ListIFace) => state.isUpdListSuccess,
  delListLoading: (state: ListIFace) => state.isDelListLoading,
  delListSuccess: (state: ListIFace) => state.isDelListSuccess,
  getSomeListsLoading: (state: ListIFace) => state.isGetSomeListsLoading,
  getUserListsLoading: (state: ListIFace) => state.isGetUserListsLoading,
};

const mutations = {
  SET_LIST_MODAL_DATA(
    state: ListIFace,
    payload: { contentId: string; title: string }
  ) {
    state.listModalData = payload;
  },
  SET_LISTS(state: ListIFace, payload: listsIFace[]) {
    state.lists = payload;
  },
  CHANGE_LIST_ITEM_STATUS(state: ListIFace, payload: string) {
    state.lists.map((list) => {
      if (list._id === payload) {
        list.isInTheList = !list.isInTheList;
      }
    });
  },
  SET_LIST_ERROR_MSG(state: ListIFace, payload: string) {
    state.listErrorMsg = payload;
  },
  SET_LIST_SUCCESS_MSG(state: ListIFace, payload: string) {
    state.listSuccessMsg = payload;
  },

  SET_SOME_LISTS(
    state: ListIFace,
    payload: { lists: userListsIFace[]; count: number }
  ) {
    state.someLists = payload.lists.map((list) => {
      const createdAt = formatDistanceToNow(new Date(list.createdAt));
      const updatedAt =
        list.updatedAt === list.createdAt
          ? "never"
          : formatDistanceToNow(new Date(list.updatedAt)) + " ago";

      return { ...list, createdAt, updatedAt };
    });
    state.listsCount = payload.count;
  },

  SET_UPD_LIST_MODAL_DATA(
    state: ListIFace,
    payload: { listId: string; listTitle: string }
  ) {
    state.updListModalData = payload;
  },

  SET_USER_LISTS(
    state: ListIFace,
    payload: { lists: userListsIFace[]; count: number }
  ) {
    state.userLists = payload.lists.map((list) => {
      const createdAt = formatDistanceToNow(new Date(list.createdAt));
      const updatedAt =
        list.createdAt === list.updatedAt
          ? "never"
          : formatDistanceToNow(new Date(list.updatedAt)) + " ago";

      return { ...list, createdAt, updatedAt };
    });
    state.listsCount = payload.count;
  },

  RESET_LIST(state: ListIFace) {
    state.isCreateListSuccess = false;
    state.isUpdListSuccess = false;
    state.isDelListSuccess = false;
    state.listErrorMsg = "";
    state.listSuccessMsg = "";
  },
};

const actions = {
  async createList(
    { commit, state }: ActionContext<ListIFace, StateIface>,
    title: string
  ) {
    state.isCreateListLoading = true;
    state.isCreateListSuccess = false;

    try {
      const { data } = await axios.post("/api/list/create", { title });
      if (data) {
        state.isCreateListLoading = false;
        state.isCreateListSuccess = true;
        commit("SET_LIST_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isCreateListLoading = false;
      console.log(error);
      if (error instanceof AxiosError) {
        state.listErrorMsg =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      } else {
        throw error;
      }
    }
  },

  async getLists(
    { commit, state }: ActionContext<ListIFace, StateIface>,
    contentId: string
  ) {
    state.isGetListsLoading = true;

    try {
      const { data } = await axios.get(`/api/list/lists/${contentId}`);
      if (data) {
        state.isGetListsLoading = false;
        commit("SET_LISTS", data);
      }
    } catch (error) {
      state.isGetListsLoading = false;
      console.log(error);
    }
  },

  async getSomeLists({ commit, state }: ActionContext<ListIFace, StateIface>) {
    state.isGetSomeListsLoading = true;

    try {
      const { data } = await axios.get(`/api/list/fetch-some/`);
      if (data) {
        state.isGetSomeListsLoading = false;
        commit("SET_SOME_LISTS", data);
      }
    } catch (error) {
      state.isGetSomeListsLoading = false;
      console.log(error);
    }
  },

  async getUserLists(
    { commit, state }: ActionContext<ListIFace, StateIface>,
    sort = ""
  ) {
    state.isGetUserListsLoading = true;

    try {
      const { data } = await axios.get(`/api/list/fetch-all?sort=${sort}`);
      if (data) {
        state.isGetUserListsLoading = false;
        commit("SET_USER_LISTS", data);
      }
    } catch (error) {
      state.isGetUserListsLoading = false;
      console.log(error);
    }
  },

  async updateList(
    { commit, state }: ActionContext<ListIFace, StateIface>,
    updData: { title: string; listId: string }
  ) {
    state.isUpdListLoading = true;
    state.isUpdListSuccess = false;

    try {
      const { data } = await axios.put("/api/list/update", updData);

      if (data) {
        state.isUpdListLoading = false;
        state.isUpdListSuccess = true;
        commit("SET_LIST_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isUpdListLoading = false;
      console.log(error);
      if (error instanceof AxiosError) {
        state.listErrorMsg =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      } else {
        throw error;
      }
    }
  },

  async deleteList(
    { commit, state }: ActionContext<ListIFace, StateIface>,
    listId: string
  ) {
    state.isDelListLoading = true;
    state.isDelListSuccess = false;

    try {
      const { data } = await axios.delete(`/api/list/delete/${listId}`);

      if (data) {
        state.isDelListLoading = false;
        state.isDelListSuccess = true;
        commit("SET_LIST_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isDelListLoading = false;
      console.log(error);
      if (error instanceof AxiosError) {
        state.listErrorMsg =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      } else {
        throw error;
      }
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
