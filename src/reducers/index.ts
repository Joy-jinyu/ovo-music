import { songSlice } from "./song";
import { djSlice } from "./dj";

export default {
  [songSlice.name]: songSlice.reducer,
  [djSlice.name]: djSlice.reducer,
};
