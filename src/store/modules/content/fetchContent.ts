import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

export interface contentIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  description: string;
  genres: string[];
  posterUrl: string;
  videoUrl: string;
  type: string;
  rating: {
    avgRatting: number;
    count: number;
  };
  crew: {
    directors: { _id: string; name: string }[];
    cast: {
      _id: string;
      name: string;
    }[];
  };
  isInFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentStatesIFace {
  isFetchContentLoading: boolean;
  content: contentIFace;
}

const state = {
  isFetchContentLoading: false,
  content: {} as contentIFace,
};

const getters = {
  fetchContent: (state: ContentStatesIFace) => state.content,
  isFetchContentLoading: (state: ContentStatesIFace) =>
    state.isFetchContentLoading,
};

const mutations = {
  FETCH_CONTENT(state: ContentStatesIFace, data: contentIFace) {
    state.content = data;
  },

  TOGGLE_FAVORITE(state: ContentStatesIFace) {
    state.content.isInFavorite = !state.content.isInFavorite;
  },
};

const actions = {
  async fetchContent(
    { commit, state }: ActionContext<ContentStatesIFace, StateIface>,
    contentData: { contentId: string; userId: string }
  ) {
    state.isFetchContentLoading = true;

    try {
      const { data } = await axios.get(
        `/api/content/fetch-one?contentId=${contentData.contentId}&userId=${contentData.userId}`
      );

      if (data) {
        state.isFetchContentLoading = false;
        commit("FETCH_CONTENT", data);
      }
    } catch (error) {
      state.isFetchContentLoading = false;
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
