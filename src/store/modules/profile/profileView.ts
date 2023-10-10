import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";
import { formatDistanceToNow } from "date-fns";

interface userProfileIface {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface someRatedContentIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  posterUrl: string;
  rating: {
    avgRating: number;
    count: number;
  };
  type: string;
  userRating: {
    _id: string;
    value: number;
  };
}

interface someFavContentIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  posterUrl: string;
  type: string;
}

export interface userCommentIFace {
  _id: string;
  text: string;
  contentId: {
    _id: string;
    title: string;
  };
  replies: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileViewStateIFace {
  profile: userProfileIface;
  isGetProfileLoading: boolean;
  someRatedContents: someRatedContentIFace[];
  profileRatedContentCount: number | null;
  isSomeGetRatedContentLoading: boolean;
  someFavContents: someFavContentIFace[];
  profileFavContentCount: number | null;
  isSomeFavContentLoading: boolean;
  someUserComments: userCommentIFace[];
  someUserCommentsCount: number | null;
  isGetSomeUserCommentsLoading: boolean;
}

const state: ProfileViewStateIFace = {
  profile: {} as userProfileIface,
  isGetProfileLoading: false,
  someRatedContents: [],
  profileRatedContentCount: null,
  isSomeGetRatedContentLoading: false,
  someFavContents: [],
  profileFavContentCount: null,
  isSomeFavContentLoading: false,
  someUserComments: [],
  someUserCommentsCount: null,
  isGetSomeUserCommentsLoading: false,
};

const getters = {
  profile: (state: ProfileViewStateIFace) => state.profile,
  getProfileLoading: (state: ProfileViewStateIFace) =>
    state.isGetProfileLoading,
  someRatedContents: (state: ProfileViewStateIFace) => state.someRatedContents,
  profileRatedContentCount: (state: ProfileViewStateIFace) =>
    state.profileRatedContentCount,
  getSomeRatedContentLoading: (state: ProfileViewStateIFace) =>
    state.isSomeGetRatedContentLoading,
  someFavContents: (state: ProfileViewStateIFace) => state.someFavContents,
  profileFavContentCount: (state: ProfileViewStateIFace) =>
    state.profileFavContentCount,
  getSomeFavContentLoading: (state: ProfileViewStateIFace) =>
    state.isSomeFavContentLoading,
  someUserComments: (state: ProfileViewStateIFace) => state.someUserComments,
  someUserCommentsCount: (state: ProfileViewStateIFace) =>
    state.someUserCommentsCount,
  getSomeUserCommentsLoading: (state: ProfileViewStateIFace) =>
    state.isGetSomeUserCommentsLoading,
};

const mutations = {
  SET_PROFILE(state: ProfileViewStateIFace, payload: userProfileIface) {
    state.profile = {
      ...payload,
      createdAt: formatDistanceToNow(new Date(payload.createdAt)),
    };
  },

  SET_SOME_RATED_CONTENTS(
    state: ProfileViewStateIFace,
    payload: { content: someRatedContentIFace[]; count: number | null }
  ) {
    state.someRatedContents = payload.content;
    state.profileRatedContentCount = payload.count;
  },

  SET_SOME_FAV_CONTENTS(
    state: ProfileViewStateIFace,
    payload: { content: someFavContentIFace[]; count: number | null }
  ) {
    state.someFavContents = payload.content;
    state.profileFavContentCount = payload.count;
  },

  DELETE_FAV_CONTENT(state: ProfileViewStateIFace, payload: string) {
    state.someFavContents = state.someFavContents.filter(
      (fav) => fav._id !== payload
    );
  },

  SET_SOME_USER_COMMENTS(
    state: ProfileViewStateIFace,
    payload: { comments: userCommentIFace[]; count: number }
  ) {
    state.someUserComments = payload.comments.map((comment) => {
      const createdAt = formatDistanceToNow(new Date(comment.createdAt));
      const updatedAt =
        comment.createdAt === comment.updatedAt
          ? "never"
          : formatDistanceToNow(new Date(comment.updatedAt)) + " ago";

      return { ...comment, createdAt, updatedAt };
    });
    state.someUserCommentsCount = payload.count;
  },
};

const actions = {
  async getProfile({
    commit,
    state,
  }: ActionContext<ProfileViewStateIFace, StateIface>) {
    state.isGetProfileLoading = true;

    try {
      const { data } = await axios.get("/api/users/profile");

      if (data) {
        state.isGetProfileLoading = false;
        commit("SET_PROFILE", data);
      }
    } catch (error) {
      state.isGetProfileLoading = false;
      console.log(error);
    }
  },

  async getSomeRatedContents({
    commit,
    state,
  }: ActionContext<ProfileViewStateIFace, StateIface>) {
    state.isSomeGetRatedContentLoading = true;

    try {
      const { data } = await axios.get("/api/content/rated/fetch-some");

      if (data) {
        state.isSomeGetRatedContentLoading = false;
        commit("SET_SOME_RATED_CONTENTS", data);
      }
    } catch (error) {
      state.isSomeGetRatedContentLoading = false;
      console.log(error);
    }
  },

  async getSomeFavContents({
    commit,
    state,
  }: ActionContext<ProfileViewStateIFace, StateIface>) {
    state.isSomeFavContentLoading = true;

    try {
      const { data } = await axios.get("/api/content/fav/fetch-some");

      if (data) {
        state.isSomeFavContentLoading = false;
        commit("SET_SOME_FAV_CONTENTS", data);
      }
    } catch (error) {
      state.isSomeFavContentLoading = false;
      console.log(error);
    }
  },

  async getSomeUserComments({
    commit,
    state,
  }: ActionContext<ProfileViewStateIFace, StateIface>) {
    state.isGetSomeUserCommentsLoading = true;

    try {
      const { data } = await axios.get("/api/comment/fetch-some");

      if (data) {
        state.isGetSomeUserCommentsLoading = false;
        commit("SET_SOME_USER_COMMENTS", data);
      }
    } catch (error) {
      state.isGetSomeUserCommentsLoading = false;
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
