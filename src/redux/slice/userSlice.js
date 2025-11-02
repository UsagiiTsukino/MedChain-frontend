import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchUser } from '../../config/api.user';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async ({ query }) => {
    const response = await callFetchUser(query);
    return response;
  }
);

const initialState = {
  isFetching: true,
  meta: {
    page: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  },
  result: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        if (action.payload && action.payload.result) {
          state.isFetching = false;
          state.meta = action.payload.meta;
          state.result = action.payload.result;
        } else {
          state.isFetching = false;
        }
      });
  },
});

export default userSlice.reducer;
