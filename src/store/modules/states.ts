export interface StIFace {
  isUserOptionOpen: boolean;
  imgError: boolean;
  excludeRoute: string;
  prevRoute: { name: string; params: object };
  profileNavRouteName: string;
}

const prevRouteNameFromStorage = localStorage.getItem("prevRoute")
  ? JSON.parse(localStorage.getItem("prevRoute") || "")
  : {};

const profileNavRouteNameFromStorage = localStorage.getItem(
  "profileNavRouteName"
)
  ? JSON.parse(localStorage.getItem("profileNavRouteName") || "")
  : "";

const state: StIFace = {
  isUserOptionOpen: false,
  imgError: false,
  excludeRoute: "",
  prevRoute: prevRouteNameFromStorage,
  profileNavRouteName: profileNavRouteNameFromStorage,
};

const getters = {
  isUserOptionOpen: (state: StIFace) => state.isUserOptionOpen,
  imgError: (state: StIFace) => state.imgError,
  excludeRoute: (state: StIFace) => state.excludeRoute,
  prevRoute: (state: StIFace) => state.prevRoute,
  profileNavRouteName: (state: StIFace) => state.profileNavRouteName,
};

const mutations = {
  TOGGLE_USER_OPTION(state: StIFace, payload: boolean) {
    state.isUserOptionOpen = payload;
  },
  TOGGLE_IMG_ERROR(state: StIFace, payload: boolean) {
    state.imgError = payload;
  },
  SET_EXCLUDE_ROUTE(state: StIFace, payload: string) {
    state.excludeRoute = payload;
  },
  SET_PREV_ROUTE(state: StIFace, payload: { name: string; params: object }) {
    state.prevRoute = payload;
    localStorage.setItem("prevRoute", JSON.stringify(state.prevRoute));
  },
  SET_PROFILE_NAV_ROUTE_NAME(state: StIFace, payload: string) {
    state.profileNavRouteName = payload;
    localStorage.setItem(
      "profileNavRouteName",
      JSON.stringify(state.profileNavRouteName)
    );
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
