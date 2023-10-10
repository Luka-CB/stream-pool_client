import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";
import { format } from "date-fns";

interface ratedContentIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  description: string;
  genres: string[];
  posterUrl: string;
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
  userRating: {
    _id: string;
    value: number;
    createdAt: string;
  };
}

export interface RatingStateIFace {
  ratingModalData: {
    contentId: string;
    title: string;
    route?: { name: string; param: string | object };
  };
  userRating: { _id?: string; rateNum: number | null };
  ratedContent: ratedContentIFace[];
  ratedContentCount: number | null;
  isCreateRatingLoading: boolean;
  isCreateRatingSuccess: boolean;
  createRatingSuccessMsg: string;
  isGetRatingLoading: boolean;
  isDelRatingLoading: boolean;
  isDelRatingSuccess: boolean;
  delRatingSuccessMsg: string;
  isGetRatedContentLoading: boolean;
}

const state: RatingStateIFace = {
  ratingModalData: { contentId: "", title: "", route: { name: "", param: "" } },
  userRating: { _id: "", rateNum: null },
  ratedContent: [],
  ratedContentCount: null,
  isCreateRatingLoading: false,
  isCreateRatingSuccess: false,
  createRatingSuccessMsg: "",
  isGetRatingLoading: false,
  isDelRatingLoading: false,
  isDelRatingSuccess: false,
  delRatingSuccessMsg: "",
  isGetRatedContentLoading: false,
};

const getters = {
  ratingModalData: (state: RatingStateIFace) => state.ratingModalData,
  userRating: (state: RatingStateIFace) => state.userRating,
  ratedContent: (state: RatingStateIFace) => state.ratedContent,
  ratedContentCount: (state: RatingStateIFace) => state.ratedContentCount,
  createRatingLoading: (state: RatingStateIFace) => state.isCreateRatingLoading,
  createRatingSuccess: (state: RatingStateIFace) => state.isCreateRatingSuccess,
  createRatingSuccessMsg: (state: RatingStateIFace) =>
    state.createRatingSuccessMsg,
  getRatingLoading: (state: RatingStateIFace) => state.isGetRatingLoading,
  delRatingLoading: (state: RatingStateIFace) => state.isDelRatingLoading,
  delRatingSuccess: (state: RatingStateIFace) => state.isDelRatingSuccess,
  delRatingSuccessMsg: (state: RatingStateIFace) => state.delRatingSuccessMsg,
  getRatedContentLoading: (state: RatingStateIFace) =>
    state.isGetRatedContentLoading,
};

const mutations = {
  SET_RATING_MODAL_DATA(
    state: RatingStateIFace,
    payload: { contentId: string; title: string }
  ) {
    state.ratingModalData = payload;
  },
  SET_USER_RATING(
    state: RatingStateIFace,
    payload: { _id: string; rateNum: number }
  ) {
    state.userRating = payload;
  },

  SET_CREATE_RATING_SUCCESS_MSG(state: RatingStateIFace, payload: string) {
    state.createRatingSuccessMsg = payload;
  },
  RESET_CREATE_RATING(state: RatingStateIFace) {
    state.isCreateRatingLoading = false;
    state.isCreateRatingSuccess = false;
    state.createRatingSuccessMsg = "";
  },

  RESET_USER_RATING(state: RatingStateIFace) {
    state.userRating = { _id: "", rateNum: null };
  },

  SET_DEL_RATING_SUCCESS_MSG(state: RatingStateIFace, payload: string) {
    state.delRatingSuccessMsg = payload;
  },
  RESET_DEL_RATING(state: RatingStateIFace) {
    state.isDelRatingLoading = false;
    state.isDelRatingSuccess = false;
    state.delRatingSuccessMsg = "";
  },

  SET_RATED_CONTENT(
    state: RatingStateIFace,
    payload: { content: ratedContentIFace[]; count: number }
  ) {
    state.ratedContent = payload.content.map((rc) => {
      const userRating = {
        ...rc.userRating,
        createdAt: format(new Date(rc.userRating.createdAt), "d MMM yyyy"),
      };
      return { ...rc, userRating };
    });
    state.ratedContentCount = payload.count;
  },

  UPD_RATED_CONTENT(
    state: RatingStateIFace,
    payload: { contentId: string; rateVal: number }
  ) {
    state.ratedContent = state.ratedContent.map((rc) => {
      if (rc._id === payload.contentId) {
        rc.userRating.value = payload.rateVal;
      }

      return rc;
    });
  },
};

const actions = {
  async createRating(
    { commit, state }: ActionContext<RatingStateIFace, StateIface>,
    ratingData: { rateNum: number; contentId: string }
  ) {
    state.isCreateRatingLoading = true;
    state.isCreateRatingSuccess = false;

    try {
      const { data } = await axios.post("/api/rating/create", ratingData);

      if (data) {
        state.isCreateRatingLoading = false;
        state.isCreateRatingSuccess = true;
        commit("SET_CREATE_RATING_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isCreateRatingLoading = false;
      console.log(error);
    }
  },

  async getRating(
    { commit, state }: ActionContext<RatingStateIFace, StateIface>,
    contentId: string
  ) {
    state.isGetRatingLoading = true;

    try {
      const { data } = await axios.get(`/api/rating/${contentId}`);

      if (data) {
        state.isGetRatingLoading = false;
        commit("SET_USER_RATING", data);
      }
    } catch (error) {
      state.isGetRatingLoading = false;
      console.log(error);
    }
  },

  async getRatedContent(
    { commit, state }: ActionContext<RatingStateIFace, StateIface>,
    queries: { sort: string; filter: string }
  ) {
    state.isGetRatedContentLoading = true;

    const modQueries = {
      filter: queries.filter || "",
      sort: queries.sort || "",
    };

    try {
      const { data } = await axios.get(
        `/api/content/rated/fetch-all?filter=${modQueries.filter}&sort=${modQueries.sort}`
      );

      if (data) {
        state.isGetRatedContentLoading = false;
        commit("SET_RATED_CONTENT", data);
      }
    } catch (error) {
      state.isGetRatedContentLoading = false;
      console.log(error);
    }
  },

  async deleteRating(
    { commit, state }: ActionContext<RatingStateIFace, StateIface>,
    ratingId: string
  ) {
    state.isDelRatingLoading = true;
    state.isDelRatingSuccess = false;

    try {
      const { data } = await axios.delete(`/api/rating/${ratingId}`);

      if (data) {
        state.isDelRatingLoading = false;
        state.isDelRatingSuccess = true;
        commit("SET_DEL_RATING_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isDelRatingLoading = false;
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
