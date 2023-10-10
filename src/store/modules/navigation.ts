export interface NavStatesIFace {
  isNavMenuIconActive: boolean;
  isMobileNavActive: boolean;
  isMobileProfileNavActive: boolean;
}

const state: NavStatesIFace = {
  isNavMenuIconActive: false,
  isMobileNavActive: false,
  isMobileProfileNavActive: false,
};

const getters = {
  navMenuIcon: (state: NavStatesIFace) => state.isNavMenuIconActive,
  mobileNav: (state: NavStatesIFace) => state.isMobileNavActive,
  profileMobileNav: (state: NavStatesIFace) => state.isMobileProfileNavActive,
};

const mutations = {
  TOGGLE_NAV_MENU_ICON(state: NavStatesIFace, payload: boolean) {
    state.isNavMenuIconActive = payload;
  },
  TOGGLE_MOBILE_NAV(state: NavStatesIFace, payload: boolean) {
    state.isMobileNavActive = payload;
  },
  TOGGLE_PROFILE_MOBILE_NAV(state: NavStatesIFace, payload: boolean) {
    state.isMobileProfileNavActive = payload;
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
