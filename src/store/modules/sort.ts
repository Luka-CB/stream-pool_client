export interface SortIFace {
  genre: string;
  year: number | string;
  ratingSort: string;
  dateSort: string;
  page: number;
}

const genreFromStorage = localStorage.getItem("sort")
  ? JSON.parse(localStorage.getItem("sort")!).genre
  : "";
const yearFromStorage = localStorage.getItem("sort")
  ? JSON.parse(localStorage.getItem("sort")!).year
  : "";
const ratingSortFromStorage = localStorage.getItem("sort")
  ? JSON.parse(localStorage.getItem("sort")!).ratingSort
  : "";
const dateSortFromStorage = localStorage.getItem("sort")
  ? JSON.parse(localStorage.getItem("sort")!).dateSort
  : "";
const pageFromStorage = localStorage.getItem("sort")
  ? JSON.parse(localStorage.getItem("sort")!).page
  : 1;

const state: SortIFace = {
  genre: genreFromStorage,
  year: yearFromStorage,
  ratingSort: ratingSortFromStorage,
  dateSort: dateSortFromStorage,
  page: pageFromStorage,
};

const getters = {
  genre: (state: SortIFace) => state.genre,
  year: (state: SortIFace) => state.year,
  ratingSort: (state: SortIFace) => state.ratingSort,
  dateSort: (state: SortIFace) => state.dateSort,
  page: (state: SortIFace) => state.page,
};

const mutations = {
  SET_GENRE(state: SortIFace, payload: string) {
    state.genre = payload;
    localStorage.setItem("sort", JSON.stringify(state));
  },
  SET_YEAR(state: SortIFace, payload: string) {
    state.year = payload;
    localStorage.setItem("sort", JSON.stringify(state));
  },
  SET_RATING_SORT(state: SortIFace, payload: string) {
    state.ratingSort = payload;
    localStorage.setItem("sort", JSON.stringify(state));
  },
  SET_DATE_SORT(state: SortIFace, payload: string) {
    state.dateSort = payload;
    localStorage.setItem("sort", JSON.stringify(state));
  },
  SET_PAGE(state: SortIFace, payload: number) {
    state.page = payload;
    localStorage.setItem("sort", JSON.stringify(state));
  },
  RESET_SORT(state: SortIFace) {
    state.genre = "";
    state.year = "";
    state.ratingSort = "";
    state.dateSort = "";
    state.page = 1;

    localStorage.removeItem("sort");
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
