import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser} from '../actions/userActions';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    loggedIn: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.name = '';
      state.loggedIn = false;
    },
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.loggedIn = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.name = action.payload.user.name;
        state.loggedIn = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.name = action.payload.user.name;
        state.loggedIn = true;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
