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
  userRating: { _id?: string; value: number | null };
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
  latestMovies: {
    groupOne: contentIFace[];
    groupTwo: contentIFace[];
    groupThree: contentIFace[];
  };
  latestMoviesAux: {
    groupOne: contentIFace[];
    groupTwo: contentIFace[];
    groupThree: contentIFace[];
  };
  isGetLatestMoviesLoading: boolean;
  loadingTvs: boolean;
  tvs: contentIFace[];
  tvPagination: PaginationIFace;
  latestTvs: {
    groupOne: contentIFace[];
    groupTwo: contentIFace[];
    groupThree: contentIFace[];
  };
  latestTvsAux: {
    groupOne: contentIFace[];
    groupTwo: contentIFace[];
    groupThree: contentIFace[];
  };
  isGetLatestTvsLoading: boolean;
}

const state: ContentsStatesIFace = {
  loadingMovies: false,
  movies: [],
  moviePagination: {} as PaginationIFace,
  latestMovies: { groupOne: [], groupTwo: [], groupThree: [] },
  latestMoviesAux: { groupOne: [], groupTwo: [], groupThree: [] },
  isGetLatestMoviesLoading: false,
  loadingTvs: false,
  tvs: [],
  tvPagination: {} as PaginationIFace,
  latestTvs: { groupOne: [], groupTwo: [], groupThree: [] },
  latestTvsAux: { groupOne: [], groupTwo: [], groupThree: [] },
  isGetLatestTvsLoading: false,
};

const getters = {
  fetchMovies: (state: ContentsStatesIFace) => state.movies,
  moviePagination: (state: ContentsStatesIFace) => state.moviePagination,
  moviesLoading: (state: ContentsStatesIFace) => state.loadingMovies,
  latestMovies: (state: ContentsStatesIFace) => state.latestMovies,
  getLatestMoviesLoading: (state: ContentsStatesIFace) =>
    state.isGetLatestMoviesLoading,
  fetchTvs: (state: ContentsStatesIFace) => state.tvs,
  tvPagination: (state: ContentsStatesIFace) => state.tvPagination,
  tvsLoading: (state: ContentsStatesIFace) => state.loadingTvs,
  latestTvs: (state: ContentsStatesIFace) => state.latestTvs,
  getLatestTvsLoading: (state: ContentsStatesIFace) =>
    state.isGetLatestTvsLoading,
};

const mutations = {
  FETCH_MOVIES(
    state: ContentsStatesIFace,
    data: {
      content: { movies: contentIFace[]; paginationData: PaginationIFace };
    }
  ) {
    state.movies = data.content.movies;
    state.moviePagination = data.content.paginationData;
  },
  UPD_MOVIE_RATING(
    state: ContentsStatesIFace,
    payload: { contentId: string; value: number }
  ) {
    state.movies = state.movies.map((movie) => {
      if (movie._id === payload.contentId) {
        movie.userRating.value = payload.value;
      }

      return movie;
    });

    const updateHandler = (arr: contentIFace[]) => {
      return arr.map((movie) => {
        if (movie._id === payload.contentId) {
          movie.userRating.value = payload.value;
        }

        return movie;
      });
    };

    if (state.latestMovies.groupOne.length > 0) {
      state.latestMovies.groupOne = updateHandler(state.latestMovies.groupOne);
    }
    if (state.latestMovies.groupTwo.length > 0) {
      state.latestMovies.groupTwo = updateHandler(state.latestMovies.groupTwo);
    }
    if (state.latestMovies.groupThree.length > 0) {
      state.latestMovies.groupThree = updateHandler(
        state.latestMovies.groupThree
      );
    }
  },
  DEL_MOVIE_RATING(state: ContentsStatesIFace, payload: string) {
    if (state.movies.length > 0) {
      state.movies = state.movies.map((movie) => {
        if (movie._id === payload) {
          movie.userRating = { _id: "", value: null };
        }

        return movie;
      });
    }

    const deleteHandler = (arr: contentIFace[]) => {
      return arr.map((movie) => {
        if (movie._id === payload) {
          movie.userRating = { _id: "", value: null };
        }

        return movie;
      });
    };

    if (state.latestMovies.groupOne.length > 0) {
      state.latestMovies.groupOne = deleteHandler(state.latestMovies.groupOne);
    }
    if (state.latestMovies.groupTwo.length > 0) {
      state.latestMovies.groupTwo = deleteHandler(state.latestMovies.groupTwo);
    }
    if (state.latestMovies.groupThree.length > 0) {
      state.latestMovies.groupThree = deleteHandler(
        state.latestMovies.groupThree
      );
    }
  },
  FETCH_LATEST_MOVIES(state: ContentsStatesIFace, payload: contentIFace[]) {
    state.latestMoviesAux.groupOne =
      payload.length >= 5 ? payload.slice(0, 5) : [];
    state.latestMoviesAux.groupTwo =
      payload.length >= 10 ? payload.slice(5, 10) : [];
    state.latestMoviesAux.groupThree =
      payload.length === 15 ? payload.slice(10, 15) : [];

    state.latestMovies.groupOne =
      payload.length >= 5 ? payload.slice(0, 5) : [];
    state.latestMovies.groupTwo =
      payload.length >= 10 ? payload.slice(5, 10) : [];
    state.latestMovies.groupThree =
      payload.length === 15 ? payload.slice(10, 15) : [];
  },
  UPD_LATEST_MOVIES(state: ContentsStatesIFace, payload: number) {
    state.latestMovies.groupOne = state.latestMoviesAux.groupOne.slice(
      0,
      payload
    );
    state.latestMovies.groupTwo = state.latestMoviesAux.groupTwo.slice(
      0,
      payload
    );
    state.latestMovies.groupThree = state.latestMoviesAux.groupThree.slice(
      0,
      payload
    );
  },
  TOGGLE_MOVIE_FAV(state: ContentsStatesIFace, payload: string) {
    if (state.movies.length > 0) {
      state.movies.map((movie) => {
        if (movie._id === payload) {
          movie.isInFavorite = !movie.isInFavorite;
        }
      });
    }

    if (state.latestMovies.groupOne.length > 0) {
      state.latestMovies.groupOne.map((movie) => {
        if (movie._id === payload) {
          movie.isInFavorite = !movie.isInFavorite;
        }
      });
    }
    if (state.latestMovies.groupTwo.length > 0) {
      state.latestMovies.groupTwo.map((movie) => {
        if (movie._id === payload) {
          movie.isInFavorite = !movie.isInFavorite;
        }
      });
    }
    if (state.latestMovies.groupThree.length > 0) {
      state.latestMovies.groupThree.map((movie) => {
        if (movie._id === payload) {
          movie.isInFavorite = !movie.isInFavorite;
        }
      });
    }
  },

  FETCH_TVS(
    state: ContentsStatesIFace,
    data: { content: { tvs: contentIFace[]; paginationData: PaginationIFace } }
  ) {
    state.tvs = data.content.tvs;
    state.tvPagination = data.content.paginationData;
  },
  UPD_TV_RATING(
    state: ContentsStatesIFace,
    payload: { contentId: string; value: number }
  ) {
    if (state.tvs.length > 0) {
      state.tvs = state.tvs.map((tv) => {
        if (tv._id === payload.contentId) {
          tv.userRating.value = payload.value;
        }

        return tv;
      });
    }

    const updateHandler = (arr: contentIFace[]) => {
      return arr.map((tv) => {
        if (tv._id === payload.contentId) {
          tv.userRating.value = payload.value;
        }

        return tv;
      });
    };

    if (state.latestTvs.groupOne.length > 0) {
      state.latestTvs.groupOne = updateHandler(state.latestTvs.groupOne);
    }
    if (state.latestTvs.groupTwo.length > 0) {
      state.latestTvs.groupTwo = updateHandler(state.latestTvs.groupTwo);
    }
    if (state.latestTvs.groupThree.length > 0) {
      state.latestTvs.groupThree = updateHandler(state.latestTvs.groupThree);
    }
  },
  DEL_TV_RATING(state: ContentsStatesIFace, payload: string) {
    if (state.tvs.length > 0) {
      state.tvs = state.tvs.map((tv) => {
        if (tv._id === payload) {
          tv.userRating = { _id: "", value: null };
        }

        return tv;
      });
    }

    const deleteHandler = (arr: contentIFace[]) => {
      return arr.map((tv) => {
        if (tv._id === payload) {
          tv.userRating = { _id: "", value: null };
        }

        return tv;
      });
    };

    if (state.latestTvs.groupOne.length > 0) {
      state.latestTvs.groupOne = deleteHandler(state.latestTvs.groupOne);
    }
    if (state.latestTvs.groupTwo.length > 0) {
      state.latestTvs.groupTwo = deleteHandler(state.latestTvs.groupTwo);
    }
    if (state.latestTvs.groupThree.length > 0) {
      state.latestTvs.groupThree = deleteHandler(state.latestTvs.groupThree);
    }
  },
  FETCH_LATEST_TVS(state: ContentsStatesIFace, payload: contentIFace[]) {
    state.latestTvsAux.groupOne =
      payload.length >= 5 ? payload.slice(0, 5) : [];
    state.latestTvsAux.groupTwo =
      payload.length >= 10 ? payload.slice(5, 10) : [];
    state.latestTvsAux.groupThree =
      payload.length === 15 ? payload.slice(10, 15) : [];

    state.latestTvs.groupOne = payload.length >= 5 ? payload.slice(0, 5) : [];
    state.latestTvs.groupTwo = payload.length >= 10 ? payload.slice(5, 10) : [];
    state.latestTvs.groupThree =
      payload.length === 15 ? payload.slice(10, 15) : [];
  },
  UPD_LATEST_TVS(state: ContentsStatesIFace, payload: number) {
    state.latestTvs.groupOne = state.latestTvsAux.groupOne.slice(0, payload);
    state.latestTvs.groupTwo = state.latestTvsAux.groupTwo.slice(0, payload);
    state.latestTvs.groupThree = state.latestTvsAux.groupThree.slice(
      0,
      payload
    );
  },
  TOGGLE_TV_FAV(state: ContentsStatesIFace, payload: string) {
    if (state.tvs.length > 0) {
      state.tvs.map((tv) => {
        if (tv._id === payload) {
          tv.isInFavorite = !tv.isInFavorite;
        }
      });
    }

    if (state.latestTvs.groupOne.length > 0) {
      state.latestTvs.groupOne.map((tv) => {
        if (tv._id === payload) {
          tv.isInFavorite = !tv.isInFavorite;
        }
      });
    }
    if (state.latestTvs.groupTwo.length > 0) {
      state.latestTvs.groupTwo.map((tv) => {
        if (tv._id === payload) {
          tv.isInFavorite = !tv.isInFavorite;
        }
      });
    }
    if (state.latestTvs.groupThree.length > 0) {
      state.latestTvs.groupThree.map((tv) => {
        if (tv._id === payload) {
          tv.isInFavorite = !tv.isInFavorite;
        }
      });
    }
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

  async fetchLatestTvs(
    { commit, state }: ActionContext<ContentsStatesIFace, StateIface>,
    userId = ""
  ) {
    state.isGetLatestTvsLoading = true;

    try {
      const { data } = await axios.get(
        `/api/content/tvs/latest?userId=${userId}`
      );

      if (data) {
        state.isGetLatestTvsLoading = false;
        commit("FETCH_LATEST_TVS", data);
      }
    } catch (error) {
      state.isGetLatestTvsLoading = false;
      console.log(error);
    }
  },

  async fetchLatestMovies(
    { commit, state }: ActionContext<ContentsStatesIFace, StateIface>,
    userId = ""
  ) {
    state.isGetLatestMoviesLoading = true;

    try {
      const { data } = await axios.get(
        `/api/content/movies/latest?userId=${userId}`
      );

      if (data) {
        state.isGetLatestMoviesLoading = false;
        commit("FETCH_LATEST_MOVIES", data);
      }
    } catch (error) {
      state.isGetLatestMoviesLoading = false;
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
