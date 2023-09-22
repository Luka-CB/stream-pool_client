import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

export interface DeleteContentStateIFace {
  isDeleteContentLoading: boolean;
  isDeleteContentSuccess: boolean;
  deleteContentSuccessMsg: string;
}

const state: DeleteContentStateIFace = {
  isDeleteContentLoading: false,
  isDeleteContentSuccess: false,
  deleteContentSuccessMsg: "",
};

const getters = {
  deleteContentLoading: (state: DeleteContentStateIFace) =>
    state.isDeleteContentLoading,
  deleteContentSuccess: (state: DeleteContentStateIFace) =>
    state.isDeleteContentSuccess,
  deleteContentSuccessMsg: (state: DeleteContentStateIFace) =>
    state.deleteContentSuccessMsg,
};

const mutations = {
  SET_DEL_SUCCESS_MSG(state: DeleteContentStateIFace, payload: string) {
    state.deleteContentSuccessMsg = payload;
  },

  RESET_DELETE_CONTENT(state: DeleteContentStateIFace) {
    if (state.isDeleteContentSuccess) state.isDeleteContentSuccess = false;
    if (state.deleteContentSuccessMsg) state.deleteContentSuccessMsg = "";
  },
};

const actions = {
  async deleteContent(
    { commit, state }: ActionContext<DeleteContentStateIFace, StateIface>,
    contentId: string
  ) {
    state.isDeleteContentLoading = true;

    try {
      const { data } = await axios.delete(`/api/content/delete/${contentId}`);

      if (data) {
        state.isDeleteContentLoading = false;
        state.isDeleteContentSuccess = true;
        commit("SET_DEL_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isDeleteContentLoading = false;
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
