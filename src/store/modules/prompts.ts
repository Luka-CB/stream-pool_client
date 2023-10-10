export interface PromptStateIFace {
  isPromptOpen: boolean;
  isAnswerYes: boolean;
  promptKeyword: string;
  promptId: string;
}

const state: PromptStateIFace = {
  isPromptOpen: false,
  isAnswerYes: false,
  promptKeyword: "",
  promptId: "",
};

const getters = {
  isPromptOpen: (state: PromptStateIFace) => state.isPromptOpen,
  isAnswerYes: (state: PromptStateIFace) => state.isAnswerYes,
  promptKeyword: (state: PromptStateIFace) => state.promptKeyword,
  promptId: (state: PromptStateIFace) => state.promptId,
};

const mutations = {
  SET_PROMPT_ANSWER(state: PromptStateIFace, payload: boolean) {
    state.isAnswerYes = payload;
  },

  SET_PROMPT_KEYWORD(state: PromptStateIFace, payload: string) {
    state.promptKeyword = payload;
  },

  SET_PROMPT_ID(state: PromptStateIFace, payload: string) {
    state.promptId = payload;
  },

  TOGGLE_PROMPT(state: PromptStateIFace, payload: boolean) {
    state.isPromptOpen = payload;
  },

  RESET_PROMPT(state: PromptStateIFace) {
    state.isAnswerYes = false;
    state.isPromptOpen = false;
    state.promptKeyword = "";
    state.promptId = "";
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
