import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import MoviesView from "../views/MoviesView.vue";
import TvsView from "../views/TvsView.vue";
import DetailsView from "../views/DetailsView.vue";
import ProfileView from "../views/userPages/ProfileView.vue";
import ListsView from "../views/userPages/ListsView.vue";
import FavoritesView from "../views/userPages/FavoritesView.vue";
import RatingsView from "../views/userPages/RatingsView.vue";
import CommentsView from "../views/userPages/CommentsView.vue";
import AccountView from "../views/userPages/AccountView.vue";
import ListItemsView from "@/views/userPages/ListItemsView.vue";
import SigninView from "../views/SigninView.vue";
import SignupView from "../views/SignupView.vue";
import AboutView from "../views/AboutView.vue";
import CreateView from "../views/CreateView.vue";
import UpdateContentView from "../views/UpdateContentView.vue";
import NotFound from "../views/404.vue";

const user = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") || "")
  : {};

const isAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (user?.id) {
    next();
  } else {
    next({ name: "signin" });
  }
};

const noAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!user?.id) {
    next();
  } else {
    next({ name: "home" });
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/movies",
    name: "movies",
    component: MoviesView,
  },
  {
    path: "/tvs",
    name: "tvs",
    component: TvsView,
  },
  {
    path: "/details/:id",
    name: "details",
    component: DetailsView,
  },
  {
    path: "/profile/:name",
    name: "profile",
    component: ProfileView,
    beforeEnter: isAuth,
  },
  {
    path: "/lists",
    name: "lists",
    component: ListsView,
    beforeEnter: isAuth,
  },
  {
    path: "/list/:listId",
    name: "listitems",
    component: ListItemsView,
    beforeEnter: isAuth,
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesView,
    beforeEnter: isAuth,
  },
  {
    path: "/ratings",
    name: "ratings",
    component: RatingsView,
    beforeEnter: isAuth,
  },
  {
    path: "/comments",
    name: "comments",
    component: CommentsView,
    beforeEnter: isAuth,
  },
  {
    path: "/account/:username",
    name: "account",
    component: AccountView,
    beforeEnter: isAuth,
  },
  {
    path: "/signin",
    name: "signin",
    component: SigninView,
    beforeEnter: noAuth,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
    beforeEnter: noAuth,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/create/:type",
    name: "create",
    component: CreateView,
  },
  {
    path: "/update/:id",
    name: "updateContent",
    component: UpdateContentView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
