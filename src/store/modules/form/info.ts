interface infoIface {
  title: string;
  startYear: string;
  endYear: string;
  videoUrl: string;
  description: string;
}

export interface InfoStateIFace {
  info: infoIface;
}

const infoFromStorage = localStorage.getItem("contentInfo")
  ? JSON.parse(localStorage.getItem("contentInfo") || "")
  : { title: "", startYear: "", endYear: "", videoUrl: "", description: "" };

const state: InfoStateIFace = {
  info: infoFromStorage as infoIface,
};

const getters = {
  info: (state: InfoStateIFace) => state.info,
};

const mutations = {
  SET_TITLE(state: InfoStateIFace, payload: string) {
    state.info.title = payload;
    localStorage.setItem("contentInfo", JSON.stringify(state.info));
  },
  SET_START_YEAR(state: InfoStateIFace, payload: string) {
    state.info.startYear = payload;
    localStorage.setItem("contentInfo", JSON.stringify(state.info));
  },
  SET_END_YEAR(state: InfoStateIFace, payload: string) {
    state.info.endYear = payload;
    localStorage.setItem("contentInfo", JSON.stringify(state.info));
  },
  SET_VIDEO_URL(state: InfoStateIFace, payload: string) {
    state.info.videoUrl = payload;
    localStorage.setItem("contentInfo", JSON.stringify(state.info));
  },
  SET_DESCRIPTION(state: InfoStateIFace, payload: string) {
    state.info.description = payload;
    localStorage.setItem("contentInfo", JSON.stringify(state.info));
  },
  RESET_INFO(state: InfoStateIFace) {
    state.info = {
      title: "",
      startYear: "",
      endYear: "",
      videoUrl: "",
      description: "",
    };
    localStorage.removeItem("contentInfo");
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
