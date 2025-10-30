import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchPermission } from '../../config/api.permission';


export const fetchPermission = createAsyncThunk(
  'permission/fetchPermission',
  async ({ query }) => {
    const response = await callFetchPermission(query);
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

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermission.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchPermission.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchPermission.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.isFetching = false;
          state.meta = action.payload.data.meta;
          state.result = action.payload.data.result;
        }
      });
  },
});

export default permissionSlice.reducer;

