import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

interface AddContentIFace {
  title: string;
  startYear: string;
  endYear: string;
  videoUrl: string;
  description: string;
  crew: {
    director: string;
    cast: { name: string }[];
  };
  genres: string[];
  image: string;
  type: string;
}

export interface AddContentStateIFace {
  isAddContentLoading: boolean;
  isAddContentSuccess: boolean;
  addContentSuccessMsg: string;
}

const state: AddContentStateIFace = {
  isAddContentLoading: false,
  isAddContentSuccess: false,
  addContentSuccessMsg: "",
};

const getters = {
  isAddContentLoading: (state: AddContentStateIFace) =>
    state.isAddContentLoading,
  isAddContentSuccess: (state: AddContentStateIFace) =>
    state.isAddContentSuccess,
  addContentSuccessMsg: (state: AddContentStateIFace) =>
    state.addContentSuccessMsg,
};

const mutations = {
  ADD_CONTENT_SUCCESS(state: AddContentStateIFace, payload: string) {
    state.addContentSuccessMsg = payload;
  },
  RESET_ADD_CONTENT(state: AddContentStateIFace) {
    if (state.isAddContentSuccess) state.isAddContentSuccess = false;
    if (state.addContentSuccessMsg) state.addContentSuccessMsg = "";
  },
};

const actions = {
  async addContent(
    { commit, state }: ActionContext<AddContentStateIFace, StateIface>,
    content: AddContentIFace
  ) {
    state.isAddContentLoading = true;

    try {
      const { data } = await axios.post("/api/content", content);

      if (data) {
        state.isAddContentLoading = false;
        state.isAddContentSuccess = true;
        commit("ADD_CONTENT_SUCCESS", data.msg);
      }
    } catch (error) {
      state.isAddContentLoading = false;
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
