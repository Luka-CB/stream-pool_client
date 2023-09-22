import { StateIface } from "@/store";
import axios from "@/utils/axios";
import { ActionContext } from "vuex";

interface contentIFace {
  _id: string;
  title: string;
  startYear: number;
  endYear: number;
  crew: {
    directors: { _id: string; name: string }[];
    cast: { name: string }[];
  };
  description: string;
  genres: string[];
  posterUrl: string;
  videoUrl: string;
  type: string;
  rating: {
    avgRatting: number;
    count: number;
  };
  isInFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationIFace {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  pagingCounter: number;
  prevPage: number;
  totalDocs: number;
  totalPages: number;
}

export interface ContentsStatesIFace {
  loadingMovies: boolean;
  movies: contentIFace[];
  moviePagination: PaginationIFace;
  loadingTvs: boolean;
  tvs: contentIFace[];
  tvPagination: PaginationIFace;
}

const state = {
  loadingMovies: false,
  movies: [],
  moviePagination: {},
  loadingTvs: false,
  tvs: [],
  tvPagination: {},
};

const getters = {
  fetchMovies: (state: ContentsStatesIFace) => state.movies,
  moviePagination: (state: ContentsStatesIFace) => state.moviePagination,
  moviesLoading: (state: ContentsStatesIFace) => state.loadingMovies,
  fetchTvs: (state: ContentsStatesIFace) => state.tvs,
  tvPagination: (state: ContentsStatesIFace) => state.tvPagination,
  tvsLoading: (state: ContentsStatesIFace) => state.loadingTvs,
};

const mutations = {
  FETCH_MOVIES(state: ContentsStatesIFace, data: any) {
    state.movies = data.content.movies;
    state.moviePagination = data.content.paginationData;
    console.log(data);
  },
  TOGGLE_MOVIE_FAV(state: ContentsStatesIFace, payload: string) {
    state.movies.map((movie) => {
      if (movie._id === payload) {
        movie.isInFavorite = !movie.isInFavorite;
      }
    });
  },
  FETCH_TVS(state: ContentsStatesIFace, data: any) {
    state.tvs = data.content.tvs;
    state.tvPagination = data.content.paginationData;
  },
  TOGGLE_TV_FAV(state: ContentsStatesIFace, payload: string) {
    state.tvs.map((tv) => {
      if (tv._id === payload) {
        tv.isInFavorite = !tv.isInFavorite;
      }
    });
  },
};

interface QueriesIFace {
  genre?: string;
  year?: number;
  rating?: string;
  byYear?: string;
  page?: number;
  userId?: string;
}

const actions = {
  async fetchMovies(
    { commit, state }: ActionContext<ContentsStatesIFace, StateIface>,
    queries: QueriesIFace
  ) {
    state.loadingMovies = true;

    const modQueries = {
      genre: queries.genre ?? "",
      year: queries.year ?? "",
      sort:
        queries.rating === "asc"
          ? "r_asc"
          : queries.rating === "desc"
          ? "r_desc"
          : queries.byYear === "asc"
          ? "y_asc"
          : queries.byYear === "desc"
          ? "y_desc"
          : "",
      page: queries.page ?? 1,
      userId: queries.userId ?? "",
    };

    try {
      const { data } = await axios.get(
        `/api/content/movies?genre=${modQueries.genre}&year=${modQueries.year}&sort=${modQueries.sort}&page=${modQueries.page}&userId=${modQueries.userId}`
      );

      if (data) {
        state.loadingMovies = false;
        commit("FETCH_MOVIES", data);
      }
    } catch (error) {
      state.loadingMovies = false;
      console.log(error);
    }
  },

  async fetchTvs(
    { commit, state }: ActionContext<ContentsStatesIFace, StateIface>,
    queries: QueriesIFace
  ) {
    state.loadingTvs = true;

    const modQueries = {
      genre: queries.genre ?? "",
      year: queries.year ?? "",
      sort:
        queries.rating === "asc"
          ? "r_asc"
          : queries.rating === "desc"
          ? "r_desc"
          : queries.byYear === "asc"
          ? "y_asc"
          : queries.byYear === "desc"
          ? "y_desc"
          : "",
      page: queries.page ?? 1,
      userId: queries.userId ?? "",
    };

    try {
      const { data } = await axios.get(
        `/api/content/tvs?genre=${modQueries.genre}&year=${modQueries.year}&sort=${modQueries.sort}&page=${modQueries.page}&userId=${modQueries.userId}`
      );

      if (data) {
        state.loadingTvs = false;
        commit("FETCH_TVS", data);
      }
    } catch (error) {
      state.loadingTvs = false;
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
