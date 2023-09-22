import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

interface genresIface {
  _id: string;
  genre: string;
}

export interface GenresStateIFace {
  genres: genresIface[];
  pickedGenres: string[];
}

const genresFromStorage = localStorage.getItem("pickedGenres")
  ? JSON.parse(localStorage.getItem("pickedGenres") || "")
  : [];

const state: GenresStateIFace = {
  genres: [],
  pickedGenres: genresFromStorage,
};

const getters = {
  genres: (state: GenresStateIFace) => state.genres,
  pickedGenres: (state: GenresStateIFace) => state.pickedGenres,
};

const mutations = {
  FETCH_GENRES(state: GenresStateIFace, payload: genresIface[]) {
    state.genres = payload;
  },
  SET_GENRES(state: GenresStateIFace, payload: string) {
    if (state.pickedGenres.some((pickedGenre) => pickedGenre === payload)) {
      state.pickedGenres = state.pickedGenres.filter(
        (pickedGenre) => pickedGenre !== payload
      );
    } else {
      state.pickedGenres.push(payload);
    }

    localStorage.setItem("pickedGenres", JSON.stringify(state.pickedGenres));
  },

  SET_DB_GENRES(state: GenresStateIFace, payload: string[]) {
    state.pickedGenres = payload;
  },

  RESET_GENRES(state: GenresStateIFace) {
    state.pickedGenres = [];
    localStorage.removeItem("pickedGenres");
  },
};

const actions = {
  async fetchGenres({ commit }: ActionContext<GenresStateIFace, StateIface>) {
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
