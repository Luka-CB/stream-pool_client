import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

interface UpdateContentIFace {
  _id: string;
  title: string;
  startYear: string;
  endYear: string;
  videoUrl: string;
  description: string;
  crew: {
    directors: { name: string }[];
    cast: { name: string }[];
  };
  genres: string[];
}

export interface UpdateContentStateIFace {
  isUpdateContentLoading: boolean;
  isUpdateContentSuccess: boolean;
  updateContentSuccessMsg: string;
}

const state: UpdateContentStateIFace = {
  isUpdateContentLoading: false,
  isUpdateContentSuccess: false,
  updateContentSuccessMsg: "",
};

const getters = {
  isUpdateContentLoading: (state: UpdateContentStateIFace) =>
    state.isUpdateContentLoading,
  isUpdateContentSuccess: (state: UpdateContentStateIFace) =>
    state.isUpdateContentSuccess,
  updateContentSuccessMsg: (state: UpdateContentStateIFace) =>
    state.updateContentSuccessMsg,
};

const mutations = {
  UPDATE_CONTENT_SUCCESS(state: UpdateContentStateIFace, payload: string) {
    state.updateContentSuccessMsg = payload;
  },
  RESET_UPDATE_CONTENT(state: UpdateContentStateIFace) {
    state.isUpdateContentLoading = false;
    state.isUpdateContentSuccess = false;
    state.updateContentSuccessMsg = "";
  },
};

const actions = {
  async updateContent(
    { commit, state }: ActionContext<UpdateContentStateIFace, StateIface>,
    content: UpdateContentIFace
  ) {
    state.isUpdateContentLoading = true;
    state.isUpdateContentSuccess = false;

    try {
      const { data } = await axios.put(`/api/content/${content._id}`, content);

      if (data) {
        state.isUpdateContentLoading = false;
        state.isUpdateContentSuccess = true;
        commit("UPDATE_CONTENT_SUCCESS", data.msg);
      }
    } catch (error) {
      state.isUpdateContentLoading = false;
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
