import { ActionContext } from "vuex";
import { StateIface } from "..";
import axios from "@/utils/axios";
import { format } from "date-fns";

interface favContentIFace {
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
  addedOn: string;
}

export interface FavStateIFace {
  favContent: favContentIFace[];
  favContentCount: number | null;
  isAddToFavLoading: boolean;
  isAddToFavSuccess: boolean;
  isDelFavLoading: boolean;
  isDelFavSuccess: boolean;
  isGetFavContentLoading: boolean;
}

const state: FavStateIFace = {
  favContent: [],
  favContentCount: null,
  isAddToFavLoading: false,
  isAddToFavSuccess: false,
  isDelFavLoading: false,
  isDelFavSuccess: false,
  isGetFavContentLoading: false,
};

const getters = {
  favContent: (state: FavStateIFace) => state.favContent,
  favContentCount: (state: FavStateIFace) => state.favContentCount,
  addToFavLoading: (state: FavStateIFace) => state.isAddToFavLoading,
  addToFavSuccess: (state: FavStateIFace) => state.isAddToFavSuccess,
  delFavLoading: (state: FavStateIFace) => state.isDelFavLoading,
  delFavSuccess: (state: FavStateIFace) => state.isDelFavSuccess,
  getFavContentLoading: (state: FavStateIFace) => state.isGetFavContentLoading,
};

const mutations = {
  SET_FAV_CONTENT(
    state: FavStateIFace,
    payload: { content: favContentIFace[]; count: number }
  ) {
    state.favContent = payload.content.map((x) => {
      const addedOn = format(new Date(x.addedOn), "d MMM yyyy");
      return { ...x, addedOn };
    });
    state.favContentCount = payload.count;
  },

  REMOVE_FROM_FAV_LIST(state: FavStateIFace, payload: string) {
    state.favContent = state.favContent.filter(
      (content) => content._id !== payload
    );
  },

  RESET_FAV(state: FavStateIFace) {
    state.isAddToFavLoading = false;
    state.isAddToFavSuccess = false;
    state.isDelFavLoading = false;
    state.isDelFavSuccess = false;
  },
};

const actions = {
  async addToFav(
    { state }: ActionContext<FavStateIFace, StateIface>,
    contentId: string
  ) {
    state.isAddToFavLoading = true;
    state.isAddToFavSuccess = false;

    try {
      const { data } = await axios.post("/api/favorite/add", { contentId });

      if (data) {
        state.isAddToFavLoading = false;
        state.isAddToFavSuccess = true;
      }
    } catch (error) {
      state.isAddToFavLoading = false;
      console.log(error);
    }
  },

  async getFavContent(
    { commit, state }: ActionContext<FavStateIFace, StateIface>,
    sort = ""
  ) {
    state.isGetFavContentLoading = true;

    try {
      const { data } = await axios.get(
        `/api/content/fav/fetch-all?sort=${sort}`
      );

      if (data) {
        state.isGetFavContentLoading = false;
        commit("SET_FAV_CONTENT", data);
      }
    } catch (error) {
      state.isGetFavContentLoading = false;
      console.log(error);
    }
  },

  async delFav(
    { state }: ActionContext<FavStateIFace, StateIface>,
    contentId: string
  ) {
    state.isDelFavLoading = true;

    try {
      const { data } = await axios.delete(`/api/favorite/delete/${contentId}`);

      if (data) {
        state.isDelFavLoading = false;
        state.isDelFavSuccess = true;
      }
    } catch (error) {
      state.isDelFavLoading = false;
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
