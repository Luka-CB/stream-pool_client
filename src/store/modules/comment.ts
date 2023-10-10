import { ActionContext } from "vuex";
import { StateIface } from "..";
import axios from "@/utils/axios";
import { formatDistanceToNow } from "date-fns";
import { userCommentIFace } from "./profile/profileView";

interface commentIFace {
  _id?: string;
  user?: { _id: string; username: string };
  text?: string;
  contentId?: string;
  avatarBgColor?: string;
  avatarTextColor?: string;
  replies?: replyIFace[];
  createdAt: string;
  updatedAt: string;
}

interface replyIFace {
  _id?: string;
  text?: string;
  commentId?: string;
  replier?: { _id: string; name: string };
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentStateIFace {
  comments: commentIFace[];
  commentsCount: number;
  userComments: userCommentIFace[];
  userCommentsCount: number;
  editCommentData: {
    routeName?: string;
    commentId: string;
    text: string;
  };
  isAddCommentLoading: boolean;
  isAddCommentSuccess: boolean;
  isGetCommentsLoading: boolean;
  isEditCommentLoading: boolean;
  isEditCommentSuccess: boolean;
  isDelCommentLoading: boolean;
  isDelCommentSuccess: boolean;
  isGetUserCommentsLoading: boolean;
}

const state: CommentStateIFace = {
  comments: [],
  commentsCount: 0,
  userComments: [],
  userCommentsCount: 0,
  editCommentData: { routeName: "", commentId: "", text: "" },
  isAddCommentLoading: false,
  isAddCommentSuccess: false,
  isGetCommentsLoading: false,
  isEditCommentLoading: false,
  isEditCommentSuccess: false,
  isDelCommentLoading: false,
  isDelCommentSuccess: false,
  isGetUserCommentsLoading: false,
};

const getters = {
  comments: (state: CommentStateIFace) => state.comments,
  commentsCount: (state: CommentStateIFace) => state.commentsCount,
  userComments: (state: CommentStateIFace) => state.userComments,
  userCommentsCount: (state: CommentStateIFace) => state.userCommentsCount,
  editCommentData: (state: CommentStateIFace) => state.editCommentData,
  addCommentLoading: (state: CommentStateIFace) => state.isAddCommentLoading,
  addCommentSuccess: (state: CommentStateIFace) => state.isAddCommentSuccess,
  getCommentsLoading: (state: CommentStateIFace) => state.isGetCommentsLoading,
  editCommentLoading: (state: CommentStateIFace) => state.isEditCommentLoading,
  editCommentSuccess: (state: CommentStateIFace) => state.isEditCommentSuccess,
  delCommentLoading: (state: CommentStateIFace) => state.isDelCommentLoading,
  delCommentSuccess: (state: CommentStateIFace) => state.isDelCommentSuccess,
  getUserCommentsLoading: (state: CommentStateIFace) =>
    state.isGetUserCommentsLoading,
};

const mutations = {
  SET_COMMENT(state: CommentStateIFace, payload: commentIFace) {
    state.comments.unshift({
      ...payload,
      createdAt: formatDistanceToNow(new Date(payload.createdAt)),
      updatedAt: formatDistanceToNow(new Date(payload.updatedAt)),
    });
  },

  SET_COMMENTS(
    state: CommentStateIFace,
    payload: { comments: commentIFace[]; count: number }
  ) {
    state.commentsCount = payload.count;
    state.comments = payload.comments.map((comment) => {
      const replies = comment.replies?.map((reply: replyIFace) => {
        const createdAt = formatDistanceToNow(new Date(reply.createdAt));
        const updatedAt = formatDistanceToNow(new Date(reply.updatedAt));

        return { ...reply, createdAt, updatedAt };
      });

      replies?.reverse();

      const createdAt = formatDistanceToNow(new Date(comment.createdAt));
      const updatedAt = formatDistanceToNow(new Date(comment.updatedAt));

      return { ...comment, replies, createdAt, updatedAt };
    });
  },

  SET_USER_COMMENTS(
    state: CommentStateIFace,
    payload: { comments: userCommentIFace[]; count: number }
  ) {
    state.userComments = payload.comments.map((comment) => {
      const createdAt = formatDistanceToNow(new Date(comment.createdAt));
      const updatedAt =
        comment.createdAt === comment.updatedAt
          ? "never"
          : formatDistanceToNow(new Date(comment.updatedAt)) + " ago";

      return { ...comment, createdAt, updatedAt };
    });
    state.userCommentsCount = payload.count;
  },

  REMOVE_USER_COMMENT_FROM_LIST(state: CommentStateIFace, payload: string) {
    state.userComments = state.userComments.filter(
      (comment) => comment._id !== payload
    );
  },

  SET_EDIT_COMMENT_DATA(
    state: CommentStateIFace,
    payload: { text: string; commentId: string }
  ) {
    state.editCommentData = payload;
  },

  SET_EDITED_COMMENT(
    state: CommentStateIFace,
    payload: { commentId: string; text: string }
  ) {
    state.comments = state.comments
      .map((comment) => {
        if (comment._id === payload.commentId) {
          comment.text = payload.text;
        }

        return comment;
      })
      .reverse();
  },

  SET_EDITED_REPLY(
    state: CommentStateIFace,
    payload: { commentId: string; replyId: string; text: string }
  ) {
    state.comments = state.comments
      .map((comment) => {
        if (comment._id === payload.commentId) {
          comment.replies
            ?.map((reply) => {
              if (reply._id === payload.replyId) {
                reply.text = payload.text;
              }
            })
            .reverse();
        }

        return comment;
      })
      .reverse();
  },

  REMOVE_STORE_COMMENT(state: CommentStateIFace, payload: string) {
    state.comments = state.comments.filter(
      (comment) => comment._id !== payload
    );
  },

  REMOVE_STORE_REPLY(
    state: CommentStateIFace,
    payload: { commentId: string; replyId: string }
  ) {
    const commentIndex = state.comments.findIndex(
      (comment) => comment._id === payload.commentId
    );

    state.comments[commentIndex].replies = state.comments[
      commentIndex
    ].replies?.filter((reply) => reply._id !== payload.replyId);
  },

  ADD_REPLY(state: CommentStateIFace, payload: replyIFace) {
    const comment = state.comments.find(
      (comment) => comment._id === payload.commentId
    );
    comment?.replies?.unshift({
      ...payload,
      createdAt: formatDistanceToNow(new Date(payload.createdAt)),
      updatedAt: formatDistanceToNow(new Date(payload.updatedAt)),
    });
  },

  RESET_COMMENTS(state: CommentStateIFace) {
    if (state.isAddCommentSuccess) state.isAddCommentSuccess = false;
    if (state.isEditCommentSuccess) state.isEditCommentSuccess = false;
    if (state.isDelCommentSuccess) state.isDelCommentSuccess = false;
  },
};

const actions = {
  async addComment(
    { commit, state }: ActionContext<CommentStateIFace, StateIface>,
    commentData: commentIFace
  ) {
    state.isAddCommentLoading = true;

    try {
      const { data } = await axios.post("/api/comment/create", commentData);

      if (data) {
        state.isAddCommentLoading = false;
        state.isAddCommentSuccess = true;
        commit("SET_COMMENT", data);
      }
    } catch (error) {
      state.isAddCommentLoading = false;
      console.log(error);
    }
  },

  async getComments(
    { commit, state }: ActionContext<CommentStateIFace, StateIface>,
    contentId: string
  ) {
    state.isGetCommentsLoading = true;

    try {
      const { data } = await axios.get(
        `/api/comment/fetch-all?contentId=${contentId}`
      );

      if (data) {
        state.isGetCommentsLoading = false;
        commit("SET_COMMENTS", data);
      }
    } catch (error) {
      state.isGetCommentsLoading = false;
      console.log(error);
    }
  },

  async getUserComments(
    { commit, state }: ActionContext<CommentStateIFace, StateIface>,
    sort = ""
  ) {
    state.isGetUserCommentsLoading = true;

    try {
      const { data } = await axios.get(
        `/api/comment/user/fetch-all?sort=${sort}`
      );

      if (data) {
        state.isGetUserCommentsLoading = false;
        commit("SET_USER_COMMENTS", data);
      }
    } catch (error) {
      state.isGetUserCommentsLoading = false;
      console.log(error);
    }
  },

  async editComment(
    { state }: ActionContext<CommentStateIFace, StateIface>,
    editData: { commentId: string; text: string }
  ) {
    state.isEditCommentLoading = true;
    state.isEditCommentSuccess = false;

    try {
      const { data } = await axios.put(`/api/comment/update`, editData);

      if (data) {
        state.isEditCommentLoading = false;
        state.isEditCommentSuccess = true;
      }
    } catch (error) {
      state.isEditCommentLoading = false;
      console.log(error);
    }
  },

  async deleteComment(
    { state }: ActionContext<CommentStateIFace, StateIface>,
    commentId: string
  ) {
    state.isDelCommentLoading = true;

    try {
      const { data } = await axios.delete(`/api/comment/delete/${commentId}`);

      if (data) {
        state.isDelCommentLoading = false;
        state.isDelCommentSuccess = true;
      }
    } catch (error) {
      state.isDelCommentLoading = false;
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
