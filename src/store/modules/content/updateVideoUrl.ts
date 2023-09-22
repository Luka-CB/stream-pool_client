import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

export interface UpdateVideoUrlStateIFace {
  isUpdVideoUrlLoading: boolean;
  isUpdVideoUrlSuccess: boolean;
  updVideoUrlMsg: string;
}

const state: UpdateVideoUrlStateIFace = {
  isUpdVideoUrlLoading: false,
  isUpdVideoUrlSuccess: false,
  updVideoUrlMsg: "",
};

const getters = {
  isUpdVideoUrlLoading: (state: UpdateVideoUrlStateIFace) =>
    state.isUpdVideoUrlLoading,
  isUpdVideoUrlSuccess: (state: UpdateVideoUrlStateIFace) =>
    state.isUpdVideoUrlSuccess,
  updVideoUrlMsg: (state: UpdateVideoUrlStateIFace) => state.updVideoUrlMsg,
};

const mutations = {
  SET_UPD_VIDEO_URL_MSG(state: UpdateVideoUrlStateIFace, payload: string) {
    state.updVideoUrlMsg = payload;
  },
  RESET_UPD_VIDEO_URL(state: UpdateVideoUrlStateIFace) {
    state.isUpdVideoUrlLoading = false;
    state.isUpdVideoUrlSuccess = false;
    state.updVideoUrlMsg = "";
  },
};

const actions = {
  async updateVideoUrl(
    { commit, state }: ActionContext<UpdateVideoUrlStateIFace, StateIface>,
    updData: { contentId: string; url: string }
  ) {
    state.isUpdVideoUrlLoading = true;
    state.isUpdVideoUrlSuccess = false;

    try {
      const { data } = await axios.put(`/api/content/update_url`, updData);

      if (data) {
        state.isUpdVideoUrlLoading = false;
        state.isUpdVideoUrlSuccess = true;
        commit("SET_UPD_VIDEO_URL_MSG", data.msg);
      }
    } catch (error) {
      state.isUpdVideoUrlLoading = false;
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
