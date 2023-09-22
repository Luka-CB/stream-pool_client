import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

export interface UpdatePosterStateIFace {
  isUpdPosterLoading: boolean;
  isUpdPosterSuccess: boolean;
  updPosterMsg: string;
}

const state: UpdatePosterStateIFace = {
  isUpdPosterLoading: false,
  isUpdPosterSuccess: false,
  updPosterMsg: "",
};

const getters = {
  isUpdPosterLoading: (state: UpdatePosterStateIFace) =>
    state.isUpdPosterLoading,
  isUpdPosterSuccess: (state: UpdatePosterStateIFace) =>
    state.isUpdPosterSuccess,
  updPosterMsg: (state: UpdatePosterStateIFace) => state.updPosterMsg,
};

const mutations = {
  SET_UPD_POSTER_MSG(state: UpdatePosterStateIFace, payload: string) {
    state.updPosterMsg = payload;
  },
  RESET_UPD_POSTER(state: UpdatePosterStateIFace) {
    state.isUpdPosterLoading = false;
    state.isUpdPosterSuccess = false;
    state.updPosterMsg = "";
  },
};

const actions = {
  async updatePoster(
    { commit, state }: ActionContext<UpdatePosterStateIFace, StateIface>,
    updData: { image: string; contentId: string }
  ) {
    state.isUpdPosterLoading = true;
    state.isUpdPosterSuccess = false;

    try {
      const { data } = await axios.put(`/api/content/update_poster`, updData);

      if (data) {
        state.isUpdPosterLoading = false;
        state.isUpdPosterSuccess = true;
        commit("SET_UPD_POSTER_MSG", data.msg);
      }
    } catch (error) {
      state.isUpdPosterLoading = false;
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
