interface fileIFace {
  name: string;
  size: number;
  type: string;
  image: string;
}

export interface ImageStatesIFace {
  file: fileIFace;
}

const state = {
  file: {} as fileIFace,
};

const getters = {
  getImageFile: (state: ImageStatesIFace) => state.file,
};

const mutations = {
  SET_IMAGE_FILE(state: ImageStatesIFace, payload: fileIFace) {
    state.file = payload;
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
