export interface MsgIFace {
  isErrMsgActive: boolean;
  errMsg: string;
  isSuccessMsgActive: boolean;
  successMsg: string;
}

const state: MsgIFace = {
  isErrMsgActive: false,
  errMsg: "",
  isSuccessMsgActive: false,
  successMsg: "",
};

const getters = {
  isErrMsgActive: (state: MsgIFace) => state.isErrMsgActive,
  errMsg: (state: MsgIFace) => state.errMsg,
  isSuccessMsgActive: (state: MsgIFace) => state.isSuccessMsgActive,
  succMsg: (state: MsgIFace) => state.successMsg,
};

const mutations = {
  TOGGLE_ERR_MSG(state: MsgIFace, payload: boolean) {
    state.isErrMsgActive = payload;
  },
  SET_ERR_MSG(state: MsgIFace, payload: string) {
    state.errMsg = payload;
  },

  TOGGLE_SUCCESS_MSG(state: MsgIFace, payload: boolean) {
    state.isSuccessMsgActive = payload;
  },
  SET_SUCCESS_MSG(state: MsgIFace, payload: string) {
    state.successMsg = payload;
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
