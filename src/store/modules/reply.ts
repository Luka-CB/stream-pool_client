import { ActionContext } from "vuex";
import { StateIface } from "..";
import axios from "@/utils/axios";
import { formatDistanceToNow } from "date-fns";

interface replyIFace {
  _id?: string;
  text?: string;
  commentId?: string;
  replier?: { _id: string; name: string };
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface replydataIface {
  commentId: string;
  replier: { _id: string; name: string };
  replyTo: string;
}

export interface ReplyStateIFace {
  reply: replyIFace;
  replies: replyIFace[];
  commentIds: number[];
  replyData: replydataIface;
  repliesModalData: { commentId: string; comment: string };
  editReplyData: {
    routeName?: string;
    commentId: string;
    replyId: string;
    text: string;
  };
  isAddReplyLoading: boolean;
  isAddReplySuccess: boolean;
  isEditReplyLoading: boolean;
  isEditReplySuccess: boolean;
  isDelReplyLoading: boolean;
  isDelReplySuccess: boolean;
  isGetRepliesLoading: boolean;
}

const state: ReplyStateIFace = {
  reply: {} as replyIFace,
  replies: [],
  commentIds: [],
  replyData: {
    commentId: "",
    replier: { _id: "", name: "" },
    replyTo: "",
  },
  repliesModalData: {
    commentId: "",
    comment: "",
  },
  editReplyData: { routeName: "", commentId: "", replyId: "", text: "" },
  isAddReplyLoading: false,
  isAddReplySuccess: false,
  isEditReplyLoading: false,
  isEditReplySuccess: false,
  isDelReplyLoading: false,
  isDelReplySuccess: false,
  isGetRepliesLoading: false,
};

const getters = {
  reply: (state: ReplyStateIFace) => state.reply,
  replies: (state: ReplyStateIFace) => state.replies,
  commentIds: (state: ReplyStateIFace) => state.commentIds,
  replyData: (state: ReplyStateIFace) => state.replyData,
  repliesModalData: (state: ReplyStateIFace) => state.repliesModalData,
  editReplyData: (state: ReplyStateIFace) => state.editReplyData,
  addReplyLoading: (state: ReplyStateIFace) => state.isAddReplyLoading,
  addReplySuccess: (state: ReplyStateIFace) => state.isAddReplySuccess,
  editReplyLoading: (state: ReplyStateIFace) => state.isEditReplyLoading,
  editReplySuccess: (state: ReplyStateIFace) => state.isEditReplySuccess,
  delReplyLoading: (state: ReplyStateIFace) => state.isDelReplyLoading,
  delReplySuccess: (state: ReplyStateIFace) => state.isDelReplySuccess,
  getRepliesLoading: (state: ReplyStateIFace) => state.isGetRepliesLoading,
};

const mutations = {
  SET_COMMENT_IDS(state: ReplyStateIFace, payload: number) {
    if (state.commentIds.some((id) => id === payload)) {
      state.commentIds = state.commentIds.filter((id) => id !== payload);
    } else {
      state.commentIds.push(payload);
    }
  },

  SET_REPLIES(state: ReplyStateIFace, payload: replyIFace[]) {
    state.replies = payload.map((reply) => {
      const createdAt = formatDistanceToNow(new Date(reply.createdAt));

      return { ...reply, createdAt };
    });
  },

  REMOVE_REPLY(state: ReplyStateIFace, payload: string) {
    state.replies = state.replies.filter((reply) => reply._id !== payload);
  },

  SET_EDITED_USER_REPLY(
    state: ReplyStateIFace,
    payload: { replyId: string; text: string }
  ) {
    state.replies = state.replies.map((reply) => {
      if (reply._id === payload.replyId) {
        reply.text = payload.text;
      }

      return reply;
    });
  },

  SET_REPLIES_MODAL_DATA(
    state: ReplyStateIFace,
    payload: { commentId: string; comment: string }
  ) {
    state.repliesModalData = payload;
  },

  SET_REPLY_DATA(state: ReplyStateIFace, payload: replydataIface) {
    state.replyData = payload;
  },

  SET_EDIT_REPLY_DATA(
    state: ReplyStateIFace,
    payload: { commentId: string; replyId: string; text: string }
  ) {
    state.editReplyData = payload;
  },

  SET_REPLY(state: ReplyStateIFace, payload: replyIFace) {
    state.reply = payload;
  },

  RESET_REPLY(state: ReplyStateIFace) {
    state.isAddReplyLoading = false;
    state.isAddReplySuccess = false;
    state.isEditReplyLoading = false;
    state.isEditReplySuccess = false;
    state.isDelReplyLoading = false;
    state.isDelReplySuccess = false;
  },
};

const actions = {
  async addReply(
    { commit, state }: ActionContext<ReplyStateIFace, StateIface>,
    replyData: replyIFace
  ) {
    state.isAddReplyLoading = true;
    state.isAddReplySuccess = false;

    try {
      const { data } = await axios.post("/api/reply/create", replyData);

      if (data) {
        state.isAddReplyLoading = false;
        state.isAddReplySuccess = true;
        commit("SET_REPLY", data);
      }
    } catch (error) {
      state.isAddReplyLoading = false;
      console.log(error);
    }
  },

  async getReplies(
    { commit, state }: ActionContext<ReplyStateIFace, StateIface>,
    commentId: string
  ) {
    state.isGetRepliesLoading = true;

    try {
      const { data } = await axios.get(`/api/reply/fetch-all/${commentId}`);

      if (data) {
        state.isGetRepliesLoading = false;
        commit("SET_REPLIES", data);
      }
    } catch (error) {
      state.isGetRepliesLoading = false;
      console.log(error);
    }
  },

  async editReply(
    { state }: ActionContext<ReplyStateIFace, StateIface>,
    editData: { replyId: string; text: string }
  ) {
    state.isEditReplyLoading = true;
    state.isEditReplySuccess = false;

    try {
      const { data } = await axios.put("/api/reply/update", editData);

      if (data) {
        state.isEditReplyLoading = false;
        state.isEditReplySuccess = true;
      }
    } catch (error) {
      state.isEditReplyLoading = false;
      console.log(error);
    }
  },

  async deleteReply(
    { state }: ActionContext<ReplyStateIFace, StateIface>,
    delData: { commentId: string; replyId: string }
  ) {
    state.isDelReplyLoading = true;

    try {
      const { data } = await axios.delete(
        `/api/reply/delete?commentId=${delData.commentId}&replyId=${delData.replyId}`
      );

      if (data) {
        state.isDelReplyLoading = false;
        state.isDelReplySuccess = true;
      }
    } catch (error) {
      state.isDelReplyLoading = false;
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
