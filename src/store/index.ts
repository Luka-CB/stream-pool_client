import { createStore } from "vuex";
import states, { StIFace } from "./modules/states";
import fetchContents, {
  ContentsStatesIFace,
} from "./modules/content/fetchContents";
import fetchContent, {
  ContentStatesIFace,
} from "./modules/content/fetchContent";
import image, { ImageStatesIFace } from "./modules/image";
import auth, { AuthStatesIFace } from "./modules/user/auth";
import sort, { SortIFace } from "./modules/sort";
import addContent, { AddContentStateIFace } from "./modules/content/addContent";
import msg, { MsgIFace } from "./modules/msg";
import genres, { GenresStateIFace } from "./modules/form/genres";
import crew, { CrewStateIFace } from "./modules/form/crew";
import info, { InfoStateIFace } from "./modules/form/info";
import updateContent, {
  UpdateContentStateIFace,
} from "./modules/content/updateContent";
import deleteContent, {
  DeleteContentStateIFace,
} from "./modules/content/deleteContent";
import modals, { ModalStateIFace } from "./modules/modals";
import updateVideoUrl, {
  UpdateVideoUrlStateIFace,
} from "./modules/content/updateVideoUrl";
import updatePoster, {
  UpdatePosterStateIFace,
} from "./modules/content/updatePoster";
import rating, { RatingStateIFace } from "./modules/rating";
import list, { ListIFace } from "./modules/list";
import listItem, { ListItemStateIFace } from "./modules/listItem";
import prompts, { PromptStateIFace } from "./modules/prompts";
import fav, { FavStateIFace } from "./modules/fav";
import comment, { CommentStateIFace } from "./modules/comment";
import reply, { ReplyStateIFace } from "./modules/reply";
import search, { SearchStateIFace } from "./modules/search";
import profileView, {
  ProfileViewStateIFace,
} from "./modules/profile/profileView";

export interface StateIface {
  fetchContents: ContentsStatesIFace;
  fetchContent: ContentStatesIFace;
  auth: AuthStatesIFace;
  image: ImageStatesIFace;
  states: StIFace;
  sort: SortIFace;
  addContent: AddContentStateIFace;
  msg: MsgIFace;
  genres: GenresStateIFace;
  crew: CrewStateIFace;
  info: InfoStateIFace;
  updateContent: UpdateContentStateIFace;
  deleteContent: DeleteContentStateIFace;
  modals: ModalStateIFace;
  updateVideoUrl: UpdateVideoUrlStateIFace;
  updatePoster: UpdatePosterStateIFace;
  createRating: RatingStateIFace;
  list: ListIFace;
  listItem: ListItemStateIFace;
  prompts: PromptStateIFace;
  fav: FavStateIFace;
  comment: CommentStateIFace;
  reply: ReplyStateIFace;
  search: SearchStateIFace;
  profileView: ProfileViewStateIFace;
}

export default createStore<StateIface>({
  modules: {
    states,
    fetchContents,
    fetchContent,
    image,
    auth,
    sort,
    addContent,
    msg,
    genres,
    crew,
    info,
    updateContent,
    deleteContent,
    modals,
    updateVideoUrl,
    updatePoster,
    rating,
    list,
    listItem,
    prompts,
    fav,
    comment,
    reply,
    search,
    profileView,
  },
});
