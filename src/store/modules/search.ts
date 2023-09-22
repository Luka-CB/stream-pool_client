import { ActionContext } from "vuex";
import { contentIFace } from "./content/fetchContent";
import { StateIface } from "..";
import axios from "@/utils/axios";

export interface SearchStateIFace {
  isSearchResultActive: boolean;
  searchedContent: contentIFace[];
  searchedContentCount: number;
  isGetSearchedContentLoading: boolean;
}

const state: SearchStateIFace = {
  isSearchResultActive: false,
  searchedContent: [],
  searchedContentCount: 0,
  isGetSearchedContentLoading: false,
};

const getters = {
  searchResultActive: (state: SearchStateIFace) => state.isSearchResultActive,
  searchedContent: (state: SearchStateIFace) => state.searchedContent,
  searchedContentCount: (state: SearchStateIFace) => state.searchedContentCount,
  getSearchedContentLoading: (state: SearchStateIFace) =>
    state.isGetSearchedContentLoading,
};

const mutations = {
  SET_SEARCHED_CONTENT(
    state: SearchStateIFace,
    payload: { content: contentIFace[]; count: number }
  ) {
    state.searchedContent = payload.content;
    state.searchedContentCount = payload.count;
  },

  TOGGLE_SEARCH_RESULT(state: SearchStateIFace, payload: boolean) {
    state.isSearchResultActive = payload;
  },
};

const actions = {
  async getSearchedContent(
    { commit, state }: ActionContext<SearchStateIFace, StateIface>,
    searchQ: string
  ) {
    state.isGetSearchedContentLoading = true;

    try {
      const { data } = await axios.get(`/api/content/search?q=${searchQ}`);

      if (data) {
        state.isGetSearchedContentLoading = false;
        commit("SET_SEARCHED_CONTENT", data);
      }
    } catch (error) {
      state.isGetSearchedContentLoading = false;
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
