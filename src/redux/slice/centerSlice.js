import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchCenter } from '../../config/api.center';

export const fetchCenter = createAsyncThunk(
  'center/fetchCenter',
  async ({ query }) => {
    const response = await callFetchCenter(query);
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

export const centerSlice = createSlice({
  name: 'center',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCenter.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchCenter.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchCenter.fulfilled, (state, action) => {
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

export default centerSlice.reducer;
