import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchRole } from '../../config/api.role';

export const fetchRole = createAsyncThunk(
  'role/fetchRole',
  async ({ query }) => {
    const response = await callFetchRole(query);
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

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRole.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchRole.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchRole.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.isFetching = false;
          state.meta = action.payload.data.meta;
          state.result = action.payload.data.result;
        }
      });
  },
});

export default roleSlice.reducer;

