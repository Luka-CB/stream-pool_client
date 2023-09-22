export interface ModalStateIFace {
  isUrlModalActive: boolean;
  isPosterModalActive: boolean;
  isRatingModalActive: boolean;
  isListModalActive: boolean;
  isReplyModalActive: boolean;
  isEditCommentModalActive: boolean;
  isEditReplyModalActive: boolean;
  isUserCommentRepliesModalActive: boolean;
  isCreateListModalActive: boolean;
  isUpdListModalActive: boolean;
  isListItemSearchResultModalActive: boolean;
}

const state: ModalStateIFace = {
  isUrlModalActive: false,
  isPosterModalActive: false,
  isRatingModalActive: false,
  isListModalActive: false,
  isReplyModalActive: false,
  isEditCommentModalActive: false,
  isEditReplyModalActive: false,
  isUserCommentRepliesModalActive: false,
  isCreateListModalActive: false,
  isUpdListModalActive: false,
  isListItemSearchResultModalActive: false,
};

const getters = {
  urlModal: (state: ModalStateIFace) => state.isUrlModalActive,
  posterModal: (state: ModalStateIFace) => state.isPosterModalActive,
  ratingModal: (state: ModalStateIFace) => state.isRatingModalActive,
  listModal: (state: ModalStateIFace) => state.isListModalActive,
  replyModal: (state: ModalStateIFace) => state.isReplyModalActive,
  editCommentModal: (state: ModalStateIFace) => state.isEditCommentModalActive,
  editReplyModal: (state: ModalStateIFace) => state.isEditReplyModalActive,
  userCommentRepliesModal: (state: ModalStateIFace) =>
    state.isUserCommentRepliesModalActive,
  createListModal: (state: ModalStateIFace) => state.isCreateListModalActive,
  updListModal: (state: ModalStateIFace) => state.isUpdListModalActive,
  listItemSearchResultModal: (state: ModalStateIFace) =>
    state.isListItemSearchResultModalActive,
};

const mutations = {
  TOGGLE_URL_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isUrlModalActive = payload;
  },
  TOGGLE_POSTER_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isPosterModalActive = payload;
  },
  TOGGLE_RATING_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isRatingModalActive = payload;
  },
  TOGGLE_LIST_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isListModalActive = payload;
  },
  TOGGLE_REPLY_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isReplyModalActive = payload;
  },
  TOGGLE_EDIT_COMMENT_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isEditCommentModalActive = payload;
  },
  TOGGLE_EDIT_REPLY_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isEditReplyModalActive = payload;
  },
  TOGGLE_USER_COMMENT_REPLIES_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isUserCommentRepliesModalActive = payload;
  },
  TOGGLE_CREATE_LIST_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isCreateListModalActive = payload;
  },
  TOGGLE_UPD_LIST_MODAL(state: ModalStateIFace, payload: boolean) {
    state.isUpdListModalActive = payload;
  },
  TOGGLE_LISTITEM_SEARCH_RESULT_MODAL(
    state: ModalStateIFace,
    payload: boolean
  ) {
    state.isListItemSearchResultModalActive = payload;
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
