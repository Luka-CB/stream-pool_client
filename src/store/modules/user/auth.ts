import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { AxiosError } from "axios";
import { ActionContext } from "vuex";

interface userIface {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface AuthStatesIFace {
  user: userIface;
  isRegLoading: boolean;
  isRegSuccess: boolean;
  regErrorMsg: string;
  isLogoutLoading: boolean;
  isLogoutSuccess: boolean;
  isLoginLoading: boolean;
  isLoginSuccess: boolean;
  loginErrorMsg: string;
  isUpdUserLoading: boolean;
  isUpdUserSuccess: boolean;
  updUserSuccessMsg: string;
  isDelUSerLoading: boolean;
  isDelUserSuccess: boolean;
}

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") || "")
  : {};

const state: AuthStatesIFace = {
  user: userInfoFromStorage,
  isRegLoading: false,
  isRegSuccess: false,
  regErrorMsg: "",
  isLogoutLoading: false,
  isLogoutSuccess: false,
  isLoginLoading: false,
  isLoginSuccess: false,
  loginErrorMsg: "",
  isUpdUserLoading: false,
  isUpdUserSuccess: false,
  updUserSuccessMsg: "",
  isDelUSerLoading: false,
  isDelUserSuccess: false,
};

const getters = {
  user: (state: AuthStatesIFace) => state.user,
  regErrMsg: (state: AuthStatesIFace) => state.regErrorMsg,
  isRegLoading: (state: AuthStatesIFace) => state.isRegLoading,
  isRegSuccess: (state: AuthStatesIFace) => state.isRegSuccess,
  isLogoutLoading: (state: AuthStatesIFace) => state.isLogoutLoading,
  isLogoutSuccess: (state: AuthStatesIFace) => state.isLogoutSuccess,
  isLoginLoading: (state: AuthStatesIFace) => state.isLoginLoading,
  isLoginSuccess: (state: AuthStatesIFace) => state.isLoginSuccess,
  loginErrMsg: (state: AuthStatesIFace) => state.loginErrorMsg,
  updUserLoading: (state: AuthStatesIFace) => state.isUpdUserLoading,
  updUserSuccess: (state: AuthStatesIFace) => state.isUpdUserSuccess,
  updUserSuccessMsg: (state: AuthStatesIFace) => state.updUserSuccessMsg,
  delUserLoading: (state: AuthStatesIFace) => state.isDelUSerLoading,
  delUserSuccess: (state: AuthStatesIFace) => state.isDelUserSuccess,
};

const mutations = {
  SET_ERR_MSG(state: AuthStatesIFace, payload: string) {
    state.regErrorMsg = payload;
  },

  SET_UPD_USER_SUCCESS_MSG(state: AuthStatesIFace, payload: string) {
    state.updUserSuccessMsg = payload;
  },

  RESET_AUTH(state: AuthStatesIFace) {
    state.isRegSuccess = false;
    state.isLoginSuccess = false;
    state.isLogoutSuccess = false;
    state.regErrorMsg = "";
    state.loginErrorMsg = "";
    state.isUpdUserLoading = false;
    state.isUpdUserSuccess = false;
    state.updUserSuccessMsg = "";
  },
};

const actions = {
  async register(
    { state }: ActionContext<AuthStatesIFace, StateIface>,
    userInfo: userIface
  ) {
    state.isRegLoading = true;
    state.isRegSuccess = false;

    try {
      const { data } = await axios.post("/api/users/register", userInfo);

      if (data) {
        state.isRegLoading = false;
        state.isRegSuccess = true;
        state.user = data;
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (error) {
      state.isRegLoading = false;
      console.log(error);
      if (error instanceof AxiosError) {
        state.regErrorMsg =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      } else {
        throw error;
      }
    }
  },

  async login(
    { state }: ActionContext<AuthStatesIFace, StateIface>,
    userInfo: userIface
  ) {
    state.isLoginLoading = true;
    state.isLoginSuccess = false;

    try {
      const { data } = await axios.post("/api/users/login", userInfo);

      if (data) {
        state.isLoginLoading = false;
        state.isLoginSuccess = true;
        state.user = data;
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (error) {
      state.isLoginLoading = false;
      console.log(error);
      if (error instanceof AxiosError) {
        state.loginErrorMsg =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
      } else {
        throw error;
      }
    }
  },

  async update(
    { commit, state }: ActionContext<AuthStatesIFace, StateIface>,
    userInfo: userIface
  ) {
    state.isUpdUserLoading = true;

    try {
      const { data } = await axios.put("/api/users/update", userInfo);

      if (data) {
        state.isUpdUserLoading = false;
        state.isUpdUserSuccess = true;
        commit("SET_UPD_USER_SUCCESS_MSG", data.msg);
      }
    } catch (error) {
      state.isUpdUserLoading = false;
      console.log(error);
    }
  },

  async delete({ state }: ActionContext<AuthStatesIFace, StateIface>) {
    state.isDelUSerLoading = true;

    try {
      const { data } = await axios.delete("/api/users/delete");

      if (data) {
        state.isDelUSerLoading = false;
        state.isDelUserSuccess = true;
        localStorage.removeItem("userInfo");
      }
    } catch (error) {
      state.isDelUSerLoading = false;
      console.log(error);
    }
  },

  async logout({ state }: ActionContext<AuthStatesIFace, StateIface>) {
    state.isLogoutLoading = true;
    state.isLogoutSuccess = false;

    console.log("cool");

    try {
      const { data } = await axios.get("/api/users/logout");

      if (data) {
        state.isLogoutLoading = false;
        state.isLogoutSuccess = true;
        localStorage.removeItem("userInfo");
        state.user = {};
      }
    } catch (error) {
      state.isLogoutLoading = false;
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
