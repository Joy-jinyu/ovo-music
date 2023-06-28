import { commonSlice } from './common'
import { songSlice } from './song'
import { djSlice } from './dj'

export default {
  [commonSlice.name]: commonSlice.reducer,
  [songSlice.name]: songSlice.reducer,
  [djSlice.name]: djSlice.reducer
}
