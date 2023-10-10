import axios from "@/utils/axios";
import { ActionContext } from "vuex";
import ShortUniqueId from "short-unique-id";
import { StateIface } from "@/store";

const uid = new ShortUniqueId();

export interface crewIFace {
  directors: {
    _id: string;
    name: string;
  }[];
  cast: {
    _id: string;
    name: string;
  }[];
}

export interface CrewStateIFace {
  crew: crewIFace;
  isCastMemberExists: boolean;
  isDirectorExists: boolean;
}

const crewFromStorage = localStorage.getItem("contentCrew")
  ? JSON.parse(localStorage.getItem("contentCrew") || "")
  : {
      directors: [],
      cast: [],
    };

const state: CrewStateIFace = {
  crew: crewFromStorage as crewIFace,
  isCastMemberExists: false,
  isDirectorExists: false,
};

const getters = {
  crew: (state: CrewStateIFace) => state.crew,
  isMemberExists: (state: CrewStateIFace) => state.isCastMemberExists,
  isDirectorExists: (state: CrewStateIFace) => state.isDirectorExists,
};

const mutations = {
  SET_CAST(state: CrewStateIFace, payload: string) {
    const castMembers: { _id: string; name: string }[] = state.crew.cast;

    if (
      state.crew.cast?.some(
        (member: { _id: string; name: string }) =>
          member.name.toLowerCase() === payload.toLowerCase()
      )
    ) {
      state.isCastMemberExists = true;
    } else {
      castMembers.push({ _id: uid(), name: payload });
    }

    state.crew.cast = castMembers;
    localStorage.setItem("contentCrew", JSON.stringify(state.crew));
  },

  REMOVE_MEMBER(state: CrewStateIFace, payload: string) {
    state.crew.cast = state.crew.cast.filter((x) => x._id !== payload);
    localStorage.setItem("contentCrew", JSON.stringify(state.crew));
  },

  SET_DIRECTOR(state: CrewStateIFace, payload: string) {
    const directors: { _id: string; name: string }[] = state.crew.directors;

    if (
      state.crew.directors?.some(
        (dir) => dir.name.toLowerCase() === payload.toLowerCase()
      )
    ) {
      state.isDirectorExists = true;
    } else {
      directors.push({ _id: uid(), name: payload });
    }

    state.crew.directors = directors;
    localStorage.setItem("contentCrew", JSON.stringify(state.crew));
  },
  REMOVE_DIRECTOR(state: CrewStateIFace, payload: string) {
    state.crew.directors = state.crew.directors.filter(
      (x) => x._id !== payload
    );
    localStorage.setItem("contentCrew", JSON.stringify(state.crew));
  },

  TOGGLE_MEMBER_EXISTS(state: CrewStateIFace, payload: boolean) {
    state.isCastMemberExists = payload;
  },
  TOGGLE_DIRECTOR_EXISTS(state: CrewStateIFace, payload: boolean) {
    state.isDirectorExists = payload;
  },

  SET_DB_CREW(state: CrewStateIFace, payload: crewIFace) {
    state.crew = payload;
  },

  RESET_CREW(state: CrewStateIFace) {
    state.crew = {
      directors: [],
      cast: [],
    };
    localStorage.removeItem("contentCrew");
  },
};

const actions = {
  async fetchGenres({ commit }: ActionContext<CrewStateIFace, StateIface>) {
    try {
      const { data } = await axios.get("/api/misc/fetch-genres");

      if (data) commit("FETCH_GENRES", data);
    } catch (error) {
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
